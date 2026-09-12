const { mintChatToken } = require('../../utils/chatToken');

/**
 * Mint a Stream Chat identity token for the logged-in counsellor.
 * GET /api/counsellor/chat/token
 */
exports.getChatToken = async (req, res) => {
  try {
    const result = mintChatToken({
      requesterUserId: req.counsellor.userId || req.counsellor._id,
      requesterName: req.counsellor.fullName || 'Counsellor',
    });
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('Error in getChatToken:', error);
    return res.status(500).json({ success: false, message: 'Server error generating chat token', error: error.message });
  }
};
