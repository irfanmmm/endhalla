const mongoose = require('mongoose');

const counsellorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    gender: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: 'Licensed Professional Counsellor',
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    },
    areasOfFocus: [{
      type: String,
      trim: true,
    }],
    experienceYears: {
      type: Number,
      default: 1,
    },
    languages: [{
      type: String,
      trim: true,
    }],
    rates: {
      chat: { type: Number, default: 499 },
      voice: { type: Number, default: 799 },
      video: { type: Number, default: 1199 },
    },
    certificates: [{
      type: String,
    }],
    rating: {
      type: Number,
      default: 4.9,
    },
    reviewCount: {
      type: Number,
      default: 24,
    },
    bio: {
      type: String,
      default: 'Empathetic & experienced therapist dedicated to supporting mental health and personal growth.',
    },
    availableSlots: [{
      type: String,
    }],
    isVerified: {
      type: Boolean,
      default: true,
    },
    isOnboardingComplete: {
      type: Boolean,
      default: false,
    },
    hasFreeSessionOffer: {
      type: Boolean,
      default: true,
    },
    freeSessionDurationText: {
      type: String,
      default: '40 min · Free',
    },
    voiceNote: {
      audioUrl: { type: String, default: '' },
      duration: { type: String, default: '0:38' },
      quote: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Counsellor', counsellorSchema);
