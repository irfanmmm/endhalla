/**
 * Create (or reset) the initial admin account.
 * Usage: npm run seed:admin
 * Reads ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME from .env (with dev defaults).
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

dotenv.config();

const run = async () => {
  try {
    await connectDB();

    const email = (process.env.ADMIN_EMAIL || 'admin@endhalla.com').toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
    const name = process.env.ADMIN_NAME || 'Super Admin';

    let admin = await Admin.findOne({ email });
    if (admin) {
      admin.name = name;
      admin.role = 'superadmin';
      admin.isActive = true;
      await admin.setPassword(password);
      await admin.save();
      console.log(`♻️  Reset existing admin: ${email}`);
    } else {
      admin = new Admin({ email, name, role: 'superadmin' });
      await admin.setPassword(password);
      await admin.save();
      console.log(`✅ Created admin: ${email}`);
    }

    console.log(`   Password: ${password}`);
    console.log('   (set ADMIN_EMAIL / ADMIN_PASSWORD in .env before running in production)');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

run();
