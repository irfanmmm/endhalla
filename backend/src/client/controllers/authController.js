const User = require('../../models/User');
const OTP = require('../../models/OTP');

/**
 * Send OTP to Client Phone Number
 * POST /api/auth/send-otp
 */
exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    // Generate 4-digit or 6-digit mock OTP (e.g. 123456)
    const mockOTP = '123456';
    
    // Save to DB
    await OTP.deleteMany({ phone });
    await OTP.create({ phone, otp: mockOTP });

    console.log(`[CLIENT AUTH] OTP sent to ${phone}: ${mockOTP}`);

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      otp: mockOTP, // Returned for dev testing
    });
  } catch (error) {
    console.error('Error in sendOTP:', error);
    return res.status(500).json({ success: false, message: 'Server error sending OTP', error: error.message });
  }
};

/**
 * Verify OTP and authenticate/create client user
 * POST /api/auth/verify-otp
 */
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    // Accept default test OTP '123456' or verify against DB
    const validOTP = await OTP.findOne({ phone, otp });
    if (otp !== '123456' && !validOTP) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Find or create User
    let user = await User.findOne({ phone });
    let isExistingUser = true;

    if (!user) {
      isExistingUser = false;
      user = await User.create({
        phone,
        userType: 'client',
      });
    } else if (!user.name) {
      isExistingUser = false;
    }

    // Generate auth token
    const token = `token_client_${user._id}_${Date.now()}`;

    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token,
      isExistingUser,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name || '',
        gender: user.gender || '',
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    return res.status(500).json({ success: false, message: 'Server error verifying OTP', error: error.message });
  }
};

/**
 * Dedicated Login API (Called when OTP is verified or logging in existing user)
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    // If OTP provided, verify it
    if (otp && otp !== '123456') {
      const validOTP = await OTP.findOne({ phone, otp });
      if (!validOTP) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      }
    }

    let user = await User.findOne({ phone });
    let isExistingUser = true;

    if (!user) {
      isExistingUser = false;
      user = await User.create({
        phone,
        userType: 'client',
      });
    } else if (!user.name) {
      isExistingUser = false;
    }

    const token = `token_client_${user._id}_${Date.now()}`;

    console.log(`[CLIENT LOGIN] Phone: ${phone}, ExistingUser: ${isExistingUser}`);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      isExistingUser,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name || '',
        gender: user.gender || '',
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error('Error in login:', error);
    return res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
};

/**
 * Update Client Profile (Name, Gender, Avatar)
 * PUT /api/auth/profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const { phone, name, gender } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const user = await User.findOneAndUpdate(
      { phone },
      { $set: { name, gender } },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        gender: user.gender,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    return res.status(500).json({ success: false, message: 'Server error updating profile', error: error.message });
  }
};

/**
 * Get Client Profile
 * GET /api/auth/profile/:phone
 */
exports.getProfile = async (req, res) => {
  try {
    const { phone } = req.params;
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        gender: user.gender,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error('Error in getProfile:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching profile', error: error.message });
  }
};
