const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.COUNSELLOR_JWT_SECRET || 'endhalla_counsellor_dev_secret_change_me';
const JWT_EXPIRES_IN = process.env.COUNSELLOR_JWT_EXPIRES_IN || '30d';

exports.signCounsellorToken = (counsellor) =>
  jwt.sign({ sub: String(counsellor._id), phone: counsellor.phone }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

exports.verifyCounsellorToken = (token) => jwt.verify(token, JWT_SECRET);
