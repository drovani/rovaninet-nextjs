import { getAllPosts, getAllPostFileInfo } from './posts';
import { globalTracker } from './performance';
import { 
    frontmatterCache, 
    processedContentCache, 
    excerptCache,
    compiledRegexCache 
} from './memoization';

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
    console.log('🚀 Starting performance benchmark...');
    
    // Clear all caches to ensure fair first run
    globalTracker.clear();
    frontmatterCache.clear();
    processedContentCache.clear();
    excerptCache.clear();
    
    // First run - cold cache
    console.log('📊 First run (cold cache)...');
    const startFirst = performance.now();
    const firstPosts = await getAllPosts();
    const endFirst = performance.now();
    const firstDuration = endFirst - startFirst;
    
    console.log(`✅ First run completed: ${firstPosts.length} posts in ${firstDuration.toFixed(2)}ms`);
    
    // Second run - warm cache
    console.log('📊 Second run (warm cache)...');
    const startSecond = performance.now();
    const secondPosts = await getAllPosts();
    const endSecond = performance.now();
    const secondDuration = endSecond - startSecond;
    
    console.log(`✅ Second run completed: ${secondPosts.length} posts in ${secondDuration.toFixed(2)}ms`);
    
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
    console.log(`🎯 Performance improvement: ${improvement}% faster on second run`);
    console.log(`📈 Cache stats:`, cacheStats);
    
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
    console.log('🏁 Memory before benchmark:', memoryBefore);
    
    const results = await runPerformanceBenchmark();
    
    const memoryAfter = await measureMemoryUsage();
    console.log('🏁 Memory after benchmark:', memoryAfter);
    
    console.log('\n📊 Performance Summary:');
    console.log(`First run: ${results.firstRun.duration.toFixed(2)}ms (${results.firstRun.postCount} posts)`);
    console.log(`Second run: ${results.secondRun.duration.toFixed(2)}ms (${results.secondRun.postCount} posts)`);
    console.log(`Improvement: ${((results.firstRun.duration - results.secondRun.duration) / results.firstRun.duration * 100).toFixed(1)}%`);
    
    console.log('\n🗂️ Cache Statistics:');
    Object.entries(results.cacheStats).forEach(([key, value]) => {
        console.log(`${key}: ${value} entries`);
    });
    
    console.log('\n⚡ Operation Breakdown:');
    results.summary.forEach(op => {
        console.log(`${op.operation}: ${op.avgDuration.toFixed(2)}ms avg (${op.count} calls)`);
    });
}