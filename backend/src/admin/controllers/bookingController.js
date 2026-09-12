const mongoose = require('mongoose');
const Booking = require('../../models/Booking');
const { parsePagination, pageMeta } = require('../utils/paginate');
const { priceToNumber, formatINR } = require('../utils/money');

/**
 * List bookings with rich filtering
 * GET /api/admin/bookings
 * ?q= &status= &paymentStatus= &sessionType= &counsellorId= &clientPhone= &from= &to=
 */
exports.list = async (req, res) => {
  try {
    const { q, status, paymentStatus, sessionType, counsellorId, clientPhone, from, to } = req.query;
    const { page, limit, skip } = parsePagination(req.query);

    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (sessionType) filter.sessionType = sessionType;
    if (counsellorId && mongoose.Types.ObjectId.isValid(counsellorId)) filter.counsellorId = counsellorId;
    if (clientPhone) filter.clientPhone = clientPhone;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }
    if (q) {
      filter.$or = [
        { counsellorName: { $regex: q, $options: 'i' } },
        { clientName: { $regex: q, $options: 'i' } },
        { clientPhone: { $regex: q, $options: 'i' } },
        { razorpayPaymentId: { $regex: q, $options: 'i' } },
        { razorpayOrderId: { $regex: q, $options: 'i' } },
      ];
    }

    const [items, total, filteredForSum] = await Promise.all([
      Booking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Booking.countDocuments(filter),
      Booking.find(filter).select('price paymentStatus').lean(),
    ]);

    const revenue = filteredForSum
      .filter((b) => b.paymentStatus === 'completed')
      .reduce((s, b) => s + priceToNumber(b.price), 0);

    return res.status(200).json({
      success: true,
      data: items,
      meta: pageMeta(page, limit, total),
      summary: { matchedRevenue: revenue, matchedRevenueText: formatINR(revenue) },
    });
  } catch (error) {
    console.error('Error in booking list:', error);
    return res.status(500).json({ success: false, message: 'Server error listing bookings', error: error.message });
  }
};

/**
 * Get a single booking
 * GET /api/admin/bookings/:id
 */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid booking id' });
    }
    const booking = await Booking.findById(id)
      .populate('clientId', 'name phone gender')
      .populate('counsellorId', 'fullName phone title')
      .lean();
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    return res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error('Error in booking getById:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching booking', error: error.message });
  }
};

/**
 * Update booking status / payment status / notes
 * PATCH /api/admin/bookings/:id
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, notes, dateText, timeText } = req.body;

    const updates = {};
    if (status) {
      if (!['confirmed', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }
      updates.status = status;
    }
    if (paymentStatus) {
      if (!['pending', 'completed', 'failed', 'free'].includes(paymentStatus)) {
        return res.status(400).json({ success: false, message: 'Invalid paymentStatus' });
      }
      updates.paymentStatus = paymentStatus;
    }
    if (notes !== undefined) updates.notes = notes;
    if (dateText !== undefined) updates.dateText = dateText;
    if (timeText !== undefined) updates.timeText = timeText;

    const booking = await Booking.findByIdAndUpdate(id, { $set: updates }, { new: true });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    return res.status(200).json({ success: true, message: 'Booking updated', data: booking });
  } catch (error) {
    console.error('Error in booking update:', error);
    return res.status(500).json({ success: false, message: 'Server error updating booking', error: error.message });
  }
};

/**
 * Delete a booking
 * DELETE /api/admin/bookings/:id
 */
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    return res.status(200).json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    console.error('Error in booking remove:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting booking', error: error.message });
  }
};

/**
 * Payments-focused view: only bookings that carry payment data
 * GET /api/admin/bookings/payments/list
 */
exports.payments = async (req, res) => {
  try {
    const { paymentStatus, paymentMethod } = req.query;
    const { page, limit, skip } = parsePagination(req.query);

    const filter = { $or: [{ razorpayOrderId: { $ne: '' } }, { paymentMethod: { $ne: 'free' } }] };
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    const [items, total] = await Promise.all([
      Booking.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('counsellorName clientName clientPhone sessionType price status paymentStatus paymentMethod razorpayOrderId razorpayPaymentId createdAt')
        .lean(),
      Booking.countDocuments(filter),
    ]);

    return res.status(200).json({ success: true, data: items, meta: pageMeta(page, limit, total) });
  } catch (error) {
    console.error('Error in booking payments:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching payments', error: error.message });
  }
};
