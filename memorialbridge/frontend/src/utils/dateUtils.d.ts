/**
 * Date Utility Functions
 */
export declare const dateUtils: {
    /**
     * Format date to readable string
     * @example formatDate('2024-01-28T10:00:00Z') => 'Jan 28, 2024'
     */
    formatDate: (date: string | Date, formatStr?: string) => string;
    /**
     * Format date and time
     * @example formatDateTime('2024-01-28T10:00:00Z') => 'Jan 28, 2024 10:00 AM'
     */
    formatDateTime: (date: string | Date, formatStr?: string) => string;
    /**
     * Format date as relative time
     * @example formatRelative('2024-01-27T10:00:00Z') => '2 days ago'
     */
    formatRelative: (date: string | Date) => string;
    /**
     * Check if date is in the past
     */
    isPast: (date: string | Date) => boolean;
    /**
     * Check if date is in the future
     */
    isFuture: (date: string | Date) => boolean;
};
//# sourceMappingURL=dateUtils.d.ts.map