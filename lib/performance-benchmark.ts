import { getAllPosts, getAllPostFileInfo } from './posts';
import { globalTracker } from './performance';
import { 
    frontmatterCache, 
    processedContentCache, 
    excerptCache,
    compiledRegexCache 
} from './memoization';
import log from 'loglevel';

export async function runPerformanceBenchmark(): Promise<{
    firstRun: { duration: number; postCount: number };
    secondRun: { duration: number; postCount: number };
    cacheStats: {
        frontmatter: number;
        processedContent: number;
        excerpt: number;
        regex: number;
    };
    summary: Array<{ operation: string; avgDuration: number; count: number }>;
}> {
    log.info('🚀 Starting performance benchmark...');
    
    // Clear all caches to ensure fair first run
    globalTracker.clear();
    frontmatterCache.clear();
    processedContentCache.clear();
    excerptCache.clear();
    
    // First run - cold cache
    log.info('📊 First run (cold cache)...');
    const startFirst = performance.now();
    const firstPosts = await getAllPosts();
    const endFirst = performance.now();
    const firstDuration = endFirst - startFirst;
    
    log.info(`✅ First run completed: ${firstPosts.length} posts in ${firstDuration.toFixed(2)}ms`);
    
    // Second run - warm cache
    log.info('📊 Second run (warm cache)...');
    const startSecond = performance.now();
    const secondPosts = await getAllPosts();
    const endSecond = performance.now();
    const secondDuration = endSecond - startSecond;
    
    log.info(`✅ Second run completed: ${secondPosts.length} posts in ${secondDuration.toFixed(2)}ms`);
    
    // Cache statistics
    const cacheStats = {
        frontmatter: frontmatterCache.size(),
        processedContent: processedContentCache.size(),
        excerpt: excerptCache.size(),
        regex: compiledRegexCache.size
    };
    
    // Performance summary
    const summary = globalTracker.summary();
    
    const improvement = ((firstDuration - secondDuration) / firstDuration * 100).toFixed(1);
    log.info(`🎯 Performance improvement: ${improvement}% faster on second run`);
    log.info(`📈 Cache stats:`, cacheStats);
    
    return {
        firstRun: { duration: firstDuration, postCount: firstPosts.length },
        secondRun: { duration: secondDuration, postCount: secondPosts.length },
        cacheStats,
        summary
    };
}

export async function measureMemoryUsage(): Promise<{
    heapUsed: number;
    heapTotal: number;
    external: number;
    rss: number;
}> {
    if (typeof process !== 'undefined' && process.memoryUsage) {
        const usage = process.memoryUsage();
        return {
            heapUsed: Math.round(usage.heapUsed / 1024 / 1024), // MB
            heapTotal: Math.round(usage.heapTotal / 1024 / 1024), // MB
            external: Math.round(usage.external / 1024 / 1024), // MB
            rss: Math.round(usage.rss / 1024 / 1024) // MB
        };
    }
    return { heapUsed: 0, heapTotal: 0, external: 0, rss: 0 };
}

// Export a function to run the benchmark and log results
export async function logPerformanceBenchmark(): Promise<void> {
    const memoryBefore = await measureMemoryUsage();
    log.info('🏁 Memory before benchmark:', memoryBefore);
    
    const results = await runPerformanceBenchmark();
    
    const memoryAfter = await measureMemoryUsage();
    log.info('🏁 Memory after benchmark:', memoryAfter);
    
    log.info('\n📊 Performance Summary:');
    log.info(`First run: ${results.firstRun.duration.toFixed(2)}ms (${results.firstRun.postCount} posts)`);
    log.info(`Second run: ${results.secondRun.duration.toFixed(2)}ms (${results.secondRun.postCount} posts)`);
    log.info(`Improvement: ${((results.firstRun.duration - results.secondRun.duration) / results.firstRun.duration * 100).toFixed(1)}%`);
    
    log.info('\n🗂️ Cache Statistics:');
    Object.entries(results.cacheStats).forEach(([key, value]) => {
        log.info(`${key}: ${value} entries`);
    });
    
    log.info('\n⚡ Operation Breakdown:');
    results.summary.forEach(op => {
        log.info(`${op.operation}: ${op.avgDuration.toFixed(2)}ms avg (${op.count} calls)`);
    });
}