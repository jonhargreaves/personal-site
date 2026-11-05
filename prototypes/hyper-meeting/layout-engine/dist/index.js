import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
//#region src/components/DefaultDraggableDivider.tsx
function DefaultDraggableDivider({ renderProps, handleColor = "rgba(255, 255, 255, 0.3)", handleSize = {
	width: 80,
	height: 6
}, showOnHover = true }) {
	const { dividerStyles, dividerHandlers, isDragging, orientation } = renderProps;
	const isVertical = orientation === "vertical";
	return /* @__PURE__ */ jsx("div", {
		...dividerHandlers,
		style: {
			...dividerStyles,
			padding: isVertical ? "0 12px" : "12px 0",
			margin: isVertical ? "0 -12px" : "-12px 0"
		},
		children: /* @__PURE__ */ jsx("div", {
			style: {
				width: isVertical ? handleSize.height : handleSize.width,
				height: isVertical ? handleSize.width : handleSize.height,
				backgroundColor: isDragging ? handleColor : `${handleColor}88`,
				borderRadius: "3px",
				display: "flex",
				flexDirection: isVertical ? "column" : "row",
				justifyContent: "center",
				alignItems: "center",
				gap: "4px",
				transition: "all 0.2s",
				transform: isDragging ? "scale(1.1)" : "scale(1)",
				opacity: showOnHover && !isDragging ? 0 : 1
			},
			children: [
				1,
				2,
				3
			].map((i) => /* @__PURE__ */ jsx("div", { style: {
				width: "2px",
				height: "2px",
				backgroundColor: "rgba(255, 255, 255, 0.8)",
				borderRadius: "50%"
			} }, i))
		})
	});
}
//#endregion
//#region src/constants.ts
/**
* Central constants file for tile-layouts package
* All default values and magic numbers should be defined here
*/
const ASPECT_RATIOS = {
	MIN: 9 / 16,
	MAX: 16 / 9,
	IDEAL: 4 / 3,
	DEFAULT_MIN: .75,
	DEFAULT_MAX: 1.8,
	SCREEN_SHARE: 16 / 9,
	SCREEN_SHARE_TOLERANCE: .05,
	SINGLE_ROW_TILE: 3 / 4,
	STAGE: {
		MIN: .5,
		MAX: 3
	},
	AUDIENCE: {
		MIN: .75,
		MAX: 1.8,
		RELAXED_MIN: .5,
		RELAXED_MAX: 2.5
	},
	SIMPLE_GRID: {
		MIN: .5,
		MAX: 2
	}
};
const DEFAULT_SCREEN_SHARE_ASPECT_RATIO = ASPECT_RATIOS.MAX;
const SPACING = {
	DEFAULT_GAP: 8,
	DEFAULT_PADDING: 16,
	FLOATING_TILE_OFFSET: 16,
	PAGINATION_OVERLAY_OFFSET: 16,
	STAGE_AUDIENCE_OFFSET: 100
};
const MIN_TILE_SIZES = {
	DEFAULT: {
		width: 100,
		height: 100
	},
	STAGE: {
		width: 200,
		height: 200
	},
	AUDIENCE: {
		width: 100,
		height: 100
	},
	EDGE_CASE: {
		width: 50,
		height: 50
	},
	GRID: {
		width: 120,
		height: 90
	},
	SIDEBAR: {
		width: 80,
		height: 60
	},
	SIDEBAR_OPTIMIZED: {
		width: 100,
		height: 100
	}
};
const PAGINATION = {
	DEFAULT_MAX_TILES_PER_PAGE: 12,
	FOCUS_MAX_OTHERS: 4,
	SIDEBAR_MAX_PARTICIPANTS: 4,
	DEFAULT_MAX_AUDIENCE_PARTICIPANTS: 25,
	DOTS: {
		ICON_SIZE: 16,
		MAX_VISIBLE_DOTS: 7,
		ELLIPSIS_LEFT_OFFSET: 2,
		ELLIPSIS_RIGHT_OFFSET: 2
	}
};
const GRID_SCORING = {
	PREFERRED_ASPECT_RATIO: 3 / 4,
	SMALL_GROUP_PREFERRED_ASPECT_RATIO: 3 / 2,
	SMALL_GROUP_SPACE_EFFICIENCY_BONUS: .5,
	MAX_ITERATIONS: 300,
	EXCELLENT_SCORE_THRESHOLD: .95,
	DEFAULT_WEIGHTS: {
		participantCoverage: .4,
		tileSize: .4,
		spaceEfficiency: .1,
		gridBalance: 0,
		tileAspectRatio: .05,
		emptySpotsPenalty: .05
	},
	EMPTY_SPOTS_PENALTY_POWER: 2,
	MAX_REASONABLE_AREA_MULTIPLIER: 25,
	MIN_SPACE_UTILIZATION: .7,
	EXHAUSTIVE: {
		MAX_DIMENSION_MULTIPLIER: 2,
		MAX_DIMENSION_CAP: 20,
		ROWS_COLS_SCALE: 1.5,
		ROWS_COLS_CAP: 15,
		MAX_GRID_ASPECT_RATIO: 10,
		MIN_GRID_ASPECT_RATIO: .1
	}
};
const PERFORMANCE = {
	DEFAULT_DEBOUNCE_MS: 160,
	DEBOUNCE_BUFFER_MS: 50,
	FRAME_TIME_MS: 16,
	WARNING_THRESHOLD_MS: 16
};
const ANIMATION = {
	DEFAULT_DURATION: 300,
	DEFAULT_EASING: "cubic-bezier(0.4, 0, 0.2, 1)",
	DEFAULT_PROPERTIES: [
		"transform",
		"width",
		"height"
	],
	PRESETS: {
		FAST: {
			duration: 150,
			easing: "cubic-bezier(0.4, 0, 1, 1)"
		},
		NORMAL: {
			duration: 300,
			easing: "cubic-bezier(0.4, 0, 0.2, 1)"
		},
		SLOW: {
			duration: 500,
			easing: "cubic-bezier(0.4, 0, 0.2, 1)"
		},
		SMOOTH: {
			duration: 400,
			easing: "cubic-bezier(0.16, 1, 0.3, 1)"
		},
		SPRING: {
			duration: 600,
			easing: "cubic-bezier(0.34, 1.56, 0.64, 1)"
		}
	},
	TRIGGER_DEFAULTS: {
		resize: {
			enabled: false,
			duration: 300,
			easing: "cubic-bezier(0.4, 0, 0.2, 1)"
		},
		participantJoined: {
			enabled: true,
			duration: 300,
			easing: "cubic-bezier(0.4, 0, 0.2, 1)"
		},
		participantLeft: {
			enabled: true,
			duration: 300,
			easing: "cubic-bezier(0.4, 0, 0.2, 1)"
		},
		participantChange: {
			enabled: true,
			duration: 300,
			easing: "cubic-bezier(0.4, 0, 0.2, 1)"
		},
		screenShareStart: {
			enabled: true,
			duration: 250,
			easing: "cubic-bezier(0.4, 0, 0.2, 1)"
		},
		screenShareEnd: {
			enabled: true,
			duration: 250,
			easing: "cubic-bezier(0.4, 0, 0.2, 1)"
		},
		modeChange: {
			enabled: true,
			duration: 400,
			easing: "cubic-bezier(0.16, 1, 0.3, 1)"
		},
		stageSizeChange: {
			enabled: true,
			duration: 0,
			easing: "cubic-bezier(0.4, 0, 0.2, 1)"
		},
		initial: {
			enabled: false,
			duration: 0,
			easing: "linear"
		}
	}
};
const SWIPE = {
	MIN_DISTANCE: 50,
	MAX_TIME: 300,
	VELOCITY_THRESHOLD: .3,
	RUBBER_BAND_FACTOR: .3
};
const BREAKPOINTS = { MOBILE: 768 };
const SIZE_RATIOS = {
	STAGE: {
		DEFAULT: .85,
		MIN: .2,
		MAX: .85,
		MIN_SINGLE_PARTICIPANT: .6,
		MIN_MULTIPLE_PARTICIPANTS: .65
	},
	SIDEBAR: {
		WIDTH_RATIO: .25,
		MAX_WIDTH: 300,
		MAIN_CONTENT_RATIO: .75
	},
	FOCUS_MOBILE: {
		PRIMARY_HEIGHT_RATIO: .6,
		OTHERS_HEIGHT_RATIO: .4
	},
	FLOATING: {
		MAX_WIDTH_RATIO: .3,
		MAX_WIDTH: 250
	},
	MIXED_CONTENT: {
		SCREEN_SHARE_RATIO: .6,
		ON_STAGE_RATIO: .4
	}
};
const Z_INDEX = {
	DEFAULT: 0,
	FLOATING_TILE: 10,
	DRAGGABLE_DIVIDER: 20,
	OVERLAY: 50
};
const DRAGGABLE_DIVIDER = {
	DEFAULT_HANDLE_SIZE: 24,
	HOVER_HIT_AREA_PADDING: 8,
	VISUAL_HANDLE: {
		VERTICAL: {
			width: 16,
			height: 40
		},
		HORIZONTAL: {
			width: 40,
			height: 16
		}
	}
};
const UI_POSITIONING = {
	PAGINATION_BOTTOM_OFFSET: 8,
	DIMENSION_INDICATOR_OFFSET: 2,
	PAGINATION_CONTROL_HEIGHT: 25,
	PAGINATION_BUFFER_VERTICAL: 56,
	PAGINATION_BUFFER_HORIZONTAL: 130
};
const STAGE_AUDIENCE = {
	MIN_STAGE_PIXELS: 200,
	ORIENTATION_SWITCH_RATIO: 1.05
};
const SMALL_GROUP = {
	MAX_PARTICIPANTS: 4,
	MAX_HEIGHT_PERCENT: .8,
	MIN_TILE_WIDTH: 150,
	MIN_HEIGHT_PERCENT: .5
};
const FACE_VISIBILITY = {
	/** Default maximum allowed face clipping (0-1). 0.3 = 30% clipped allowed */
	DEFAULT_MAX_CLIP_THRESHOLD: .3,
	/** Default behavior when no config passes: use best-score */
	DEFAULT_FALLBACK_BEHAVIOR: "best-score",
	/** Relaxed thresholds for fallback (progressively more permissive) */
	RELAXED_THRESHOLDS: [
		.5,
		.7,
		1
	],
	/** Default video aspect ratio when participant doesn't specify one */
	DEFAULT_VIDEO_ASPECT_RATIO: 16 / 9
};
const DEFAULT_VALUES = {
	LAYOUT_MODE: "auto",
	PRIORITIZE_SPEAKER: true,
	PRIORITIZE_SCREEN_SHARE: true,
	ENABLE_ANIMATIONS: true,
	PIP_INITIAL_CORNER: "bottom-right",
	PIP_ENABLE_DRAG: true,
	PAGINATION_SHOW_ON_HOVER_ONLY: true,
	PAGINATION_POSITION: "bottom",
	PAGINATION_DISABLED: false,
	MAX_HEIGHT_PERCENT: 1,
	STAGE_AUDIENCE_ALLOW_RESIZE: true
};
//#endregion
//#region src/components/PaginationDots.tsx
const paginationClasses = {
	root: "flex items-center gap-1",
	dots: "flex items-center gap-1",
	navBtn: "m-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded border-0 bg-transparent p-0 text-white transition-colors duration-150 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent",
	dot: "m-0 h-2 cursor-pointer rounded-full border-0 p-0 [transition:width_300ms_cubic-bezier(0.2,2.2,0.3,0.8),background-color_300ms_ease]",
	dotActive: "w-6 bg-white",
	dotInactive: "w-2 bg-white/30 hover:bg-white/50",
	ellipsis: "select-none px-1 text-sm text-white/60"
};
function cx(...classes) {
	return classes.filter(Boolean).join(" ");
}
const PaginationDots = ({ currentPage, totalPages, onPageChange, className, style, showButtons = true, dotClassName, activeDotClassName, buttonClassName, ellipsisClassName }) => {
	if (totalPages <= 1) return null;
	const showEllipsis = totalPages > PAGINATION.DOTS.MAX_VISIBLE_DOTS;
	const getPageNumbers = () => {
		if (!showEllipsis) return Array.from({ length: totalPages }, (_, i) => i);
		const pages = [];
		const leftOffset = PAGINATION.DOTS.ELLIPSIS_LEFT_OFFSET;
		const rightOffset = PAGINATION.DOTS.ELLIPSIS_RIGHT_OFFSET;
		pages.push(0);
		if (currentPage > leftOffset + 1) pages.push("...");
		const start = Math.max(1, currentPage - leftOffset);
		const end = Math.min(totalPages - 2, currentPage + rightOffset);
		for (let i = start; i <= end; i += 1) pages.push(i);
		if (currentPage < totalPages - rightOffset - 2) pages.push("...");
		if (totalPages > 1) pages.push(totalPages - 1);
		return pages;
	};
	return /* @__PURE__ */ jsxs("div", {
		className: cx(paginationClasses.root, className),
		style,
		children: [
			showButtons && /* @__PURE__ */ jsx("button", {
				"aria-label": "Previous page",
				className: cx(paginationClasses.navBtn, buttonClassName),
				disabled: currentPage === 0,
				onClick: () => onPageChange(currentPage - 1),
				children: /* @__PURE__ */ jsx("svg", {
					fill: "none",
					height: PAGINATION.DOTS.ICON_SIZE,
					stroke: "currentColor",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					strokeWidth: "2",
					viewBox: "0 0 24 24",
					width: PAGINATION.DOTS.ICON_SIZE,
					children: /* @__PURE__ */ jsx("path", { d: "M15 18l-6-6 6-6" })
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: cx(paginationClasses.dots, className),
				children: getPageNumbers().map((page, index) => {
					if (page === "...") return /* @__PURE__ */ jsx("span", {
						className: cx(paginationClasses.ellipsis, ellipsisClassName),
						children: "⋯"
					}, `ellipsis-${index}`);
					const pageNumber = page;
					const isActive = pageNumber === currentPage;
					return /* @__PURE__ */ jsx("button", {
						"aria-current": isActive ? "page" : void 0,
						"aria-label": `Go to page ${pageNumber + 1}`,
						className: cx(paginationClasses.dot, isActive ? paginationClasses.dotActive : paginationClasses.dotInactive, dotClassName, isActive && activeDotClassName),
						onClick: () => onPageChange(pageNumber)
					}, pageNumber);
				})
			}),
			showButtons && /* @__PURE__ */ jsx("button", {
				"aria-label": "Next page",
				className: cx(paginationClasses.navBtn, buttonClassName),
				disabled: currentPage === totalPages - 1,
				onClick: () => onPageChange(currentPage + 1),
				children: /* @__PURE__ */ jsx("svg", {
					fill: "none",
					height: PAGINATION.DOTS.ICON_SIZE,
					stroke: "currentColor",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					strokeWidth: "2",
					viewBox: "0 0 24 24",
					width: PAGINATION.DOTS.ICON_SIZE,
					children: /* @__PURE__ */ jsx("path", { d: "M9 18l6-6-6-6" })
				})
			})
		]
	});
};
//#endregion
//#region src/config.ts
/**
* Default layout configuration
* This is the base configuration that will be merged with user-provided config
*/
const DEFAULT_LAYOUT_CONFIG = {
	mode: DEFAULT_VALUES.LAYOUT_MODE,
	maxTilesPerPage: PAGINATION.DEFAULT_MAX_TILES_PER_PAGE,
	aspectRatio: ASPECT_RATIOS.SCREEN_SHARE,
	prioritizeSpeaker: DEFAULT_VALUES.PRIORITIZE_SPEAKER,
	prioritizeScreenShare: DEFAULT_VALUES.PRIORITIZE_SCREEN_SHARE,
	enableAnimations: DEFAULT_VALUES.ENABLE_ANIMATIONS,
	animationConfig: {
		duration: ANIMATION.DEFAULT_DURATION,
		easing: ANIMATION.DEFAULT_EASING
	},
	minTileWidth: MIN_TILE_SIZES.GRID.width,
	minTileHeight: MIN_TILE_SIZES.GRID.height,
	minTileAspectRatio: ASPECT_RATIOS.DEFAULT_MIN,
	maxTileAspectRatio: ASPECT_RATIOS.DEFAULT_MAX,
	gridScoringWeights: GRID_SCORING.DEFAULT_WEIGHTS,
	maxHeightPercent: DEFAULT_VALUES.MAX_HEIGHT_PERCENT,
	stageAudienceConfig: {
		allowResize: DEFAULT_VALUES.STAGE_AUDIENCE_ALLOW_RESIZE,
		minStagePercent: SIZE_RATIOS.STAGE.MIN * 100,
		maxStagePercent: SIZE_RATIOS.STAGE.MAX * 100,
		stageSize: SIZE_RATIOS.STAGE.DEFAULT * 100,
		forceOrientation: void 0,
		maxAudienceParticipants: PAGINATION.DEFAULT_MAX_AUDIENCE_PARTICIPANTS,
		fitScreenshareAspectRatio: true,
		screenShareContentInsets: void 0
	},
	pipConfig: {
		initialCorner: DEFAULT_VALUES.PIP_INITIAL_CORNER,
		enableDrag: DEFAULT_VALUES.PIP_ENABLE_DRAG,
		pipSizeRatio: SIZE_RATIOS.FLOATING.MAX_WIDTH_RATIO
	},
	paginationConfig: {
		showOnHoverOnly: DEFAULT_VALUES.PAGINATION_SHOW_ON_HOVER_ONLY,
		position: DEFAULT_VALUES.PAGINATION_POSITION,
		disabled: DEFAULT_VALUES.PAGINATION_DISABLED
	},
	aspectRatioTracking: {
		enabled: false,
		debounceMs: 50
	},
	tileTransitions: {
		exitRetention: true,
		maxExitingTiles: 8
	},
	debugOverlays: {
		enabled: false,
		showAreaOverlays: false,
		showGridLines: false,
		showTileInfo: false
	}
};
/**
* Shared meeting-oriented defaults for app-level video layouts.
* Consumers can layer product-specific mode and responsive overrides on top.
*/
const DEFAULT_MEETING_LAYOUT_CONFIG = {
	...DEFAULT_LAYOUT_CONFIG,
	aspectRatioTracking: {
		enabled: true,
		debounceMs: 0
	},
	debounceMs: 0,
	gap: 8,
	maxTilesPerPage: 12,
	padding: 16,
	prioritizeScreenShare: true,
	gridScoringWeights: {
		participantCoverage: .9,
		tileSize: 0,
		spaceEfficiency: .4,
		gridBalance: 0,
		tileAspectRatio: .3,
		emptySpotsPenalty: .1
	},
	animationConfig: {
		...DEFAULT_LAYOUT_CONFIG.animationConfig,
		duration: 300,
		easing: ANIMATION.DEFAULT_EASING,
		properties: [
			"transform",
			"width",
			"height"
		],
		triggers: {
			resize: { enabled: false },
			stageSizeChange: { enabled: true }
		}
	},
	stageAudienceConfig: {
		...DEFAULT_LAYOUT_CONFIG.stageAudienceConfig,
		allowResize: false,
		stageSize: 70,
		minStagePercent: 5,
		maxStagePercent: 70,
		fitScreenshareAspectRatio: true
	},
	pipConfig: {
		...DEFAULT_LAYOUT_CONFIG.pipConfig,
		enableDrag: false
	},
	paginationConfig: {
		...DEFAULT_LAYOUT_CONFIG.paginationConfig,
		position: "bottom",
		bufferSize: 32
	}
};
const DEFAULT_MOBILE_MEETING_LAYOUT_OVERRIDES = {
	gap: 4,
	padding: 0,
	minTileAspectRatio: 7 / 16,
	maxTileAspectRatio: 3 / 4,
	stageAudienceConfig: {
		allowResize: false,
		stageSize: 60,
		minStagePercent: 60,
		maxStagePercent: 60
	},
	pipConfig: { pipSizeRatio: SIZE_RATIOS.FLOATING.MAX_WIDTH_RATIO },
	paginationConfig: { bufferSize: 24 }
};
function isMergeableObject(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
function mergeConfigObjects(base, overrides) {
	const result = { ...base };
	const overrideEntries = overrides;
	for (const key of Object.keys(overrideEntries)) {
		const overrideVal = overrideEntries[key];
		if (overrideVal === void 0) continue;
		const baseVal = result[key];
		if (isMergeableObject(baseVal) && isMergeableObject(overrideVal)) result[key] = {
			...baseVal,
			...overrideVal
		};
		else result[key] = overrideVal;
	}
	return result;
}
/**
* Creates a shared meeting-oriented layout config with optional mobile defaults
* and product-specific overrides layered on top.
*/
function createMeetingLayoutConfig(options = {}) {
	const { isMobile = false, overrides = {} } = options;
	const responsiveDefaults = isMobile ? DEFAULT_MOBILE_MEETING_LAYOUT_OVERRIDES : {};
	const presetAnimationTriggers = mergeConfigObjects(DEFAULT_MEETING_LAYOUT_CONFIG.animationConfig.triggers ?? {}, responsiveDefaults.animationConfig?.triggers ?? {});
	const normalizedOverrides = overrides.animationConfig?.triggers === void 0 ? overrides : {
		...overrides,
		animationConfig: {
			...overrides.animationConfig,
			triggers: mergeConfigObjects(presetAnimationTriggers, overrides.animationConfig.triggers)
		}
	};
	return mergeConfigObjects(mergeConfigObjects(DEFAULT_MEETING_LAYOUT_CONFIG, responsiveDefaults), normalizedOverrides);
}
/**
* Shallow-then-one-level deep merge tailored to the LayoutConfig shape.
* Replaces the `deepmerge-ts` dependency (19 kB) with ~15 lines.
*
* Rules:
* - Top-level primitives from `overrides` win.
* - Top-level plain objects are spread-merged one level deep.
* - `undefined` values in `overrides` are skipped (keep the default).
*/
function mergeLayoutConfig(defaults, overrides) {
	return mergeConfigObjects(defaults, overrides);
}
/**
* Applies overrides to an already-resolved layout config using the same
* one-level object merge semantics as the base config merge performed by
* `mergeConfigObjects`.
*
* @param baseConfig - The fully resolved base layout config.
* @param overrides - Breakpoint or runtime overrides to merge onto the base config.
* @returns The merged layout config.
*/
function applyLayoutConfigOverrides(baseConfig, overrides) {
	return mergeConfigObjects(baseConfig, overrides);
}
//#endregion
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
//#endregion
//#region src/utils/bounds-manager.ts
/**
* Centralized bounds management system
* Single source of truth for all layout bounds calculations
*/
/**
* THE single function that calculates bounds for stage-audience layouts
* All other systems MUST use this function - no exceptions!
*/
function calculateStageBounds(input) {
	const { dimensions, isVertical, config, isManualAdjustment = false, participantCounts } = input;
	const containerSize = isVertical ? dimensions.containerHeight : dimensions.containerWidth;
	const padding = dimensions.padding ?? 0;
	const gap = dimensions.gap ?? 0;
	const usableSize = containerSize - 2 * padding - gap;
	const minStageForOneTile = isVertical ? MIN_TILE_SIZES.STAGE.height : MIN_TILE_SIZES.STAGE.width;
	const minAudienceForOneTile = isVertical ? MIN_TILE_SIZES.AUDIENCE.height : MIN_TILE_SIZES.AUDIENCE.width;
	let minRequiredStageSize = minStageForOneTile;
	if (participantCounts?.stage) {
		const stageRows = Math.ceil(Math.sqrt(participantCounts.stage));
		const stageCols = Math.ceil(participantCounts.stage / stageRows);
		if (isVertical) minRequiredStageSize = Math.max(minStageForOneTile * stageRows + gap * (stageRows - 1), minStageForOneTile);
		else minRequiredStageSize = Math.max(minStageForOneTile * stageCols + gap * (stageCols - 1), minStageForOneTile);
	}
	let minRequiredAudienceSize = minAudienceForOneTile + gap;
	if (participantCounts?.audience) {
		if (participantCounts.audience > 8) minRequiredAudienceSize = minAudienceForOneTile * 3 + gap * 2;
		else if (participantCounts.audience > 4) minRequiredAudienceSize = minAudienceForOneTile * 2 + gap;
	}
	const dynamicMinPercent = Math.min(100, minRequiredStageSize / usableSize * 100);
	const dynamicMaxPercent = participantCounts?.audience === 0 ? 100 : (usableSize - minRequiredAudienceSize) / usableSize * 100;
	const configMinPercent = config?.minStagePercent ?? SIZE_RATIOS.STAGE.MIN * 100;
	const defaultMaxPercent = participantCounts?.audience === 0 ? 100 : SIZE_RATIOS.STAGE.MAX * 100;
	const configMaxPercent = config?.maxStagePercent ?? defaultMaxPercent;
	if (isManualAdjustment) return {
		minStagePercent: Math.max(dynamicMinPercent, configMinPercent),
		maxStagePercent: Math.min(100, dynamicMaxPercent, configMaxPercent),
		isManualAdjustment: true,
		source: "dynamic"
	};
	return {
		minStagePercent: Math.max(dynamicMinPercent, configMinPercent),
		maxStagePercent: Math.min(100, dynamicMaxPercent, configMaxPercent),
		isManualAdjustment: false,
		source: "config"
	};
}
/**
* Validates and clamps a stage size percentage using calculated bounds
*/
function clampStageSize(stagePercent, bounds, context) {
	const clamped = Math.max(bounds.minStagePercent, Math.min(bounds.maxStagePercent, stagePercent));
	if (__DEV__ && clamped !== stagePercent) console.warn(`[BoundsManager] Clamped stage size from ${stagePercent.toFixed(1)}% to ${clamped.toFixed(1)}% (bounds: ${bounds.minStagePercent.toFixed(1)}%-${bounds.maxStagePercent.toFixed(1)}%) in context: ${context || "unknown"}`);
	return clamped;
}
//#endregion
//#region src/utils/bounds-wrapper.ts
/**
* Simple helper for drag handlers to get consistent bounds
*/
function getDragBounds(dimensions, isVertical, config, participantCounts) {
	return calculateStageBounds({
		dimensions,
		isVertical,
		config,
		isManualAdjustment: true,
		context: "drag-handler",
		participantCounts
	});
}
//#endregion
//#region src/hooks/useDividerDrag.ts
/**
* Hook that manages draggable divider functionality for stage-audience layouts.
* Handles the drag state, position calculations, and bounds checking.
*/
function useDividerDrag({ layout, dimensions, config, setStageSize }) {
	const [isDraggingDivider, setIsDraggingDivider] = useState(false);
	const [dividerPosition, setDividerPosition] = useState(null);
	const dragStartRef = useRef(null);
	const rafRef = useRef(null);
	const pendingMoveRef = useRef(null);
	const startDividerDrag = useCallback((position, clientPos, options) => {
		if (!layout.audience) return;
		const isVerticalLayout = layout.audience?.position === "bottom" || layout.audience?.position === "top";
		const stageCount = layout.tiles.length - (layout.audience?.visibleParticipantIds?.length || 0);
		const audienceCount = layout.audience?.participantIds?.length || 0;
		const bounds = getDragBounds(dimensions, isVerticalLayout, config.stageAudienceConfig, {
			stage: stageCount,
			audience: audienceCount
		});
		const minStagePercent = bounds.minStagePercent;
		const maxStagePercent = bounds.maxStagePercent;
		dragStartRef.current = {
			position,
			clientPos,
			options,
			minStagePercent,
			maxStagePercent
		};
		setIsDraggingDivider(true);
	}, [
		layout.audience,
		dimensions,
		config.stageAudienceConfig,
		layout.tiles.length
	]);
	const stopDividerDrag = useCallback(() => {
		dragStartRef.current = null;
		setIsDraggingDivider(false);
		setDividerPosition(null);
		if (rafRef.current) {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		}
		pendingMoveRef.current = null;
	}, []);
	const processDividerMove = useCallback((clientX, clientY, options) => {
		if (!(isDraggingDivider && dragStartRef.current && layout.audience)) return;
		const isVertical = layout.audience.position === "right" || layout.audience.position === "left";
		const containerSize = isVertical ? dimensions.containerWidth : dimensions.containerHeight;
		const padding = dimensions.padding ?? 0;
		const gap = dimensions.gap ?? 0;
		const delta = (isVertical ? clientX : clientY) - dragStartRef.current.clientPos;
		const newPosition = dragStartRef.current.position + delta;
		const minStagePercent = dragStartRef.current.minStagePercent;
		const maxStagePercent = dragStartRef.current.maxStagePercent;
		const usableSize = containerSize - 2 * padding - gap;
		const minStageSize = usableSize * (minStagePercent / 100);
		const maxStageSize = usableSize * (maxStagePercent / 100);
		const minPosition = padding + minStageSize + gap / 2;
		const maxPosition = padding + maxStageSize + gap / 2;
		const clampedPosition = Math.max(minPosition, Math.min(maxPosition, newPosition));
		const rawStageSize = (clampedPosition - padding - gap / 2) / usableSize * 100;
		const isVerticalLayout = layout.audience?.position === "bottom" || layout.audience?.position === "top";
		const stageCount = layout.tiles.length - (layout.audience?.visibleParticipantIds?.length || 0);
		const audienceCount = layout.audience?.participantIds?.length || 0;
		const finalStageSize = clampStageSize(rawStageSize, getDragBounds(dimensions, isVerticalLayout, config.stageAudienceConfig, {
			stage: stageCount,
			audience: audienceCount
		}), "drag-move");
		if (options.onPositionChange) options.onPositionChange(finalStageSize);
		setStageSize(finalStageSize, true);
		setDividerPosition(clampedPosition);
	}, [
		isDraggingDivider,
		layout.audience,
		dimensions,
		setStageSize,
		config.stageAudienceConfig,
		layout.tiles.length
	]);
	const handleDividerMove = useCallback((clientX, clientY, options) => {
		pendingMoveRef.current = {
			clientX,
			clientY
		};
		if (rafRef.current) return;
		rafRef.current = requestAnimationFrame(() => {
			if (pendingMoveRef.current) {
				processDividerMove(pendingMoveRef.current.clientX, pendingMoveRef.current.clientY, options);
				pendingMoveRef.current = null;
			}
			rafRef.current = null;
		});
	}, [processDividerMove]);
	useEffect(() => {
		if (!isDraggingDivider) return;
		const currentOptions = dragStartRef.current?.options;
		if (!currentOptions) return;
		const handleMouseMove = (e) => {
			handleDividerMove(e.clientX, e.clientY, currentOptions);
		};
		const handleTouchMove = (e) => {
			const touch = e.touches[0];
			if (touch) handleDividerMove(touch.clientX, touch.clientY, currentOptions);
		};
		const handleEnd = () => {
			stopDividerDrag();
		};
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleEnd);
		document.addEventListener("touchmove", handleTouchMove, { passive: false });
		document.addEventListener("touchend", handleEnd);
		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleEnd);
			document.removeEventListener("touchmove", handleTouchMove);
			document.removeEventListener("touchend", handleEnd);
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
				rafRef.current = null;
			}
		};
	}, [
		isDraggingDivider,
		handleDividerMove,
		stopDividerDrag
	]);
	return {
		isDraggingDivider,
		dividerPosition,
		handleDividerMove,
		startDividerDrag,
		stopDividerDrag
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
/** Count one full layout pipeline computation (the memo factory body ran). */
function countLayoutComputation() {
	layoutComputations += 1;
}
/** Count one call to `calculateOptimalGrid`. */
function countOptimalGridCall() {
	optimalGridCalls += 1;
}
/** Count one grid candidate evaluated by `evaluateGridConfiguration`. */
function countGridConfigurationEvaluated() {
	gridConfigurationsEvaluated += 1;
}
//#endregion
//#region src/utils/sorting.ts
function sortParticipants(participants, options = {}) {
	const { prioritizeSpeaker = true, prioritizeScreenShare = true, prioritizePinned = true } = options;
	if (options.currentPageInfo && !participants.slice(options.currentPageInfo.maxTilesPerPage).find((p) => p.isPinned || p.isScreenSharing || p.isSpeaking)) return participants;
	return [...participants].sort((a, b) => {
		if (prioritizePinned) {
			if (a.isPinned && !b.isPinned) return -1;
			if (!a.isPinned && b.isPinned) return 1;
		}
		if (prioritizeScreenShare) {
			const aScreenShare = a.isScreenSharing;
			const bScreenShare = b.isScreenSharing;
			if (aScreenShare && !bScreenShare) return -1;
			if (!aScreenShare && bScreenShare) return 1;
		}
		if (prioritizeSpeaker) {
			if (a.isSpeaking && !b.isSpeaking) return -1;
			if (!a.isSpeaking && b.isSpeaking) return 1;
		}
		return 0;
	});
}
//#endregion
//#region src/utils/face-visibility.ts
/**
* Calculate the visible region of a video when displayed with object-fit: cover.
*
* When a video with a different aspect ratio than its container is displayed
* with object-fit: cover, parts of the video are cropped. This function
* calculates which portion of the original video remains visible.
*
* @param videoAspectRatio - The aspect ratio of the source video (width/height)
* @param tileAspectRatio - The aspect ratio of the tile/container (width/height)
* @returns The visible region in normalized 0-1000 coordinates
*/
function calculateVisibleRegion(videoAspectRatio, tileAspectRatio) {
	if (videoAspectRatio > tileAspectRatio) {
		const croppedWidth = 1e3 * (tileAspectRatio / videoAspectRatio);
		return {
			x: (1e3 - croppedWidth) / 2,
			y: 0,
			width: croppedWidth,
			height: 1e3
		};
	} else {
		const croppedHeight = 1e3 * (videoAspectRatio / tileAspectRatio);
		return {
			x: 0,
			y: (1e3 - croppedHeight) / 2,
			width: 1e3,
			height: croppedHeight
		};
	}
}
/**
* Calculate the intersection area of two rectangles.
*/
function calculateIntersectionArea(rect1, rect2) {
	const x1 = Math.max(rect1.x, rect2.x);
	const y1 = Math.max(rect1.y, rect2.y);
	const x2 = Math.min(rect1.x + rect1.width, rect2.x + rect2.width);
	const y2 = Math.min(rect1.y + rect1.height, rect2.y + rect2.height);
	return Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
}
/**
* Calculate what percentage of a face is clipped (not visible) when displayed
* in a tile with object-fit: cover.
*
* @param faceBox - The face bounding box in normalized 0-1000 coordinates
* @param visibleRegion - The visible region of the video after cropping
* @returns Clip percentage (0 = fully visible, 1 = fully clipped)
*/
function calculateFaceClipPercentage(faceBox, visibleRegion) {
	const faceArea = faceBox.width * faceBox.height;
	if (faceArea === 0) return 0;
	const intersectionArea = calculateIntersectionArea(faceBox, visibleRegion);
	return 1 - Math.min(intersectionArea, faceArea) / faceArea;
}
/**
* Evaluate face visibility for all participants in a given tile aspect ratio.
*
* Only evaluates participants with 2+ faces, since face zoom/centering handles
* single face visibility. When multiple faces are present, face zoom disengages
* and we need to ensure the layout doesn't clip faces.
*
* @param participants - Array of participants (only those with 2+ faceBoxes will be evaluated)
* @param tileAspectRatio - The aspect ratio of tiles in the current grid configuration
* @param maxClipThreshold - Maximum allowed clip percentage (0-1)
* @returns Face visibility evaluation result
*/
function evaluateFaceVisibility(participants, tileAspectRatio, maxClipThreshold = FACE_VISIBILITY.DEFAULT_MAX_CLIP_THRESHOLD) {
	const participantDetails = [];
	let maxClipPercentage = 0;
	let isValid = true;
	for (const participant of participants) {
		if (participant.isScreenShare) continue;
		if (!participant.faceBoxes || participant.faceBoxes.length < 2) continue;
		const visibleRegion = calculateVisibleRegion(participant.aspectRatio ?? FACE_VISIBILITY.DEFAULT_VIDEO_ASPECT_RATIO, tileAspectRatio);
		let participantMaxClip = 0;
		for (const faceBox of participant.faceBoxes) {
			const clipPercentage = calculateFaceClipPercentage(faceBox, visibleRegion);
			if (clipPercentage > participantMaxClip) participantMaxClip = clipPercentage;
		}
		const isClipped = participantMaxClip > maxClipThreshold;
		participantDetails.push({
			participantId: participant.id,
			clipPercentage: participantMaxClip,
			isClipped
		});
		if (participantMaxClip > maxClipPercentage) maxClipPercentage = participantMaxClip;
		if (isClipped) isValid = false;
	}
	if (participantDetails.length === 0) return {
		isValid: true,
		maxClipPercentage: 0,
		participantDetails: []
	};
	return {
		isValid,
		maxClipPercentage,
		participantDetails
	};
}
/**
* Check if any participants have 2+ faces that require visibility checking.
* Single faces are handled by face zoom/centering, so we only check when
* there are multiple faces.
*/
function hasAnyFaceData(participants) {
	return !!participants?.some((p) => !p.isScreenShare && p.faceBoxes && p.faceBoxes.length >= 2 && p.faceBoxes.some((box) => box.width > 0));
}
/**
* Get the resolved face visibility configuration with defaults.
*/
function resolveFaceVisibilityConfig(config) {
	return {
		maxClipThreshold: config?.maxClipThreshold ?? FACE_VISIBILITY.DEFAULT_MAX_CLIP_THRESHOLD,
		rejectOnThreshold: config?.rejectOnThreshold ?? true,
		fallbackBehavior: config?.fallbackBehavior ?? FACE_VISIBILITY.DEFAULT_FALLBACK_BEHAVIOR
	};
}
/**
* Check if a layout should be rejected due to face visibility constraints.
*
* This is a convenience function that combines:
* - Checking if participants have face data requiring visibility checks
* - Evaluating face visibility for the given tile aspect ratio
* - Checking if the result exceeds the configured threshold
*
* @param participants - Array of participants to check
* @param tileAspectRatio - The aspect ratio of tiles in the layout
* @param config - Face visibility configuration (optional)
* @returns Check result with rejection status and detailed info
*/
function checkFaceVisibility(participants, tileAspectRatio, config) {
	if (!config || !participants) return { shouldReject: false };
	if (!hasAnyFaceData(participants)) return { shouldReject: false };
	const resolvedConfig = resolveFaceVisibilityConfig(config);
	const result = evaluateFaceVisibility(participants, tileAspectRatio, resolvedConfig.maxClipThreshold);
	const faceVisibility = {
		maxClipPercentage: result.maxClipPercentage,
		isValid: result.isValid
	};
	if (!resolvedConfig.rejectOnThreshold) return {
		shouldReject: false,
		faceVisibility
	};
	if (!result.isValid) return {
		shouldReject: true,
		reason: `Face(s) clipped beyond ${(resolvedConfig.maxClipThreshold * 100).toFixed(0)}% threshold (max: ${(result.maxClipPercentage * 100).toFixed(1)}%)`,
		faceVisibility
	};
	return {
		shouldReject: false,
		faceVisibility
	};
}
//#endregion
//#region src/utils/layout-scoring.ts
/**
* Normalizes scoring weights to ensure they sum to 1.0
* This ensures consistent scoring across different weight configurations.
*/
function normalizeScoringWeights(weights) {
	const defaults = GRID_SCORING.DEFAULT_WEIGHTS;
	const merged = {
		participantCoverage: weights.participantCoverage ?? defaults.participantCoverage,
		tileSize: weights.tileSize ?? defaults.tileSize,
		spaceEfficiency: weights.spaceEfficiency ?? defaults.spaceEfficiency,
		gridBalance: weights.gridBalance ?? defaults.gridBalance,
		tileAspectRatio: weights.tileAspectRatio ?? defaults.tileAspectRatio,
		emptySpotsPenalty: weights.emptySpotsPenalty ?? defaults.emptySpotsPenalty
	};
	const sum = merged.participantCoverage + merged.tileSize + merged.spaceEfficiency + merged.gridBalance + merged.tileAspectRatio + merged.emptySpotsPenalty;
	if (sum === 0) return defaults;
	return {
		participantCoverage: merged.participantCoverage / sum,
		tileSize: merged.tileSize / sum,
		spaceEfficiency: merged.spaceEfficiency / sum,
		gridBalance: merged.gridBalance / sum,
		tileAspectRatio: merged.tileAspectRatio / sum,
		emptySpotsPenalty: merged.emptySpotsPenalty / sum
	};
}
/**
* Unified function to calculate grid scoring components and final score.
* This is the single source of truth for all scoring logic.
*/
function calculateGridScore({ participantCoverage, averageTileArea, spaceUtilization, gridBalance, averageAspectRatio, emptySpotsPenalty, minTileWidth, minTileHeight, containerArea, visibleTiles, scoringWeights, preferredAspectRatio = GRID_SCORING.PREFERRED_ASPECT_RATIO }) {
	const participantCoverageScore = participantCoverage;
	const minAcceptableArea = minTileWidth * minTileHeight;
	const maxReasonableArea = containerArea / visibleTiles;
	const normalizedTileSize = Math.min((averageTileArea - minAcceptableArea) / (maxReasonableArea - minAcceptableArea), 1);
	let spaceEfficiencyScore = 1;
	if (spaceUtilization < GRID_SCORING.MIN_SPACE_UTILIZATION) spaceEfficiencyScore = spaceUtilization / GRID_SCORING.MIN_SPACE_UTILIZATION;
	const gridBalanceScore = gridBalance;
	const tileAspectRatioScore = 1 - Math.abs(averageAspectRatio - preferredAspectRatio) / preferredAspectRatio;
	const emptySpotsPenaltyScore = emptySpotsPenalty;
	const weights = normalizeScoringWeights(scoringWeights ?? {});
	return {
		score: participantCoverageScore * weights.participantCoverage + normalizedTileSize * weights.tileSize + spaceEfficiencyScore * weights.spaceEfficiency + gridBalanceScore * weights.gridBalance + tileAspectRatioScore * weights.tileAspectRatio + emptySpotsPenaltyScore * weights.emptySpotsPenalty,
		scoreBreakdown: {
			participantCoverage: participantCoverageScore,
			tileSize: normalizedTileSize,
			spaceEfficiency: spaceEfficiencyScore,
			gridBalance: gridBalanceScore,
			tileAspectRatio: tileAspectRatioScore,
			emptySpotsPenalty: emptySpotsPenaltyScore
		},
		weights
	};
}
/**
* Calculate the overall score for a complete layout including all tiles
* This evaluates the layout as a whole, treating all tiles uniformly
*/
function calculateLayoutScore({ totalTiles, visibleTiles, containerWidth, containerHeight, tilePositions, minTileWidth = 100, minTileHeight = 100, scoringWeights }) {
	const averageTileWidth = tilePositions.reduce((sum, tile) => sum + tile.width, 0) / tilePositions.length;
	const averageTileHeight = tilePositions.reduce((sum, tile) => sum + tile.height, 0) / tilePositions.length;
	const averageAspectRatio = averageTileWidth / averageTileHeight;
	const tileAreas = tilePositions.map((tile) => tile.width * tile.height);
	const averageTileArea = tileAreas.reduce((sum, area) => sum + area, 0) / tileAreas.length;
	const minTileArea = Math.min(...tileAreas);
	const maxTileArea = Math.max(...tileAreas);
	const totalTilesArea = tileAreas.reduce((sum, area) => sum + area, 0);
	const containerArea = containerWidth * containerHeight;
	const participantCoverage = visibleTiles / totalTiles;
	const spaceUtilization = totalTilesArea / containerArea;
	const tileSizeVariance = tileAreas.reduce((sum, area) => sum + (area - averageTileArea) ** 2, 0) / tileAreas.length;
	const coefficientOfVariation = Math.sqrt(tileSizeVariance) / averageTileArea;
	const gridBalance = Math.max(0, 1 - coefficientOfVariation);
	const emptySpotsPenalty = participantCoverage;
	const isSmallGroup = totalTiles >= 4 && totalTiles <= 7;
	const preferredAspectRatio = isSmallGroup ? GRID_SCORING.SMALL_GROUP_PREFERRED_ASPECT_RATIO : GRID_SCORING.PREFERRED_ASPECT_RATIO;
	const { score, scoreBreakdown, weights } = calculateGridScore({
		participantCoverage,
		averageTileArea,
		spaceUtilization,
		gridBalance,
		averageAspectRatio,
		emptySpotsPenalty,
		minTileWidth,
		minTileHeight,
		containerArea,
		visibleTiles,
		scoringWeights: isSmallGroup ? {
			...scoringWeights,
			spaceEfficiency: (scoringWeights?.spaceEfficiency ?? GRID_SCORING.DEFAULT_WEIGHTS.spaceEfficiency) + GRID_SCORING.SMALL_GROUP_SPACE_EFFICIENCY_BONUS
		} : scoringWeights,
		preferredAspectRatio
	});
	return {
		score,
		scoreBreakdown,
		weights,
		metrics: {
			averageTileWidth,
			averageTileHeight,
			averageTileArea,
			minTileArea,
			maxTileArea,
			totalTilesArea,
			containerArea,
			spaceUtilization
		}
	};
}
//#endregion
//#region src/utils/layout-utils.ts
/**
* Calculates the final content size within a container to fit a target aspect ratio.
* Used by focus and stage-audience layouts.
*/
function fitAspectRatio(containerWidth, containerHeight, targetRatio) {
	if (containerWidth / containerHeight > targetRatio) return {
		contentWidth: containerHeight * targetRatio,
		contentHeight: containerHeight
	};
	return {
		contentWidth: containerWidth,
		contentHeight: containerWidth / targetRatio
	};
}
/**
* Calculate optimal grid dimensions for a given tile count.
* Evaluates all possible configurations and returns the best.
* Returns both the grid result and configuration details for comparison/logging.
*/
function calculateOptimalGrid({ tileCount, containerWidth, containerHeight, gap, options = {} }) {
	countOptimalGridCall();
	const { minTileWidth = MIN_TILE_SIZES.DEFAULT.width, minTileHeight = MIN_TILE_SIZES.DEFAULT.height, minAspectRatio = ASPECT_RATIOS.SIMPLE_GRID.MIN, maxAspectRatio = ASPECT_RATIOS.SIMPLE_GRID.MAX, preferredAspectRatio, scoringWeights } = options;
	if (tileCount === 0 || containerWidth <= 0 || containerHeight <= 0) return null;
	if (tileCount === 1) {
		let tileWidth = containerWidth;
		let tileHeight = containerHeight;
		const containerAspectRatio = tileWidth / tileHeight;
		if (containerAspectRatio < minAspectRatio) tileHeight = tileWidth / minAspectRatio;
		else if (containerAspectRatio > maxAspectRatio) tileWidth = tileHeight * maxAspectRatio;
		if (tileWidth >= minTileWidth && tileHeight >= minTileHeight && tileWidth <= containerWidth && tileHeight <= containerHeight) return {
			grid: {
				rows: 1,
				columns: 1,
				tileWidth,
				tileHeight,
				valid: true
			},
			configDetails: calculateScore({
				tileWidth,
				tileHeight,
				aspectRatio: tileWidth / tileHeight,
				tiles: 1,
				tileCount: 1,
				gridCapacity: 1,
				minTileWidth,
				minTileHeight,
				rows: 1,
				columns: 1,
				scoringWeights,
				containerWidth,
				containerHeight,
				gap,
				minAspectRatio,
				maxAspectRatio,
				preferredAspectRatio
			})
		};
	}
	const { participants, faceVisibilityConfig } = options;
	const bestScoreGrid = calculateBestScoreGrid({
		tileCount,
		containerWidth,
		containerHeight,
		gap,
		constraints: {
			minTileWidth,
			minTileHeight,
			minAspectRatio,
			maxAspectRatio,
			preferredAspectRatio,
			scoringWeights,
			participants,
			faceVisibilityConfig
		}
	});
	if (!bestScoreGrid) return null;
	return bestScoreGrid;
}
/**
* Evaluate a single grid configuration and return its score and grid details
*/
function evaluateGridConfiguration({ rows, cols, tileCount, containerWidth, containerHeight, gap, minTileWidth, minTileHeight, minAspectRatio, maxAspectRatio, preferredAspectRatio, scoringWeights, participants, faceVisibilityConfig }) {
	countGridConfigurationEvaluated();
	const gridCapacity = rows * cols;
	if (gridCapacity < tileCount) return { valid: false };
	const tiles = Math.min(tileCount, gridCapacity);
	if (tiles < cols) return { valid: false };
	if (Math.ceil(tiles / cols) < rows) return { valid: false };
	const effectiveContainerHeight = containerHeight - (gridCapacity < tileCount ? UI_POSITIONING.PAGINATION_BUFFER_VERTICAL : 0);
	let tileWidth = (containerWidth - (cols - 1) * gap) / cols;
	let tileHeight = (effectiveContainerHeight - (rows - 1) * gap) / rows;
	const initialTotalWidth = cols * tileWidth + (cols - 1) * gap;
	const initialTotalHeight = rows * tileHeight + (rows - 1) * gap;
	const tolerance = .1;
	if (initialTotalWidth > containerWidth + tolerance || initialTotalHeight > effectiveContainerHeight + tolerance) return { valid: false };
	if (Math.round(tileWidth) < minTileWidth || Math.round(tileHeight) < minTileHeight) return { valid: false };
	const aspectRatio = tileWidth / tileHeight;
	if (aspectRatio < minAspectRatio || aspectRatio > maxAspectRatio) {
		const maxTileWidthForContainer = (containerWidth - (cols - 1) * gap) / cols;
		const tileHeightFromWidth = maxTileWidthForContainer / minAspectRatio;
		const maxTileHeightForContainer = (effectiveContainerHeight - (rows - 1) * gap) / rows;
		const tileWidthFromHeight = maxTileHeightForContainer * maxAspectRatio;
		const option1TotalHeight = rows * tileHeightFromWidth + (rows - 1) * gap;
		const option2TotalWidth = cols * tileWidthFromHeight + (cols - 1) * gap;
		if (option1TotalHeight <= effectiveContainerHeight) {
			tileWidth = maxTileWidthForContainer;
			tileHeight = tileHeightFromWidth;
		} else if (option2TotalWidth <= containerWidth) {
			tileWidth = tileWidthFromHeight;
			tileHeight = maxTileHeightForContainer;
		} else if (maxTileWidthForContainer * tileHeightFromWidth < tileWidthFromHeight * maxTileHeightForContainer) {
			tileWidth = maxTileWidthForContainer;
			tileHeight = Math.min(tileHeightFromWidth, maxTileHeightForContainer);
		} else {
			tileHeight = maxTileHeightForContainer;
			tileWidth = Math.min(tileWidthFromHeight, maxTileWidthForContainer);
		}
		const totalWidth = cols * tileWidth + (cols - 1) * gap;
		const totalHeight = rows * tileHeight + (rows - 1) * gap;
		if (totalWidth > containerWidth || totalHeight > effectiveContainerHeight) return { valid: false };
		if (Math.round(tileWidth) < minTileWidth || Math.round(tileHeight) < minTileHeight) return { valid: false };
	}
	const finalAspectRatio = tileWidth / tileHeight;
	const finalTileWidth = tileWidth;
	const finalTileHeight = tileHeight;
	const totalGridWidth = cols * finalTileWidth + (cols - 1) * gap;
	const totalGridHeight = rows * finalTileHeight + (rows - 1) * gap;
	if (totalGridWidth > containerWidth || totalGridHeight > effectiveContainerHeight) return { valid: false };
	const configDetails = calculateScore({
		tileWidth,
		tileHeight,
		aspectRatio: finalAspectRatio,
		tiles,
		tileCount,
		gridCapacity,
		minTileWidth,
		minTileHeight,
		rows,
		columns: cols,
		scoringWeights,
		containerWidth,
		containerHeight,
		gap,
		minAspectRatio,
		maxAspectRatio,
		preferredAspectRatio
	});
	const grid = {
		rows,
		columns: cols,
		tileWidth,
		tileHeight,
		valid: true
	};
	const faceCheck = checkFaceVisibility(participants, tileWidth / tileHeight, faceVisibilityConfig);
	if (faceCheck.shouldReject) return {
		valid: false,
		rejectedScore: configDetails.score,
		rejectedGrid: grid,
		rejectedConfigDetails: configDetails,
		faceVisibility: faceCheck.faceVisibility
	};
	if (faceCheck.faceVisibility) return {
		valid: true,
		grid,
		score: configDetails.score,
		configDetails,
		faceVisibility: faceCheck.faceVisibility
	};
	return {
		valid: true,
		grid,
		score: configDetails.score,
		configDetails
	};
}
/**
* Best-score algorithm: Evaluates all possible configurations and returns the best.
*/
function calculateBestScoreGrid({ tileCount, containerWidth, containerHeight, gap, constraints }) {
	const { minTileWidth, minTileHeight, minAspectRatio, maxAspectRatio, preferredAspectRatio, participants, faceVisibilityConfig } = constraints;
	let bestScore = Number.NEGATIVE_INFINITY;
	let bestResult = null;
	let bestRejectedScore = Number.NEGATIVE_INFINITY;
	let bestRejectedResult = null;
	const containerAspectRatio = containerWidth / containerHeight;
	const testedConfigs = /* @__PURE__ */ new Set();
	const configKeyOf = (rows, cols) => rows * 4096 + cols;
	const maxIterations = GRID_SCORING.MAX_ITERATIONS;
	let iterations = 0;
	if (faceVisibilityConfig && tileCount >= 2 && tileCount <= 3) {
		const singleRowResult = evaluateGridConfiguration({
			rows: 1,
			cols: tileCount,
			tileCount,
			containerWidth,
			containerHeight,
			gap,
			minTileWidth,
			minTileHeight,
			minAspectRatio,
			maxAspectRatio,
			preferredAspectRatio,
			scoringWeights: constraints.scoringWeights,
			participants,
			faceVisibilityConfig
		});
		if (singleRowResult.valid) return {
			grid: singleRowResult.grid,
			configDetails: singleRowResult.configDetails
		};
		if (singleRowResult.rejectedScore !== void 0 && singleRowResult.rejectedGrid && singleRowResult.rejectedConfigDetails) {
			bestRejectedScore = singleRowResult.rejectedScore;
			bestRejectedResult = {
				grid: singleRowResult.rejectedGrid,
				configDetails: singleRowResult.rejectedConfigDetails
			};
		}
		testedConfigs.add(configKeyOf(1, tileCount));
	}
	const sqrtTiles = Math.sqrt(tileCount);
	const baseRows = Math.ceil(sqrtTiles);
	const baseCols = Math.ceil(tileCount / baseRows);
	const evalParams = {
		tileCount,
		containerWidth,
		containerHeight,
		gap,
		minTileWidth,
		minTileHeight,
		minAspectRatio,
		maxAspectRatio,
		preferredAspectRatio,
		scoringWeights: constraints.scoringWeights,
		participants,
		faceVisibilityConfig
	};
	const tryConfig = (rows, cols) => {
		const configKey = configKeyOf(rows, cols);
		if (testedConfigs.has(configKey) || rows * cols < tileCount) return;
		iterations += 1;
		const result = evaluateGridConfiguration({
			rows,
			cols,
			...evalParams
		});
		if (result.valid) {
			testedConfigs.add(configKey);
			if (result.score > bestScore) {
				bestScore = result.score;
				bestResult = {
					grid: result.grid,
					configDetails: result.configDetails
				};
			}
		} else if (result.rejectedScore !== void 0 && result.rejectedGrid && result.rejectedConfigDetails && result.rejectedScore > bestRejectedScore) {
			bestRejectedScore = result.rejectedScore;
			bestRejectedResult = {
				grid: result.rejectedGrid,
				configDetails: result.rejectedConfigDetails
			};
		}
	};
	const isExcellent = () => bestScore >= GRID_SCORING.EXCELLENT_SCORE_THRESHOLD;
	for (let testRows = Math.max(1, baseRows - 3); testRows <= baseRows + 3 && iterations < maxIterations; testRows += 1) if (tileCount % testRows === 0) {
		tryConfig(testRows, tileCount / testRows);
		if (isExcellent()) return bestResult;
	}
	for (let rowDelta = -4; rowDelta <= 4 && iterations < maxIterations; rowDelta += 1) for (let colDelta = -4; colDelta <= 4 && iterations < maxIterations; colDelta += 1) {
		tryConfig(Math.max(1, baseRows + rowDelta), Math.max(1, baseCols + colDelta));
		if (isExcellent()) return bestResult;
	}
	const containerRatioRows = Math.round(sqrtTiles / Math.sqrt(containerAspectRatio));
	const containerRatioCols = Math.round(sqrtTiles * Math.sqrt(containerAspectRatio));
	for (let delta = -3; delta <= 3 && iterations < maxIterations; delta += 1) {
		tryConfig(Math.max(1, containerRatioRows + delta), Math.max(1, containerRatioCols + delta));
		if (isExcellent()) return bestResult;
	}
	if (tileCount <= 4) {
		const commonConfigs = [
			[1, tileCount],
			[tileCount, 1],
			[2, Math.ceil(tileCount / 2)],
			[Math.ceil(tileCount / 2), 2]
		];
		for (const [rows, cols] of commonConfigs) {
			tryConfig(rows, cols);
			if (isExcellent()) return bestResult;
		}
	}
	const { EXHAUSTIVE } = GRID_SCORING;
	const maxDimension = Math.min(tileCount * EXHAUSTIVE.MAX_DIMENSION_MULTIPLIER, EXHAUSTIVE.MAX_DIMENSION_CAP);
	const secondaryAxis = Math.min(Math.ceil(tileCount * EXHAUSTIVE.ROWS_COLS_SCALE), EXHAUSTIVE.ROWS_COLS_CAP);
	const maxRows = containerAspectRatio < 1 ? maxDimension : secondaryAxis;
	const maxCols = containerAspectRatio > 1 ? maxDimension : secondaryAxis;
	for (let rows = 1; rows <= maxRows && iterations < maxIterations; rows += 1) for (let cols = 1; cols <= maxCols && iterations < maxIterations; cols += 1) {
		const ar = cols / rows;
		if (ar > EXHAUSTIVE.MAX_GRID_ASPECT_RATIO || ar < EXHAUSTIVE.MIN_GRID_ASPECT_RATIO) continue;
		tryConfig(rows, cols);
	}
	if (bestResult) return bestResult;
	if (bestRejectedResult) {
		const rejectedResult = bestRejectedResult;
		const resolvedFaceConfig = resolveFaceVisibilityConfig(faceVisibilityConfig);
		if (resolvedFaceConfig.fallbackBehavior === "relax-threshold") for (const relaxedThreshold of FACE_VISIBILITY.RELAXED_THRESHOLDS) {
			const relaxedGridResult = calculateBestScoreGrid({
				tileCount,
				containerWidth,
				containerHeight,
				gap,
				constraints: {
					...constraints,
					faceVisibilityConfig: {
						...faceVisibilityConfig,
						maxClipThreshold: relaxedThreshold
					}
				}
			});
			if (relaxedGridResult) {
				console.warn(`[GridCalc] No valid config at ${(resolvedFaceConfig.maxClipThreshold * 100).toFixed(0)}% threshold, using relaxed threshold ${(relaxedThreshold * 100).toFixed(0)}%`);
				return relaxedGridResult;
			}
		}
		console.warn(`[GridCalc] No valid face visibility config found, using best rejected config (${rejectedResult.configDetails.rows}x${rejectedResult.configDetails.cols})`);
		return rejectedResult;
	}
	return null;
}
/**
* Calculate score for grid configuration using unified scoring system
*/
function calculateScore({ tileWidth, tileHeight, aspectRatio, tiles, tileCount, gridCapacity, minTileWidth, minTileHeight, rows, columns, scoringWeights, containerWidth, containerHeight, gap, minAspectRatio, maxAspectRatio, preferredAspectRatio }) {
	const participantCoverage = tiles / tileCount;
	const averageTileArea = tileWidth * tileHeight;
	const tileArea = tileWidth * tileHeight;
	let spaceUtilization = 1;
	if (containerWidth && containerHeight) spaceUtilization = tiles * tileArea / (containerWidth * containerHeight);
	const gridBalance = 1 - Math.abs(rows - columns) / Math.max(rows, columns);
	const averageAspectRatio = aspectRatio;
	const emptySpotsPenalty = 1 - ((gridCapacity - tiles) / gridCapacity) ** (1 / GRID_SCORING.EMPTY_SPOTS_PENALTY_POWER);
	const isSmallGroup = tileCount >= 4 && tileCount <= 7;
	const resolvedPreferredAspectRatio = preferredAspectRatio ?? (isSmallGroup ? GRID_SCORING.SMALL_GROUP_PREFERRED_ASPECT_RATIO : GRID_SCORING.PREFERRED_ASPECT_RATIO);
	const adjustedScoringWeights = isSmallGroup ? {
		...scoringWeights,
		spaceEfficiency: (scoringWeights?.spaceEfficiency ?? GRID_SCORING.DEFAULT_WEIGHTS.spaceEfficiency) + GRID_SCORING.SMALL_GROUP_SPACE_EFFICIENCY_BONUS
	} : scoringWeights;
	const { score, scoreBreakdown, weights } = calculateGridScore({
		participantCoverage,
		averageTileArea,
		spaceUtilization,
		gridBalance,
		averageAspectRatio,
		emptySpotsPenalty,
		minTileWidth,
		minTileHeight,
		containerArea: containerWidth && containerHeight ? containerWidth * containerHeight : 0,
		visibleTiles: tiles,
		scoringWeights: adjustedScoringWeights,
		preferredAspectRatio: resolvedPreferredAspectRatio
	});
	return {
		rows,
		cols: columns,
		score,
		scoreBreakdown,
		weights,
		tileWidth,
		tileHeight,
		containerWidth: containerWidth ?? 0,
		containerHeight: containerHeight ?? 0,
		minTileWidth,
		minTileHeight,
		minAspectRatio,
		maxAspectRatio,
		gap: gap ?? 0
	};
}
/**
* Calculate optimal grid with reduced tile count.
* Tries progressively fewer tiles until a valid grid is found.
*/
function calculateOptimalGridWithReducedCount({ maxTileCount, containerWidth, containerHeight, gap, options = {} }) {
	for (let tryCount = maxTileCount; tryCount >= 1; tryCount -= 1) {
		const result = calculateOptimalGrid({
			tileCount: tryCount,
			containerWidth,
			containerHeight,
			gap,
			options
		});
		if (result?.grid.valid) return {
			grid: result.grid,
			actualTileCount: tryCount
		};
	}
	return null;
}
/**
* Position tiles within a grid layout.
* Handles centering of the last row if it's not full.
*/
function positionTilesInGrid(participants, area, grid, options) {
	const { rows, columns: cols, tileWidth, tileHeight } = grid;
	const { gap, padding = 0, centerLastRow = true, centerHorizontally = true, centerVertically = true, align, lastRowPolicy = "center" } = options;
	const totalGridWidth = cols * tileWidth + (cols - 1) * gap;
	const totalGridHeight = rows * tileHeight + (rows - 1) * gap;
	const availableWidth = area.width - 2 * padding;
	const availableHeight = area.height - 2 * padding;
	let gridXOffset = 0;
	let gridYOffset = 0;
	if (totalGridWidth < availableWidth) {
		if (align === "end") gridXOffset = availableWidth - totalGridWidth;
		else if (align === "center" || align === void 0 && centerHorizontally) gridXOffset = (availableWidth - totalGridWidth) / 2;
	}
	if (centerVertically && totalGridHeight < availableHeight) gridYOffset = (availableHeight - totalGridHeight) / 2;
	const tilesInLastRow = participants.length % cols || cols;
	return participants.map((participant, index) => {
		const row = Math.floor(index / cols);
		const col = index % cols;
		const isIncompleteLastRow = row === rows - 1 && tilesInLastRow < cols;
		if (lastRowPolicy === "mosaic" && isIncompleteLastRow) {
			const mosaicTileWidth = (totalGridWidth - (tilesInLastRow - 1) * gap) / tilesInLastRow;
			return {
				participantId: participant.id,
				row: row + 1,
				column: col + 1,
				width: mosaicTileWidth,
				height: tileHeight,
				x: area.x + padding + gridXOffset + col * (mosaicTileWidth + gap),
				y: area.y + padding + gridYOffset + row * (tileHeight + gap)
			};
		}
		let lastRowXOffset = 0;
		if (centerLastRow && isIncompleteLastRow) {
			const totalWidthOfLastRow = tilesInLastRow * tileWidth + (tilesInLastRow - 1) * gap;
			lastRowXOffset = (totalGridWidth - totalWidthOfLastRow) / 2;
		}
		return {
			participantId: participant.id,
			row: row + 1,
			column: col + 1,
			width: tileWidth,
			height: tileHeight,
			x: area.x + padding + gridXOffset + lastRowXOffset + col * (tileWidth + gap),
			y: area.y + padding + gridYOffset + row * (tileHeight + gap)
		};
	});
}
/**
* Calculate the maximum number of tiles that can fit in a grid.
* Useful for determining pagination limits.
*/
function calculateGridCapacity({ width, height, gap, minTileSize, minAspectRatio, maxAspectRatio }) {
	const maxCols = Math.floor((width + gap) / (minTileSize.width + gap));
	const maxRows = Math.floor((height + gap) / (minTileSize.height + gap));
	const theoreticalMax = maxCols * maxRows;
	if (minAspectRatio === void 0 || maxAspectRatio === void 0) return theoreticalMax;
	let maxValidTiles = 0;
	for (let rows = 1; rows <= maxRows; rows += 1) for (let cols = 1; cols <= maxCols; cols += 1) {
		const totalTiles = rows * cols;
		if (totalTiles > theoreticalMax) continue;
		const tileWidth = (width - (cols - 1) * gap) / cols;
		const tileHeight = (height - (rows - 1) * gap) / rows;
		if (tileWidth < minTileSize.width || tileHeight < minTileSize.height) continue;
		const aspectRatio = tileWidth / tileHeight;
		if (aspectRatio >= minAspectRatio && aspectRatio <= maxAspectRatio) maxValidTiles = Math.max(maxValidTiles, totalTiles);
	}
	return Math.max(1, maxValidTiles);
}
//#endregion
//#region src/utils/stage-audience-helpers.ts
/**
* Determines which participants should be on the stage
*/
function getStageParticipants(participants) {
	const stageParticipants = participants.filter((p) => p.isScreenShare || p.isOnStage);
	if (stageParticipants.length > 0) return {
		stage: stageParticipants,
		audience: participants.filter((p) => !(p.isScreenShare || p.isOnStage))
	};
	return {
		stage: [],
		audience: participants
	};
}
/**
* Determines the optimal orientation based on container dimensions and participant counts
*/
function determineOrientation({ containerWidth, containerHeight, stageCount, audienceCount: _audienceCount, forceOrientation }) {
	if (forceOrientation) return forceOrientation;
	const aspectRatio = containerWidth / containerHeight;
	if (aspectRatio > 2.5) return "horizontal";
	if (aspectRatio < .8) return "vertical";
	if (stageCount > 0 && containerWidth > 1e3) return "horizontal";
	return "vertical";
}
/**
* Calculate optimal stage size percentage based on participant configuration and container dimensions
*/
function calculateOptimalStageSize({ stageParticipantCount, audienceParticipantCount, containerWidth, containerHeight, hasScreenShare = false, minStagePercent = SIZE_RATIOS.STAGE.MIN * 100, maxStagePercent = SIZE_RATIOS.STAGE.MAX * 100, stageParticipants }) {
	if (audienceParticipantCount === 0) return 100;
	if (stageParticipantCount === 0) return Math.max(10, minStagePercent);
	const containerAspectRatio = containerWidth / containerHeight;
	const stageRatio = stageParticipantCount / (stageParticipantCount + audienceParticipantCount);
	let optimalPercentage;
	if (hasScreenShare && stageParticipants) {
		const screenShareParticipant = stageParticipants.find((p) => p.isScreenShare && p.aspectRatio);
		if (screenShareParticipant?.aspectRatio) {
			const targetAspectRatio = screenShareParticipant.aspectRatio;
			if (containerAspectRatio > 1.2) {
				const padding = 16;
				const gap = 8;
				const effectiveHeight = containerHeight - 2 * padding;
				let tileWidth;
				let tileHeight;
				if (targetAspectRatio < 1) {
					tileHeight = effectiveHeight;
					tileWidth = tileHeight * targetAspectRatio;
				} else {
					tileHeight = effectiveHeight;
					tileWidth = tileHeight * targetAspectRatio;
					const maxReasonableStageWidth = containerWidth * maxStagePercent / 100 - gap;
					if (tileWidth > maxReasonableStageWidth) {
						tileWidth = maxReasonableStageWidth;
						tileHeight = tileWidth / targetAspectRatio;
					}
				}
				optimalPercentage = (tileWidth + gap * 2) / containerWidth * 100;
				if (targetAspectRatio < 1 && audienceParticipantCount > 0) optimalPercentage = Math.max(optimalPercentage, 40);
			} else {
				const padding = 16;
				const gap = 8;
				const effectiveWidth = containerWidth - 2 * padding;
				let tileWidth;
				let tileHeight;
				if (targetAspectRatio > 1) {
					tileWidth = effectiveWidth;
					tileHeight = tileWidth / targetAspectRatio;
				} else {
					tileWidth = effectiveWidth;
					tileHeight = tileWidth / targetAspectRatio;
					const maxReasonableStageHeight = containerHeight * maxStagePercent / 100 - gap;
					if (tileHeight > maxReasonableStageHeight) {
						tileHeight = maxReasonableStageHeight;
						tileWidth = tileHeight * targetAspectRatio;
					}
				}
				optimalPercentage = (tileHeight + gap * 2) / containerHeight * 100;
				if (targetAspectRatio > 1 && audienceParticipantCount > 0) optimalPercentage = Math.max(optimalPercentage, 40);
			}
			if (audienceParticipantCount > 0 && optimalPercentage > maxStagePercent) optimalPercentage = maxStagePercent;
		} else optimalPercentage = calculateDefaultOptimalPercentage({
			stageParticipantCount,
			audienceParticipantCount,
			containerAspectRatio,
			stageRatio,
			hasScreenShare
		});
	} else optimalPercentage = calculateDefaultOptimalPercentage({
		stageParticipantCount,
		audienceParticipantCount,
		containerAspectRatio,
		stageRatio,
		hasScreenShare
	});
	return Math.max(minStagePercent, Math.min(maxStagePercent, Math.round(optimalPercentage)));
}
function calculateDefaultOptimalPercentage({ stageParticipantCount, audienceParticipantCount, containerAspectRatio, stageRatio, hasScreenShare }) {
	let optimalPercentage;
	if (stageParticipantCount === 1) if (audienceParticipantCount <= 4) optimalPercentage = 75;
	else if (audienceParticipantCount <= 8) optimalPercentage = 70;
	else optimalPercentage = SIZE_RATIOS.STAGE.MIN_MULTIPLE_PARTICIPANTS * 100;
	else if (stageParticipantCount <= 3) if (stageParticipantCount === 3 && audienceParticipantCount >= 6) optimalPercentage = SIZE_RATIOS.STAGE.MAX * 100;
	else optimalPercentage = Math.max(70, stageRatio * 100 * 1.5);
	else optimalPercentage = Math.max(75, stageRatio * 100 * 1.2);
	if (containerAspectRatio > 2.5) if (stageParticipantCount === 1 && audienceParticipantCount >= 8) optimalPercentage = Math.min(40, optimalPercentage);
	else optimalPercentage *= .9;
	else if (containerAspectRatio < .8) optimalPercentage = Math.max(SIZE_RATIOS.STAGE.MIN_SINGLE_PARTICIPANT * 100, optimalPercentage);
	if (hasScreenShare) optimalPercentage = Math.max(SIZE_RATIOS.STAGE.MIN_MULTIPLE_PARTICIPANTS * 100, optimalPercentage * 1.1);
	return optimalPercentage;
}
//#endregion
//#region src/layouts/stage-audience.ts
function resolveScreenShareContentInsets(screenShareContentInsets) {
	return {
		top: screenShareContentInsets?.top ?? 0,
		right: screenShareContentInsets?.right ?? 0,
		bottom: screenShareContentInsets?.bottom ?? 0,
		left: screenShareContentInsets?.left ?? 0
	};
}
function calculateFittedScreenShareArea({ area, aspectRatio, screenShareContentInsets }) {
	const contentInsets = resolveScreenShareContentInsets(screenShareContentInsets);
	const availableWidth = Math.max(0, area.width - contentInsets.left - contentInsets.right);
	const availableHeight = Math.max(0, area.height - contentInsets.top - contentInsets.bottom);
	if (availableWidth === 0 || availableHeight === 0 || aspectRatio <= 0) return 0;
	const areaAspectRatio = availableWidth / availableHeight;
	return (areaAspectRatio > aspectRatio ? availableHeight * aspectRatio : availableWidth) * (areaAspectRatio > aspectRatio ? availableHeight : availableWidth / aspectRatio);
}
function determineScreenShareOrientation({ width, height, stageSize, gap, stageParticipants, audienceParticipantCount, config }) {
	const screenShare = stageParticipants.length === 1 && stageParticipants[0]?.isScreenShare ? stageParticipants[0] : void 0;
	if (!screenShare?.aspectRatio || audienceParticipantCount === 0) return;
	const horizontalAreas = calculateAreas({
		width,
		height,
		orientation: "horizontal",
		stagePercent: stageSize,
		gap,
		stageParticipantCount: stageParticipants.length,
		audienceParticipantCount,
		config
	});
	const verticalAreas = calculateAreas({
		width,
		height,
		orientation: "vertical",
		stagePercent: stageSize,
		gap,
		stageParticipantCount: stageParticipants.length,
		audienceParticipantCount,
		config
	});
	const horizontalArea = calculateFittedScreenShareArea({
		area: horizontalAreas.stage,
		aspectRatio: screenShare.aspectRatio,
		screenShareContentInsets: config.screenShareContentInsets
	});
	const verticalArea = calculateFittedScreenShareArea({
		area: verticalAreas.stage,
		aspectRatio: screenShare.aspectRatio,
		screenShareContentInsets: config.screenShareContentInsets
	});
	const preferredOrientation = verticalArea > horizontalArea ? "vertical" : "horizontal";
	const { currentOrientation } = config;
	if (currentOrientation !== "horizontal" && currentOrientation !== "vertical") return verticalArea === horizontalArea ? void 0 : preferredOrientation;
	if (preferredOrientation !== currentOrientation && (preferredOrientation === "vertical" ? verticalArea : horizontalArea) > (currentOrientation === "vertical" ? verticalArea : horizontalArea) * STAGE_AUDIENCE.ORIENTATION_SWITCH_RATIO) return preferredOrientation;
	return currentOrientation;
}
function simpleStageAudienceLayout(participants, dimensions, config = { maxAudiencePerPage: PAGINATION.DEFAULT_MAX_AUDIENCE_PARTICIPANTS }) {
	const { stageSize: configStageSize, maxAudiencePerPage, currentPage = 0, orientation = "auto" } = config;
	const { containerWidth, containerHeight, gap = SPACING.DEFAULT_GAP, padding = SPACING.DEFAULT_PADDING } = dimensions;
	const effectiveWidth = containerWidth - 2 * padding;
	const effectiveHeight = containerHeight - 2 * padding;
	const { stage: allStageParticipants, audience: allAudienceParticipants } = getStageParticipants(participants);
	const stageSize = configStageSize ?? (allAudienceParticipants.length === 0 ? 100 : SIZE_RATIOS.STAGE.DEFAULT * 100);
	if (allStageParticipants.length === 0) return createAudienceOnlyLayout({
		participants: allAudienceParticipants,
		dimensions,
		maxPerPage: maxAudiencePerPage,
		currentPage,
		scoringWeights: config.scoringWeights
	});
	const layoutOrientation = orientation === "auto" ? determineScreenShareOrientation({
		width: effectiveWidth,
		height: effectiveHeight,
		stageSize,
		gap,
		stageParticipants: allStageParticipants,
		audienceParticipantCount: allAudienceParticipants.length,
		config
	}) ?? determineOrientation({
		containerWidth: effectiveWidth,
		containerHeight: effectiveHeight,
		stageCount: allStageParticipants.length,
		audienceCount: allAudienceParticipants.length
	}) : orientation;
	const attemptLayoutWithOrientation = ({ orientation, audienceParticipants = allAudienceParticipants, paginationPosition = "bottom", heightAdjustment = 0, stageParticipants = allStageParticipants }) => {
		const areasForOrientation = calculateAreas({
			width: effectiveWidth,
			height: effectiveHeight,
			orientation,
			stagePercent: stageSize,
			gap,
			stageParticipantCount: stageParticipants.length,
			audienceParticipantCount: audienceParticipants.length,
			config
		});
		const { tiles: stageTiles, overflowParticipants, rows: stageRows, columns: stageCols } = layoutStageWithOverflow({
			participants: stageParticipants,
			area: {
				width: areasForOrientation.stage.width,
				height: areasForOrientation.stage.height + heightAdjustment,
				x: areasForOrientation.stage.x + padding,
				y: areasForOrientation.stage.y + padding
			},
			gap,
			scoringWeights: config.scoringWeights,
			minAspectRatio: audienceParticipants.length === 0 ? 1 : config.minAspectRatio,
			maxAspectRatio: config.maxAspectRatio,
			fitScreenshareAspectRatio: config.fitScreenshareAspectRatio,
			screenShareContentInsets: config.screenShareContentInsets
		});
		const movedToAudience = stageParticipants.filter((p) => {
			return overflowParticipants.includes(p.id) && !p.isScreenShare;
		});
		const finalAudienceParticipants = [...audienceParticipants, ...movedToAudience];
		const audienceResult = layoutAudience({
			participants: finalAudienceParticipants,
			area: {
				width: areasForOrientation.audience.width,
				height: areasForOrientation.audience.height + heightAdjustment,
				x: areasForOrientation.audience.x + padding,
				y: areasForOrientation.audience.y + padding
			},
			gap,
			maxPerPage: maxAudiencePerPage,
			currentPage,
			orientation,
			stageRows,
			stageCols,
			scoringWeights: config.scoringWeights,
			minAspectRatio: config.minAspectRatio,
			maxAspectRatio: config.maxAspectRatio,
			paginationPosition
		});
		const allTiles = [...stageTiles, ...audienceResult.tiles];
		const totalRows = Math.max(...allTiles.map((t) => t.row), 1);
		const totalColumns = Math.max(...allTiles.map((t) => t.column), 1);
		const audienceWidthAdjustment = paginationPosition === "right" ? UI_POSITIONING.PAGINATION_BUFFER_HORIZONTAL + (audienceResult.pagination?.totalPages || 0) * 10 : 0;
		const audienceInfo = finalAudienceParticipants.length > 0 && audienceResult.tiles.length > 0 ? { audience: {
			participantIds: finalAudienceParticipants.map((p) => p.id),
			visibleParticipantIds: audienceResult.tiles.map((t) => t.participantId),
			position: orientation === "vertical" ? "bottom" : "right",
			x: areasForOrientation.audience.x,
			y: areasForOrientation.audience.y,
			width: areasForOrientation.audience.width - audienceWidthAdjustment,
			height: areasForOrientation.audience.height
		} } : {};
		return {
			id: `stage-audience-${orientation}`,
			rows: totalRows,
			columns: totalColumns,
			tiles: allTiles,
			...audienceResult.pagination && { pagination: audienceResult.pagination },
			...audienceInfo
		};
	};
	let result = attemptLayoutWithOrientation({ orientation: layoutOrientation });
	if (allAudienceParticipants.length > 0 && !result.audience) {
		const alternativeResult = attemptLayoutWithOrientation({ orientation: layoutOrientation === "horizontal" ? "vertical" : "horizontal" });
		if (alternativeResult.audience) result = alternativeResult;
		else {
			const sidePaginationResult = attemptLayoutWithOrientation({
				orientation: "horizontal",
				paginationPosition: "right",
				heightAdjustment: UI_POSITIONING.PAGINATION_BUFFER_VERTICAL
			});
			if (sidePaginationResult.audience) result = sidePaginationResult;
			else {
				const stageOnlyLayout = layoutStageWithOverflow({
					participants: allStageParticipants,
					area: {
						width: containerWidth,
						height: effectiveHeight - (allStageParticipants.length > 1 ? UI_POSITIONING.PAGINATION_BUFFER_VERTICAL : 0),
						x: 0 + padding,
						y: 0 + padding
					},
					gap,
					scoringWeights: config.scoringWeights,
					minAspectRatio: config.minAspectRatio,
					maxAspectRatio: config.maxAspectRatio,
					fitScreenshareAspectRatio: config.fitScreenshareAspectRatio,
					screenShareContentInsets: config.screenShareContentInsets
				});
				result = {
					id: `stage-audience-${layoutOrientation}`,
					rows: stageOnlyLayout.rows,
					columns: stageOnlyLayout.columns,
					tiles: stageOnlyLayout.tiles
				};
			}
		}
	}
	return result;
}
function calculateAreas({ width, height, orientation, stagePercent, gap, stageParticipantCount, audienceParticipantCount, config }) {
	const stageSizeRatio = clampStageSize(stagePercent, calculateStageBounds({
		dimensions: {
			containerWidth: width,
			containerHeight: height,
			gap
		},
		isVertical: orientation === "vertical",
		config: config || {},
		context: "stage-audience-layout",
		participantCounts: {
			stage: stageParticipantCount,
			audience: audienceParticipantCount
		}
	}), "stage-audience-layout") / 100;
	if (orientation === "horizontal") {
		const hasAudience = audienceParticipantCount > 0;
		const availableWidth = hasAudience ? width - gap : width;
		const stageWidth = hasAudience ? availableWidth * stageSizeRatio : availableWidth;
		const audienceWidth = hasAudience ? availableWidth - stageWidth : 0;
		return {
			stage: {
				width: stageWidth,
				height,
				x: 0,
				y: 0
			},
			audience: {
				width: audienceWidth,
				height,
				x: stageWidth + gap,
				y: 0
			}
		};
	}
	const hasAudience = audienceParticipantCount > 0;
	const availableHeight = hasAudience ? height - gap : height;
	const stageHeight = hasAudience ? availableHeight * stageSizeRatio : availableHeight;
	const audienceHeight = hasAudience ? availableHeight - stageHeight : 0;
	return {
		stage: {
			width,
			height: stageHeight,
			x: 0,
			y: 0
		},
		audience: {
			width,
			height: audienceHeight,
			x: 0,
			y: stageHeight + gap
		}
	};
}
function calculateGridDimensions(participantCount, area, gap, minTileSize) {
	const minCols = Math.ceil(Math.sqrt(participantCount));
	const minRows = Math.ceil(participantCount / minCols);
	const tileWidth = Math.floor((area.width - (minCols - 1) * gap) / minCols);
	const tileHeight = Math.floor((area.height - (minRows - 1) * gap) / minRows);
	if (minTileSize && (tileWidth < minTileSize.width || tileHeight < minTileSize.height)) return {
		rows: 1,
		cols: 1,
		tileWidth: Math.min(area.width, minTileSize.width),
		tileHeight: Math.min(area.height, minTileSize.height)
	};
	return {
		rows: minRows,
		cols: minCols,
		tileWidth,
		tileHeight
	};
}
function validateGridFitsArea(grid, area, gap, tolerance = .1) {
	if (!grid?.valid) return false;
	const totalWidth = grid.columns * grid.tileWidth + (grid.columns - 1) * gap;
	const totalHeight = grid.rows * grid.tileHeight + (grid.rows - 1) * gap;
	return totalWidth <= area.width + tolerance && totalHeight <= area.height + tolerance;
}
/**
* Attempts to find a grid layout with reduced participant count as fallback.
* If enforceMinSize is true and even a single tile doesn't fit, returns null.
* Otherwise, always returns at least a 1x1 grid respecting aspect ratios.
*/
function calculateGridWithFallback({ maxTileCount, area, gap, minTileSize, aspectRatios, preferredAspectRatio, scoringWeights, enforceMinSize = true }) {
	const fallbackGrid = calculateOptimalGridWithReducedCount({
		maxTileCount,
		containerWidth: area.width,
		containerHeight: area.height,
		gap,
		options: {
			minTileWidth: minTileSize.width,
			minTileHeight: minTileSize.height,
			minAspectRatio: aspectRatios.min,
			maxAspectRatio: aspectRatios.max,
			preferredAspectRatio,
			scoringWeights
		}
	});
	if (fallbackGrid) return {
		rows: fallbackGrid.grid.rows,
		cols: fallbackGrid.grid.columns,
		tileWidth: fallbackGrid.grid.tileWidth,
		tileHeight: fallbackGrid.grid.tileHeight
	};
	if (enforceMinSize) {
		const simpleGrid = calculateGridDimensions(1, area, gap, minTileSize);
		if (simpleGrid.tileWidth < minTileSize.width || simpleGrid.tileHeight < minTileSize.height) return null;
		return simpleGrid;
	}
	const tileWidth = Math.min(area.width, area.height * aspectRatios.max);
	return {
		rows: 1,
		cols: 1,
		tileWidth,
		tileHeight: tileWidth / aspectRatios.max
	};
}
function layoutSingleParticipant({ participant, area, aspectRatioConstraints, minTileSize, defaultScreenShareAspectRatio = DEFAULT_SCREEN_SHARE_ASPECT_RATIO, screenShareContentInsets }) {
	const isScreenShare = participant.isScreenShare;
	const contentInsets = isScreenShare ? resolveScreenShareContentInsets(screenShareContentInsets) : {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	};
	const availableContentWidth = Math.max(0, area.width - contentInsets.left - contentInsets.right);
	const availableContentHeight = Math.max(0, area.height - contentInsets.top - contentInsets.bottom);
	const areaAspectRatio = availableContentHeight > 0 ? availableContentWidth / availableContentHeight : area.width / area.height;
	const targetAspectRatio = participant.aspectRatio || (isScreenShare ? defaultScreenShareAspectRatio : areaAspectRatio);
	const minRatio = aspectRatioConstraints.minAspectRatio;
	const maxRatio = aspectRatioConstraints.maxAspectRatio;
	const effectiveAspectRatio = Math.max(minRatio, Math.min(maxRatio, targetAspectRatio));
	const minContentWidth = Math.max(0, minTileSize.width - contentInsets.left - contentInsets.right);
	const minContentHeight = Math.max(0, minTileSize.height - contentInsets.top - contentInsets.bottom);
	let contentWidth;
	let contentHeight;
	let tileWidth;
	let tileHeight;
	let x;
	let y;
	if (areaAspectRatio >= minRatio && areaAspectRatio <= maxRatio) {
		contentWidth = availableContentWidth;
		contentHeight = availableContentHeight;
		tileWidth = contentWidth + contentInsets.left + contentInsets.right;
		tileHeight = contentHeight + contentInsets.top + contentInsets.bottom;
		x = area.x;
		y = area.y;
	} else {
		if (areaAspectRatio > effectiveAspectRatio) {
			contentHeight = availableContentHeight;
			contentWidth = contentHeight * effectiveAspectRatio;
		} else {
			contentWidth = availableContentWidth;
			contentHeight = contentWidth / effectiveAspectRatio;
		}
		contentWidth = Math.max(contentWidth, minContentWidth);
		contentHeight = contentWidth / effectiveAspectRatio;
		if (contentHeight < minContentHeight) {
			contentHeight = minContentHeight;
			contentWidth = contentHeight * effectiveAspectRatio;
		}
		if (contentWidth > availableContentWidth) {
			contentWidth = availableContentWidth;
			contentHeight = contentWidth / effectiveAspectRatio;
		}
		if (contentHeight > availableContentHeight) {
			contentHeight = availableContentHeight;
			contentWidth = contentHeight * effectiveAspectRatio;
		}
		tileWidth = contentWidth + contentInsets.left + contentInsets.right;
		tileHeight = contentHeight + contentInsets.top + contentInsets.bottom;
		const xOffset = (area.width - tileWidth) / 2;
		const yOffset = (area.height - tileHeight) / 2;
		x = area.x + xOffset;
		y = area.y + yOffset;
	}
	return {
		tiles: [{
			participantId: participant.id,
			row: 1,
			column: 1,
			width: tileWidth,
			height: tileHeight,
			x,
			y
		}],
		overflowParticipants: [],
		rows: 1,
		columns: 1
	};
}
function layoutStageWithOverflow({ participants, area, gap, scoringWeights, minAspectRatio, maxAspectRatio, fitScreenshareAspectRatio = true, screenShareContentInsets }) {
	if (participants.length === 0) return {
		tiles: [],
		overflowParticipants: [],
		rows: 0,
		columns: 0
	};
	const screenShareParticipants = participants.filter((p) => p.isScreenShare);
	const hasScreenShare = screenShareParticipants.length > 0;
	let aspectRatioConstraints;
	if (hasScreenShare && fitScreenshareAspectRatio) {
		const screenShareAspectRatio = screenShareParticipants.find((p) => p.aspectRatio)?.aspectRatio || DEFAULT_SCREEN_SHARE_ASPECT_RATIO;
		aspectRatioConstraints = participants.length === 1 ? {
			minAspectRatio: screenShareAspectRatio,
			maxAspectRatio: screenShareAspectRatio
		} : {
			minAspectRatio: screenShareAspectRatio * (1 - ASPECT_RATIOS.SCREEN_SHARE_TOLERANCE),
			maxAspectRatio: screenShareAspectRatio * (1 + ASPECT_RATIOS.SCREEN_SHARE_TOLERANCE)
		};
	} else aspectRatioConstraints = {
		minAspectRatio: minAspectRatio ?? ASPECT_RATIOS.STAGE.MIN,
		maxAspectRatio: fitScreenshareAspectRatio ? maxAspectRatio ?? ASPECT_RATIOS.STAGE.MAX : ASPECT_RATIOS.STAGE.MAX * 2
	};
	const effectiveMinTileSize = participants.length > 1 && (area.width < 400 || area.height < 400) ? MIN_TILE_SIZES.AUDIENCE : MIN_TILE_SIZES.STAGE;
	if (participants.length === 1) return layoutSingleParticipant({
		participant: participants[0],
		area,
		aspectRatioConstraints,
		minTileSize: effectiveMinTileSize,
		screenShareContentInsets
	});
	let rows = 1;
	let cols = 1;
	let tileWidth = 100;
	let tileHeight = 100;
	const adjustedWeights = hasScreenShare ? {
		participantCoverage: .8,
		tileSize: .1,
		spaceEfficiency: .05,
		gridBalance: .03,
		tileAspectRatio: .02
	} : scoringWeights;
	const gridConstraints = {
		minTileWidth: effectiveMinTileSize.width,
		minTileHeight: effectiveMinTileSize.height,
		minAspectRatio: aspectRatioConstraints.minAspectRatio,
		maxAspectRatio: aspectRatioConstraints.maxAspectRatio,
		scoringWeights: adjustedWeights
	};
	let optimalGrid = calculateOptimalGrid({
		tileCount: participants.length,
		containerWidth: area.width,
		containerHeight: area.height,
		gap,
		options: gridConstraints
	});
	if (!validateGridFitsArea(optimalGrid?.grid, area, gap)) optimalGrid = null;
	if (optimalGrid?.grid.valid) ({rows, columns: cols, tileHeight, tileWidth} = optimalGrid.grid);
	else ({rows, cols, tileWidth, tileHeight} = calculateGridDimensions(participants.length, area, gap, MIN_TILE_SIZES.EDGE_CASE));
	const sortedParticipants = [...participants].sort((a, b) => {
		const aIsScreenShare = a.isScreenSharing;
		const bIsScreenShare = b.isScreenSharing;
		if (aIsScreenShare && !bIsScreenShare) return -1;
		if (!aIsScreenShare && bIsScreenShare) return 1;
		return 0;
	});
	const gridCapacity = rows * cols;
	let participantsToLayout = sortedParticipants;
	let overflowParticipants = [];
	if (participants.length > gridCapacity) {
		participantsToLayout = sortedParticipants.slice(0, gridCapacity);
		overflowParticipants = sortedParticipants.slice(gridCapacity).map((p) => p.id);
	}
	return {
		tiles: positionTilesInGrid(participantsToLayout, area, {
			rows,
			columns: cols,
			tileWidth,
			tileHeight,
			valid: true
		}, {
			gap,
			padding: 0,
			centerLastRow: true
		}),
		overflowParticipants,
		rows,
		columns: cols
	};
}
function layoutAudience({ participants, area, gap, maxPerPage, currentPage, orientation, stageRows, stageCols, scoringWeights, minAspectRatio, maxAspectRatio, paginationPosition = "bottom" }) {
	if (participants.length === 0 || area.width === 0 || area.height === 0) return { tiles: [] };
	const effectiveArea = { ...area };
	if (paginationPosition === "right") {
		effectiveArea.width = area.width - UI_POSITIONING.PAGINATION_BUFFER_HORIZONTAL;
		effectiveArea.width -= Math.ceil(participants.length / (effectiveArea.width / (MIN_TILE_SIZES.AUDIENCE.width * 1.6))) * 10;
	}
	const testParticipantCount = Math.min(participants.length, maxPerPage);
	const audienceAspectRatios = {
		min: minAspectRatio ?? ASPECT_RATIOS.AUDIENCE.MIN,
		max: maxAspectRatio ?? ASPECT_RATIOS.AUDIENCE.MAX
	};
	const audiencePreferredAspectRatio = ASPECT_RATIOS.MAX;
	const optimalGrid = calculateOptimalGrid({
		tileCount: testParticipantCount,
		containerWidth: effectiveArea.width,
		containerHeight: effectiveArea.height,
		gap,
		options: {
			minTileWidth: MIN_TILE_SIZES.AUDIENCE.width,
			minTileHeight: MIN_TILE_SIZES.AUDIENCE.height,
			minAspectRatio: audienceAspectRatios.min,
			maxAspectRatio: audienceAspectRatios.max,
			preferredAspectRatio: audiencePreferredAspectRatio,
			scoringWeights
		}
	});
	let rows, cols, tileWidth, tileHeight;
	if (optimalGrid?.grid.valid) {
		rows = optimalGrid.grid.rows;
		cols = optimalGrid.grid.columns;
		tileWidth = optimalGrid.grid.tileWidth;
		tileHeight = optimalGrid.grid.tileHeight;
	} else {
		const fallbackGrid = calculateGridWithFallback({
			maxTileCount: testParticipantCount,
			area: effectiveArea,
			gap,
			minTileSize: MIN_TILE_SIZES.AUDIENCE,
			aspectRatios: audienceAspectRatios,
			preferredAspectRatio: audiencePreferredAspectRatio,
			scoringWeights
		});
		if (fallbackGrid) {
			rows = fallbackGrid.rows;
			cols = fallbackGrid.cols;
			tileWidth = fallbackGrid.tileWidth;
			tileHeight = fallbackGrid.tileHeight;
		} else return {
			tiles: [],
			pagination: {
				totalParticipants: participants.length,
				visibleParticipants: 0,
				currentPage: 0,
				totalPages: Math.ceil(participants.length / 1),
				allParticipantIds: participants.map((p) => p.id),
				currentPageParticipantIds: [],
				pageSize: 1,
				position: paginationPosition
			}
		};
	}
	const gridCapacity = rows * cols;
	let effectivePageSize = gridCapacity;
	if (participants.length <= maxPerPage && orientation === "horizontal") effectivePageSize = participants.length;
	else if (orientation === "vertical" && participants.length > gridCapacity) effectivePageSize = gridCapacity;
	const totalPages = Math.ceil(participants.length / effectivePageSize);
	const validPage = Math.max(0, Math.min(currentPage, totalPages - 1));
	const startIdx = validPage * effectivePageSize;
	const endIdx = Math.min(startIdx + effectivePageSize, participants.length);
	const visibleParticipants = participants.slice(startIdx, endIdx);
	let participantsToLayout = visibleParticipants;
	if (gridCapacity < visibleParticipants.length) if (orientation === "vertical") if (!(totalPages > 1) && visibleParticipants.length <= 6) {
		const requiredRows = Math.ceil(visibleParticipants.length / cols);
		const newTileHeight = (effectiveArea.height - (requiredRows - 1) * gap) / requiredRows;
		if (newTileHeight >= MIN_TILE_SIZES.AUDIENCE.height) {
			rows = requiredRows;
			tileHeight = newTileHeight;
		} else {
			const twoColumnGrid = calculateGridDimensions(visibleParticipants.length, effectiveArea, gap, MIN_TILE_SIZES.AUDIENCE);
			if (twoColumnGrid.cols > 1) {
				cols = twoColumnGrid.cols;
				rows = twoColumnGrid.rows;
				tileWidth = twoColumnGrid.tileWidth;
				tileHeight = twoColumnGrid.tileHeight;
			} else participantsToLayout = visibleParticipants.slice(0, gridCapacity);
		}
	} else participantsToLayout = visibleParticipants.slice(0, gridCapacity);
	else {
		rows = Math.ceil(visibleParticipants.length / cols);
		tileHeight = (effectiveArea.height - (rows - 1) * gap) / rows;
	}
	if (!(Math.ceil(participants.length / effectivePageSize) > 1) && participants.length > 1 && participants.length <= 6) {
		if (orientation === "horizontal") {
			const reasonableHeightFactor = participants.length === 1 ? .7 : participants.length <= 3 ? .5 : .4;
			const maxReasonableTileHeight = Math.min(effectiveArea.height * reasonableHeightFactor, participants.length === 1 ? 600 : 400);
			if (tileHeight > maxReasonableTileHeight) {
				tileHeight = maxReasonableTileHeight;
				const targetAspectRatio = Math.max(audienceAspectRatios.min, Math.min(audienceAspectRatios.max, tileWidth / tileHeight));
				tileWidth = tileHeight * targetAspectRatio;
				tileWidth = Math.max(tileWidth, MIN_TILE_SIZES.AUDIENCE.width);
				tileHeight = Math.max(tileHeight, MIN_TILE_SIZES.AUDIENCE.height);
				rows = Math.min(Math.floor((effectiveArea.height + gap) / (tileHeight + gap)), participantsToLayout.length);
			}
		} else if (orientation === "vertical") {
			const reasonableWidthFactor = participants.length === 1 ? .7 : participants.length <= 3 ? .6 : .5;
			const maxReasonableTileWidth = Math.min(effectiveArea.width * reasonableWidthFactor, participants.length === 1 ? 600 : 400);
			if (cols === 1 && tileWidth > maxReasonableTileWidth && participantsToLayout.length <= 4) {
				const testCols = 2;
				const testTileWidth = (effectiveArea.width - gap) / testCols;
				const testRows = Math.ceil(participantsToLayout.length / testCols);
				const testTileHeight = Math.min((effectiveArea.height - (testRows - 1) * gap) / testRows, testTileWidth / audienceAspectRatios.min);
				if (testRows * testTileHeight + (testRows - 1) * gap <= effectiveArea.height && testTileWidth >= MIN_TILE_SIZES.AUDIENCE.width && testTileHeight >= MIN_TILE_SIZES.AUDIENCE.height) {
					cols = testCols;
					rows = testRows;
					tileWidth = testTileWidth;
					tileHeight = testTileHeight;
				}
			}
		}
	}
	const rowOffset = orientation === "vertical" ? stageRows : 0;
	const colOffset = orientation === "horizontal" ? stageCols : 0;
	const gridResult = {
		rows,
		columns: cols,
		tileWidth,
		tileHeight,
		valid: true
	};
	const actualTotalPages = Math.ceil(participants.length / effectivePageSize);
	const pagination = actualTotalPages > 1 || participantsToLayout.length < visibleParticipants.length ? {
		totalParticipants: participants.length,
		visibleParticipants: participantsToLayout.length,
		currentPage: validPage,
		totalPages: actualTotalPages,
		allParticipantIds: participants.map((p) => p.id),
		currentPageParticipantIds: participantsToLayout.map((p) => p.id),
		pageSize: effectivePageSize,
		position: paginationPosition
	} : void 0;
	return {
		tiles: positionTilesInGrid(participantsToLayout, effectiveArea, gridResult, {
			gap,
			padding: 0,
			centerLastRow: true
		}).map((tile) => ({
			...tile,
			row: tile.row + rowOffset,
			column: tile.column + colOffset
		})),
		pagination
	};
}
function createAudienceOnlyLayout({ participants, dimensions, maxPerPage, currentPage, scoringWeights }) {
	const { containerWidth, containerHeight, gap = SPACING.DEFAULT_GAP, padding = SPACING.DEFAULT_PADDING } = dimensions;
	const effectiveWidth = containerWidth - 2 * padding;
	const effectiveHeight = containerHeight - 2 * padding;
	const totalPages = Math.ceil(participants.length / maxPerPage);
	const validPage = Math.max(0, Math.min(currentPage, totalPages - 1));
	const startIdx = validPage * maxPerPage;
	const endIdx = Math.min(startIdx + maxPerPage, participants.length);
	const visibleParticipants = participants.slice(startIdx, endIdx);
	const optimalGrid = calculateOptimalGrid({
		tileCount: visibleParticipants.length,
		containerWidth: effectiveWidth,
		containerHeight: effectiveHeight,
		gap,
		options: {
			minTileWidth: MIN_TILE_SIZES.AUDIENCE.width,
			minTileHeight: MIN_TILE_SIZES.AUDIENCE.height,
			minAspectRatio: ASPECT_RATIOS.AUDIENCE.MIN,
			maxAspectRatio: ASPECT_RATIOS.AUDIENCE.MAX,
			scoringWeights
		}
	});
	let rows, cols, tileWidth, tileHeight;
	if (optimalGrid?.grid.valid) {
		rows = optimalGrid.grid.rows;
		cols = optimalGrid.grid.columns;
		tileWidth = optimalGrid.grid.tileWidth;
		tileHeight = optimalGrid.grid.tileHeight;
	} else {
		const fallbackGrid = calculateGridWithFallback({
			maxTileCount: visibleParticipants.length,
			area: {
				width: effectiveWidth,
				height: effectiveHeight
			},
			gap,
			minTileSize: MIN_TILE_SIZES.AUDIENCE,
			aspectRatios: {
				min: ASPECT_RATIOS.AUDIENCE.MIN,
				max: ASPECT_RATIOS.AUDIENCE.MAX
			},
			scoringWeights,
			enforceMinSize: false
		});
		rows = fallbackGrid.rows;
		cols = fallbackGrid.cols;
		tileWidth = fallbackGrid.tileWidth;
		tileHeight = fallbackGrid.tileHeight;
	}
	const tiles = positionTilesInGrid(visibleParticipants, {
		x: 0,
		y: 0,
		width: containerWidth,
		height: containerHeight
	}, {
		rows,
		columns: cols,
		tileWidth,
		tileHeight,
		valid: true
	}, {
		gap,
		padding,
		centerLastRow: true
	});
	const pagination = totalPages > 1 ? {
		totalParticipants: participants.length,
		visibleParticipants: visibleParticipants.length,
		currentPage: validPage,
		totalPages,
		allParticipantIds: participants.map((p) => p.id),
		currentPageParticipantIds: visibleParticipants.map((p) => p.id),
		pageSize: maxPerPage
	} : void 0;
	return {
		id: "audience-only",
		rows,
		columns: cols,
		tiles,
		...pagination && { pagination }
	};
}
//#endregion
//#region src/layouts/fullscreen.ts
/**
* Fullscreen layout - displays a single participant filling the container
*
* Features:
* - Shows one participant at a time
* - Optional aspect ratio constraints
* - Pagination for cycling through participants
* - Centers content if aspect ratio constraints are applied
*
* @param participants - Array of participants
* @param dimensions - Container dimensions
* @param config - Fullscreen layout configuration
* @returns Layout with single fullscreen tile
*/
function fullscreenLayout(participants, dimensions, config = {}) {
	const { currentPage = 0, minAspectRatio, maxAspectRatio, fullscreenParticipantId } = config;
	const { containerWidth, containerHeight, padding = dimensions.padding ?? SPACING.DEFAULT_PADDING } = dimensions;
	const effectiveWidth = containerWidth - 2 * padding;
	const effectiveHeight = containerHeight - 2 * padding;
	if (participants.length === 0 || effectiveWidth <= 0 || effectiveHeight <= 0) return {
		id: "fullscreen",
		rows: 0,
		columns: 0,
		tiles: []
	};
	const clampedPage = Math.min(Math.max(0, currentPage), participants.length - 1);
	let fullscreenParticipant;
	let fullscreenIndex;
	if (fullscreenParticipantId) {
		fullscreenIndex = participants.findIndex((p) => p.id === fullscreenParticipantId);
		if (fullscreenIndex !== -1) fullscreenParticipant = participants[fullscreenIndex];
		else {
			fullscreenIndex = 0;
			fullscreenParticipant = participants[0];
		}
	} else {
		fullscreenIndex = clampedPage;
		fullscreenParticipant = participants[fullscreenIndex];
	}
	if (!fullscreenParticipant) return {
		id: "fullscreen",
		rows: 0,
		columns: 0,
		tiles: []
	};
	const layout = layoutSingleParticipant({
		participant: fullscreenParticipant,
		area: {
			width: effectiveWidth,
			height: effectiveHeight,
			x: padding,
			y: padding
		},
		aspectRatioConstraints: {
			minAspectRatio: minAspectRatio ?? ASPECT_RATIOS.STAGE.MIN,
			maxAspectRatio: maxAspectRatio ?? ASPECT_RATIOS.STAGE.MAX
		},
		minTileSize: MIN_TILE_SIZES.STAGE
	});
	const pagination = participants.length > 1 ? {
		totalParticipants: participants.length,
		visibleParticipants: 1,
		currentPage: clampedPage,
		totalPages: participants.length,
		allParticipantIds: participants.map((p) => p.id),
		currentPageParticipantIds: [fullscreenParticipant.id],
		pageSize: 1
	} : void 0;
	return {
		id: "fullscreen",
		rows: layout.rows,
		columns: layout.columns,
		tiles: layout.tiles,
		pagination
	};
}
//#endregion
//#region src/layouts/grid.ts
function simpleGridLayout(participants, dimensions, config = {}) {
	const { maxTilesPerPage = PAGINATION.DEFAULT_MAX_TILES_PER_PAGE, currentPage = 0, minTileSize = MIN_TILE_SIZES.DEFAULT } = config;
	const { containerWidth, containerHeight, gap = dimensions.gap ?? SPACING.DEFAULT_GAP, padding = dimensions.padding ?? SPACING.DEFAULT_PADDING } = dimensions;
	const effectiveWidth = containerWidth - 2 * padding;
	const effectiveHeight = containerHeight - 2 * padding;
	const totalParticipants = participants.length;
	if (totalParticipants === 0 || effectiveWidth <= 0 || effectiveHeight <= 0) return {
		id: "simple-grid",
		rows: 0,
		columns: 0,
		tiles: []
	};
	let visibleParticipants = participants;
	let paginationInfo;
	let gridResult = null;
	const gridCapacity = calculateGridCapacity({
		width: effectiveWidth,
		height: effectiveHeight,
		gap,
		minTileSize,
		minAspectRatio: config.minAspectRatio,
		maxAspectRatio: config.maxAspectRatio
	});
	if (config.faceVisibilityConfig && totalParticipants <= maxTilesPerPage) {
		gridResult = calculateOptimalGrid({
			tileCount: totalParticipants,
			containerWidth: effectiveWidth,
			containerHeight: effectiveHeight,
			gap,
			options: {
				minTileWidth: minTileSize.width,
				minTileHeight: minTileSize.height,
				minAspectRatio: config.minAspectRatio,
				maxAspectRatio: config.maxAspectRatio,
				scoringWeights: config.scoringWeights,
				participants,
				faceVisibilityConfig: config.faceVisibilityConfig
			}
		});
		if (gridResult?.grid.valid && gridResult.grid.rows * gridResult.grid.columns >= totalParticipants) visibleParticipants = participants;
		else gridResult = null;
	}
	if (!gridResult?.grid.valid) {
		const safeTilesPerPage = totalParticipants > 0 && effectiveWidth > 0 && effectiveHeight > 0 ? Math.max(1, Math.min(maxTilesPerPage, gridCapacity)) : Math.min(maxTilesPerPage, gridCapacity);
		if (totalParticipants > safeTilesPerPage) {
			const totalPages = Math.ceil(totalParticipants / safeTilesPerPage);
			const validPage = Math.max(0, Math.min(currentPage, totalPages - 1));
			const startIndex = validPage * safeTilesPerPage;
			const endIndex = Math.min(startIndex + safeTilesPerPage, totalParticipants);
			visibleParticipants = participants.slice(startIndex, endIndex);
			paginationInfo = {
				totalParticipants,
				visibleParticipants: visibleParticipants.length,
				currentPage: validPage,
				totalPages,
				allParticipantIds: participants.map((p) => p.id),
				currentPageParticipantIds: visibleParticipants.map((p) => p.id),
				pageSize: safeTilesPerPage
			};
		}
		gridResult = calculateOptimalGrid({
			tileCount: visibleParticipants.length,
			containerWidth: effectiveWidth,
			containerHeight: effectiveHeight,
			gap,
			options: {
				minTileWidth: minTileSize.width,
				minTileHeight: minTileSize.height,
				minAspectRatio: config.minAspectRatio,
				maxAspectRatio: config.maxAspectRatio,
				scoringWeights: config.scoringWeights,
				participants: visibleParticipants,
				faceVisibilityConfig: config.faceVisibilityConfig
			}
		});
	}
	if (!gridResult?.grid.valid && (effectiveWidth < 200 || effectiveHeight < 200)) gridResult = calculateOptimalGrid({
		tileCount: visibleParticipants.length,
		containerWidth: effectiveWidth,
		containerHeight: effectiveHeight,
		gap,
		options: {
			minTileWidth: MIN_TILE_SIZES.EDGE_CASE.width,
			minTileHeight: MIN_TILE_SIZES.EDGE_CASE.height,
			minAspectRatio: config.minAspectRatio,
			maxAspectRatio: config.maxAspectRatio,
			scoringWeights: config.scoringWeights,
			participants: visibleParticipants,
			faceVisibilityConfig: config.faceVisibilityConfig
		}
	});
	if (!gridResult?.grid.valid) return {
		id: "simple-grid",
		rows: 0,
		columns: 0,
		tiles: []
	};
	const { rows, columns } = gridResult.grid;
	const maxTilesInGrid = rows * columns;
	let actualVisibleParticipants = visibleParticipants.slice(0, maxTilesInGrid);
	if (maxTilesInGrid < visibleParticipants.length) if (paginationInfo) {
		paginationInfo.visibleParticipants = actualVisibleParticipants.length;
		paginationInfo.currentPageParticipantIds = actualVisibleParticipants.map((p) => p.id);
		paginationInfo.pageSize = maxTilesInGrid;
	} else {
		const totalPages = Math.ceil(participants.length / maxTilesInGrid);
		const validPage = Math.max(0, Math.min(currentPage, totalPages - 1));
		const startIndex = validPage * maxTilesInGrid;
		const endIndex = Math.min(startIndex + maxTilesInGrid, participants.length);
		visibleParticipants = participants.slice(startIndex, endIndex);
		actualVisibleParticipants = visibleParticipants.slice(0, maxTilesInGrid);
		paginationInfo = {
			totalParticipants: participants.length,
			visibleParticipants: actualVisibleParticipants.length,
			currentPage: validPage,
			totalPages,
			allParticipantIds: participants.map((p) => p.id),
			currentPageParticipantIds: actualVisibleParticipants.map((p) => p.id),
			pageSize: maxTilesInGrid
		};
	}
	return {
		id: "simple-grid",
		rows,
		columns,
		tiles: positionTilesInGrid(actualVisibleParticipants, {
			x: 0,
			y: 0,
			width: containerWidth,
			height: containerHeight
		}, gridResult.grid, {
			gap,
			padding,
			centerLastRow: true,
			align: config.align,
			lastRowPolicy: config.lastRowPolicy
		}),
		...paginationInfo && { pagination: paginationInfo }
	};
}
//#endregion
//#region src/layouts/picture-in-picture.ts
function pictureInPictureLayout(participants, dimensions, config = {}) {
	const { pipPosition = "bottom-right", pipSizeRatio = SIZE_RATIOS.FLOATING.MAX_WIDTH_RATIO, minAspectRatio = ASPECT_RATIOS.SIMPLE_GRID.MIN, maxAspectRatio = ASPECT_RATIOS.SIMPLE_GRID.MAX } = config;
	const { containerWidth, containerHeight, padding = SPACING.DEFAULT_PADDING } = dimensions;
	const effectiveWidth = containerWidth - 2 * padding;
	const effectiveHeight = containerHeight - 2 * padding;
	if (participants.length !== 2) return {
		id: "picture-in-picture",
		rows: 1,
		columns: 1,
		tiles: participants.slice(0, 1).map((participant) => ({
			participantId: participant.id,
			row: 1,
			column: 1,
			width: effectiveWidth,
			height: effectiveHeight,
			x: padding,
			y: padding
		}))
	};
	let mainWidth = effectiveWidth;
	let mainHeight = effectiveHeight;
	const mainAspectRatio = mainWidth / mainHeight;
	if (mainAspectRatio < minAspectRatio) mainHeight = mainWidth / minAspectRatio;
	else if (mainAspectRatio > maxAspectRatio) mainWidth = mainHeight * maxAspectRatio;
	const mainXOffset = (effectiveWidth - mainWidth) / 2;
	const mainYOffset = (effectiveHeight - mainHeight) / 2;
	const localParticipant = participants.find((p) => p.isSelf);
	const remoteParticipant = participants.find((p) => !p.isSelf);
	let mainParticipant;
	let pipParticipant;
	if (localParticipant && remoteParticipant) {
		mainParticipant = remoteParticipant;
		pipParticipant = localParticipant;
	} else {
		const mainParticipantIndex = participants.findIndex((p) => p.isScreenSharing || p.isPinned);
		mainParticipant = mainParticipantIndex !== -1 ? participants[mainParticipantIndex] : participants[0];
		pipParticipant = participants.find((p) => p.id !== mainParticipant.id);
	}
	const pipAspect = pipParticipant.aspectRatio ?? ASPECT_RATIOS.SCREEN_SHARE;
	const pipSize = Math.min(effectiveWidth * pipSizeRatio, effectiveHeight * pipSizeRatio, SIZE_RATIOS.FLOATING.MAX_WIDTH);
	let pipWidth = pipSize;
	let pipHeight = pipSize / pipAspect;
	const pipAspectRatio = pipWidth / pipHeight;
	if (pipAspectRatio < minAspectRatio) pipHeight = pipWidth / minAspectRatio;
	else if (pipAspectRatio > maxAspectRatio) pipWidth = pipHeight * maxAspectRatio;
	let pipX;
	let pipY;
	const floatingOffset = SPACING.FLOATING_TILE_OFFSET;
	switch (pipPosition) {
		case "top-left":
			pipX = padding + floatingOffset;
			pipY = padding + floatingOffset;
			break;
		case "top-right":
			pipX = containerWidth - padding - pipWidth - floatingOffset;
			pipY = padding + floatingOffset;
			break;
		case "bottom-left":
			pipX = padding + floatingOffset;
			pipY = containerHeight - padding - pipHeight - floatingOffset;
			break;
		default:
			pipX = containerWidth - padding - pipWidth - floatingOffset;
			pipY = containerHeight - padding - pipHeight - floatingOffset;
			break;
	}
	return {
		id: "picture-in-picture",
		rows: 1,
		columns: 1,
		tiles: [{
			participantId: mainParticipant.id,
			row: 1,
			column: 1,
			width: mainWidth,
			height: mainHeight,
			x: padding + mainXOffset,
			y: padding + mainYOffset
		}, {
			participantId: pipParticipant.id,
			row: 1,
			column: 1,
			width: pipWidth,
			height: pipHeight,
			x: pipX,
			y: pipY,
			isFloating: true
		}]
	};
}
//#endregion
//#region src/layouts/small-group.ts
/**
* Small group layout optimized for 2-4 participants
* Arranges tiles horizontally with a 3:4 aspect ratio
* Ensures good visibility by limiting height usage
*/
function smallGroupLayout(participants, dimensions, config = {}) {
	const { maxParticipants = SMALL_GROUP.MAX_PARTICIPANTS, targetAspectRatio = ASPECT_RATIOS.MIN, maxHeightPercent = SMALL_GROUP.MAX_HEIGHT_PERCENT } = config;
	const { containerWidth, containerHeight, gap = dimensions.gap ?? SPACING.DEFAULT_GAP, padding = dimensions.padding ?? SPACING.DEFAULT_PADDING } = dimensions;
	const effectiveWidth = containerWidth - 2 * padding;
	const effectiveHeight = containerHeight - 2 * padding;
	if (participants.length === 0 || participants.length > maxParticipants) return {
		id: "small-group",
		rows: 0,
		columns: 0,
		tiles: []
	};
	const maxTileHeight = effectiveHeight * maxHeightPercent;
	const maxTileWidth = Math.min(Math.max(maxTileHeight * targetAspectRatio, effectiveWidth / participants.length - gap), maxTileHeight * ASPECT_RATIOS.MAX);
	const totalWidthNeeded = participants.length * maxTileWidth + (participants.length - 1) * gap;
	let tileWidth;
	let tileHeight;
	if (totalWidthNeeded <= effectiveWidth) {
		tileWidth = maxTileWidth;
		tileHeight = maxTileHeight;
	} else {
		tileWidth = (effectiveWidth - (participants.length - 1) * gap) / participants.length;
		tileHeight = tileWidth / targetAspectRatio;
		if (tileHeight > maxTileHeight) {
			tileHeight = maxTileHeight;
			tileWidth = tileHeight * targetAspectRatio;
		}
	}
	const gridResult = {
		rows: 1,
		columns: participants.length,
		tileWidth,
		tileHeight,
		valid: true
	};
	const tiles = positionTilesInGrid(participants, {
		x: 0,
		y: 0,
		width: containerWidth,
		height: containerHeight
	}, gridResult, {
		gap,
		padding,
		centerLastRow: false
	});
	return {
		id: "small-group",
		rows: 1,
		columns: participants.length,
		tiles
	};
}
/**
* Check if small group layout should be used
* Returns true if all participants can fit horizontally with 3:4 aspect ratio
* AND the container is wide enough that a horizontal row makes sense
* AND (if face visibility is enabled) faces won't be clipped
*/
function shouldUseSmallGroupLayout({ participantCount, containerWidth, containerHeight, gap = SPACING.DEFAULT_GAP, padding = SPACING.DEFAULT_PADDING, maxParticipants = SMALL_GROUP.MAX_PARTICIPANTS, maxTilesPerPage = PAGINATION.DEFAULT_MAX_TILES_PER_PAGE, targetAspectRatio = ASPECT_RATIOS.MIN, maxHeightPercent = SMALL_GROUP.MAX_HEIGHT_PERCENT, participants, faceVisibilityConfig }) {
	if (participantCount <= 0 || participantCount > maxParticipants || participantCount > maxTilesPerPage) return false;
	const effectiveWidth = containerWidth - 2 * padding;
	const effectiveHeight = containerHeight - 2 * padding;
	const containerAspectRatio = effectiveWidth / effectiveHeight;
	if (participantCount === 4 && containerAspectRatio < 2.5) return false;
	if (participantCount === 3 && containerAspectRatio < 2) return false;
	const maxTileHeight = effectiveHeight * maxHeightPercent;
	const maxTileWidth = maxTileHeight * targetAspectRatio;
	const totalWidthNeeded = participantCount * maxTileWidth + (participantCount - 1) * gap;
	let tileWidth;
	let tileHeight;
	if (totalWidthNeeded <= effectiveWidth) {
		if (maxTileHeight < effectiveHeight * SMALL_GROUP.MIN_HEIGHT_PERCENT) return false;
		tileWidth = maxTileWidth;
		tileHeight = maxTileHeight;
	} else {
		tileWidth = (effectiveWidth - (participantCount - 1) * gap) / participantCount;
		tileHeight = tileWidth / targetAspectRatio;
		if (tileHeight > maxTileHeight) {
			tileHeight = maxTileHeight;
			tileWidth = tileHeight * targetAspectRatio;
		}
		const minHeightThreshold = effectiveHeight * SMALL_GROUP.MIN_HEIGHT_PERCENT;
		if (tileWidth < SMALL_GROUP.MIN_TILE_WIDTH || tileHeight > effectiveHeight || tileHeight < minHeightThreshold) return false;
	}
	if (checkFaceVisibility(participants, tileWidth / tileHeight, faceVisibilityConfig).shouldReject) return false;
	return true;
}
//#endregion
//#region src/layouts/auto.ts
function autoLayout(participants, dimensions, config) {
	const screenShareCount = participants.filter((p) => p.isScreenShare).length;
	const onStageCount = participants.filter((p) => p.isOnStage).length;
	const hasPriority = screenShareCount > 0 || onStageCount > 0;
	const currentPage = Math.min(config.currentPage || 0, participants.length - 1);
	if (config.fullscreenParticipantId || config.maxTilesPerPage === 1) return fullscreenLayout(participants, dimensions, {
		currentPage,
		fullscreenParticipantId: config.fullscreenParticipantId
	});
	if (!hasPriority && participants.length <= 2) {
		if (participants.length === 1) return fullscreenLayout(participants, dimensions, { currentPage });
		return pictureInPictureLayout(participants, dimensions, {
			minAspectRatio: config.minAspectRatio ?? ASPECT_RATIOS.SIMPLE_GRID.MIN,
			maxAspectRatio: config.maxAspectRatio ?? ASPECT_RATIOS.SIMPLE_GRID.MAX,
			pipPosition: config.pipPosition,
			pipSizeRatio: config.pipSizeRatio
		});
	}
	if (onStageCount > 0 || screenShareCount > 0) return simpleStageAudienceLayout(participants, dimensions, {
		stageSize: config.stageSize ?? SIZE_RATIOS.STAGE.DEFAULT * 100,
		maxAudiencePerPage: config.maxTilesPerPage,
		currentPage,
		currentOrientation: config.currentOrientation,
		scoringWeights: config.scoringWeights,
		allowResize: config.allowResize,
		minAspectRatio: config.minAspectRatio,
		maxAspectRatio: config.maxAspectRatio,
		fitScreenshareAspectRatio: config.fitScreenshareAspectRatio,
		screenShareContentInsets: config.screenShareContentInsets
	});
	if (shouldUseSmallGroupLayout({
		participantCount: participants.length,
		containerWidth: dimensions.containerWidth,
		containerHeight: dimensions.containerHeight,
		maxTilesPerPage: config.maxTilesPerPage,
		gap: dimensions.gap ?? SPACING.DEFAULT_GAP,
		padding: dimensions.padding ?? SPACING.DEFAULT_PADDING,
		participants,
		faceVisibilityConfig: config.faceVisibilityConfig
	})) return smallGroupLayout(participants, dimensions, { maxHeightPercent: config.maxHeightPercent });
	return simpleGridLayout(participants, dimensions, {
		...config,
		minAspectRatio: config.minAspectRatio ?? ASPECT_RATIOS.SIMPLE_GRID.MIN,
		maxAspectRatio: config.maxAspectRatio ?? ASPECT_RATIOS.SIMPLE_GRID.MAX,
		faceVisibilityConfig: config.faceVisibilityConfig
	});
}
//#endregion
//#region src/layouts/focus.ts
function simpleFocusLayout(participants, dimensions, config = {}) {
	const { primaryId, maxTilesPerPage = 4, isMobile = false, minAspectRatio = ASPECT_RATIOS.SIMPLE_GRID.MIN, maxAspectRatio = ASPECT_RATIOS.SIMPLE_GRID.MAX, minTileSize = MIN_TILE_SIZES.DEFAULT } = config;
	const { containerWidth, containerHeight, gap = 8, padding = 16 } = dimensions;
	const effectiveWidth = containerWidth - 2 * padding;
	const effectiveHeight = containerHeight - 2 * padding;
	let primary = participants.find((p) => p.id === primaryId);
	let others = participants.filter((p) => p.id !== primaryId);
	if (!primary) [primary, ...others] = participants;
	return layoutFocusParticipants({
		primary,
		others,
		effectiveWidth,
		effectiveHeight,
		gap,
		padding,
		isMobile,
		maxOthers: maxTilesPerPage,
		minAspectRatio,
		maxAspectRatio,
		minTileSize
	});
}
function layoutFocusParticipants({ primary, others, effectiveWidth, effectiveHeight, gap, padding, isMobile, maxOthers, minAspectRatio, maxAspectRatio, minTileSize }) {
	const tiles = [];
	if (!primary) return {
		id: "simple-focus-empty",
		rows: 0,
		columns: 0,
		tiles: []
	};
	const visibleOthers = others.slice(0, maxOthers);
	const hasOthers = visibleOthers.length > 0;
	if (isMobile) {
		let primaryHeight = hasOthers ? effectiveHeight * .6 : effectiveHeight;
		let primaryWidth = effectiveWidth;
		const primaryAspectRatio = primaryWidth / primaryHeight;
		if (primaryAspectRatio < minAspectRatio) primaryHeight = primaryWidth / minAspectRatio;
		else if (primaryAspectRatio > maxAspectRatio) primaryWidth = primaryHeight * maxAspectRatio;
		const primaryXOffset = (effectiveWidth - primaryWidth) / 2;
		const primaryYOffset = hasOthers ? 0 : (effectiveHeight - primaryHeight) / 2;
		const primaryTile = {
			participantId: primary.id,
			row: 1,
			column: 1,
			width: primaryWidth,
			height: primaryHeight,
			x: padding + primaryXOffset,
			y: padding + primaryYOffset
		};
		if (primary.isScreenShare && primary.aspectRatio) {
			const { contentWidth, contentHeight } = fitAspectRatio(effectiveWidth, primaryHeight, primary.aspectRatio);
			primaryTile.contentWidth = contentWidth;
			primaryTile.contentHeight = contentHeight;
		}
		tiles.push(primaryTile);
		if (hasOthers) {
			let othersHeight = effectiveHeight - primaryHeight - gap;
			const othersPerRow = Math.min(visibleOthers.length, 2);
			let tileWidth = (effectiveWidth - (othersPerRow - 1) * gap) / othersPerRow;
			const othersAspectRatio = tileWidth / othersHeight;
			if (othersAspectRatio < minAspectRatio) othersHeight = tileWidth / minAspectRatio;
			else if (othersAspectRatio > maxAspectRatio) tileWidth = othersHeight * maxAspectRatio;
			if (tileWidth < minTileSize.width || othersHeight < minTileSize.height) return {
				id: "simple-focus-mobile",
				rows: 1,
				columns: 1,
				tiles: [primaryTile]
			};
			const rowXOffset = (effectiveWidth - (othersPerRow * tileWidth + (othersPerRow - 1) * gap)) / 2;
			visibleOthers.forEach((participant, i) => {
				tiles.push({
					participantId: participant.id,
					row: 2,
					column: i + 1,
					width: tileWidth,
					height: othersHeight,
					x: padding + rowXOffset + i * (tileWidth + gap),
					y: padding + primaryHeight + gap
				});
			});
		}
		return {
			id: "simple-focus-mobile",
			rows: hasOthers ? 2 : 1,
			columns: hasOthers ? Math.min(visibleOthers.length, 2) : 1,
			tiles
		};
	}
	let sidebarWidth = Math.min(effectiveWidth * .25, 300);
	let primaryWidth = hasOthers ? effectiveWidth - sidebarWidth - gap : effectiveWidth;
	let primaryHeight = effectiveHeight;
	const primaryAspectRatio = primaryWidth / primaryHeight;
	if (primaryAspectRatio < minAspectRatio) primaryHeight = primaryWidth / minAspectRatio;
	else if (primaryAspectRatio > maxAspectRatio) primaryWidth = primaryHeight * maxAspectRatio;
	const primaryXOffset = hasOthers ? 0 : (effectiveWidth - primaryWidth) / 2;
	const primaryYOffset = (effectiveHeight - primaryHeight) / 2;
	const primaryTile = {
		participantId: primary.id,
		row: 1,
		column: 1,
		width: primaryWidth,
		height: primaryHeight,
		x: padding + primaryXOffset,
		y: padding + primaryYOffset
	};
	if (primary.isScreenShare && primary.aspectRatio) {
		const { contentWidth, contentHeight } = fitAspectRatio(primaryWidth, effectiveHeight, primary.aspectRatio);
		primaryTile.contentWidth = contentWidth;
		primaryTile.contentHeight = contentHeight;
	}
	tiles.push(primaryTile);
	let actualVisibleOthersCount = 0;
	if (hasOthers) {
		sidebarWidth = effectiveWidth - primaryWidth - gap;
		let tileHeight = (effectiveHeight - (visibleOthers.length - 1) * gap) / visibleOthers.length;
		const sidebarAspectRatio = sidebarWidth / tileHeight;
		if (sidebarAspectRatio < minAspectRatio) tileHeight = sidebarWidth / minAspectRatio;
		else if (sidebarAspectRatio > maxAspectRatio) sidebarWidth = tileHeight * maxAspectRatio;
		const maxTilesCanFit = Math.floor((effectiveHeight + gap) / (tileHeight + gap));
		const actualVisibleOthers = visibleOthers.slice(0, Math.min(visibleOthers.length, maxTilesCanFit));
		actualVisibleOthersCount = actualVisibleOthers.length;
		if (sidebarWidth < minTileSize.width || tileHeight < minTileSize.height || actualVisibleOthers.length === 0) return {
			id: "simple-focus-desktop",
			rows: 1,
			columns: 1,
			tiles: [primaryTile]
		};
		actualVisibleOthers.forEach((participant, i) => {
			tiles.push({
				participantId: participant.id,
				row: i + 1,
				column: 2,
				width: sidebarWidth,
				height: tileHeight,
				x: padding + primaryWidth + gap,
				y: padding + i * (tileHeight + gap)
			});
		});
	}
	return {
		id: "simple-focus-desktop",
		rows: Math.max(1, actualVisibleOthersCount),
		columns: tiles.length > 1 ? 2 : 1,
		tiles
	};
}
//#endregion
//#region src/layouts/compute-layout.ts
/**
* The pure layout pipeline.
*
* `computeLayout` is the whole per-render layout computation — participant
* sort (with stability feedback), breakpoint resolution, mode dispatch,
* pagination sizing and offsets — as a pure function. The sequence-dependent
* state the old hook kept in render-mutated refs (previous sort order, actual
* tiles per page, orientation hysteresis) is threaded explicitly as
* `LayoutFeedback`: callers pass the feedback from the previous committed
* computation and receive the next one to commit.
*
* Purity buys three things:
* - the adjacent-page carousel layout can share the main computation's
*   feedback instead of running a second, permanently-hot hook instance (P1);
* - a render React discards can no longer poison hysteresis, because the
*   caller only commits feedback from committed renders (P6);
* - the entire pipeline is hash-testable without React.
*/
const INITIAL_LAYOUT_FEEDBACK = {
	previousSortedIds: [],
	actualTilesPerPage: null,
	previousOrientation: void 0
};
function resolveBreakpointConfig(config, containerWidth) {
	if (!config.breakpoints) return config;
	return Object.keys(config.breakpoints).map(Number).filter((breakpoint) => containerWidth <= breakpoint).sort((a, b) => b - a).reduce((resolvedConfig, breakpoint) => {
		const overrides = config.breakpoints?.[breakpoint];
		return overrides ? applyLayoutConfigOverrides(resolvedConfig, overrides) : resolvedConfig;
	}, config);
}
/**
* Adjusts container dimensions to make room for pagination controls.
* Reduces width for left/right pagination, height for top/bottom pagination.
*/
function adjustDimensionsForPagination(dimensions, position, bufferSize) {
	const adjustedDimensions = { ...dimensions };
	switch (position) {
		case "bottom":
		case "top":
			adjustedDimensions.containerHeight = Math.max(100, dimensions.containerHeight - (bufferSize ?? UI_POSITIONING.PAGINATION_BUFFER_VERTICAL));
			break;
		case "left":
		case "right":
			adjustedDimensions.containerWidth = Math.max(100, dimensions.containerWidth - (bufferSize ?? UI_POSITIONING.PAGINATION_BUFFER_HORIZONTAL));
			break;
		default: break;
	}
	return adjustedDimensions;
}
/**
* Applies position offsets to a layout based on pagination position.
* When pagination is at the top or left, tiles need to be offset to make room.
*/
function applyPaginationOffsets(layout, position, isStageAudienceMode, bufferSize) {
	if (isStageAudienceMode || position === "bottom" || position === "right") return layout;
	const verticalBuffer = bufferSize ?? UI_POSITIONING.PAGINATION_BUFFER_VERTICAL;
	const horizontalBuffer = bufferSize ?? UI_POSITIONING.PAGINATION_BUFFER_HORIZONTAL;
	if (position === "top") return {
		...layout,
		tiles: layout.tiles.map((tile) => ({
			...tile,
			y: tile.y + verticalBuffer
		})),
		audience: layout.audience ? {
			...layout.audience,
			y: layout.audience.y + verticalBuffer
		} : void 0
	};
	if (position === "left") return {
		...layout,
		tiles: layout.tiles.map((tile) => ({
			...tile,
			x: tile.x + horizontalBuffer
		})),
		audience: layout.audience ? {
			...layout.audience,
			x: layout.audience.x + UI_POSITIONING.PAGINATION_BUFFER_HORIZONTAL
		} : void 0
	};
	return layout;
}
function orientationFromLayoutId(id) {
	if (id === "stage-audience-vertical") return "vertical";
	if (id === "stage-audience-horizontal") return "horizontal";
}
/**
* Run the full layout pipeline for one page.
*
* Returns the computed result plus the feedback the *next* computation should
* receive. Callers that render the result commit `nextFeedback`; speculative
* callers (adjacent-page carousel) simply drop it.
*/
function computeLayout(input, feedback) {
	countLayoutComputation();
	const { participants, dimensions, config, currentPage, stageSize, pipCorner, fullscreenParticipantId } = input;
	const resolvedConfig = resolveBreakpointConfig(config, dimensions.containerWidth);
	const maxTilesPerPageForSorting = Math.min(feedback.actualTilesPerPage ?? resolvedConfig.maxTilesPerPage, resolvedConfig.maxTilesPerPage);
	let participantsToSort = participants;
	if (feedback.previousSortedIds.length > 0) {
		const participantMap = new Map(participants.map((p) => [p.id, p]));
		const previousOrder = feedback.previousSortedIds;
		const orderedParticipants = [];
		const seenIds = /* @__PURE__ */ new Set();
		for (const id of previousOrder) {
			const participant = participantMap.get(id);
			if (participant) {
				orderedParticipants.push(participant);
				seenIds.add(id);
			}
		}
		for (const participant of participants) if (!seenIds.has(participant.id)) orderedParticipants.push(participant);
		participantsToSort = orderedParticipants;
	}
	const sortedParticipants = sortParticipants(participantsToSort, {
		prioritizeSpeaker: resolvedConfig.prioritizeSpeaker,
		prioritizeScreenShare: resolvedConfig.prioritizeScreenShare,
		prioritizePinned: true,
		currentPageInfo: { maxTilesPerPage: maxTilesPerPageForSorting }
	});
	const sortedIds = sortedParticipants.map((p) => p.id);
	const isMobile = dimensions.containerWidth <= BREAKPOINTS.MOBILE;
	const resolvedDimensions = {
		...dimensions,
		gap: resolvedConfig.gap,
		padding: resolvedConfig.padding
	};
	const currentOrientation = feedback.previousOrientation;
	const calculateLayout = (dims) => {
		let result;
		switch (resolvedConfig.mode) {
			case "auto":
				result = autoLayout(sortedParticipants, dims, {
					maxTilesPerPage: resolvedConfig.maxTilesPerPage,
					currentPage,
					minTileSize: {
						width: resolvedConfig.minTileWidth || 100,
						height: resolvedConfig.minTileHeight || 100
					},
					minAspectRatio: resolvedConfig.minTileAspectRatio,
					maxAspectRatio: resolvedConfig.maxTileAspectRatio,
					stageSize,
					currentOrientation,
					pipPosition: pipCorner,
					pipSizeRatio: resolvedConfig.pipConfig.pipSizeRatio,
					scoringWeights: resolvedConfig.gridScoringWeights,
					allowResize: resolvedConfig.stageAudienceConfig?.allowResize,
					maxHeightPercent: resolvedConfig.maxHeightPercent,
					fitScreenshareAspectRatio: resolvedConfig.stageAudienceConfig?.fitScreenshareAspectRatio,
					screenShareContentInsets: resolvedConfig.stageAudienceConfig?.screenShareContentInsets,
					fullscreenParticipantId,
					faceVisibilityConfig: resolvedConfig.faceVisibilityConfig,
					align: resolvedConfig.align,
					lastRowPolicy: resolvedConfig.lastRowPolicy
				});
				break;
			case "grid":
				result = simpleGridLayout(sortedParticipants, dims, {
					maxTilesPerPage: resolvedConfig.maxTilesPerPage,
					currentPage,
					minTileSize: resolvedConfig.minTileWidth && resolvedConfig.minTileHeight ? {
						width: resolvedConfig.minTileWidth,
						height: resolvedConfig.minTileHeight
					} : void 0,
					minAspectRatio: resolvedConfig.minTileAspectRatio,
					maxAspectRatio: resolvedConfig.maxTileAspectRatio,
					scoringWeights: resolvedConfig.gridScoringWeights,
					faceVisibilityConfig: resolvedConfig.faceVisibilityConfig,
					align: resolvedConfig.align,
					lastRowPolicy: resolvedConfig.lastRowPolicy
				});
				break;
			case "focus": {
				const primaryParticipant = sortedParticipants.find((p) => p.isPinned) || sortedParticipants.find((p) => p.isScreenSharing) || sortedParticipants.find((p) => p.isSpeaking) || sortedParticipants[0];
				result = simpleFocusLayout(sortedParticipants, dims, {
					primaryId: primaryParticipant?.id || sortedParticipants[0]?.id || "",
					maxTilesPerPage: resolvedConfig.maxTilesPerPage,
					currentPage,
					isMobile
				});
				break;
			}
			case "picture-in-picture":
				result = pictureInPictureLayout(sortedParticipants, dims, {
					minAspectRatio: resolvedConfig.minTileAspectRatio,
					maxAspectRatio: resolvedConfig.maxTileAspectRatio,
					pipPosition: pipCorner,
					pipSizeRatio: resolvedConfig.pipConfig.pipSizeRatio
				});
				break;
			case "stage-audience":
				result = simpleStageAudienceLayout(sortedParticipants, dims, {
					stageSize,
					maxAudiencePerPage: resolvedConfig.maxTilesPerPage,
					currentPage,
					currentOrientation,
					orientation: resolvedConfig.stageAudienceConfig?.forceOrientation,
					minAspectRatio: resolvedConfig.minTileAspectRatio,
					maxAspectRatio: resolvedConfig.maxTileAspectRatio,
					scoringWeights: resolvedConfig.gridScoringWeights,
					allowResize: resolvedConfig.stageAudienceConfig?.allowResize,
					screenShareContentInsets: resolvedConfig.stageAudienceConfig?.screenShareContentInsets
				});
				break;
			case "fullscreen":
				result = fullscreenLayout(sortedParticipants, dims, {
					currentPage,
					minAspectRatio: resolvedConfig.minTileAspectRatio,
					maxAspectRatio: resolvedConfig.maxTileAspectRatio
				});
				break;
			case "small-group":
				result = smallGroupLayout(sortedParticipants, dims);
				break;
			default: result = simpleGridLayout(sortedParticipants, dims, {
				maxTilesPerPage: resolvedConfig.maxTilesPerPage,
				currentPage,
				minTileSize: resolvedConfig.minTileWidth && resolvedConfig.minTileHeight ? {
					width: resolvedConfig.minTileWidth,
					height: resolvedConfig.minTileHeight
				} : void 0,
				minAspectRatio: resolvedConfig.minTileAspectRatio,
				maxAspectRatio: resolvedConfig.maxTileAspectRatio,
				scoringWeights: resolvedConfig.gridScoringWeights,
				faceVisibilityConfig: resolvedConfig.faceVisibilityConfig,
				align: resolvedConfig.align,
				lastRowPolicy: resolvedConfig.lastRowPolicy
			});
		}
		return result;
	};
	const finishFeedback = (layout) => ({
		previousSortedIds: sortedIds,
		actualTilesPerPage: fullscreenParticipantId ? feedback.actualTilesPerPage : layout.tiles.length,
		previousOrientation: orientationFromLayoutId(layout.id)
	});
	const totalParticipants = sortedParticipants.length;
	const hasPriorityParticipants = sortedParticipants.some((p) => p.isScreenShare || p.isOnStage);
	if (!resolvedConfig.paginationConfig?.disabled && dimensions.containerWidth > 0 && dimensions.containerHeight > 0 && totalParticipants > resolvedConfig.maxTilesPerPage && (resolvedConfig.mode === "grid" || resolvedConfig.mode === "fullscreen" || resolvedConfig.mode === "auto" && (Boolean(fullscreenParticipantId) || !hasPriorityParticipants))) {
		const fastPosition = resolvedConfig.paginationConfig?.position || "bottom";
		const fastBufferSize = resolvedConfig.paginationConfig?.bufferSize;
		const fastAdjustedDimensions = adjustDimensionsForPagination(resolvedDimensions, fastPosition, fastBufferSize);
		const fastLayout = calculateLayout(fastAdjustedDimensions);
		if (fastLayout.pagination && fastLayout.pagination.totalPages > 1) {
			const fastResult = applyPaginationOffsets(fastLayout, fastPosition, false, fastBufferSize);
			return {
				result: {
					layout: fastResult,
					adjustedDimensions: fastAdjustedDimensions,
					sortedParticipants,
					willNeedPagination: true,
					isMobile,
					isStageAudienceMode: false
				},
				nextFeedback: finishFeedback(fastResult)
			};
		}
	}
	const initialLayout = calculateLayout(resolvedDimensions);
	if (!(initialLayout.pagination && initialLayout.pagination.totalPages > 1) || resolvedConfig.paginationConfig?.disabled) return {
		result: {
			layout: initialLayout,
			adjustedDimensions: resolvedDimensions,
			sortedParticipants,
			willNeedPagination: false,
			isMobile,
			isStageAudienceMode: resolvedConfig.mode === "stage-audience" || initialLayout.id.includes("stage-audience")
		},
		nextFeedback: finishFeedback(initialLayout)
	};
	const paginationPosition = resolvedConfig.paginationConfig?.position || "bottom";
	const isStageAudienceMode = initialLayout.id.includes("stage-audience");
	const effectivePosition = isStageAudienceMode ? "bottom" : paginationPosition;
	const bufferSize = resolvedConfig.paginationConfig?.bufferSize;
	const adjustedDimensions = adjustDimensionsForPagination(resolvedDimensions, effectivePosition, bufferSize);
	const result = applyPaginationOffsets(calculateLayout(adjustedDimensions), effectivePosition, isStageAudienceMode, bufferSize);
	return {
		result: {
			layout: result,
			adjustedDimensions,
			sortedParticipants,
			willNeedPagination: true,
			isMobile,
			isStageAudienceMode
		},
		nextFeedback: finishFeedback(result)
	};
}
//#endregion
//#region src/hooks/useDeepCompareMemo.ts
/**
* Deep equality comparison for objects and arrays
*/
function deepEqual(a, b) {
	if (a === b) return true;
	if (a === null || a === void 0 || b === null || b === void 0) return false;
	if (typeof a !== typeof b) return false;
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		return a.every((item, index) => deepEqual(item, b[index]));
	}
	if (typeof a === "object" && typeof b === "object") {
		const keysA = Object.keys(a);
		const keysB = Object.keys(b);
		if (keysA.length !== keysB.length) return false;
		return keysA.every((key) => deepEqual(a[key], b[key]));
	}
	return false;
}
/**
* A version of useMemo that uses deep comparison for dependencies
* instead of referential equality. Useful when dependencies are objects
* or arrays that may have the same content but different references.
*
* Referentially-stable deps short-circuit (`a === b`) before any deep walk,
* so passing stable references is free. Two caveats (P4):
* - Dep REFERENCES are stored, so mutating a dep in place is invisible to
*   the comparison — callers must treat participants/config as immutable.
* - Unstable-but-equal references pay one deep walk per render; keep dep
*   objects small or memoize them upstream.
*/
function useDeepCompareMemo(factory, dependencies) {
	const ref = useRef(null);
	if (ref.current === null || !deepEqual(ref.current.deps, dependencies)) ref.current = {
		deps: dependencies,
		value: factory()
	};
	return ref.current.value;
}
//#endregion
//#region src/hooks/useLayoutCalculation.ts
/**
* Thin React wrapper around the pure `computeLayout` pipeline.
*
* Reads the previous committed feedback from a ref during render and commits
* the new feedback in a passive effect — a render React discards (StrictMode
* double-invoke, interrupted concurrent render) can no longer poison sort
* stability or orientation hysteresis.
*/
function useLayoutCalculation({ participants, dimensions, config, currentPage, stageSize, pipCorner, fullscreenParticipantId }) {
	const feedbackRef = useRef(INITIAL_LAYOUT_FEEDBACK);
	const { result, nextFeedback } = useDeepCompareMemo(() => computeLayout({
		participants,
		dimensions,
		config,
		currentPage,
		stageSize,
		pipCorner,
		fullscreenParticipantId
	}, feedbackRef.current), [
		participants,
		dimensions,
		config,
		currentPage,
		stageSize,
		pipCorner,
		fullscreenParticipantId
	]);
	useEffect(() => {
		feedbackRef.current = nextFeedback;
	}, [nextFeedback]);
	return {
		...result,
		feedback: nextFeedback
	};
}
//#endregion
//#region src/utils/dev-warnings.ts
/**
* One-shot development warnings for misconfigured consumers.
*
* These fire for features that fail silently when half-wired (e.g. PiP drag
* enabled but `dragHandlers` never spread). They are skipped entirely in
* production builds.
*/
const warned = /* @__PURE__ */ new Set();
function isProduction() {
	return typeof process !== "undefined" && process.env?.["NODE_ENV"] === "production";
}
/** Log `message` once per `key` per session, outside production builds. */
function devWarnOnce(key, message) {
	if (isProduction() || warned.has(key)) return;
	warned.add(key);
	console.warn(message);
}
//#endregion
//#region src/hooks/useLayoutRenderers.tsx
/** How long to wait after mount before checking feature consumption (dev only). */
const CONSUMPTION_WARNING_DELAY_MS = 2e3;
/**
* Hook that provides render function factories for various UI components.
* This includes dividers, area placeholders, pagination controls, state indicators, and tiles.
*/
function useLayoutRenderers({ layout, dimensions, config, stageSize, isDraggingDivider, dividerPosition, startDividerDrag, isCalculating, totalPages, validPage, goToPage, paginationStyles, isDraggingPip, pipDragOffset, handlePipDragStart, animationSettings, exitingFullscreenId, swipeDragOffset, swipePhase, swipeDirection, adjacentLayout, tileTransitions }) {
	const dragHandlersReadRef = useRef(false);
	const floatingTileRenderedRef = useRef(false);
	const dividerRenderedRef = useRef(false);
	const styleCacheRef = useRef(/* @__PURE__ */ new Map());
	const pipDragEnabled = config.pipConfig?.enableDrag !== false;
	const allowResize = config.stageAudienceConfig?.allowResize === true;
	const hasAudience = Boolean(layout.audience);
	useEffect(() => {
		if (!pipDragEnabled) return;
		const timer = setTimeout(() => {
			if (floatingTileRenderedRef.current && !dragHandlersReadRef.current) devWarnOnce("pip-drag-handlers-unconsumed", "[tile-layouts] pipConfig.enableDrag is on and a floating (PiP) tile was rendered, but no tile render function ever read `tile.dragHandlers` — the PiP tile is not draggable. Spread them onto your tile element (e.g. <div {...tile.dragHandlers}>) or set pipConfig.enableDrag: false.");
		}, CONSUMPTION_WARNING_DELAY_MS);
		return () => clearTimeout(timer);
	}, [pipDragEnabled]);
	useEffect(() => {
		if (!allowResize || !hasAudience) return;
		const timer = setTimeout(() => {
			if (!dividerRenderedRef.current) devWarnOnce("divider-never-rendered", "[tile-layouts] stageAudienceConfig.allowResize is on, but renderDraggableDivider() was never called — the stage/audience split cannot be resized. Render it inside your container, or set allowResize: false.");
		}, CONSUMPTION_WARNING_DELAY_MS);
		return () => clearTimeout(timer);
	}, [allowResize, hasAudience]);
	return {
		renderDraggableDivider: useCallback((options) => {
			dividerRenderedRef.current = true;
			if (!layout.audience) return null;
			const { children, style, disabled, handleSize = DRAGGABLE_DIVIDER.DEFAULT_HANDLE_SIZE } = options || {};
			const isVertical = layout.audience.position === "right" || layout.audience.position === "left";
			const containerSize = isVertical ? dimensions.containerWidth : dimensions.containerHeight;
			const padding = dimensions.padding ?? 0;
			const gap = dimensions.gap ?? 0;
			let calculatedPosition;
			if (layout.audience && isVertical) calculatedPosition = layout.audience.x + padding - gap / 2;
			else if (layout.audience && !isVertical) calculatedPosition = layout.audience.y + padding - gap / 2;
			else calculatedPosition = padding + (containerSize - 2 * padding - gap) * (stageSize / 100) + gap / 2;
			const position = dividerPosition ?? calculatedPosition;
			const handleStart = (clientX, clientY) => {
				if (disabled) return;
				startDividerDrag(position, isVertical ? clientX : clientY, options);
			};
			const dividerHandlers = {
				onMouseDown: (e) => {
					if (disabled) return;
					e.preventDefault();
					handleStart(e.clientX, e.clientY);
				},
				onTouchStart: (e) => {
					if (disabled) return;
					const touch = e.touches[0];
					if (touch) handleStart(touch.clientX, touch.clientY);
				}
			};
			const dividerStyles = {
				position: "absolute",
				cursor: disabled ? "default" : isVertical ? "col-resize" : "row-resize",
				userSelect: "none",
				touchAction: "none",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: Z_INDEX.DRAGGABLE_DIVIDER,
				opacity: disabled ? .5 : 1,
				...style
			};
			if (isVertical) {
				dividerStyles.left = `${position}px`;
				dividerStyles.top = padding;
				dividerStyles.bottom = padding;
				dividerStyles.width = `${handleSize}px`;
				dividerStyles.transform = "translateX(-50%)";
			} else {
				dividerStyles.top = `${position}px`;
				dividerStyles.left = padding;
				dividerStyles.right = padding;
				dividerStyles.height = `${handleSize}px`;
				dividerStyles.transform = "translateY(-50%)";
			}
			const renderProps = {
				dividerStyles,
				dividerHandlers,
				isDragging: isDraggingDivider,
				position,
				orientation: isVertical ? "vertical" : "horizontal"
			};
			if (children) return children(renderProps);
			return /* @__PURE__ */ jsx(DefaultDividerWrapper, {
				dividerHandlers,
				dividerStyles,
				isDragging: isDraggingDivider,
				orientation: isVertical ? "vertical" : "horizontal"
			});
		}, [
			layout.audience,
			dimensions,
			stageSize,
			isDraggingDivider,
			dividerPosition,
			startDividerDrag
		]),
		renderAreaPlaceholders: useCallback((options) => {
			if (!layout.audience) return null;
			const { visible, stageStyle, audienceStyle } = options || {};
			if (!(visible ?? isDraggingDivider)) return null;
			const padding = dimensions.padding ?? 0;
			const gap = dimensions.gap ?? 0;
			const containerWidth = dimensions.containerWidth - 2 * padding;
			const containerHeight = dimensions.containerHeight - 2 * padding;
			let stageWidth;
			let stageHeight;
			if (isDraggingDivider && dividerPosition !== null) if (layout.audience.position === "right") {
				stageWidth = Math.max(0, Math.min(containerWidth - gap, dividerPosition - padding - gap / 2));
				stageHeight = containerHeight;
			} else if (layout.audience.position === "bottom") {
				stageWidth = containerWidth;
				stageHeight = Math.max(0, Math.min(containerHeight - gap, dividerPosition - padding - gap / 2));
			} else {
				stageWidth = containerWidth;
				stageHeight = containerHeight;
			}
			else {
				stageWidth = layout.audience.position === "right" ? containerWidth * (stageSize / 100) - gap / 2 : containerWidth;
				stageHeight = layout.audience.position === "bottom" ? containerHeight * (stageSize / 100) - gap / 2 : containerHeight;
			}
			let audienceLeft;
			let audienceTop;
			let audienceWidth;
			let audienceHeight;
			if (isDraggingDivider && dividerPosition !== null) if (layout.audience.position === "right") {
				audienceLeft = dividerPosition + gap / 2;
				audienceTop = padding;
				audienceWidth = Math.max(0, containerWidth - stageWidth - gap);
				audienceHeight = containerHeight;
			} else if (layout.audience.position === "bottom") {
				audienceLeft = padding;
				audienceTop = dividerPosition + gap / 2;
				audienceWidth = containerWidth;
				audienceHeight = Math.max(0, containerHeight - stageHeight - gap);
			} else {
				audienceLeft = padding;
				audienceTop = padding;
				audienceWidth = containerWidth;
				audienceHeight = containerHeight;
			}
			else {
				audienceLeft = layout.audience.position === "right" ? layout.audience.x : padding;
				audienceTop = layout.audience.position === "bottom" ? layout.audience.y : padding;
				audienceWidth = layout.audience.position === "right" ? layout.audience.width : containerWidth;
				audienceHeight = layout.audience.position === "bottom" ? layout.audience.height : containerHeight;
			}
			return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(AreaPlaceholder, {
				left: padding,
				top: padding,
				width: stageWidth,
				height: stageHeight,
				color: "59, 130, 246",
				label: "Stage",
				style: stageStyle
			}), /* @__PURE__ */ jsx(AreaPlaceholder, {
				left: audienceLeft,
				top: audienceTop,
				width: audienceWidth,
				height: audienceHeight,
				color: "34, 197, 94",
				label: "Audience",
				style: audienceStyle
			})] });
		}, [
			layout.audience,
			dimensions,
			stageSize,
			isDraggingDivider,
			dividerPosition
		]),
		renderPaginationControls: useCallback((options) => {
			if (!paginationStyles || totalPages <= 1) return null;
			const { containerStyle, containerClassName, children, ...dotProps } = options || {};
			return /* @__PURE__ */ jsx("div", {
				className: containerClassName ?? "rounded-full bg-black/70 px-4 py-2 backdrop-blur-sm",
				style: {
					...paginationStyles,
					...containerStyle
				},
				children: children || /* @__PURE__ */ jsx(PaginationDots, {
					currentPage: validPage,
					onPageChange: goToPage,
					totalPages,
					...dotProps
				})
			});
		}, [
			paginationStyles,
			totalPages,
			validPage,
			goToPage
		]),
		renderLayoutStateIndicators: useCallback((options) => {
			const { showDimensions = true, calculatingText = "Calculating layout...", calculatingStyle, dimensionsStyle } = options || {};
			return /* @__PURE__ */ jsxs(Fragment, { children: [isCalculating && /* @__PURE__ */ jsx("div", {
				className: "absolute top-2 right-2 z-10 rounded bg-black/50 px-2 py-1 text-sm text-white",
				style: calculatingStyle,
				children: calculatingText
			}), showDimensions && /* @__PURE__ */ jsxs("div", {
				className: "absolute top-2 left-2 z-10 rounded bg-black/50 px-2 py-1 text-sm text-white",
				style: dimensionsStyle,
				children: [
					dimensions.containerWidth,
					" × ",
					dimensions.containerHeight
				]
			})] });
		}, [isCalculating, dimensions]),
		renderTiles: useCallback((renderFn, options) => {
			const styleMode = options?.styleMode ?? "full";
			const transitionByTile = new Map(tileTransitions.diff.tiles.map((diff) => [diff.participantId, diff]));
			const makeTransition = (diff, phase) => ({
				phase: phase ?? (diff?.change === "entered" ? "entering" : "idle"),
				change: diff?.change ?? "unchanged",
				from: diff?.from ?? null,
				to: diff?.to ?? null,
				trigger: tileTransitions.diff.trigger,
				settings: tileTransitions.settings,
				generation: tileTransitions.generation
			});
			const sortedTiles = [...layout.tiles].sort((a, b) => a.participantId < b.participantId ? -1 : a.participantId > b.participantId ? 1 : 0);
			const styleCache = styleCacheRef.current;
			if (styleCache.size > sortedTiles.length) {
				const liveIds = new Set(sortedTiles.map((tile) => tile.participantId));
				for (const id of styleCache.keys()) if (!liveIds.has(id)) styleCache.delete(id);
			}
			const audienceIds = layout.audience ? new Set(layout.audience.participantIds) : null;
			const result = sortedTiles.map((tile) => {
				const pipOffsetX = isDraggingPip && tile.isFloating ? pipDragOffset.x : 0;
				const pipOffsetY = isDraggingPip && tile.isFloating ? pipDragOffset.y : 0;
				const isSwipeable = !tile.isFloating && (!audienceIds || audienceIds.has(tile.participantId));
				const swipeOffsetX = isSwipeable ? swipeDragOffset : 0;
				const x = tile.x + pipOffsetX + swipeOffsetX;
				const y = tile.y + pipOffsetY;
				const baseStyle = styleMode === "none" ? { ...options?.style } : {
					position: "absolute",
					transform: `translate(${x}px, ${y}px)`,
					width: tile.width,
					height: tile.height,
					contain: "strict",
					...options?.style
				};
				if (styleMode === "full" && config.enableAnimations) if (animationSettings?.enabled ?? true) {
					const duration = animationSettings?.duration ?? config.animationConfig?.duration ?? ANIMATION.DEFAULT_DURATION;
					const easing = animationSettings?.easing ?? config.animationConfig?.easing ?? ANIMATION.DEFAULT_EASING;
					const properties = animationSettings?.properties ?? config.animationConfig?.properties ?? ANIMATION.DEFAULT_PROPERTIES;
					if (!tile.isFloating || tile.isFadingOut || tile.isFadingIn) {
						const change = transitionByTile.get(tile.participantId)?.change ?? "unchanged";
						const isFading = Boolean(tile.isFadingOut || tile.isFadingIn);
						const needed = /* @__PURE__ */ new Set();
						if (change === "moved" || change === "resized") needed.add("transform");
						if (change === "resized") {
							needed.add("width");
							needed.add("height");
						}
						const active = properties.filter((prop) => needed.has(prop));
						if (isFading) active.push("opacity");
						if (active.length > 0) baseStyle.transition = active.map((prop) => `${prop} ${duration}ms ${easing}`).join(", ");
					}
					if (tile.isFadingOut) baseStyle.opacity = 0;
					if (tile.isFadingIn) baseStyle.opacity = 1;
					if (exitingFullscreenId && exitingFullscreenId === tile.participantId) baseStyle.zIndex = 50;
				} else baseStyle.transition = "none";
				if (styleMode === "full" && isSwipeable && swipePhase !== "idle") applySwipeTransition(baseStyle, swipePhase);
				if (tile.isFloating && styleMode !== "none") {
					baseStyle.zIndex = Z_INDEX.OVERLAY + 10;
					if (styleMode !== "full") {} else if (isDraggingPip) {
						baseStyle.cursor = "grabbing";
						baseStyle.opacity = .8;
						baseStyle.transition = "none";
					} else if (!tile.isFadingOut && !tile.isFadingIn) {
						const isEnabled = animationSettings?.enabled ?? true;
						if (config.enableAnimations && isEnabled) baseStyle.transition = `all ${config.animationConfig?.duration ?? ANIMATION.DEFAULT_DURATION}ms ${config.animationConfig?.easing ?? ANIMATION.DEFAULT_EASING}`;
						else baseStyle.transition = "none";
						baseStyle.cursor = config.pipConfig?.enableDrag !== false ? "grab" : "default";
					}
				}
				let style = baseStyle;
				if (styleMode === "full") {
					const cachedStyle = styleCache.get(tile.participantId);
					style = cachedStyle && shallowEqualStyleIgnoringTransition(cachedStyle, baseStyle) ? cachedStyle : baseStyle;
					styleCache.set(tile.participantId, style);
				}
				const layoutTile = {
					...tile,
					key: tile.participantId,
					style,
					className: [options?.className, tile.isFloating && "touch-none"].filter(Boolean).join(" "),
					isDragging: tile.isFloating && isDraggingPip,
					transition: makeTransition(transitionByTile.get(tile.participantId))
				};
				if (tile.isFloating && config.pipConfig?.enableDrag !== false) {
					floatingTileRenderedRef.current = true;
					const dragHandlers = {
						onMouseDown: (e) => handlePipDragStart(e, tile),
						onTouchStart: (e) => handlePipDragStart(e, tile)
					};
					Object.defineProperty(layoutTile, "dragHandlers", {
						enumerable: true,
						configurable: true,
						get() {
							dragHandlersReadRef.current = true;
							return dragHandlers;
						}
					});
				}
				return renderFn(layoutTile);
			});
			if (adjacentLayout && swipeDirection) {
				const pageGap = dimensions.gap ?? 0;
				const adjacentBaseOffset = swipeDirection === "next" ? dimensions.containerWidth + pageGap : -dimensions.containerWidth - pageGap;
				const adjacentAudienceIds = adjacentLayout.audience ? new Set(adjacentLayout.audience.participantIds) : null;
				const adjacentTiles = [...adjacentLayout.tiles].sort((a, b) => a.participantId.localeCompare(b.participantId)).filter((tile) => {
					if (tile.isFloating) return false;
					if (adjacentAudienceIds && !adjacentAudienceIds.has(tile.participantId)) return false;
					return true;
				});
				for (const tile of adjacentTiles) {
					const adjStyle = {
						position: "absolute",
						transform: `translate(${tile.x + swipeDragOffset + adjacentBaseOffset}px, ${tile.y}px)`,
						width: tile.width,
						height: tile.height,
						contain: "strict",
						...options?.style
					};
					applySwipeTransition(adjStyle, swipePhase);
					const layoutTile = {
						...tile,
						key: `adjacent-${tile.participantId}`,
						style: adjStyle,
						className: options?.className || "",
						isDragging: false
					};
					result.push(renderFn(layoutTile));
				}
			}
			for (const exiting of tileTransitions.exitingTiles) {
				const from = exiting.from;
				const exitStyle = styleMode === "none" ? { ...options?.style } : {
					position: "absolute",
					transform: `translate(${from.x}px, ${from.y}px)`,
					width: from.width,
					height: from.height,
					contain: "strict",
					...options?.style
				};
				if (styleMode === "full" && config.enableAnimations) {
					exitStyle.opacity = 0;
					exitStyle.transition = `opacity ${tileTransitions.settings.duration}ms ${tileTransitions.settings.easing}`;
				}
				const layoutTile = {
					participantId: exiting.participantId,
					x: from.x,
					y: from.y,
					width: from.width,
					height: from.height,
					row: 0,
					column: 0,
					key: exiting.participantId,
					style: exitStyle,
					className: options?.className ?? "",
					isDragging: false,
					transition: {
						phase: "exiting",
						change: "exited",
						from,
						to: null,
						trigger: tileTransitions.diff.trigger,
						settings: tileTransitions.settings,
						generation: exiting.generation
					}
				};
				result.push(renderFn(layoutTile));
			}
			return result;
		}, [
			layout.tiles,
			layout.audience,
			config.pipConfig?.enableDrag,
			config.enableAnimations,
			config.animationConfig,
			animationSettings,
			isDraggingPip,
			pipDragOffset,
			handlePipDragStart,
			exitingFullscreenId,
			swipeDragOffset,
			swipePhase,
			swipeDirection,
			adjacentLayout,
			dimensions.containerWidth,
			tileTransitions
		])
	};
}
function AreaPlaceholder({ left, top, width, height, color, label, style }) {
	return /* @__PURE__ */ jsx("div", {
		"aria-hidden": "true",
		role: "presentation",
		style: {
			position: "absolute",
			left,
			top,
			width,
			height,
			backgroundColor: `rgba(${color}, 0.1)`,
			border: `2px dashed rgba(${color}, 0.5)`,
			borderRadius: "8px",
			pointerEvents: "none",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			...style
		},
		children: /* @__PURE__ */ jsx("span", {
			style: {
				color: `rgba(${color}, 0.8)`,
				fontSize: "18px",
				fontWeight: "600",
				textTransform: "uppercase",
				letterSpacing: "0.05em"
			},
			children: label
		})
	});
}
function shallowEqualStyleIgnoringTransition(a, b) {
	const aKeys = Object.keys(a).filter((key) => key !== "transition");
	const bKeys = Object.keys(b).filter((key) => key !== "transition");
	if (aKeys.length !== bKeys.length) return false;
	for (const key of aKeys) if (a[key] !== b[key]) return false;
	return true;
}
function applySwipeTransition(style, phase) {
	if (phase === "dragging") style.transition = "none";
	else if (phase === "snapping") style.transition = `transform ${ANIMATION.DEFAULT_DURATION}ms ${ANIMATION.DEFAULT_EASING}`;
}
function DefaultDividerWrapper({ dividerHandlers, dividerStyles, orientation, isDragging }) {
	return /* @__PURE__ */ jsx("div", {
		...dividerHandlers,
		style: dividerStyles,
		children: renderDefaultDividerHandle(orientation, isDragging)
	});
}
function renderDefaultDividerHandle(orientation, isDragging = false) {
	const isVertical = orientation === "vertical";
	return /* @__PURE__ */ jsx("div", {
		style: {
			width: isVertical ? "24px" : "100%",
			height: isVertical ? "100%" : "24px",
			display: "flex",
			justifyContent: "center",
			alignItems: "center"
		},
		children: /* @__PURE__ */ jsx("div", {
			className: "opacity-0 transition-all duration-200 hover:opacity-100 data-[dragging=true]:opacity-100",
			"data-dragging": isDragging,
			style: {
				width: isVertical ? "6px" : "80px",
				height: isVertical ? "80px" : "6px",
				backgroundColor: isDragging ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)",
				borderRadius: "6px",
				display: "flex",
				flexDirection: isVertical ? "column" : "row",
				justifyContent: "center",
				alignItems: "center",
				gap: "4px",
				transform: isDragging ? "scale(1.1)" : "scale(1)"
			}
		})
	});
}
//#endregion
//#region src/hooks/usePaginationState.ts
/**
* Hook that manages pagination state and styling for layouts with multiple pages.
* Handles page navigation, visibility logic, and positioning calculations.
*/
function usePaginationState({ layout, config, currentPage: externalCurrentPage, setCurrentPage: externalSetCurrentPage }) {
	const [internalCurrentPage, setInternalCurrentPage] = useState(0);
	const currentPage = externalCurrentPage ?? internalCurrentPage;
	const setCurrentPage = externalSetCurrentPage ?? setInternalCurrentPage;
	const totalPages = layout.pagination?.totalPages ?? 1;
	const canGoNext = currentPage < totalPages - 1;
	const canGoPrevious = currentPage > 0;
	const validPage = Math.min(currentPage, Math.max(0, totalPages - 1));
	return {
		currentPage: validPage,
		totalPages,
		canGoNext,
		canGoPrevious,
		validPage,
		goToPage: useCallback((page) => {
			const clampedPage = Math.max(0, Math.min(page, totalPages - 1));
			setCurrentPage(clampedPage);
		}, [totalPages, setCurrentPage]),
		nextPage: useCallback(() => {
			if (canGoNext) if (externalSetCurrentPage) setCurrentPage(currentPage + 1);
			else setCurrentPage((prev) => prev + 1);
		}, [
			canGoNext,
			setCurrentPage,
			externalSetCurrentPage,
			currentPage
		]),
		previousPage: useCallback(() => {
			if (canGoPrevious) if (externalSetCurrentPage) setCurrentPage(currentPage - 1);
			else setCurrentPage((prev) => prev - 1);
		}, [
			canGoPrevious,
			setCurrentPage,
			externalSetCurrentPage,
			currentPage
		]),
		paginationStyles: useMemo(() => {
			if (!layout.pagination || totalPages <= 1) return;
			const paginationPosition = config.paginationConfig?.position || "bottom";
			const baseStyle = {
				position: "absolute",
				zIndex: Z_INDEX.OVERLAY
			};
			if (layout.audience) {
				const audience = layout.audience;
				const audiencePosition = audience.position;
				if (layout.pagination.position === "right") return {
					...baseStyle,
					right: UI_POSITIONING.PAGINATION_BOTTOM_OFFSET,
					top: audience.y + audience.height / 2,
					transform: "translateY(50%)"
				};
				if (audiencePosition === "right") return {
					...baseStyle,
					bottom: UI_POSITIONING.PAGINATION_BOTTOM_OFFSET,
					left: audience.x + audience.width / 2,
					transform: "translateX(-50%)"
				};
				if (audiencePosition === "left") return {
					...baseStyle,
					bottom: UI_POSITIONING.PAGINATION_BOTTOM_OFFSET,
					left: audience.x + audience.width / 2,
					transform: "translateX(-50%)"
				};
				if (audiencePosition === "bottom") return {
					...baseStyle,
					bottom: UI_POSITIONING.PAGINATION_BOTTOM_OFFSET,
					left: audience.x + audience.width / 2,
					transform: "translateX(-50%)"
				};
				if (audiencePosition === "top") return {
					...baseStyle,
					bottom: UI_POSITIONING.PAGINATION_BOTTOM_OFFSET,
					left: audience.x + audience.width / 2,
					transform: "translateX(-50%)"
				};
				return {
					...baseStyle,
					bottom: UI_POSITIONING.PAGINATION_BOTTOM_OFFSET,
					left: audience.x + audience.width / 2,
					transform: "translateX(-50%)"
				};
			}
			switch (paginationPosition) {
				case "bottom": return {
					...baseStyle,
					bottom: UI_POSITIONING.PAGINATION_BOTTOM_OFFSET,
					left: "50%",
					transform: "translateX(-50%)"
				};
				case "top": return {
					...baseStyle,
					top: UI_POSITIONING.PAGINATION_BOTTOM_OFFSET,
					left: "50%",
					transform: "translateX(-50%)"
				};
				case "left": return {
					...baseStyle,
					left: UI_POSITIONING.PAGINATION_BOTTOM_OFFSET,
					top: "50%",
					transform: "translateY(-50%)"
				};
				case "right": return {
					...baseStyle,
					right: UI_POSITIONING.PAGINATION_BOTTOM_OFFSET,
					top: "50%",
					transform: "translateY(-50%)"
				};
				default: return {
					...baseStyle,
					bottom: UI_POSITIONING.PAGINATION_BOTTOM_OFFSET,
					left: "50%",
					transform: "translateX(-50%)"
				};
			}
		}, [
			layout.pagination,
			totalPages,
			config.paginationConfig?.position,
			layout.audience
		]),
		isPaginationVisible: useMemo(() => {
			if (!layout.pagination || totalPages <= 1) return false;
			return true;
		}, [layout.pagination, totalPages]),
		setContainerHovered: useCallback(() => {}, [])
	};
}
//#endregion
//#region src/hooks/usePipDrag.ts
/**
* Hook that manages Picture-in-Picture tile dragging functionality.
* Handles drag state, position tracking, and corner snapping logic.
*/
function usePipDrag({ config, dimensions, setPipCorner, tiles }) {
	const [isDraggingPip, setIsDraggingPip] = useState(false);
	const [pipDragStart, setPipDragStart] = useState(null);
	const [pipDragOffset, setPipDragOffset] = useState({
		x: 0,
		y: 0
	});
	const handlePipDragStart = useCallback((e, tile) => {
		if (config.pipConfig?.enableDrag === false) return;
		const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
		const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
		setIsDraggingPip(true);
		setPipDragStart({
			x: clientX - tile.x,
			y: clientY - tile.y
		});
		setPipDragOffset({
			x: 0,
			y: 0
		});
		e.preventDefault();
	}, [config.pipConfig?.enableDrag]);
	const handlePipDragMove = useCallback((e) => {
		if (!(isDraggingPip && pipDragStart)) return;
		const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
		const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
		const floatingTile = tiles.find((t) => t.isFloating);
		if (!floatingTile) return;
		setPipDragOffset({
			x: clientX - pipDragStart.x - floatingTile.x,
			y: clientY - pipDragStart.y - floatingTile.y
		});
	}, [
		isDraggingPip,
		pipDragStart,
		tiles
	]);
	const handlePipDragEnd = useCallback(() => {
		if (!isDraggingPip) return;
		const floatingTile = tiles.find((t) => t.isFloating);
		if (!floatingTile) return;
		const finalX = floatingTile.x + pipDragOffset.x;
		const finalY = floatingTile.y + pipDragOffset.y;
		const centerX = finalX + floatingTile.width / 2;
		const centerY = finalY + floatingTile.height / 2;
		const containerCenterX = dimensions.containerWidth / 2;
		const containerCenterY = dimensions.containerHeight / 2;
		let newCorner;
		if (centerX < containerCenterX && centerY < containerCenterY) newCorner = "top-left";
		else if (centerX >= containerCenterX && centerY < containerCenterY) newCorner = "top-right";
		else if (centerX < containerCenterX && centerY >= containerCenterY) newCorner = "bottom-left";
		else newCorner = "bottom-right";
		setPipCorner(newCorner);
		setIsDraggingPip(false);
		setPipDragStart(null);
		setPipDragOffset({
			x: 0,
			y: 0
		});
	}, [
		isDraggingPip,
		pipDragOffset,
		tiles,
		dimensions,
		setPipCorner
	]);
	useEffect(() => {
		if (!isDraggingPip) return;
		window.addEventListener("mousemove", handlePipDragMove);
		window.addEventListener("mouseup", handlePipDragEnd);
		window.addEventListener("touchmove", handlePipDragMove);
		window.addEventListener("touchend", handlePipDragEnd);
		return () => {
			window.removeEventListener("mousemove", handlePipDragMove);
			window.removeEventListener("mouseup", handlePipDragEnd);
			window.removeEventListener("touchmove", handlePipDragMove);
			window.removeEventListener("touchend", handlePipDragEnd);
		};
	}, [
		isDraggingPip,
		handlePipDragMove,
		handlePipDragEnd
	]);
	return {
		isDraggingPip,
		pipDragOffset,
		handlePipDragStart
	};
}
//#endregion
//#region src/hooks/useStageAudienceState.ts
const SIGNIFICANT_CHANGE_THRESHOLD = .001;
/**
* Hook that manages stage size state for stage-audience layouts.
* Handles automatic optimal size calculations and manual adjustments.
*/
function useStageAudienceState({ config, dimensions, participants }) {
	const minStagePercent = config.stageAudienceConfig?.minStagePercent ?? SIZE_RATIOS.STAGE.MIN * 100;
	const maxStagePercent = config.stageAudienceConfig?.maxStagePercent ?? SIZE_RATIOS.STAGE.MAX * 100;
	const initialStageSize = config.stageAudienceConfig?.stageSize ?? SIZE_RATIOS.STAGE.DEFAULT * 100;
	const [stageSize, setInternalStageSize] = useState(Math.max(minStagePercent, Math.min(maxStagePercent, initialStageSize)));
	const prevDimensionsRef = useRef({
		width: 0,
		height: 0
	});
	const prevParticipantsRef = useRef({
		stageCount: 0,
		audienceCount: 0,
		aspectRatios: /* @__PURE__ */ new Map()
	});
	const hasManualAdjustmentRef = useRef(false);
	const setStageSize = useCallback((size, isManualAdjustment = false) => {
		const minPercent = config.stageAudienceConfig?.minStagePercent ?? SIZE_RATIOS.STAGE.MIN * 100;
		const maxPercent = config.stageAudienceConfig?.maxStagePercent ?? SIZE_RATIOS.STAGE.MAX * 100;
		setInternalStageSize(Math.max(minPercent, Math.min(maxPercent, size)));
		if (isManualAdjustment) hasManualAdjustmentRef.current = true;
	}, [config.stageAudienceConfig?.minStagePercent, config.stageAudienceConfig?.maxStagePercent]);
	useEffect(() => {
		if (config.stageAudienceConfig?.stageSize !== void 0) {
			setStageSize(config.stageAudienceConfig.stageSize);
			hasManualAdjustmentRef.current = false;
		}
	}, [config.stageAudienceConfig?.stageSize, setStageSize]);
	useEffect(() => {
		hasManualAdjustmentRef.current = false;
	}, [config.mode]);
	useEffect(() => {
		if (config.mode !== "stage-audience" && config.mode !== "auto") return;
		const prevWidth = prevDimensionsRef.current.width;
		const prevHeight = prevDimensionsRef.current.height;
		const hasValidDimensions = prevWidth > 0 && prevHeight > 0;
		const { stage: stageParticipants, audience: audienceParticipants } = getStageParticipants(participants);
		if (stageParticipants.length === 0 && audienceParticipants.length === 0) return;
		let isSignificantResize = false;
		if (hasValidDimensions) {
			const widthChange = Math.abs(dimensions.containerWidth - prevWidth) / prevWidth;
			const heightChange = Math.abs(dimensions.containerHeight - prevHeight) / prevHeight;
			isSignificantResize = widthChange > SIGNIFICANT_CHANGE_THRESHOLD || heightChange > SIGNIFICANT_CHANGE_THRESHOLD;
		}
		const prevStageCount = prevParticipantsRef.current.stageCount;
		const prevAudienceCount = prevParticipantsRef.current.audienceCount;
		const prevAspectRatios = prevParticipantsRef.current.aspectRatios;
		const hasCountChanges = stageParticipants.length !== prevStageCount || audienceParticipants.length !== prevAudienceCount;
		const allParticipants = [...stageParticipants, ...audienceParticipants];
		const hasAspectRatioChanges = allParticipants.some((p) => {
			const prevRatio = prevAspectRatios.get(p.id);
			const currentRatio = p.aspectRatio;
			if (currentRatio !== void 0 && prevRatio === void 0) return true;
			if (currentRatio === void 0 && prevRatio !== void 0) return true;
			if (currentRatio !== void 0 && prevRatio !== void 0) return Math.abs(currentRatio - prevRatio) / prevRatio > .01;
			return false;
		});
		const hasParticipantChanges = hasCountChanges || hasAspectRatioChanges;
		if (hasAspectRatioChanges) console.log("[useStageAudienceState] Aspect ratio changes detected:", { participants: allParticipants.map((p) => ({
			id: p.id,
			current: p.aspectRatio,
			previous: prevAspectRatios.get(p.id)
		})) });
		const shouldRecalculate = !hasValidDimensions || isSignificantResize || hasParticipantChanges;
		if (hasParticipantChanges) {
			const bounds = calculateStageBounds({
				dimensions,
				isVertical: (dimensions.containerWidth - 2 * (dimensions.padding ?? 16)) / (dimensions.containerHeight - 2 * (dimensions.padding ?? 16)) < .8,
				config: config.stageAudienceConfig,
				participantCounts: {
					stage: stageParticipants.length,
					audience: audienceParticipants.length
				},
				context: "participant-change-validation"
			});
			const clampedSize = clampStageSize(stageSize, bounds, "participant-change");
			if (clampedSize !== stageSize) setStageSize(clampedSize);
		}
		const hasUserAdjusted = config.stageAudienceConfig?.allowResize === true && hasManualAdjustmentRef.current;
		if (shouldRecalculate && !hasUserAdjusted) {
			const hasScreenShare = stageParticipants.some((p) => p.isScreenShare);
			const minStagePct = config.stageAudienceConfig?.minStagePercent ?? SIZE_RATIOS.STAGE.MIN * 100;
			const maxStagePct = config.stageAudienceConfig?.maxStagePercent ?? SIZE_RATIOS.STAGE.MAX * 100;
			const optimalSize = calculateOptimalStageSize({
				stageParticipantCount: stageParticipants.length,
				audienceParticipantCount: audienceParticipants.length,
				containerWidth: dimensions.containerWidth,
				containerHeight: dimensions.containerHeight,
				hasScreenShare,
				minStagePercent: minStagePct,
				maxStagePercent: maxStagePct,
				stageParticipants
			});
			setStageSize(optimalSize);
		}
		prevDimensionsRef.current = {
			width: dimensions.containerWidth,
			height: dimensions.containerHeight
		};
		const currentAspectRatios = /* @__PURE__ */ new Map();
		for (const p of allParticipants) if (p.aspectRatio !== void 0) currentAspectRatios.set(p.id, p.aspectRatio);
		prevParticipantsRef.current = {
			stageCount: stageParticipants.length,
			audienceCount: audienceParticipants.length,
			aspectRatios: currentAspectRatios
		};
	}, [
		dimensions,
		participants,
		config.mode,
		config.stageAudienceConfig,
		setStageSize,
		stageSize
	]);
	return {
		stageSize,
		setStageSize
	};
}
//#endregion
//#region src/hooks/useSwipeGestures.ts
/**
* Hook that manages swipe gesture functionality for mobile pagination.
* Implements a three-phase state machine (idle → dragging → snapping → idle)
* with real-time drag offset tracking for carousel-style swipe animations.
*
* During dragging and snapping, both the current page and the adjacent page
* should be rendered simultaneously — the swipe direction tells the renderer
* which adjacent page to show and where to place it.
*/
function useSwipeGestures({ totalPages, canGoNext, canGoPrevious, nextPage, previousPage, containerWidth, gap }) {
	const swipeStartRef = useRef(null);
	const [swipePhase, setSwipePhase] = useState("idle");
	const [swipeDragOffset, setSwipeDragOffset] = useState(0);
	const [swipeDirection, setSwipeDirection] = useState(null);
	const snapTimeoutRef = useRef(null);
	const directionLockedRef = useRef(false);
	useEffect(() => {
		return () => {
			if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
		};
	}, []);
	const resetToIdle = useCallback(() => {
		setSwipePhase("idle");
		setSwipeDragOffset(0);
		setSwipeDirection(null);
		swipeStartRef.current = null;
		directionLockedRef.current = false;
	}, []);
	const handleSwipeStart = useCallback((clientX, clientY) => {
		if (totalPages <= 1) return;
		if (swipePhase === "snapping") return;
		swipeStartRef.current = {
			x: clientX,
			y: clientY,
			time: Date.now()
		};
		directionLockedRef.current = false;
		setSwipePhase("dragging");
		setSwipeDragOffset(0);
		setSwipeDirection(null);
	}, [totalPages, swipePhase]);
	const handleSwipeMove = useCallback((clientX, clientY) => {
		if (!swipeStartRef.current || swipePhase !== "dragging") return;
		const deltaX = clientX - swipeStartRef.current.x;
		const deltaY = clientY - swipeStartRef.current.y;
		if (!directionLockedRef.current) {
			if (Math.abs(deltaX) < 5 && Math.abs(deltaY) < 5) return;
			if (Math.abs(deltaY) > Math.abs(deltaX)) {
				resetToIdle();
				return;
			}
			directionLockedRef.current = true;
		}
		let offset = deltaX;
		if (deltaX > 0 && !canGoPrevious) offset = deltaX * SWIPE.RUBBER_BAND_FACTOR;
		else if (deltaX < 0 && !canGoNext) offset = deltaX * SWIPE.RUBBER_BAND_FACTOR;
		setSwipeDirection(deltaX < 0 ? "next" : "previous");
		setSwipeDragOffset(offset);
	}, [
		swipePhase,
		canGoNext,
		canGoPrevious,
		resetToIdle
	]);
	const handleSwipeEnd = useCallback((clientX) => {
		if (!swipeStartRef.current || swipePhase !== "dragging") return;
		const deltaX = clientX - swipeStartRef.current.x;
		const deltaTime = Date.now() - swipeStartRef.current.time;
		const velocity = Math.abs(deltaX) / deltaTime;
		const isValidSwipe = Math.abs(deltaX) > SWIPE.MIN_DISTANCE && (deltaTime < SWIPE.MAX_TIME || velocity > SWIPE.VELOCITY_THRESHOLD);
		const snapDuration = ANIMATION.DEFAULT_DURATION;
		if (isValidSwipe && (deltaX > 0 && canGoPrevious || deltaX < 0 && canGoNext)) {
			const snapDistance = containerWidth + gap;
			const targetOffset = deltaX < 0 ? -snapDistance : snapDistance;
			setSwipePhase("snapping");
			setSwipeDragOffset(targetOffset);
			snapTimeoutRef.current = setTimeout(() => {
				if (deltaX < 0) nextPage();
				else previousPage();
				resetToIdle();
			}, snapDuration);
		} else {
			setSwipePhase("snapping");
			setSwipeDragOffset(0);
			snapTimeoutRef.current = setTimeout(() => {
				resetToIdle();
			}, snapDuration);
		}
	}, [
		swipePhase,
		canGoNext,
		canGoPrevious,
		nextPage,
		previousPage,
		containerWidth,
		gap,
		resetToIdle
	]);
	return {
		swipeHandlers: useMemo(() => {
			if (totalPages <= 1) return {};
			return {
				onTouchStart: (e) => {
					const touch = e.touches[0];
					if (touch) handleSwipeStart(touch.clientX, touch.clientY);
				},
				onTouchMove: (e) => {
					const touch = e.touches[0];
					if (touch) handleSwipeMove(touch.clientX, touch.clientY);
				},
				onTouchEnd: (e) => {
					const touch = e.changedTouches[0];
					if (touch) handleSwipeEnd(touch.clientX);
				}
			};
		}, [
			totalPages,
			handleSwipeStart,
			handleSwipeMove,
			handleSwipeEnd
		]),
		swipeDragOffset,
		swipePhase,
		swipeDirection
	};
}
//#endregion
//#region src/utils/device-detection.ts
/**
* Detects if the current device has touch capabilities.
* This is primarily used for enabling/disabling swipe gestures and touch-specific interactions.
*
* Note: This is a one-time detection that runs when called. It does not track changes
* to touch capability (which is rare outside of browser DevTools).
*
* @returns true if the device supports touch input, false otherwise
*/
function isTouchDevice() {
	if (typeof window === "undefined") return false;
	return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}
//#endregion
//#region src/utils/tile-transitions.ts
/** Position/size deltas at or below this many pixels are float noise, not motion. */
const DEFAULT_TRANSITION_EPSILON = .5;
/** Default bound on how many exiting tiles are retained at once. */
const DEFAULT_MAX_EXITING_TILES = 8;
function rectOf(tile) {
	return {
		x: tile.x,
		y: tile.y,
		width: tile.width,
		height: tile.height
	};
}
/**
* Layout-level trigger detection. This is the logic that used to live in
* `animationContext.detectAnimationTrigger`; that export is now a wrapper
* around this function and its semantics are unchanged.
*/
function detectTrigger(current, previous, isResizing, isDraggingDivider) {
	if (!previous) return "initial";
	if (isDraggingDivider || previous.stageSize !== current.stageSize) return "stageSizeChange";
	if (isResizing || previous.dimensionWidth !== current.dimensionWidth || previous.dimensionHeight !== current.dimensionHeight) return "resize";
	if (previous.layoutId !== current.layoutId) return "modeChange";
	if (!previous.hasScreenShare && current.hasScreenShare) return "screenShareStart";
	if (previous.hasScreenShare && !current.hasScreenShare) return "screenShareEnd";
	if (previous.participantCount < current.participantCount) return "participantJoined";
	if (previous.participantCount > current.participantCount) return "participantLeft";
	for (const id of current.participantIds) if (!previous.participantIds.has(id)) return "participantChange";
	return "participantChange";
}
/**
* Diff two layout snapshots into per-tile enter/exit/move/resize changes.
*
* A tile whose size changed is `resized` (even if it also moved — the
* `from`/`to` rects carry the full geometry); a tile whose position alone
* changed is `moved`. On the initial snapshot (no previous) every tile is
* `entered` with `trigger: "initial"` so consumers can opt out of animating
* first paint.
*/
function diffLayout(current, previous, options = {}) {
	const epsilon = options.epsilon ?? .5;
	const trigger = detectTrigger(current, previous, options.isResizing ?? false, options.isDraggingDivider ?? false);
	const previousTiles = new Map((previous?.tiles ?? []).map((tile) => [tile.participantId, tile]));
	const tiles = [];
	const byChange = {
		entered: [],
		exited: [],
		moved: [],
		resized: [],
		unchanged: []
	};
	const push = (diff) => {
		tiles.push(diff);
		byChange[diff.change].push(diff.participantId);
	};
	const seen = /* @__PURE__ */ new Set();
	for (const tile of current.tiles) {
		seen.add(tile.participantId);
		const to = rectOf(tile);
		const prevTile = previousTiles.get(tile.participantId);
		if (!prevTile) {
			push({
				participantId: tile.participantId,
				change: "entered",
				from: null,
				to
			});
			continue;
		}
		const from = rectOf(prevTile);
		const resized = Math.abs(from.width - to.width) > epsilon || Math.abs(from.height - to.height) > epsilon;
		const moved = Math.abs(from.x - to.x) > epsilon || Math.abs(from.y - to.y) > epsilon;
		const change = resized ? "resized" : moved ? "moved" : "unchanged";
		push({
			participantId: tile.participantId,
			change,
			from,
			to
		});
	}
	for (const prevTile of previous?.tiles ?? []) if (!seen.has(prevTile.participantId)) push({
		participantId: prevTile.participantId,
		change: "exited",
		from: rectOf(prevTile),
		to: null
	});
	return {
		trigger,
		tiles,
		...byChange
	};
}
const INITIAL_TILE_PRESENCE = {
	generation: 0,
	exiting: []
};
/**
* Fold a layout diff into the exit-retention state. Newly exited tiles are
* retained (newest first); tiles that re-entered stop exiting immediately.
* Callers drop a tile via `removeExitedTiles` once its exit animation ends.
*/
function advancePresence(presence, diff, options = {}) {
	const maxExitingTiles = options.maxExitingTiles ?? 8;
	const generation = presence.generation + 1;
	const currentIds = new Set(diff.tiles.filter((tile) => tile.change !== "exited").map((tile) => tile.participantId));
	const newlyExited = [];
	for (const tile of diff.tiles) if (tile.change === "exited" && tile.from) newlyExited.push({
		participantId: tile.participantId,
		from: tile.from,
		generation
	});
	const newlyExitedIds = new Set(newlyExited.map((tile) => tile.participantId));
	const kept = presence.exiting.filter((tile) => !currentIds.has(tile.participantId) && !newlyExitedIds.has(tile.participantId));
	return {
		generation,
		exiting: [...newlyExited, ...kept].slice(0, maxExitingTiles)
	};
}
/** Drop tiles whose exit animation has finished. */
function removeExitedTiles(presence, participantIds) {
	if (participantIds.length === 0) return presence;
	const ids = new Set(participantIds);
	const exiting = presence.exiting.filter((tile) => !ids.has(tile.participantId));
	if (exiting.length === presence.exiting.length) return presence;
	return {
		...presence,
		exiting
	};
}
//#endregion
//#region src/utils/animationContext.ts
/**
* Creates a snapshot of the current layout state for change detection
*/
function createLayoutSnapshot(participants, dimensions, layoutId, stageSize, tiles, currentPage) {
	return {
		participantIds: new Set(participants.map((p) => p.id)),
		participantCount: participants.length,
		hasScreenShare: participants.some((p) => p.isScreenSharing || p.isScreenShare),
		dimensionWidth: dimensions.containerWidth,
		dimensionHeight: dimensions.containerHeight,
		currentPage,
		layoutId,
		stageSize,
		tiles
	};
}
/**
* Detects what type of change triggered a layout recalculation
* by comparing the current state with the previous snapshot.
*
* The detection logic lives in `tile-transitions.detectTrigger` (where the
* per-tile diffing shares it); this wrapper keeps the historical export and
* its semantics unchanged.
*/
function detectAnimationTrigger(current, previous, isResizing, isDraggingDivider) {
	return detectTrigger(current, previous, isResizing, isDraggingDivider);
}
/**
* Resolves the animation settings for a given trigger, merging defaults
* with global config and trigger-specific overrides.
*/
function resolveAnimationSettings(trigger, config) {
	if (config.enableAnimations === false) return {
		enabled: false,
		duration: 0,
		easing: "linear",
		properties: []
	};
	const triggerDefaults = ANIMATION.TRIGGER_DEFAULTS[trigger] ?? ANIMATION.TRIGGER_DEFAULTS.resize;
	const globalConfig = config.animationConfig ?? {};
	const triggerConfig = globalConfig.triggers?.[trigger] ?? {};
	return {
		enabled: triggerConfig.enabled ?? globalConfig.enabled ?? triggerDefaults.enabled,
		duration: triggerConfig.duration ?? globalConfig.duration ?? triggerDefaults.duration,
		easing: triggerConfig.easing ?? globalConfig.easing ?? triggerDefaults.easing,
		properties: triggerConfig.properties ?? globalConfig.properties ?? [...ANIMATION.DEFAULT_PROPERTIES]
	};
}
/**
* Creates an animation context by detecting the trigger and resolving settings.
* This is a convenience function that combines detection and resolution.
*/
function createAnimationContext(current, previous, config, isResizing, isDraggingDivider) {
	const trigger = detectAnimationTrigger(current, previous, isResizing, isDraggingDivider);
	return {
		trigger,
		settings: resolveAnimationSettings(trigger, config)
	};
}
//#endregion
//#region src/hooks/useTileTransitions.ts
/**
* Headless per-tile transition state for the hook layer.
*
* Owns the layout snapshot diffing (replacing the useMemo that wrote
* `prevSnapshotRef` during render — a side effect that double-executed under
* StrictMode and diffed current against current) and, when exit retention is
* enabled, the presence machine plus exit timers.
*
* Exit removal is timer-based, not `transitionend`-based: under
* `styleMode: "none"` the library emits no transition, so `transitionend`
* would never fire and exited tiles would leak.
*/
function useTileTransitions({ layout, participants, dimensions, stageSize, currentPage, isResizing, isDraggingDivider, swipePhase, config }) {
	const exitRetention = config.tileTransitions?.exitRetention === true;
	const maxExitingTiles = config.tileTransitions?.maxExitingTiles;
	const prevSnapshotRef = useRef(null);
	const currentSnapshot = useMemo(() => createLayoutSnapshot(participants, dimensions, layout.id, stageSize, layout.tiles, currentPage), [
		participants,
		dimensions,
		layout.id,
		layout.tiles,
		stageSize,
		currentPage
	]);
	const diff = useMemo(() => diffLayout(currentSnapshot, prevSnapshotRef.current, {
		isResizing,
		isDraggingDivider
	}), [
		currentSnapshot,
		isResizing,
		isDraggingDivider
	]);
	useEffect(() => {
		prevSnapshotRef.current = currentSnapshot;
	}, [currentSnapshot]);
	const animationSettings = useMemo(() => resolveAnimationSettings(diff.trigger, config), [diff.trigger, config]);
	const [presence, setPresence] = useState(INITIAL_TILE_PRESENCE);
	useEffect(() => {
		if (!exitRetention) return;
		if (swipePhase !== "idle") return;
		setPresence((prev) => {
			const next = advancePresence(prev, diff, { maxExitingTiles });
			return prev.exiting.length === 0 && next.exiting.length === 0 ? prev : next;
		});
	}, [
		diff,
		exitRetention,
		swipePhase,
		maxExitingTiles
	]);
	const commitExit = useCallback((participantIds) => {
		setPresence((prev) => removeExitedTiles(prev, participantIds));
	}, []);
	const exitTimersRef = useRef(/* @__PURE__ */ new Map());
	const exitDurationMs = config.animationConfig?.duration ?? ANIMATION.TRIGGER_DEFAULTS.participantLeft.duration;
	useEffect(() => {
		if (!exitRetention) return;
		const timers = exitTimersRef.current;
		for (const tile of presence.exiting) if (!timers.has(tile.participantId)) {
			const timer = setTimeout(() => {
				timers.delete(tile.participantId);
				commitExit([tile.participantId]);
			}, exitDurationMs);
			timers.set(tile.participantId, timer);
		}
		for (const [id, timer] of timers) if (!presence.exiting.some((tile) => tile.participantId === id)) {
			clearTimeout(timer);
			timers.delete(id);
		}
	}, [
		presence,
		exitRetention,
		exitDurationMs,
		commitExit
	]);
	useEffect(() => () => {
		exitTimersRef.current.forEach((timer) => clearTimeout(timer));
		exitTimersRef.current.clear();
	}, []);
	const getPreviousTiles = useCallback(() => prevSnapshotRef.current?.tiles ?? null, []);
	return {
		diff,
		animationTrigger: diff.trigger,
		animationSettings,
		exitingTiles: exitRetention ? presence.exiting : [],
		generation: presence.generation,
		commitExit,
		getPreviousTiles
	};
}
//#endregion
//#region src/hooks/useTileLayout.tsx
/**
* Helper to check if the input is a ref object
*/
function isRefObject(input) {
	return input !== null && typeof input === "object" && "current" in input;
}
function getPageTileIds(allTileIds, page, pageSize) {
	if (page < 0 || pageSize <= 0) return [];
	const startIndex = page * pageSize;
	return allTileIds.slice(startIndex, startIndex + pageSize);
}
function createTileVisibilityWindow(input) {
	const allTileIds = input.sortedParticipants.map((participant) => participant.id);
	const allTileIdSet = new Set(allTileIds);
	const visibleTileIds = input.layout.tiles.map((tile) => tile.participantId);
	const visibleTileIdSet = new Set(visibleTileIds);
	const adjacentTileIds = [];
	const adjacentTileIdSet = /* @__PURE__ */ new Set();
	const addAdjacentTileIds = (tileIds) => {
		for (const tileId of tileIds) {
			if (!allTileIdSet.has(tileId) || visibleTileIdSet.has(tileId) || adjacentTileIdSet.has(tileId)) continue;
			adjacentTileIdSet.add(tileId);
			adjacentTileIds.push(tileId);
		}
	};
	const pagination = input.layout.pagination;
	const pageSize = pagination?.pageSize ?? Math.max(1, pagination?.currentPageParticipantIds.length ?? 0);
	if (pagination && pageSize > 0) {
		if (pagination.currentPage > 0) addAdjacentTileIds(getPageTileIds(pagination.allParticipantIds, pagination.currentPage - 1, pageSize));
		if (pagination.currentPage < pagination.totalPages - 1) addAdjacentTileIds(getPageTileIds(pagination.allParticipantIds, pagination.currentPage + 1, pageSize));
	}
	return {
		allTileIds,
		visibleTileIds,
		adjacentTileIds,
		exitingTileIds: [...input.exitingTileIds]
	};
}
/**
* Internal hook for tracking container dimensions via ResizeObserver
*/
function useContainerDimensions(containerRef, config) {
	const gap = config.gap ?? SPACING.DEFAULT_GAP;
	const padding = config.padding ?? SPACING.DEFAULT_PADDING;
	const debounceMs = config.debounceMs ?? PERFORMANCE.DEFAULT_DEBOUNCE_MS;
	const [dimensions, setDimensions] = useState({
		containerWidth: 0,
		containerHeight: 0,
		gap,
		padding
	});
	const [isResizing, setIsResizing] = useState(true);
	const resizeTimeoutRef = useRef(null);
	const hasMeasuredRef = useRef(false);
	useEffect(() => {
		const element = containerRef?.current;
		if (!element) return;
		let latestEntry;
		const observer = new ResizeObserver((entries) => {
			latestEntry = entries[0];
			if (!hasMeasuredRef.current && latestEntry) {
				hasMeasuredRef.current = true;
				const { width, height } = latestEntry.contentRect;
				setDimensions((prev) => ({
					...prev,
					containerWidth: width,
					containerHeight: height
				}));
				setIsResizing(false);
				return;
			}
			setIsResizing(true);
			if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
			resizeTimeoutRef.current = setTimeout(() => {
				if (!latestEntry) return;
				const { width, height } = latestEntry.contentRect;
				setDimensions((prev) => ({
					...prev,
					containerWidth: width,
					containerHeight: height
				}));
				setTimeout(() => setIsResizing(false), 10);
			}, debounceMs);
		});
		observer.observe(element);
		return () => {
			observer.disconnect();
			if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
		};
	}, [containerRef, debounceMs]);
	useEffect(() => {
		setDimensions((prev) => ({
			...prev,
			gap,
			padding
		}));
	}, [gap, padding]);
	return {
		dimensions,
		isResizing
	};
}
/**
* React hook for calculating tile layouts for video conferencing applications.
* Handles various layout modes, pagination, and responsive design.
*
* This is the main composing hook that uses the modular hook architecture.
* It combines focused hooks for layout calculation, drag interactions, state management,
* and UI rendering to provide a complete solution while maintaining separation of concerns.
*
* @param participants - Array of participants to layout
* @param container - Either a ref to the container element (recommended) or explicit dimensions
* @param config - Layout configuration including mode, constraints, gap, and padding
* @returns Layout calculation result with tiles, pagination, and helper functions
*
* @example
* ```tsx
* // Recommended: Pass a ref to automatically track container dimensions
* const containerRef = useRef<HTMLDivElement>(null);
* const { layout, isCalculating } = useTileLayout(participants, containerRef, {
*   mode: 'auto',
*   maxTilesPerPage: 25,
* });
*
* return <div ref={containerRef}>...</div>;
* ```
*
* @example
* ```tsx
* // Alternative: Pass explicit dimensions (useful for testing or SSR)
* const { layout } = useTileLayout(
*   participants,
*   { containerWidth: 1920, containerHeight: 1080, gap: 8, padding: 16 },
*   { mode: 'grid' }
* );
* ```
*/
function useTileLayout(participants, container, config = {}) {
	const containerRef = isRefObject(container) ? container : void 0;
	const explicitDimensions = isRefObject(container) ? void 0 : container;
	const { dimensions: trackedDimensions, isResizing: isTrackingResize } = useContainerDimensions(containerRef, config);
	const aspectRatiosRef = useRef(/* @__PURE__ */ new Map());
	const [aspectRatioVersion, bumpAspectRatioVersion] = useReducer((version) => version + 1, 0);
	const processedParticipants = useMemo(() => {
		if (aspectRatiosRef.current.size === 0) return participants;
		return participants.map((p) => {
			const trackedRatio = aspectRatiosRef.current.get(p.id);
			if (trackedRatio === void 0) return p;
			return {
				...p,
				aspectRatio: trackedRatio
			};
		});
	}, [aspectRatioVersion, participants]);
	const _sortedParticipants = useRef(processedParticipants);
	const dimensions = explicitDimensions ?? trackedDimensions;
	const isResizing = explicitDimensions ? false : isTrackingResize;
	const isMeasured = dimensions.containerWidth > 0 && dimensions.containerHeight > 0;
	const mergedConfig = useDeepCompareMemo(() => mergeLayoutConfig(DEFAULT_LAYOUT_CONFIG, config), [config]);
	const isCalculating = useMemo(() => isResizing, [isResizing]);
	const [pipCorner, setPipCorner] = useState(mergedConfig.pipConfig.initialCorner);
	const isTouchDeviceValue = useMemo(() => isTouchDevice(), []);
	const [fullscreenParticipantId, setFullscreenParticipantId] = useState(null);
	const [exitingFullscreenId, setExitingFullscreenId] = useState(null);
	const [enteringFullscreenId, setEnteringFullscreenId] = useState(null);
	const [_currentPage, _setCurrentPage] = useState(0);
	const setFullscreenParticipant = useCallback((participantId) => {
		setEnteringFullscreenId(participantId);
		setFullscreenParticipantId(participantId);
		_setCurrentPage(participants.findIndex((p) => p.id === participantId));
		setTimeout(() => {
			setEnteringFullscreenId(null);
		}, mergedConfig.animationConfig.duration);
	}, [mergedConfig, participants]);
	const exitFullscreen = useCallback(() => {
		setExitingFullscreenId(fullscreenParticipantId);
		setFullscreenParticipantId(null);
		_setCurrentPage(Math.floor(participants.findIndex((p) => p.id === fullscreenParticipantId) / mergedConfig.maxTilesPerPage));
		setTimeout(() => {
			setExitingFullscreenId(null);
		}, mergedConfig.animationConfig.duration);
	}, [
		fullscreenParticipantId,
		mergedConfig,
		participants
	]);
	const aspectRatioTimers = useRef(/* @__PURE__ */ new Map());
	const updateParticipantAspectRatio = useCallback((participantId, aspectRatio) => {
		if (!mergedConfig.aspectRatioTracking?.enabled) return;
		const existingTimer = aspectRatioTimers.current.get(participantId);
		if (existingTimer) clearTimeout(existingTimer);
		const debounceMs = mergedConfig.aspectRatioTracking?.debounceMs ?? 50;
		const timer = setTimeout(() => {
			const aspectRatios = aspectRatiosRef.current;
			let didChange = false;
			if (aspectRatio !== void 0) {
				const currentRatio = aspectRatios.get(participantId);
				if (currentRatio === void 0 || Math.abs(currentRatio - aspectRatio) > .01) {
					aspectRatios.set(participantId, aspectRatio);
					didChange = true;
				}
			} else if (aspectRatios.has(participantId)) {
				aspectRatios.delete(participantId);
				didChange = true;
			}
			if (didChange) bumpAspectRatioVersion();
			aspectRatioTimers.current.delete(participantId);
		}, debounceMs);
		aspectRatioTimers.current.set(participantId, timer);
	}, [mergedConfig.aspectRatioTracking]);
	const getParticipantAspectRatio = useCallback((participantId) => aspectRatiosRef.current.get(participantId), []);
	useEffect(() => () => {
		aspectRatioTimers.current.forEach((timer) => {
			clearTimeout(timer);
		});
		aspectRatioTimers.current.clear();
	}, []);
	const { stageSize, setStageSize } = useStageAudienceState({
		config: mergedConfig,
		dimensions,
		participants: processedParticipants
	});
	const currentPage = _currentPage;
	const { layout, sortedParticipants, feedback } = useLayoutCalculation({
		participants: processedParticipants,
		dimensions,
		config: mergedConfig,
		currentPage,
		stageSize,
		pipCorner,
		fullscreenParticipantId
	});
	_sortedParticipants.current = sortedParticipants;
	const setCurrentPage = useCallback((page) => {
		_setCurrentPage(page);
		if (layout.id === "fullscreen") {
			const participantOnNewPage = processedParticipants[page];
			setFullscreenParticipantId(participantOnNewPage?.id || null);
		}
	}, [
		layout,
		processedParticipants,
		setFullscreenParticipantId
	]);
	const toggleFullscreen = useCallback((participantId) => {
		if (fullscreenParticipantId === participantId) {
			exitFullscreen();
			return;
		} else setFullscreenParticipant(participantId);
	}, [
		fullscreenParticipantId,
		exitFullscreen,
		setFullscreenParticipant
	]);
	const totalPages = layout.pagination?.totalPages ?? 1;
	const validPage = Math.min(currentPage, Math.max(0, totalPages - 1));
	useEffect(() => {
		if (currentPage !== validPage && currentPage > validPage) setCurrentPage(validPage);
	}, [
		currentPage,
		validPage,
		setCurrentPage
	]);
	const { canGoNext, canGoPrevious, goToPage, nextPage, previousPage, paginationStyles, isPaginationVisible, setContainerHovered } = usePaginationState({
		layout,
		config: mergedConfig,
		currentPage: validPage,
		setCurrentPage
	});
	const { isDraggingDivider, dividerPosition, startDividerDrag } = useDividerDrag({
		layout,
		dimensions,
		config: mergedConfig,
		setStageSize
	});
	const { isDraggingPip, pipDragOffset, handlePipDragStart } = usePipDrag({
		config: mergedConfig,
		dimensions,
		setPipCorner,
		tiles: layout.tiles
	});
	const { swipeHandlers, swipeDragOffset, swipePhase, swipeDirection } = useSwipeGestures({
		totalPages,
		canGoNext,
		canGoPrevious,
		nextPage,
		previousPage,
		containerWidth: dimensions.containerWidth,
		gap: dimensions.gap ?? 0
	});
	const adjacentPage = swipeDirection === "next" ? validPage + 1 : swipeDirection === "previous" ? validPage - 1 : null;
	const adjacentLayout = useMemo(() => {
		if (adjacentPage === null) return null;
		return computeLayout({
			participants: processedParticipants,
			dimensions,
			config: mergedConfig,
			currentPage: adjacentPage,
			stageSize,
			pipCorner,
			fullscreenParticipantId
		}, feedback).result.layout;
	}, [
		adjacentPage,
		processedParticipants,
		dimensions,
		mergedConfig,
		stageSize,
		pipCorner,
		fullscreenParticipantId,
		feedback
	]);
	const { diff: layoutDiff, animationTrigger, animationSettings, exitingTiles, generation: transitionGeneration, getPreviousTiles } = useTileTransitions({
		layout,
		participants: processedParticipants,
		dimensions,
		stageSize,
		currentPage,
		isResizing,
		isDraggingDivider,
		swipePhase,
		config: mergedConfig
	});
	const visibilityWindow = useMemo(() => createTileVisibilityWindow({
		layout,
		sortedParticipants,
		exitingTileIds: exitingTiles.map((tile) => tile.participantId)
	}), [
		layout,
		sortedParticipants,
		exitingTiles
	]);
	const { renderDraggableDivider, renderAreaPlaceholders, renderPaginationControls, renderLayoutStateIndicators, renderTiles } = useLayoutRenderers({
		layout: useMemo(() => {
			const previousTiles = getPreviousTiles();
			if (!previousTiles) return layout;
			if (enteringFullscreenId) {
				const fullscreenTile = layout.tiles.find((tile) => tile.participantId === enteringFullscreenId);
				if (!fullscreenTile) return layout;
				const mergedTiles = previousTiles.map((prevTile) => prevTile.participantId === enteringFullscreenId ? fullscreenTile : {
					...prevTile,
					isFadingOut: true
				});
				return {
					...layout,
					tiles: mergedTiles
				};
			}
			if (exitingFullscreenId) {
				const tilesWithFadeFlags = layout.tiles.map((tile) => tile.participantId === exitingFullscreenId ? tile : {
					...tile,
					isFadingIn: true
				});
				return {
					...layout,
					tiles: tilesWithFadeFlags
				};
			}
			return layout;
		}, [
			layout,
			enteringFullscreenId,
			exitingFullscreenId,
			getPreviousTiles
		]),
		dimensions,
		config: mergedConfig,
		stageSize,
		isDraggingDivider,
		dividerPosition,
		startDividerDrag,
		isCalculating,
		totalPages,
		validPage,
		goToPage: (page) => setCurrentPage(page),
		paginationStyles,
		isDraggingPip,
		pipDragOffset,
		handlePipDragStart,
		animationSettings,
		exitingFullscreenId,
		swipeDragOffset,
		swipePhase,
		swipeDirection,
		adjacentLayout,
		tileTransitions: {
			diff: layoutDiff,
			settings: animationSettings,
			generation: transitionGeneration,
			exitingTiles
		}
	});
	const containerProps = useMemo(() => ({
		onMouseEnter: () => setContainerHovered(true),
		onMouseLeave: () => setContainerHovered(false),
		...swipeHandlers
	}), [setContainerHovered, swipeHandlers]);
	const participantMap = useMemo(() => {
		const map = /* @__PURE__ */ new Map();
		processedParticipants.forEach((p) => {
			map.set(p.id, p);
		});
		return map;
	}, [processedParticipants]);
	const getParticipant = useCallback((participantId) => participantMap.get(participantId), [participantMap]);
	const [showAreaOverlays, setShowAreaOverlays] = useState(mergedConfig.debugOverlays?.showAreaOverlays ?? false);
	const [showGridLines, setShowGridLines] = useState(mergedConfig.debugOverlays?.showGridLines ?? false);
	const [showTileInfo, setShowTileInfo] = useState(mergedConfig.debugOverlays?.showTileInfo ?? false);
	const debugOverlays = useMemo(() => ({
		showAreaOverlays,
		toggleAreaOverlays: () => setShowAreaOverlays((prev) => !prev),
		showGridLines,
		toggleGridLines: () => setShowGridLines((prev) => !prev),
		showTileInfo,
		toggleTileInfo: () => setShowTileInfo((prev) => !prev)
	}), [
		showAreaOverlays,
		showGridLines,
		showTileInfo
	]);
	return {
		layout,
		visibilityWindow,
		isCalculating,
		isResizing,
		isMeasured,
		currentPage: validPage,
		totalPages,
		canGoNext,
		canGoPrevious,
		goToPage,
		nextPage,
		previousPage,
		paginationStyles,
		renderDraggableDivider,
		renderAreaPlaceholders,
		renderPaginationControls,
		renderLayoutStateIndicators,
		isDraggingDivider,
		dividerPosition,
		stageSize,
		setStageSize,
		renderTiles,
		pipCorner,
		setPipCorner,
		isPaginationVisible,
		setContainerHovered,
		isTouchDevice: isTouchDeviceValue,
		isSwiping: swipePhase !== "idle",
		swipeHandlers,
		fullscreenParticipantId,
		setFullscreenParticipant,
		exitFullscreen,
		toggleFullscreen,
		updateParticipantAspectRatio,
		getParticipantAspectRatio,
		containerProps,
		getParticipant,
		participantMap,
		debugOverlays,
		animationTrigger
	};
}
//#endregion
//#region src/utils/debounce.ts
function debounce(fn, delay) {
	let timeoutId = null;
	return (...args) => {
		if (delay === 0) {
			fn(...args);
			return;
		}
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			fn(...args);
		}, delay);
	};
}
//#endregion
export { ANIMATION, ASPECT_RATIOS, BREAKPOINTS, DEFAULT_LAYOUT_CONFIG, DEFAULT_MAX_EXITING_TILES, DEFAULT_MEETING_LAYOUT_CONFIG, DEFAULT_SCREEN_SHARE_ASPECT_RATIO, DEFAULT_TRANSITION_EPSILON, DEFAULT_VALUES, DRAGGABLE_DIVIDER, DefaultDraggableDivider, FACE_VISIBILITY, GRID_SCORING, INITIAL_LAYOUT_FEEDBACK, INITIAL_TILE_PRESENCE, MIN_TILE_SIZES, PAGINATION, PERFORMANCE, PaginationDots, SIZE_RATIOS, SMALL_GROUP, SPACING, STAGE_AUDIENCE, SWIPE, UI_POSITIONING, Z_INDEX, advancePresence, autoLayout, calculateFaceClipPercentage, calculateGridCapacity, calculateGridScore, calculateLayoutScore, calculateOptimalGrid, calculateOptimalGridWithReducedCount, calculateOptimalStageSize, calculateStageBounds, calculateVisibleRegion, checkFaceVisibility, clampStageSize, computeLayout, createAnimationContext, createLayoutSnapshot, createMeetingLayoutConfig, debounce, detectAnimationTrigger, determineOrientation, diffLayout, evaluateFaceVisibility, fitAspectRatio, fullscreenLayout, getDragBounds, getStageParticipants, hasAnyFaceData, isTouchDevice, layoutSingleParticipant, normalizeScoringWeights, pictureInPictureLayout, positionTilesInGrid, removeExitedTiles, resolveAnimationSettings, resolveFaceVisibilityConfig, shouldUseSmallGroupLayout, simpleFocusLayout, simpleGridLayout, simpleStageAudienceLayout, smallGroupLayout, sortParticipants, useDividerDrag, useLayoutCalculation, useLayoutRenderers, usePaginationState, usePipDrag, useStageAudienceState, useSwipeGestures, useTileLayout, useTileTransitions };
