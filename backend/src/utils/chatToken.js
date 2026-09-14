const { getStreamClient } = require('../config/stream');

/**
 * Mints a Stream Chat identity token for a user (not tied to any channel).
 * Used to connect the mobile Stream Chat client for inbox browsing.
 */
function mintChatToken({ requesterUserId, requesterName }) {
  const client = getStreamClient();
  const userId = String(requesterUserId);
  const token = client.generateUserToken({ user_id: userId });
  return {
    apiKey: process.env.STREAM_API_KEY,
    token,
    userId,
    userName: requesterName,
  };
}

/**
 * Ensures a 1:1 messaging channel exists between a client and counsellor,
 * identified deterministically so both sides land in the same channel.
 * Idempotent — safe for either side to call independently.
 *
 * Stream Chat (unlike Video) requires member user objects to already exist
 * before they can be added to a channel, so both users are upserted first.
 */
async function provisionChatChannel({ clientUser, counsellorUser }) {
  const clientUserId = String(clientUser.id);
  const counsellorUserId = String(counsellorUser.id);

  if (clientUserId === counsellorUserId) {
    // Same phone number is registered as both the client and the counsellor
    // (e.g. testing both apps with one number) — Stream rejects a channel
    // with a duplicate member, so fail with a clear message instead.
    const error = new Error('Client and counsellor accounts are the same user — cannot start a chat with yourself');
    error.status = 400;
    throw error;
  }

  const client = getStreamClient();
  const ids = [clientUserId, counsellorUserId].sort();
  const channelId = `chat-${ids.join('_')}`;

  await client.upsertUsers([
    { id: clientUserId, name: clientUser.name || 'Client' },
    { id: counsellorUserId, name: counsellorUser.name || 'Counsellor' },
  ]);

  const channel = client.chat.channel('messaging', channelId);
  await channel.getOrCreate({
    data: {
      created_by_id: ids[0],
      members: [{ user_id: clientUserId }, { user_id: counsellorUserId }],
    },
  });

  return { channelId };
}

module.exports = { mintChatToken, provisionChatChannel };
