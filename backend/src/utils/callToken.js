const { getStreamClient } = require('../config/stream');
const { parseBookingDateTime, JOIN_WINDOW_BEFORE_MIN, JOIN_WINDOW_AFTER_MIN } = require('./dateTime');
const Booking = require('../models/Booking');

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
 */
async function mintCallToken({ bookingId, requesterUserId, requesterName }) {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new CallTokenError(404, 'Booking not found');
  if (booking.sessionType !== 'Video') throw new CallTokenError(400, 'This booking is not a video session');
  if (booking.status !== 'confirmed') throw new CallTokenError(400, 'This booking is not confirmed');

  const scheduledAt = booking.scheduledAt || parseBookingDateTime(booking.dateText, booking.timeText);
  if (!scheduledAt) {
    throw new CallTokenError(400, 'Unable to determine the scheduled time for this booking');
  }

  const now = Date.now();
  const opensAt = scheduledAt.getTime() - JOIN_WINDOW_BEFORE_MIN * 60 * 1000;
  const closesAt = scheduledAt.getTime() + JOIN_WINDOW_AFTER_MIN * 60 * 1000;
  if (now < opensAt) {
    throw new CallTokenError(403, 'The call has not opened yet', 'too_early');
  }
  if (now > closesAt) {
    throw new CallTokenError(403, 'The call window has expired', 'expired');
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
  }

  return {
    apiKey: process.env.STREAM_API_KEY,
    token,
    callId,
    userId,
    userName: requesterName,
    opensAt: new Date(opensAt),
    closesAt: new Date(closesAt),
  };
}

async function endCall({ bookingId }) {
  await Booking.updateOne(
    { _id: bookingId, callStatus: { $ne: 'ended' } },
    { $set: { callStatus: 'ended', callEndedAt: new Date() } }
  );
}

module.exports = { mintCallToken, endCall, CallTokenError };
