const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.CLIENT_JWT_SECRET || 'endhalla_client_dev_secret_change_me';
const JWT_EXPIRES_IN = process.env.CLIENT_JWT_EXPIRES_IN || '30d';

exports.signClientToken = (user) =>
  jwt.sign({ sub: String(user._id), phone: user.phone, userType: user.userType }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

exports.verifyClientToken = (token) => jwt.verify(token, JWT_SECRET);
