/**
 * String Utility Functions
 */
export declare const stringUtils: {
    /**
     * Truncate string to specified length
     */
    truncate: (str: string, length: number, suffix?: string) => string;
    /**
     * Capitalize first letter
     */
    capitalize: (str: string) => string;
    /**
     * Convert to title case
     */
    titleCase: (str: string) => string;
    /**
     * Mask email address
     * @example maskEmail('john@example.com') => 'j***@example.com'
     */
    maskEmail: (email: string) => string;
    /**
     * Mask phone number
     * @example maskPhone('1234567890') => '***-***-7890'
     */
    maskPhone: (phone: string) => string;
    /**
     * Check if string is valid UUID
     */
    isUUID: (str: string) => boolean;
    /**
     * Generate random string
     */
    randomString: (length?: number) => string;
};
//# sourceMappingURL=stringUtils.d.ts.map