/**
 * One-off backfill: compute scheduledAt on bookings created before the field existed.
 * Usage: npm run migrate:scheduledAt
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Booking = require('../models/Booking');
const { parseBookingDateTime } = require('../utils/dateTime');

dotenv.config();

const run = async () => {
  try {
    await connectDB();

    const bookings = await Booking.find({ scheduledAt: { $exists: false } });
    let updated = 0;
    let unparsable = 0;

    for (const booking of bookings) {
      const scheduledAt = parseBookingDateTime(booking.dateText, booking.timeText);
      if (!scheduledAt) {
        unparsable += 1;
        continue;
      }
      booking.scheduledAt = scheduledAt;
      await booking.save();
      updated += 1;
    }

    console.log(`scanned: ${bookings.length}, updated: ${updated}, unparsable: ${unparsable}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Backfill failed:', error);
    process.exit(1);
  }
};

run();
