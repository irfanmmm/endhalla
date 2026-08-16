/**
 * Common Validation & Input Sanitization Utilities
 * Shared between Client and Counsellor applications.
 */

/**
 * Checks if a string of digits is a sequential, repeated, or fake pattern.
 * Detects:
 * - All identical digits (e.g. "0000000000", "9999999999")
 * - Ascending sequences (e.g. "1234567890", "0123456789", "2345678901")
 * - Descending sequences (e.g. "9876543210", "8765432109", "7654321098")
 * - 6 or more consecutive identical digits (e.g. "9999999123")
 */
export const isSequentialPhone = (phone: string): boolean => {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 5) return false;

  // 1. All same digits (e.g., 1111111111, 0000000000)
  if (/^(\d)\1+$/.test(digits)) return true;

  // 2. Ascending sequence (e.g., 0123456789, 1234567890)
  const ascending = '01234567890123456789';
  if (ascending.includes(digits)) return true;

  // 3. Descending sequence (e.g., 9876543210, 8765432109)
  const descending = '98765432109876543210';
  if (descending.includes(digits)) return true;

  // 4. 6 or more repeated digits in a row (e.g., 9999991234)
  if (/(\d)\1{5,}/.test(digits)) return true;

  return false;
};

/**
 * Sanitizes phone input text for typing and paste events.
 * Extracts digits only (0-9) and strips out letters, spaces, hyphens, brackets, country codes, etc.
 * Restricts length to `maxLength` (default: 10 digits).
 */
export const sanitizePhone = (text: string, maxLength: number = 10): string => {
  if (!text) return '';
  const digitsOnly = text.replace(/\D/g, '');
  return digitsOnly.slice(0, maxLength);
};

/**
 * Sanitizes name input text for typing and paste events.
 * Keeps letters (a-z, A-Z), spaces, hyphens, and apostrophes.
 * Strips out numbers, emojis, and special symbols.
 * Restricts length to `maxLength` (default: 30 characters).
 * Prevents leading spaces and multiple consecutive spaces.
 */
export const sanitizeName = (text: string, maxLength: number = 30): string => {
  if (!text) return '';
  const cleaned = text.replace(/[^a-zA-Z\s'-]/g, '');
  const sanitized = cleaned.replace(/^\s+/, '').replace(/\s{2,}/g, ' ');
  return sanitized.slice(0, maxLength);
};

/**
 * Validates whether a phone number is valid:
 * - Exact required length (default 10 digits)
 * - Not a sequential or fake number (e.g., 1234567890, 0000000000, 9876543210)
 */
export const validatePhone = (phone: string, requiredLength: number = 10): boolean => {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  if (digits.length !== requiredLength) return false;
  if (isSequentialPhone(digits)) return false;

  return true;
};

/**
 * Validates whether a name is valid (at least `minLength` characters, max `maxLength` characters).
 */
export const validateName = (name: string, minLength: number = 2, maxLength: number = 30): boolean => {
  if (!name) return false;
  const trimmed = name.trim();
  if (trimmed.length < minLength || trimmed.length > maxLength) return false;
  return /^[a-zA-Z\s'-]+$/.test(trimmed);
};
