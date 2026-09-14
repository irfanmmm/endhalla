const { getStreamClient } = require('../config/stream');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { sendPushNotification } = require('./pushNotification');

async function notifyClientOfIncomingCall(booking, counsellorName) {
  try {
    let clientUser = booking.clientId ? await User.findById(booking.clientId) : null;
    if (!clientUser && booking.clientPhone) {
      clientUser = await User.findOne({ phone: booking.clientPhone });
    }
    if (!clientUser?.pushToken) return;

    await sendPushNotification({
      token: clientUser.pushToken,
      data: {
        type: 'incoming_call',
        bookingId: String(booking._id),
        callerName: counsellorName || 'Your counsellor',
      },
      androidChannelId: 'calls',
      dataOnly: true,
    });
  } catch (error) {
    console.error('Failed to notify client of incoming call:', error.message);
  }
}

class CallTokenError extends Error {
  constructor(status, message, reason) {
    super(message);
    this.status = status;
    this.reason = reason;
  }
}

/**
 * Loads a booking, validates it's a joinable video session, mints a Stream
 * Video call token for the requester, and marks the call ongoing.
 * Throws CallTokenError (with .status/.reason) for any validation failure.
 * Caller is responsible for auth + ownership checks before calling this.
 *
 * The counsellor can start the call at any time relative to the scheduled
 * slot. The client can only join once the counsellor has actually started
 * it (booking.callStatus === 'ongoing') — this is not a time-of-day gate.
 */
async function mintCallToken({ bookingId, requesterUserId, requesterName, isCounsellor }) {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new CallTokenError(404, 'Booking not found');
  if (booking.sessionType !== 'Video') throw new CallTokenError(400, 'This booking is not a video session');
  if (booking.status !== 'confirmed') throw new CallTokenError(400, 'This booking is not confirmed');

  if (booking.callStatus === 'ended') {
    throw new CallTokenError(403, 'This call has ended', 'expired');
  }
  if (!isCounsellor && booking.callStatus === 'not_started') {
    throw new CallTokenError(403, "The counsellor hasn't started the call yet", 'not_started');
  }

  const client = getStreamClient();
  const callId = `video-${booking._id}`;
  const call = client.video.call('default', callId);
  const userId = String(requesterUserId);

  await call.getOrCreate({
    data: {
      created_by_id: userId,
      members: [{ user_id: userId, role: 'call_member' }],
      custom: { bookingId: String(booking._id) },
    },
  });

  const token = client.generateUserToken({ user_id: userId });

  if (booking.callStatus === 'not_started') {
    booking.callStatus = 'ongoing';
    booking.callStartedAt = new Date();
    await booking.save();
    if (isCounsellor) {
      notifyClientOfIncomingCall(booking, requesterName);
    }
  }

  return {
    apiKey: process.env.STREAM_API_KEY,
    token,
    callId,
    userId,
    userName: requesterName,
  };
}

async function endCall({ bookingId }) {
  await Booking.updateOne(
    { _id: bookingId, callStatus: { $ne: 'ended' } },
    { $set: { callStatus: 'ended', callEndedAt: new Date() } }
  );
}

module.exports = { mintCallToken, endCall, CallTokenError };
