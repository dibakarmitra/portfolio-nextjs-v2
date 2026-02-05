/**
 * Dashboard UI Types
 * Dashboard statistics and metrics types
 */

/**
 * Statistics metric for dashboard
 */
export interface StatMetric {
    label: string;
    value: string | number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
}
