import React, { useState, useEffect, useCallback } from 'react';

interface UseLocalStorageOptions<T> {
    key: string;
    initialValue: T;
    debounceMs?: number;
}

export const useLocalStorage = <T>({
    key,
    initialValue,
    debounceMs = 0,
}: UseLocalStorageOptions<T>) => {
    const [value, setValue] = useState<T>(() => {
        if (typeof window !== 'undefined') {
            try {
                const item = window.localStorage.getItem(key);
                return item ? JSON.parse(item) : initialValue;
            } catch (error) {
                console.error(`Error reading localStorage key "${key}":`, error);
                return initialValue;
            }
        }
        return initialValue;
    });

    const setStoredValue = useCallback(
        (newValue: T | ((prev: T) => T)) => {
            try {
                const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
                setValue(valueToStore);

                if (typeof window !== 'undefined') {
                    if (debounceMs > 0) {
                        setTimeout(() => {
                            window.localStorage.setItem(key, JSON.stringify(valueToStore));
                        }, debounceMs);
                    } else {
                        window.localStorage.setItem(key, JSON.stringify(valueToStore));
                    }
                }
            } catch (error) {
                console.error(`Error setting localStorage key "${key}":`, error);
            }
        },
        [key, debounceMs]
    );

    return [value, setStoredValue] as const;
};
