const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'endhalla_admin_dev_secret_change_me';
const JWT_EXPIRES_IN = process.env.ADMIN_JWT_EXPIRES_IN || '7d';

exports.signAdminToken = (admin) =>
  jwt.sign({ sub: String(admin._id), role: admin.role, email: admin.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

exports.verifyAdminToken = (token) => jwt.verify(token, JWT_SECRET);
