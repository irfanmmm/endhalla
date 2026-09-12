const mongoose = require('mongoose');
const Counsellor = require('../../models/Counsellor');
const User = require('../../models/User');
const Booking = require('../../models/Booking');
const { parsePagination, pageMeta } = require('../utils/paginate');
const { priceToNumber } = require('../utils/money');
const { sendPushNotification } = require('../../utils/pushNotification');

// Counsellors self-register through the counsellor app, so admins can edit the
// profile but never create one or flip approval directly through this list.
const EDITABLE_FIELDS = [
  'fullName', 'phone', 'gender', 'title', 'avatar', 'areasOfFocus', 'experienceYears',
  'languages', 'rates', 'certificates', 'rating', 'reviewCount', 'bio', 'availableSlots',
  'isOnboardingComplete', 'hasFreeSessionOffer', 'freeSessionDurationText', 'voiceNote',
];

const APPROVAL_STATES = ['pending', 'approved', 'rejected'];

const pick = (obj, keys) =>
  keys.reduce((acc, k) => {
    if (obj[k] !== undefined) acc[k] = obj[k];
    return acc;
  }, {});

/**
 * List counsellors with search / filter / pagination
 * GET /api/admin/counsellors?q=&status=pending|approved|rejected&onboarding=&sortBy=
 */
exports.list = async (req, res) => {
  try {
    const { q, status, onboarding, sortBy } = req.query;
    const { page, limit, skip } = parsePagination(req.query);

    const filter = {};
    if (q) {
      filter.$or = [
        { fullName: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
        { title: { $regex: q, $options: 'i' } },
        { areasOfFocus: { $regex: q, $options: 'i' } },
      ];
    }
    if (APPROVAL_STATES.includes(status)) filter.approvalStatus = status;
    if (onboarding === 'true') filter.isOnboardingComplete = true;
    if (onboarding === 'false') filter.isOnboardingComplete = false;

    const sort = { createdAt: -1 };
    if (sortBy === 'rating') Object.assign(sort, { rating: -1 });
    if (sortBy === 'experience') Object.assign(sort, { experienceYears: -1 });
    if (sortBy === 'name') Object.assign(sort, { fullName: 1 });

    const [items, total, pendingCount] = await Promise.all([
      Counsellor.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Counsellor.countDocuments(filter),
      Counsellor.countDocuments({ approvalStatus: 'pending' }),
    ]);

    return res.status(200).json({
      success: true,
      data: items,
      meta: pageMeta(page, limit, total),
      pendingCount,
    });
  } catch (error) {
    console.error('Error in counsellor list:', error);
    return res.status(500).json({ success: false, message: 'Server error listing counsellors', error: error.message });
  }
};

/**
 * Count of counsellors awaiting review (for the sidebar badge)
 * GET /api/admin/counsellors/pending/count
 */
exports.pendingCount = async (req, res) => {
  try {
    const count = await Counsellor.countDocuments({ approvalStatus: 'pending' });
    return res.status(200).json({ success: true, count });
  } catch (error) {
    console.error('Error in pendingCount:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Get a single counsellor plus their booking summary
 * GET /api/admin/counsellors/:id
 */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid counsellor id' });
    }

    const counsellor = await Counsellor.findById(id).lean();
    if (!counsellor) {
      return res.status(404).json({ success: false, message: 'Counsellor not found' });
    }

    const bookings = await Booking.find({
      $or: [{ counsellorId: counsellor._id }, { counsellorName: counsellor.fullName }],
    })
      .sort({ createdAt: -1 })
      .lean();

    const earnings = bookings
      .filter((b) => b.paymentStatus === 'completed')
      .reduce((s, b) => s + priceToNumber(b.price), 0);

    return res.status(200).json({
      success: true,
      data: counsellor,
      bookingSummary: {
        total: bookings.length,
        completed: bookings.filter((b) => b.status === 'completed').length,
        confirmed: bookings.filter((b) => b.status === 'confirmed').length,
        cancelled: bookings.filter((b) => b.status === 'cancelled').length,
        earnings,
      },
      recentBookings: bookings.slice(0, 10),
    });
  } catch (error) {
    console.error('Error in counsellor getById:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching counsellor', error: error.message });
  }
};

/**
 * Update an existing counsellor's profile (not approval, not creation)
 * PUT /api/admin/counsellors/:id
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid counsellor id' });
    }

    const updates = pick(req.body, EDITABLE_FIELDS);
    const counsellor = await Counsellor.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
    if (!counsellor) {
      return res.status(404).json({ success: false, message: 'Counsellor not found' });
    }

    if (updates.fullName || updates.phone || updates.gender !== undefined) {
      const userUpdate = {};
      if (updates.fullName) userUpdate.name = updates.fullName;
      if (updates.phone) userUpdate.phone = updates.phone;
      if (updates.gender !== undefined) userUpdate.gender = updates.gender;
      if (counsellor.userId) await User.updateOne({ _id: counsellor.userId }, { $set: userUpdate });
    }

    return res.status(200).json({ success: true, message: 'Counsellor updated', data: counsellor });
  } catch (error) {
    console.error('Error in counsellor update:', error);
    return res.status(500).json({ success: false, message: 'Server error updating counsellor', error: error.message });
  }
};

/**
 * Approve or reject a counsellor
 * PATCH /api/admin/counsellors/:id/approval   body: { decision: 'approved'|'rejected'|'pending', reason? }
 */
exports.review = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, reason } = req.body;

    if (!APPROVAL_STATES.includes(decision)) {
      return res.status(400).json({ success: false, message: "decision must be 'approved', 'rejected' or 'pending'" });
    }

    const update = {
      approvalStatus: decision,
      isVerified: decision === 'approved',
      rejectionReason: decision === 'rejected' ? String(reason || '') : '',
      reviewedAt: new Date(),
      reviewedBy: req.admin?._id,
    };

    const counsellor = await Counsellor.findByIdAndUpdate(id, { $set: update }, { new: true });
    if (!counsellor) {
      return res.status(404).json({ success: false, message: 'Counsellor not found' });
    }

    if (decision === 'approved' || decision === 'rejected') {
      const counsellorUser = counsellor.userId ? await User.findById(counsellor.userId) : null;
      if (counsellorUser?.pushToken) {
        sendPushNotification({
          token: counsellorUser.pushToken,
          title: decision === 'approved' ? 'Profile approved' : 'Profile not approved',
          body:
            decision === 'approved'
              ? 'Your counsellor profile has been approved. You can now receive bookings.'
              : 'Your counsellor profile was not approved. Check your profile for details.',
          data: { type: 'counsellor_review', decision },
        });
      }
    }

    return res.status(200).json({
      success: true,
      message:
        decision === 'approved'
          ? 'Counsellor approved'
          : decision === 'rejected'
          ? 'Counsellor rejected'
          : 'Counsellor moved back to pending',
      data: counsellor,
    });
  } catch (error) {
    console.error('Error in counsellor review:', error);
    return res.status(500).json({ success: false, message: 'Server error reviewing counsellor', error: error.message });
  }
};

/**
 * Delete a counsellor (optionally the linked user via ?deleteUser=true)
 * DELETE /api/admin/counsellors/:id
 */
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const counsellor = await Counsellor.findByIdAndDelete(id);
    if (!counsellor) {
      return res.status(404).json({ success: false, message: 'Counsellor not found' });
    }

    if (req.query.deleteUser === 'true' && counsellor.userId) {
      await User.deleteOne({ _id: counsellor.userId });
    }

    return res.status(200).json({ success: true, message: 'Counsellor deleted' });
  } catch (error) {
    console.error('Error in counsellor remove:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting counsellor', error: error.message });
  }
};
