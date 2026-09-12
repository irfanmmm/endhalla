const User = require('../../models/User');
const Counsellor = require('../../models/Counsellor');
const Booking = require('../../models/Booking');
const { priceToNumber, formatINR } = require('../utils/money');

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

/**
 * Aggregate platform stats for the admin dashboard
 * GET /api/admin/dashboard/overview
 */
exports.getOverview = async (req, res) => {
  try {
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalClients,
      totalCounsellors,
      verifiedCounsellors,
      pendingCounsellors,
      newUsers30d,
      bookings,
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ userType: 'client' }),
      Counsellor.countDocuments({}),
      Counsellor.countDocuments({ approvalStatus: 'approved' }),
      Counsellor.countDocuments({ approvalStatus: 'pending' }),
      User.countDocuments({ createdAt: { $gte: monthAgo } }),
      Booking.find({}).select('status paymentStatus paymentMethod price sessionType createdAt').lean(),
    ]);

    const paidBookings = bookings.filter((b) => b.paymentStatus === 'completed');
    const grossRevenue = paidBookings.reduce((s, b) => s + priceToNumber(b.price), 0);
    const revenue30d = paidBookings
      .filter((b) => new Date(b.createdAt) >= monthAgo)
      .reduce((s, b) => s + priceToNumber(b.price), 0);

    const byStatus = bookings.reduce((acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {});
    const bySessionType = bookings.reduce((acc, b) => {
      acc[b.sessionType] = (acc[b.sessionType] || 0) + 1;
      return acc;
    }, {});
    const byPaymentStatus = bookings.reduce((acc, b) => {
      acc[b.paymentStatus] = (acc[b.paymentStatus] || 0) + 1;
      return acc;
    }, {});

    // Bookings + revenue per day for the last 14 days
    const days = [];
    for (let i = 13; i >= 0; i -= 1) {
      const day = startOfDay(new Date(now.getTime() - i * 24 * 60 * 60 * 1000));
      const next = new Date(day.getTime() + 24 * 60 * 60 * 1000);
      const dayBookings = bookings.filter((b) => {
        const c = new Date(b.createdAt);
        return c >= day && c < next;
      });
      days.push({
        date: day.toISOString().slice(0, 10),
        bookings: dayBookings.length,
        revenue: dayBookings
          .filter((b) => b.paymentStatus === 'completed')
          .reduce((s, b) => s + priceToNumber(b.price), 0),
      });
    }

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalClients,
        totalCounsellors,
        verifiedCounsellors,
        pendingCounsellors,
        newUsers30d,
        totalBookings: bookings.length,
        completedBookings: byStatus.completed || 0,
        confirmedBookings: byStatus.confirmed || 0,
        cancelledBookings: byStatus.cancelled || 0,
        grossRevenue,
        grossRevenueText: formatINR(grossRevenue),
        revenue30d,
        revenue30dText: formatINR(revenue30d),
      },
      breakdown: { byStatus, bySessionType, byPaymentStatus },
      timeseries: days,
    });
  } catch (error) {
    console.error('Error in getOverview:', error);
    return res.status(500).json({ success: false, message: 'Server error building dashboard', error: error.message });
  }
};

/**
 * Recent activity feed (latest bookings + newest users/counsellors)
 * GET /api/admin/dashboard/activity
 */
exports.getActivity = async (req, res) => {
  try {
    const [recentBookings, recentUsers, recentCounsellors] = await Promise.all([
      Booking.find({}).sort({ createdAt: -1 }).limit(10).lean(),
      User.find({}).sort({ createdAt: -1 }).limit(8).select('name phone userType createdAt').lean(),
      Counsellor.find({}).sort({ createdAt: -1 }).limit(8).select('fullName phone approvalStatus createdAt').lean(),
    ]);

    return res.status(200).json({ success: true, recentBookings, recentUsers, recentCounsellors });
  } catch (error) {
    console.error('Error in getActivity:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching activity', error: error.message });
  }
};
