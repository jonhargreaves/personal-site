import { useCallback, useEffect, useRef, useState } from "react";
//#region src/utils/env.ts
/**
* Environment detection utilities
*
* This uses a constant that bundlers can optimize away in production builds.
* Avoids direct process.env access which doesn't work in browsers without bundler transformation.
*/
/**
* Development mode flag
* Bundlers will replace this with false in production builds
*/
const __DEV__ = typeof process !== "undefined" && process.env?.["NODE_ENV"] === "development";
/**
* Check if code is running in a browser environment
*/
const isBrowser = typeof window !== "undefined";
//#endregion
//#region src/utils/performance.ts
/**
* Performance monitoring utilities for tile layout calculations
*/
var PerformanceMonitor = class {
	marks = /* @__PURE__ */ new Map();
	metrics = [];
	enabled;
	constructor() {
		this.enabled = __DEV__;
	}
	/**
	* Start a performance measurement
	*/
	startMark(name) {
		if (!this.enabled) return;
		this.marks.set(name, {
			name,
			startTime: performance.now()
		});
	}
	/**
	* End a performance measurement and log if it exceeds threshold
	*/
	endMark(name, threshold = 16) {
		if (!this.enabled) return;
		const mark = this.marks.get(name);
		if (!mark) {
			console.warn(`Performance mark "${name}" not found`);
			return;
		}
		const endTime = performance.now();
		const duration = endTime - mark.startTime;
		mark.endTime = endTime;
		mark.duration = duration;
		if (duration > threshold) console.warn(`[Performance] ${name} took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`);
		return duration;
	}
	/**
	* Measure a function's execution time
	*/
	measure(name, fn, threshold = 16) {
		if (!this.enabled) return fn();
		this.startMark(name);
		const result = fn();
		this.endMark(name, threshold);
		return result;
	}
	/**
	* Measure an async function's execution time
	*/
	async measureAsync(name, fn, threshold = 16) {
		if (!this.enabled) return fn();
		this.startMark(name);
		const result = await fn();
		this.endMark(name, threshold);
		return result;
	}
	/**
	* Record layout performance metrics
	*/
	recordLayoutMetrics(metrics) {
		if (!this.enabled) return;
		this.metrics.push(metrics);
		if (this.metrics.length > 100) this.metrics.shift();
		if (metrics.layoutCalculationTime > 16) console.warn(`[Performance] Slow layout calculation: ${metrics.layoutCalculationTime.toFixed(2)}ms for ${metrics.participantCount} participants`);
	}
	/**
	* Get average metrics over the recorded period
	*/
	getAverageMetrics() {
		if (this.metrics.length === 0) return {};
		const sum = this.metrics.reduce((acc, metric) => ({
			layoutCalculationTime: acc.layoutCalculationTime + metric.layoutCalculationTime,
			renderTime: acc.renderTime + metric.renderTime,
			participantCount: acc.participantCount + metric.participantCount,
			tileCount: acc.tileCount + metric.tileCount
		}), {
			layoutCalculationTime: 0,
			renderTime: 0,
			participantCount: 0,
			tileCount: 0
		});
		const count = this.metrics.length;
		return {
			layoutCalculationTime: sum.layoutCalculationTime / count,
			renderTime: sum.renderTime / count,
			participantCount: sum.participantCount / count,
			tileCount: sum.tileCount / count
		};
	}
	/**
	* Clear all recorded metrics
	*/
	clear() {
		this.marks.clear();
		this.metrics = [];
	}
	/**
	* Enable or disable performance monitoring
	*/
	setEnabled(enabled) {
		this.enabled = enabled;
	}
	/**
	* Get current enabled state
	*/
	isEnabled() {
		return this.enabled;
	}
};
const performanceMonitor = new PerformanceMonitor();
/**
* React hook for performance monitoring
*/
function usePerformanceMonitor() {
	return performanceMonitor;
}
/**
* Utility to create a performance-monitored version of a function
*/
function withPerformanceMonitoring(fn, name, threshold = 16) {
	return ((...args) => performanceMonitor.measure(name, () => fn(...args), threshold));
}
/**
* Log render count for debugging excessive re-renders.
*
* Counts committed renders of THIS component instance in a ref-plus-effect —
* the previous implementation incremented `window["render-count-…"]` inside a
* useMemo body, i.e. a process-global counter mutated during render, which
* double-counted under StrictMode and warned across unrelated instances.
*/
function useRenderCount(componentName) {
	const renderCountRef = useRef(0);
	useEffect(() => {
		if (!__DEV__) return;
		renderCountRef.current += 1;
		if (renderCountRef.current > 10) console.warn(`[Performance] ${componentName} has rendered ${renderCountRef.current} times`);
	});
}
/**
* Performance optimization helper for heavy computations
*/
function memoizeWithCache(fn, getCacheKey, maxCacheSize = 10) {
	const cache = /* @__PURE__ */ new Map();
	return ((...args) => {
		const key = getCacheKey(...args);
		if (cache.has(key)) return cache.get(key);
		const result = fn(...args);
		cache.set(key, result);
		if (cache.size > maxCacheSize) {
			const firstKey = cache.keys().next().value;
			if (firstKey !== void 0) cache.delete(firstKey);
		}
		return result;
	});
}
//#endregion
//#region src/hooks/useReactScan.ts
/**
* Hook that manages React Scan integration for performance monitoring.
* Only loads React Scan in development mode and when explicitly enabled.
*/
function useReactScan(initialOptions = {}) {
	const [isEnabled, setIsEnabled] = useState(initialOptions.enabled ?? false);
	const [options, setOptions] = useState({
		enabled: false,
		showToolbar: true,
		log: true,
		...initialOptions
	});
	const isSupported = __DEV__ && isBrowser;
	useEffect(() => {
		if (!(isSupported && isEnabled)) return;
		let scanCleanup;
		const loadReactScan = async () => {
			try {
				const { scan } = await import("react-scan");
				const result = scan({
					enabled: true,
					showToolbar: options.showToolbar,
					log: options.log
				});
				if (typeof result === "function") scanCleanup = result;
				console.log("🔍 React Scan enabled for tile layout performance monitoring");
			} catch (error) {
				console.warn("Failed to load React Scan:", error);
			}
		};
		loadReactScan();
		return () => {
			if (scanCleanup) {
				scanCleanup();
				console.log("🔍 React Scan disabled");
			}
		};
	}, [
		isEnabled,
		isSupported,
		options
	]);
	const enable = useCallback(() => {
		setIsEnabled(true);
		setOptions((prev) => ({
			...prev,
			enabled: true
		}));
	}, []);
	const disable = useCallback(() => {
		setIsEnabled(false);
		setOptions((prev) => ({
			...prev,
			enabled: false
		}));
	}, []);
	return {
		isEnabled,
		isSupported,
		options,
		enable,
		disable,
		toggle: useCallback(() => {
			if (isEnabled) disable();
			else enable();
		}, [
			isEnabled,
			enable,
			disable
		]),
		updateOptions: useCallback((newOptions) => {
			setOptions((prev) => {
				const updated = {
					...prev,
					...newOptions
				};
				if (newOptions.enabled !== void 0) setIsEnabled(newOptions.enabled);
				return updated;
			});
		}, [])
	};
}
//#endregion
//#region src/utils/instrumentation.ts
/**
* Deterministic work counters.
*
* These module-scoped integers count how much layout work actually runs, so
* performance changes can be proven as machine-independent integer assertions
* instead of wall-clock timings. Increment cost is a single integer add; the
* readers are only exported from the dev entry point (`src/index.dev.ts`), so
* the production API surface is unchanged.
*/
let layoutComputations = 0;
let optimalGridCalls = 0;
let gridConfigurationsEvaluated = 0;
function readInstrumentation() {
	return {
		layoutComputations,
		optimalGridCalls,
		gridConfigurationsEvaluated
	};
}
function resetInstrumentation() {
	layoutComputations = 0;
	optimalGridCalls = 0;
	gridConfigurationsEvaluated = 0;
}
//#endregion
export { memoizeWithCache, performanceMonitor, readInstrumentation, resetInstrumentation, usePerformanceMonitor, useReactScan, useRenderCount, withPerformanceMonitoring };
