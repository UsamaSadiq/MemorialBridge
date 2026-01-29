/**
 * Validation Utility Functions
 */

export const validationUtils = {
  /**
   * Validate email format
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   * Requires: 8+ chars, uppercase, lowercase, number, special char
   */
  isValidPassword: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Password must contain special character (!@#$%^&*)');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate URL format
   */
  isValidURL: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validate phone number (basic)
   */
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    const digitsOnly = phone.replace(/\D/g, '');
    return phoneRegex.test(phone) && digitsOnly.length >= 10;
  },

  /**
   * Validate date format (YYYY-MM-DD)
   */
  isValidDate: (dateStr: string): boolean => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) return false;

    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date.getTime());
  },

  /**
   * Check if date is in past
   */
  isPastDate: (dateStr: string): boolean => {
    try {
      return new Date(dateStr) < new Date();
    } catch {
      return false;
    }
  },

  /**
   * Check if date is in future
   */
  isFutureDate: (dateStr: string): boolean => {
    try {
      return new Date(dateStr) > new Date();
    } catch {
      return false;
    }
  },

  /**
   * Validate file size
   * @param size File size in bytes
   * @param maxSizeInMB Maximum size in megabytes
   */
  isValidFileSize: (size: number, maxSizeInMB = 5): boolean => {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return size <= maxSizeInBytes;
  },

  /**
   * Validate file type
   * @param mimeType File MIME type
   * @param allowedTypes Array of allowed MIME types
   */
  isValidFileType: (mimeType: string, allowedTypes: string[] = ['image/jpeg', 'image/png']): boolean => {
    return allowedTypes.includes(mimeType);
  },
};
