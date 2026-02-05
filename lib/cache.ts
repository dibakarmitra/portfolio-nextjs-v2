interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiresAt: number;
}

class Cache {
    private store = new Map<string, CacheEntry<any>>();
    private defaultTTL = 60000; // 1 minute default

    set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
        const now = Date.now();
        this.store.set(key, {
            data,
            timestamp: now,
            expiresAt: now + ttl,
        });
    }

    get<T>(key: string): T | null {
        const entry = this.store.get(key);

        if (!entry) {
            return null;
        }

        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return null;
        }

        return entry.data as T;
    }

    has(key: string): boolean {
        return this.get(key) !== null;
    }

    delete(key: string): boolean {
        return this.store.delete(key);
    }

    clear(): void {
        this.store.clear();
    }

    clearExpired(): void {
        const now = Date.now();
        for (const [key, entry] of this.store.entries()) {
            if (now > entry.expiresAt) {
                this.store.delete(key);
            }
        }
    }

    getStats() {
        return {
            size: this.store.size,
            keys: Array.from(this.store.keys()),
        };
    }

    invalidatePattern(pattern: string): number {
        let count = 0;
        for (const key of this.store.keys()) {
            if (key.startsWith(pattern)) {
                this.store.delete(key);
                count++;
            }
        }
        return count;
    }
}

export const cache = new Cache();

if (typeof window === 'undefined') {
    setInterval(
        () => {
            cache.clearExpired();
        },
        5 * 60 * 1000
    );
}

export async function withCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 60000
): Promise<T> {
    const cached = cache.get<T>(key);
    if (cached !== null) {
        return cached;
    }

    const data = await fetcher();
    cache.set(key, data, ttl);
    return data;
}

export const CacheKeys = {
    notes: (status?: string) => `notes:${status || 'all'}`,
    note: (id: string) => `note:${id}`,
    categories: () => 'categories:all',
    category: (id: string) => `category:${id}`,
    tags: () => 'tags:all',
    settings: () => 'settings:all',
    profile: (userId: string) => `profile:${userId}`,
    resume: (type?: string) => `resume:${type || 'all'}`,
};

export const CacheTTL = {
    SHORT: 30000, // 30 seconds
    MEDIUM: 60000, // 1 minute
    LONG: 300000, // 5 minutes
    VERY_LONG: 900000, // 15 minutes
};
