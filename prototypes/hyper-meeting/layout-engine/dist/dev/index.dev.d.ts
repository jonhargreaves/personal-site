//#region src/utils/performance.d.ts
interface PerformanceMetrics {
  layoutCalculationTime: number;
  renderTime: number;
  participantCount: number;
  tileCount: number;
  timestamp: number;
}
declare class PerformanceMonitor {
  private readonly marks;
  private metrics;
  private enabled;
  constructor();
  /**
   * Start a performance measurement
   */
  startMark(name: string): void;
  /**
   * End a performance measurement and log if it exceeds threshold
   */
  endMark(name: string, threshold?: number): number | undefined;
  /**
   * Measure a function's execution time
   */
  measure<T>(name: string, fn: () => T, threshold?: number): T;
  /**
   * Measure an async function's execution time
   */
  measureAsync<T>(name: string, fn: () => Promise<T>, threshold?: number): Promise<T>;
  /**
   * Record layout performance metrics
   */
  recordLayoutMetrics(metrics: PerformanceMetrics): void;
  /**
   * Get average metrics over the recorded period
   */
  getAverageMetrics(): Partial<PerformanceMetrics>;
  /**
   * Clear all recorded metrics
   */
  clear(): void;
  /**
   * Enable or disable performance monitoring
   */
  setEnabled(enabled: boolean): void;
  /**
   * Get current enabled state
   */
  isEnabled(): boolean;
}
declare const performanceMonitor: PerformanceMonitor;
/**
 * React hook for performance monitoring
 */
declare function usePerformanceMonitor(): PerformanceMonitor;
/**
 * Utility to create a performance-monitored version of a function
 */
declare function withPerformanceMonitoring<T extends (...args: any[]) => any>(fn: T, name: string, threshold?: number): T;
/**
 * Log render count for debugging excessive re-renders.
 *
 * Counts committed renders of THIS component instance in a ref-plus-effect —
 * the previous implementation incremented `window["render-count-…"]` inside a
 * useMemo body, i.e. a process-global counter mutated during render, which
 * double-counted under StrictMode and warned across unrelated instances.
 */
declare function useRenderCount(componentName: string): void;
/**
 * Performance optimization helper for heavy computations
 */
declare function memoizeWithCache<T extends (...args: any[]) => any>(fn: T, getCacheKey: (...args: Parameters<T>) => string, maxCacheSize?: number): T;
//#endregion
//#region src/hooks/useReactScan.d.ts
interface UseReactScanOptions {
  enabled?: boolean;
  showToolbar?: boolean;
  log?: boolean;
}
interface UseReactScanResult {
  isEnabled: boolean;
  isSupported: boolean;
  options: UseReactScanOptions;
  enable: () => void;
  disable: () => void;
  toggle: () => void;
  updateOptions: (newOptions: Partial<UseReactScanOptions>) => void;
}
/**
 * Hook that manages React Scan integration for performance monitoring.
 * Only loads React Scan in development mode and when explicitly enabled.
 */
declare function useReactScan(initialOptions?: UseReactScanOptions): UseReactScanResult;
//#endregion
//#region src/utils/instrumentation.d.ts
interface InstrumentationCounters {
  /** Number of times the full layout pipeline ran. */
  layoutComputations: number;
  /** Number of `calculateOptimalGrid` invocations. */
  optimalGridCalls: number;
  /** Number of grid (rows × cols) candidates evaluated. */
  gridConfigurationsEvaluated: number;
}
declare function readInstrumentation(): InstrumentationCounters;
declare function resetInstrumentation(): void;
//#endregion
export { type InstrumentationCounters, memoizeWithCache, performanceMonitor, readInstrumentation, resetInstrumentation, usePerformanceMonitor, useReactScan, useRenderCount, withPerformanceMonitoring };