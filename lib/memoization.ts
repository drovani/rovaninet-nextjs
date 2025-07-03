import { readFile, stat } from "fs/promises";

export interface CacheEntry<T> {
    value: T;
    timestamp: number;
    fileModTime?: number;
}

export class FileBasedCache<T> {
    private cache = new Map<string, CacheEntry<T>>();
    private ttl: number;

    constructor(ttlMs: number = 5 * 60 * 1000) { // 5 minutes default
        this.ttl = ttlMs;
    }

    async get(
        key: string, 
        filePath?: string,
        factory?: () => Promise<T>
    ): Promise<T | undefined> {
        const entry = this.cache.get(key);
        
        if (entry) {
            // Check TTL
            if (Date.now() - entry.timestamp > this.ttl) {
                this.cache.delete(key);
            } else if (filePath) {
                // Check file modification time
                try {
                    const stats = await stat(filePath);
                    if (stats.mtimeMs > (entry.fileModTime || 0)) {
                        this.cache.delete(key);
                    } else {
                        return entry.value;
                    }
                } catch {
                    // File doesn't exist or can't be accessed, remove cache entry
                    this.cache.delete(key);
                }
            } else {
                return entry.value;
            }
        }

        // Cache miss or invalidated, use factory if provided
        if (factory) {
            const value = await factory();
            await this.set(key, value, filePath);
            return value;
        }

        return undefined;
    }

    async set(key: string, value: T, filePath?: string): Promise<void> {
        let fileModTime: number | undefined;
        
        if (filePath) {
            try {
                const stats = await stat(filePath);
                fileModTime = stats.mtimeMs;
            } catch {
                // File doesn't exist, that's okay
            }
        }

        this.cache.set(key, {
            value,
            timestamp: Date.now(),
            fileModTime
        });
    }

    clear(): void {
        this.cache.clear();
    }

    size(): number {
        return this.cache.size;
    }
}

// Global caches for different types of operations
export const frontmatterCache = new FileBasedCache<any>();
export const processedContentCache = new FileBasedCache<string>();
export const excerptCache = new FileBasedCache<string>();

// Memoized regex patterns for better performance
export const compiledRegexCache = new Map<string, RegExp>();

export function getCompiledRegex(pattern: string, flags?: string): RegExp {
    const key = `${pattern}:${flags || ''}`;
    let regex = compiledRegexCache.get(key);
    
    if (!regex) {
        regex = new RegExp(pattern, flags);
        compiledRegexCache.set(key, regex);
    }
    
    return regex;
}

// Memoized file content reader
export async function memoizedReadFile(filePath: string): Promise<string> {
    return processedContentCache.get(
        `file:${filePath}`,
        filePath,
        () => readFile(filePath, 'utf-8')
    ) as Promise<string>;
}

// Function to create a simple memoization decorator
export function memoize<T extends (...args: any[]) => any>(
    fn: T,
    keyGenerator?: (...args: Parameters<T>) => string
): T {
    const cache = new Map<string, ReturnType<T>>();
    
    return ((...args: Parameters<T>): ReturnType<T> => {
        const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
        
        if (cache.has(key)) {
            return cache.get(key)!;
        }
        
        const result = fn(...args);
        cache.set(key, result);
        return result;
    }) as T;
}