const Admin = require('../../models/Admin');
const { signAdminToken } = require('../utils/token');

/**
 * Admin login with email + password
 * POST /api/admin/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email: String(email).toLowerCase().trim() });
    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const ok = await admin.verifyPassword(password);
    if (!ok) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    admin.lastLoginAt = new Date();
    await admin.save();

    const token = signAdminToken(admin);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: admin.toSafeJSON(),
    });
  } catch (error) {
    console.error('Error in admin login:', error);
    return res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
};

/**
 * Get the currently authenticated admin
 * GET /api/admin/auth/me
 */
exports.me = async (req, res) => {
  return res.status(200).json({ success: true, admin: req.admin.toSafeJSON() });
};

/**
 * Change own password
 * PUT /api/admin/auth/password
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'currentPassword and newPassword are required' });
    }
    if (String(newPassword).length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
    }

    const ok = await req.admin.verifyPassword(currentPassword);
    if (!ok) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    await req.admin.setPassword(newPassword);
    await req.admin.save();

    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error in changePassword:', error);
    return res.status(500).json({ success: false, message: 'Server error updating password', error: error.message });
  }
};
