const Counsellor = require('../../models/Counsellor');
const { verifyCounsellorToken } = require('../utils/token');

/**
 * Protect counsellor routes: requires a valid Bearer JWT belonging to an existing counsellor.
 * Attaches req.counsellor.
 */
exports.requireCounsellorAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    let payload;
    try {
      payload = verifyCounsellorToken(token);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    const counsellor = await Counsellor.findById(payload.sub);
    if (!counsellor) {
      return res.status(401).json({ success: false, message: 'Counsellor not found' });
    }

    req.counsellor = counsellor;
    return next();
  } catch (error) {
    console.error('Error in requireCounsellorAuth:', error);
    return res.status(500).json({ success: false, message: 'Auth middleware error', error: error.message });
  }
};
