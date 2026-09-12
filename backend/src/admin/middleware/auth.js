const Admin = require('../../models/Admin');
const { verifyAdminToken } = require('../utils/token');

/**
 * Protect admin routes: requires a valid Bearer JWT belonging to an active admin.
 * Attaches req.admin.
 */
exports.requireAdmin = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    let payload;
    try {
      payload = verifyAdminToken(token);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    const admin = await Admin.findById(payload.sub);
    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: 'Admin account not found or disabled' });
    }

    req.admin = admin;
    return next();
  } catch (error) {
    console.error('Error in requireAdmin:', error);
    return res.status(500).json({ success: false, message: 'Auth middleware error', error: error.message });
  }
};

/**
 * Restrict a route to superadmins only.
 */
exports.requireSuperadmin = (req, res, next) => {
  if (!req.admin || req.admin.role !== 'superadmin') {
    return res.status(403).json({ success: false, message: 'Superadmin privileges required' });
  }
  return next();
};
