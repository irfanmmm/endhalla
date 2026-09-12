/**
 * Booking.price is stored as a free-form string ("₹499", "499", "Free").
 * Normalise it to a number for aggregation.
 */
exports.priceToNumber = (value) => {
  if (value == null) return 0;
  const n = parseFloat(String(value).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

exports.formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
