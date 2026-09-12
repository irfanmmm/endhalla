const { mintChatToken } = require('../../utils/chatToken');

/**
 * Mint a Stream Chat identity token for the logged-in client.
 * GET /api/chat/token
 */
exports.getChatToken = async (req, res) => {
  try {
    const result = mintChatToken({
      requesterUserId: req.clientUser._id,
      requesterName: req.clientUser.name || 'Client',
    });
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('Error in getChatToken:', error);
    return res.status(500).json({ success: false, message: 'Server error generating chat token', error: error.message });
  }
};
