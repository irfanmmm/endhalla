const Booking = require('../../models/Booking');
const Counsellor = require('../../models/Counsellor');

/**
 * Get Counsellor Dashboard Stats & Summary
 * GET /api/counsellor/dashboard/overview/:phone
 */
exports.getDashboardOverview = async (req, res) => {
  try {
    const { phone } = req.params;
    const counsellor = await Counsellor.findOne({ phone });

    if (!counsellor) {
      return res.status(404).json({ success: false, message: 'Counsellor profile not found' });
    }

    // Fetch all bookings for this counsellor
    const bookings = await Booking.find({
      $or: [
        { counsellorId: counsellor._id },
        { counsellorName: { $regex: counsellor.fullName, $options: 'i' } },
      ],
    }).sort({ createdAt: -1 });

    const totalSessions = bookings.length;
    const completedSessions = bookings.filter((b) => b.status === 'completed').length;
    const upcomingSessions = bookings.filter((b) => b.status === 'confirmed').length;

    // Calculate total earnings
    const totalEarnings = bookings.reduce((sum, b) => {
      const priceNum = parseFloat(String(b.price).replace(/[^0-9.]/g, '')) || 0;
      return sum + priceNum;
    }, 0);

    return res.status(200).json({
      success: true,
      stats: {
        totalSessions,
        completedSessions,
        upcomingSessions,
        totalEarnings: `₹${totalEarnings.toLocaleString()}`,
        rating: counsellor.rating || 4.9,
        reviewCount: counsellor.reviewCount || 12,
      },
      upcomingBookings: bookings.slice(0, 10),
    });
  } catch (error) {
    console.error('Error in getDashboardOverview:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching dashboard stats', error: error.message });
  }
};

/**
 * Update availability slots or session rates for counsellor
 * PUT /api/counsellor/dashboard/settings
 */
exports.updateSettings = async (req, res) => {
  try {
    const { phone, rates, availableSlots } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const updateFields = {};
    if (rates) updateFields.rates = rates;
    if (availableSlots) updateFields.availableSlots = availableSlots;

    const counsellor = await Counsellor.findOneAndUpdate(
      { phone },
      { $set: updateFields },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Dashboard settings updated successfully',
      data: counsellor,
    });
  } catch (error) {
    console.error('Error in updateSettings:', error);
    return res.status(500).json({ success: false, message: 'Server error updating settings', error: error.message });
  }
};
