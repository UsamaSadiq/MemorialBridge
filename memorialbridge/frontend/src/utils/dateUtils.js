/**
 * Date Utility Functions
 */
import { format, formatDistance, parseISO } from 'date-fns';
export const dateUtils = {
    /**
     * Format date to readable string
     * @example formatDate('2024-01-28T10:00:00Z') => 'Jan 28, 2024'
     */
    formatDate: (date, formatStr = 'MMM dd, yyyy') => {
        try {
            const dateObj = typeof date === 'string' ? parseISO(date) : date;
            return format(dateObj, formatStr);
        }
        catch {
            return 'Invalid date';
        }
    },
    /**
     * Format date and time
     * @example formatDateTime('2024-01-28T10:00:00Z') => 'Jan 28, 2024 10:00 AM'
     */
    formatDateTime: (date, formatStr = 'MMM dd, yyyy hh:mm a') => {
        try {
            const dateObj = typeof date === 'string' ? parseISO(date) : date;
            return format(dateObj, formatStr);
        }
        catch {
            return 'Invalid date';
        }
    },
    /**
     * Format date as relative time
     * @example formatRelative('2024-01-27T10:00:00Z') => '2 days ago'
     */
    formatRelative: (date) => {
        try {
            const dateObj = typeof date === 'string' ? parseISO(date) : date;
            return formatDistance(dateObj, new Date(), { addSuffix: true });
        }
        catch {
            return 'Invalid date';
        }
    },
    /**
     * Check if date is in the past
     */
    isPast: (date) => {
        try {
            const dateObj = typeof date === 'string' ? parseISO(date) : date;
            return dateObj < new Date();
        }
        catch {
            return false;
        }
    },
    /**
     * Check if date is in the future
     */
    isFuture: (date) => {
        try {
            const dateObj = typeof date === 'string' ? parseISO(date) : date;
            return dateObj > new Date();
        }
        catch {
            return false;
        }
    },
};
