/**
 * Utility Types and Helpers
 * Generic TypeScript helpers used throughout the application
 */

/**
 * Async Request State
 */
export type AsyncState<T> =
    | { status: 'idle'; data: null; error: null }
    | { status: 'pending'; data: null; error: null }
    | { status: 'success'; data: T; error: null }
    | { status: 'error'; data: null; error: Error };

/**
 * Component Props Base
 */
export interface BaseProps {
    className?: string;
    style?: React.CSSProperties;
    id?: string;
    testId?: string;
}

/**
 * Event Handler Types
 */
export type EventHandler<E extends Event = Event> = (event: E) => void;
export type ChangeHandler<T = string> = (value: T) => void;
export type SubmitHandler = (event: React.FormEvent) => void | Promise<void>;

/**
 * Type Manipulation Helpers
 */
export type Optional<T> = {
    [K in keyof T]?: T[K];
};

export type DeepReadonly<T> = {
    readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

export type Nullable<T> = {
    [K in keyof T]: T[K] | null;
};

export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

export type Constructor<T = any> = new (...args: any[]) => T;
