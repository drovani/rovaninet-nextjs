export interface PerformanceMetrics {
    startTime: number;
    endTime?: number;
    duration?: number;
    operation: string;
    details?: Record<string, any>;
}

export class PerformanceTracker {
    private metrics: Map<string, PerformanceMetrics> = new Map();

    start(operation: string, details?: Record<string, any>): string {
        const id = `${operation}-${Date.now()}-${Math.random()}`;
        this.metrics.set(id, {
            startTime: performance.now(),
            operation,
            details
        });
        return id;
    }

    end(id: string): PerformanceMetrics | null {
        const metric = this.metrics.get(id);
        if (!metric) return null;

        metric.endTime = performance.now();
        metric.duration = metric.endTime - metric.startTime;
        
        return metric;
    }

    getMetrics(): PerformanceMetrics[] {
        return Array.from(this.metrics.values()).filter(m => m.duration !== undefined);
    }

    clear(): void {
        this.metrics.clear();
    }

    summary(): { operation: string, avgDuration: number, count: number }[] {
        const grouped = new Map<string, number[]>();
        
        for (const metric of this.getMetrics()) {
            if (!grouped.has(metric.operation)) {
                grouped.set(metric.operation, []);
            }
            grouped.get(metric.operation)!.push(metric.duration!);
        }

        return Array.from(grouped.entries()).map(([operation, durations]) => ({
            operation,
            avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
            count: durations.length
        }));
    }
}

export const globalTracker = new PerformanceTracker();

export async function withConcurrencyLimit<T>(
    items: T[],
    processor: (item: T) => Promise<any>,
    limit: number = 10
): Promise<any[]> {
    const results: any[] = [];
    
    for (let i = 0; i < items.length; i += limit) {
        const batch = items.slice(i, i + limit);
        const batchResults = await Promise.allSettled(
            batch.map(item => processor(item))
        );
        
        results.push(...batchResults.map(result => 
            result.status === 'fulfilled' ? result.value : null
        ).filter(Boolean));
    }
    
    return results;
}