const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Counsellor = require('./models/Counsellor');
const User = require('./models/User');

dotenv.config();

const sampleCounsellors = [
  {
    fullName: 'Dr. Sarah Jenkins',
    phone: '+919876543210',
    gender: 'Female',
    title: 'Clinical Psychologist, Ph.D.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    areasOfFocus: ['Anxiety', 'Depression', 'Mindset & Growth'],
    experienceYears: 8,
    languages: ['English', 'Hindi'],
    rates: { chat: 499, voice: 799, video: 1199 },
    rating: 4.9,
    reviewCount: 38,
    bio: 'Specializing in cognitive behavioral therapy and trauma recovery with 8+ years of experience helping individuals thrive.',
    availableSlots: ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'],
    isVerified: true,
    isOnboardingComplete: true,
    hasFreeSessionOffer: true,
    freeSessionDurationText: '40 min · Free',
    voiceNote: {
      audioUrl: '/public/sample_voicenote.mp3',
      duration: '0:38',
      quote: '"Hi! I\'d love to offer you a free 40-min session to help you get started on your journey."',
    },
  },
  {
    fullName: 'Dr. Marcus Vance',
    phone: '+919876543211',
    gender: 'Male',
    title: 'Relationship & Marriage Therapist',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    areasOfFocus: ['Relationships', 'Career Stress', 'Anxiety'],
    experienceYears: 12,
    languages: ['English', 'Tamil'],
    rates: { chat: 599, voice: 899, video: 1399 },
    rating: 4.8,
    reviewCount: 52,
    bio: 'Helping couples and professionals navigate complex interpersonal dynamics and workplace burnout.',
    availableSlots: ['09:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'],
    isVerified: true,
    isOnboardingComplete: true,
    hasFreeSessionOffer: false,
    freeSessionDurationText: '',
    voiceNote: {
      audioUrl: '/public/sample_voicenote.mp3',
      duration: '0:45',
      quote: '"I specialize in relationship dynamics and stress management. Let\'s work together to achieve clarity."',
    },
  },
  {
    fullName: 'Ananya Sharma',
    phone: '+919876543212',
    gender: 'Female',
    title: 'Holistic Wellness & Mindset Coach',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    areasOfFocus: ['Mindset & Growth', 'Grief & Loss', 'Depression'],
    experienceYears: 5,
    languages: ['English', 'Hindi', 'Malayalam'],
    rates: { chat: 399, voice: 699, video: 999 },
    rating: 4.95,
    reviewCount: 29,
    bio: 'Empowering clients to build resilience, self-compassion, and mental clarity through compassionate dialogue.',
    availableSlots: ['11:00 AM', '02:30 PM', '04:00 PM', '06:00 PM'],
    isVerified: true,
    isOnboardingComplete: true,
    hasFreeSessionOffer: false,
    freeSessionDurationText: '',
    voiceNote: {
      audioUrl: '/public/sample_voicenote.mp3',
      duration: '0:32',
      quote: '"Ready to take the first step towards wellness? Book a private session with me today."',
    },
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Seeding initial Counsellors data...');

    await Counsellor.deleteMany({});
    
    for (const data of sampleCounsellors) {
      let user = await User.findOne({ phone: data.phone });
      if (!user) {
        user = await User.create({
          phone: data.phone,
          name: data.fullName,
          gender: data.gender,
          userType: 'counsellor',
        });
      }
      await Counsellor.create({
        ...data,
        userId: user._id,
      });
    }

    console.log('✅ Seeding complete! Database ready.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
