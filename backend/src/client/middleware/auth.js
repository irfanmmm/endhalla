const User = require('../../models/User');
const { verifyClientToken } = require('../utils/token');

/**
 * Protect client routes: requires a valid Bearer JWT belonging to an existing user.
 * Attaches req.clientUser.
 */
exports.requireClientAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    let payload;
    try {
      payload = verifyClientToken(token);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.clientUser = user;
    return next();
  } catch (error) {
    console.error('Error in requireClientAuth:', error);
    return res.status(500).json({ success: false, message: 'Auth middleware error', error: error.message });
  }
};
