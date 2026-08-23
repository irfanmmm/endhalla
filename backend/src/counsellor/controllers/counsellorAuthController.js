const Counsellor = require('../../models/Counsellor');
const User = require('../../models/User');
const OTP = require('../../models/OTP');

/**
 * Send OTP to Counsellor Phone Number
 * POST /api/counsellor/auth/send-otp
 */
exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const mockOTP = '123456';
    await OTP.deleteMany({ phone });
    await OTP.create({ phone, otp: mockOTP });

    console.log(`[COUNSELLOR AUTH] OTP sent to ${phone}: ${mockOTP}`);

    return res.status(200).json({
      success: true,
      message: 'OTP sent to counsellor phone',
      otp: mockOTP,
    });
  } catch (error) {
    console.error('Error in sendOTP:', error);
    return res.status(500).json({ success: false, message: 'Server error sending OTP', error: error.message });
  }
};

/**
 * Verify Counsellor OTP
 * POST /api/counsellor/auth/verify-otp
 */
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    const validOTP = await OTP.findOne({ phone, otp });
    if (otp !== '123456' && !validOTP) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Find or create User record with userType = 'counsellor'
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({
        phone,
        userType: 'counsellor',
      });
    } else {
      user.userType = 'counsellor';
      await user.save();
    }

    // Find or create Counsellor Profile record
    let counsellor = await Counsellor.findOne({ phone });
    if (!counsellor) {
      counsellor = await Counsellor.create({
        userId: user._id,
        fullName: user.name || 'Counsellor',
        phone,
        isOnboardingComplete: false,
      });
    }

    const token = `token_counsellor_${counsellor._id}_${Date.now()}`;

    return res.status(200).json({
      success: true,
      message: 'Counsellor OTP verified',
      token,
      counsellor,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    return res.status(500).json({ success: false, message: 'Server error verifying OTP', error: error.message });
  }
};

/**
 * Counsellor Login API
 * POST /api/counsellor/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    if (otp && otp !== '123456') {
      const validOTP = await OTP.findOne({ phone, otp });
      if (!validOTP) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      }
    }

    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone, userType: 'counsellor' });
    }

    let counsellor = await Counsellor.findOne({ phone });
    if (!counsellor) {
      counsellor = await Counsellor.create({
        userId: user._id,
        fullName: user.name || 'Counsellor',
        phone,
        isOnboardingComplete: false,
      });
    }

    const token = `token_counsellor_${counsellor._id}_${Date.now()}`;

    return res.status(200).json({
      success: true,
      message: 'Counsellor login successful',
      token,
      counsellor,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error('Error in login:', error);
    return res.status(500).json({ success: false, message: 'Server error during counsellor login', error: error.message });
  }
};

/**
 * Complete or Update Counsellor Onboarding Data
 * PUT /api/counsellor/auth/onboarding
 */
exports.completeOnboarding = async (req, res) => {
  try {
    const {
      phone,
      fullName,
      gender,
      areasOfFocus,
      experienceYears,
      languages,
      rates,
      certificates,
      bio,
    } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const updateFields = {};
    if (fullName) updateFields.fullName = fullName;
    if (gender) updateFields.gender = gender;
    if (areasOfFocus) updateFields.areasOfFocus = areasOfFocus;
    if (experienceYears !== undefined) updateFields.experienceYears = Number(experienceYears);
    if (languages) updateFields.languages = languages;
    if (rates) updateFields.rates = rates;
    if (certificates) updateFields.certificates = certificates;
    if (bio) updateFields.bio = bio;
    updateFields.isOnboardingComplete = true;

    const counsellor = await Counsellor.findOneAndUpdate(
      { phone },
      { $set: updateFields },
      { new: true, upsert: true }
    );

    if (fullName) {
      await User.updateOne({ phone }, { $set: { name: fullName, gender: gender || '' } });
    }

    return res.status(200).json({
      success: true,
      message: 'Onboarding completed successfully',
      data: counsellor,
    });
  } catch (error) {
    console.error('Error in completeOnboarding:', error);
    return res.status(500).json({ success: false, message: 'Server error completing onboarding', error: error.message });
  }
};

/**
 * Get Counsellor Profile
 * GET /api/counsellor/auth/profile/:phone
 */
exports.getProfile = async (req, res) => {
  try {
    const { phone } = req.params;
    const counsellor = await Counsellor.findOne({ phone });

    if (!counsellor) {
      return res.status(404).json({ success: false, message: 'Counsellor profile not found' });
    }

    return res.status(200).json({
      success: true,
      data: counsellor,
    });
  } catch (error) {
    console.error('Error in getProfile:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching profile', error: error.message });
  }
};
