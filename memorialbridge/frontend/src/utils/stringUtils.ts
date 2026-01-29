/**
 * String Utility Functions
 */

export const stringUtils = {
  /**
   * Truncate string to specified length
   */
  truncate: (str: string, length: number, suffix = '...'): string => {
    if (str.length <= length) return str;
    return str.slice(0, length - suffix.length) + suffix;
  },

  /**
   * Capitalize first letter
   */
  capitalize: (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  /**
   * Convert to title case
   */
  titleCase: (str: string): string => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  /**
   * Mask email address
   * @example maskEmail('john@example.com') => 'j***@example.com'
   */
  maskEmail: (email: string): string => {
    const [name, domain] = email.split('@');
    if (!name || !domain) return email;
    return name[0] + '***@' + domain;
  },

  /**
   * Mask phone number
   * @example maskPhone('1234567890') => '***-***-7890'
   */
  maskPhone: (phone: string): string => {
    if (phone.length < 4) return phone;
    return '*'.repeat(Math.max(0, phone.length - 4)) + phone.slice(-4);
  },

  /**
   * Check if string is valid UUID
   */
  isUUID: (str: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  },

  /**
   * Generate random string
   */
  randomString: (length = 16): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },
};
