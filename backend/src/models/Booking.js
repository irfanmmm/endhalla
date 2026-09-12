const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    counsellorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Counsellor',
    },
    counsellorName: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
      default: 'Anonymous',
    },
    clientPhone: {
      type: String,
    },
    sessionType: {
      type: String,
      enum: ['Chat', 'Voice', 'Video'],
      required: true,
    },
    dateText: {
      type: String,
      required: true,
    },
    timeText: {
      type: String,
      required: true,
    },
    scheduledAt: {
      type: Date,
      index: true,
    },
    price: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'completed', 'cancelled'],
      default: 'confirmed',
    },
    callStatus: {
      type: String,
      enum: ['not_started', 'ongoing', 'ended'],
      default: 'not_started',
    },
    callStartedAt: {
      type: Date,
    },
    callEndedAt: {
      type: Date,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'free'],
      default: 'completed',
    },
    paymentMethod: {
      type: String,
      default: 'free',
    },
    razorpayOrderId: {
      type: String,
      default: '',
    },
    razorpayPaymentId: {
      type: String,
      default: '',
    },
    razorpaySignature: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.pre('save', function () {
  if (this.isModified('dateText') || this.isModified('timeText') || !this.scheduledAt) {
    const { parseBookingDateTime } = require('../utils/dateTime');
    this.scheduledAt = parseBookingDateTime(this.dateText, this.timeText);
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
