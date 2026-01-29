/**
 * Validation Utility Functions
 */
export declare const validationUtils: {
    /**
     * Validate email format
     */
    isValidEmail: (email: string) => boolean;
    /**
     * Validate password strength
     * Requires: 8+ chars, uppercase, lowercase, number, special char
     */
    isValidPassword: (password: string) => {
        valid: boolean;
        errors: string[];
    };
    /**
     * Validate URL format
     */
    isValidURL: (url: string) => boolean;
    /**
     * Validate phone number (basic)
     */
    isValidPhone: (phone: string) => boolean;
    /**
     * Validate date format (YYYY-MM-DD)
     */
    isValidDate: (dateStr: string) => boolean;
    /**
     * Check if date is in past
     */
    isPastDate: (dateStr: string) => boolean;
    /**
     * Check if date is in future
     */
    isFutureDate: (dateStr: string) => boolean;
    /**
     * Validate file size
     * @param size File size in bytes
     * @param maxSizeInMB Maximum size in megabytes
     */
    isValidFileSize: (size: number, maxSizeInMB?: number) => boolean;
    /**
     * Validate file type
     * @param mimeType File MIME type
     * @param allowedTypes Array of allowed MIME types
     */
    isValidFileType: (mimeType: string, allowedTypes?: string[]) => boolean;
};
//# sourceMappingURL=validationUtils.d.ts.map