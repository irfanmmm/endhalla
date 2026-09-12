/**
 * One-off backfill for the counsellor approval workflow.
 * Existing verified counsellors become 'approved'; everyone else 'pending'.
 * Usage: npm run migrate:approval
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Counsellor = require('../models/Counsellor');

dotenv.config();

const run = async () => {
  try {
    await connectDB();

    const approved = await Counsellor.updateMany(
      { approvalStatus: { $exists: false }, isVerified: true },
      { $set: { approvalStatus: 'approved' } }
    );
    const pending = await Counsellor.updateMany(
      { approvalStatus: { $exists: false } },
      { $set: { approvalStatus: 'pending', isVerified: false } }
    );

    console.log(`approved: ${approved.modifiedCount}, pending: ${pending.modifiedCount}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Backfill failed:', error);
    process.exit(1);
  }
};

run();
