const TIME_RE = /(\d{1,2}):(\d{2})\s*(AM|PM)/i;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Parses a booking's dateText ("2026-09-12") + timeText ("5:00 PM") as IST
// wall-clock time and returns a UTC Date. Returns null if unparsable —
// callers must treat a null scheduledAt as "unknown", never throw on bad data.
function parseBookingDateTime(dateText, timeText) {
  if (!dateText || !timeText || !DATE_RE.test(dateText)) return null;

  const match = TIME_RE.exec(timeText);
  if (!match) return null;

  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();

  if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return null;
  if (meridiem === 'PM' && hour !== 12) hour += 12;
  if (meridiem === 'AM' && hour === 12) hour = 0;

  const hh = String(hour).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  const date = new Date(`${dateText}T${hh}:${mm}:00+05:30`);

  return Number.isNaN(date.getTime()) ? null : date;
}

module.exports = {
  parseBookingDateTime,
  JOIN_WINDOW_BEFORE_MIN: 10,
  JOIN_WINDOW_AFTER_MIN: 60,
};
