const mongoose = require('mongoose');
const User = require('../../models/User');
const Booking = require('../../models/Booking');
const Counsellor = require('../../models/Counsellor');
const { parsePagination, pageMeta } = require('../utils/paginate');
const { priceToNumber } = require('../utils/money');

/**
 * List users with search / filter / pagination
 * GET /api/admin/users
 */
exports.list = async (req, res) => {
  try {
    const { q, userType } = req.query;
    const { page, limit, skip } = parsePagination(req.query);

    const filter = {};
    if (userType && ['client', 'counsellor'].includes(userType)) filter.userType = userType;
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ]);

    return res.status(200).json({ success: true, data: items, meta: pageMeta(page, limit, total) });
  } catch (error) {
    console.error('Error in user list:', error);
    return res.status(500).json({ success: false, message: 'Server error listing users', error: error.message });
  }
};

/**
 * Get a user with booking history
 * GET /api/admin/users/:id
 */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }

    const user = await User.findById(id).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const bookings = await Booking.find({
      $or: [{ clientId: user._id }, { clientPhone: user.phone }],
    })
      .sort({ createdAt: -1 })
      .lean();

    const counsellorProfile =
      user.userType === 'counsellor' ? await Counsellor.findOne({ phone: user.phone }).lean() : null;

    const spend = bookings
      .filter((b) => b.paymentStatus === 'completed')
      .reduce((s, b) => s + priceToNumber(b.price), 0);

    return res.status(200).json({
      success: true,
      data: user,
      counsellorProfile,
      bookingSummary: {
        total: bookings.length,
        completed: bookings.filter((b) => b.status === 'completed').length,
        cancelled: bookings.filter((b) => b.status === 'cancelled').length,
        spend,
      },
      bookings,
    });
  } catch (error) {
    console.error('Error in user getById:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching user', error: error.message });
  }
};

/**
 * Update basic user fields
 * PUT /api/admin/users/:id
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, gender, avatar, userType } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (gender !== undefined) updates.gender = gender;
    if (avatar !== undefined) updates.avatar = avatar;
    if (userType !== undefined && ['client', 'counsellor'].includes(userType)) updates.userType = userType;

    const user = await User.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, message: 'User updated', data: user });
  } catch (error) {
    console.error('Error in user update:', error);
    return res.status(500).json({ success: false, message: 'Server error updating user', error: error.message });
  }
};

/**
 * Delete a user (and their counsellor profile if present)
 * DELETE /api/admin/users/:id
 */
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await Counsellor.deleteOne({ phone: user.phone });
    return res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error('Error in user remove:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting user', error: error.message });
  }
};
