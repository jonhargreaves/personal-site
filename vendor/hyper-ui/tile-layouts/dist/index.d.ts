import React$1, { CSSProperties, ReactElement, ReactNode } from "react";
//#region src/types/render.d.ts
interface DraggableDividerRenderProps {
  dividerStyles: CSSProperties;
  dividerHandlers: {
    onMouseDown: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
  };
  isDragging: boolean;
  position: number;
  orientation: "vertical" | "horizontal";
}
interface DraggableDividerOptions {
  onPositionChange?: (percentage: number) => void;
  disabled?: boolean;
  children?: (props: DraggableDividerRenderProps) => ReactElement;
  style?: CSSProperties;
  handleSize?: number;
}
interface AreaPlaceholdersOptions {
  visible?: boolean;
  stageStyle?: CSSProperties;
  audienceStyle?: CSSProperties;
}
/**
 * Options for customizing the pagination controls rendered by `renderPaginationControls`.
 *
 * All properties are optional — sensible defaults are provided by the library.
 */
interface PaginationControlsOptions {
  /** Inline styles applied to the pagination container element. */
  containerStyle?: CSSProperties;
  /** CSS class name for the pagination container. Replaces the default class when provided. */
  containerClassName?: string;
  /** Custom pagination component. When provided, replaces the built-in {@link PaginationDots}. */
  children?: ReactNode;
  /** Whether to show prev/next navigation buttons alongside the dots. */
  showButtons?: boolean;
  /** CSS class name applied to each pagination dot. */
  dotClassName?: string;
  /** CSS class name applied to the active pagination dot. */
  activeDotClassName?: string;
  /** CSS class name applied to the prev/next navigation buttons. */
  buttonClassName?: string;
  /** CSS class name applied to the ellipsis indicator shown when there are many pages. */
  ellipsisClassName?: string;
}
interface LayoutStateIndicatorsOptions {
  showDimensions?: boolean;
  calculatingText?: string;
  calculatingStyle?: CSSProperties;
  dimensionsStyle?: CSSProperties;
}
interface TileLayoutRenderFunctions {
  renderDraggableDivider: (options: DraggableDividerOptions) => ReactElement | null;
  renderAreaPlaceholders: (options?: AreaPlaceholdersOptions) => ReactElement | null;
  renderPaginationControls: (options?: PaginationControlsOptions) => ReactElement | null;
  renderLayoutStateIndicators: (options?: LayoutStateIndicatorsOptions) => ReactElement | null;
}
interface DividerHandleIconProps {
  orientation: "vertical" | "horizontal";
  style?: CSSProperties;
}
interface TileRenderProps {
  key: string;
  style: CSSProperties;
  className?: string;
  dragHandlers?: {
    onMouseDown?: (e: React.MouseEvent) => void;
    onTouchStart?: (e: React.TouchEvent) => void;
    onMouseUp?: (e: React.MouseEvent) => void;
    onTouchEnd?: (e: React.TouchEvent) => void;
  };
  isDragging?: boolean;
  isFloating?: boolean;
  role?: string;
  "aria-label"?: string;
  tabIndex?: number;
}
interface TileRenderOptions {
  style?: CSSProperties;
  className?: string;
  disableDrag?: boolean;
  children?: (props: TileRenderProps) => ReactElement;
  /**
   * How much styling the library emits per tile:
   * - `"full"` (default): positioning plus CSS transitions/animations — the
   *   zero-config CSS animation path.
   * - `"position"`: positioning (transform/width/height/contain/z-index)
   *   only, no transitions — for consumers driving WAAPI themselves.
   * - `"none"`: no styling at all — for handing tiles to an external
   *   animation driver (e.g. `motion` layout animations) at zero library
   *   bundle cost. Geometry stays available on the tile fields and
   *   `tile.transition`.
   */
  styleMode?: "full" | "position" | "none";
}
/**
 * Per-tile transition state exposed on `LayoutTile.transition`.
 * This is the headless animation contract: everything an external driver
 * (CSS, WAAPI, motion) needs to animate enter/exit/move/resize itself.
 */
interface TileTransition {
  /** Lifecycle phase: exiting tiles are retained only while animating out. */
  phase: "entering" | "exiting" | "idle";
  /** What changed for this tile since the previous committed layout. */
  change: "entered" | "exited" | "moved" | "resized" | "unchanged";
  /** Rect on the previous layout; null for tiles that just entered. */
  from: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  /** Rect on the current layout; null for exiting tiles. */
  to: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  /** The layout-level trigger for this change. */
  trigger: AnimationTrigger;
  /** Resolved animation settings for the trigger. */
  settings: Required<AnimationSettings>;
  /** Monotonic diff generation; bumps once per committed layout change. */
  generation: number;
}
interface LayoutTile {
  participantId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  row: number;
  column: number;
  isFloating?: boolean;
  key: string;
  style: CSSProperties;
  className?: string;
  dragHandlers?: {
    onMouseDown?: (e: React.MouseEvent) => void;
    onTouchStart?: (e: React.TouchEvent) => void;
  };
  isDragging?: boolean;
  /**
   * Per-tile transition state (headless animation contract). Present on
   * every tile once the layout has a previous committed state to diff
   * against; `phase: "exiting"` tiles only appear when exit retention is
   * enabled via `tileTransitions.exitRetention`.
   */
  transition?: TileTransition;
}
type TileRenderFunction = (tile: LayoutTile) => ReactElement | null;
//#endregion
//#region src/types/index.d.ts
/**
 * Face bounding box in normalized 0-1000 coordinates.
 * These coordinates represent the face position relative to the video frame.
 */
interface FaceBoundingBox {
  /** X position of the face bounding box (0-1000) */
  x: number;
  /** Y position of the face bounding box (0-1000) */
  y: number;
  /** Width of the face bounding box (0-1000) */
  width: number;
  /** Height of the face bounding box (0-1000) */
  height: number;
}
/**
 * Configuration for face visibility checking during grid layout selection.
 */
interface FaceVisibilityConfig {
  /** Maximum allowed face clipping (0-1). Default: 0.3 (30%) */
  maxClipThreshold?: number;
  /** Whether to reject configurations exceeding threshold. Default: true */
  rejectOnThreshold?: boolean;
  /** Fallback behavior when no config passes: 'best-score' | 'relax-threshold' */
  fallbackBehavior?: "best-score" | "relax-threshold";
}
/**
 * Represents a participant in a video conference
 */
interface Participant {
  /** Required unique identifier for the participant */
  id: string;
  /** Video aspect ratio (e.g., 16/9 = 1.777, 9/16 = 0.5625) */
  aspectRatio?: number;
  /** Whether the participant is currently speaking */
  isSpeaking?: boolean;
  /**
   * Whether this participant is sharing their screen.
   * @deprecated Use `isScreenShare` — the two flags were redundant and only
   * `isScreenShare` drives layout decisions. `isScreenSharing` still counts
   * toward screen-share detection for animation triggers, but will be
   * removed in a future major.
   */
  isScreenSharing?: boolean;
  /** If this is a screen share participant */
  isScreenShare?: boolean;
  /** Whether the participant is pinned by the user */
  isPinned?: boolean;
  /** Whether this participant should appear in the stage area */
  isOnStage?: boolean;
  /** Whether this is the local participant (used for PiP layout) */
  isSelf?: boolean;
  /**
   * Face bounding boxes in normalized 0-1000 coordinates.
   * When 2+ faces are present, layout optimization ensures faces aren't clipped.
   * When 0-1 faces are present, face zoom/centering handles visibility.
   */
  faceBoxes?: FaceBoundingBox[];
}
interface AudienceInfo {
  participantIds: string[];
  visibleParticipantIds: string[];
  position: "bottom" | "right" | "left" | "top";
  x: number;
  y: number;
  width: number;
  height: number;
}
interface PaginationInfo {
  totalParticipants: number;
  visibleParticipants: number;
  currentPage: number;
  totalPages: number;
  allParticipantIds: string[];
  currentPageParticipantIds: string[];
  pageSize?: number;
  position?: "bottom" | "top" | "left" | "right";
}
interface TileVisibilityWindow {
  allTileIds: string[];
  visibleTileIds: string[];
  adjacentTileIds: string[];
  /**
   * IDs of tiles retained while animating out (exit retention). Keep these
   * tracks alive so a departing tile can fade its real video out instead of
   * a black rectangle. Empty unless `tileTransitions.exitRetention` is on.
   */
  exitingTileIds: string[];
}
interface TileLayout {
  id: LayoutId;
  rows: number;
  columns: number;
  tiles: TilePosition[];
  audience?: AudienceInfo;
  pagination?: PaginationInfo;
  suggestedMaxTiles?: number;
}
interface TilePosition {
  participantId: string;
  row: number;
  column: number;
  width: number;
  height: number;
  x: number;
  y: number;
  contentWidth?: number;
  contentHeight?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  isFloating?: boolean;
  isFadingOut?: boolean;
  isFadingIn?: boolean;
}
interface LayoutDimensions {
  containerWidth: number;
  containerHeight: number;
  gap?: number;
  padding?: number;
}
type LayoutMode = "auto" | "grid" | "focus" | "small-group" | "stage-audience" | "picture-in-picture" | "fullscreen";
/**
 * Specific layout IDs returned by layout calculation functions
 * These are more specific than LayoutMode and represent the actual layout implementation used
 */
type LayoutId = "simple-grid" | "simple-grid-fullscreen" | "simple-focus-empty" | "simple-focus-mobile" | "simple-focus-desktop" | "stage-audience-horizontal" | "stage-audience-vertical" | "audience-only" | "picture-in-picture" | "small-group" | "fullscreen";
/**
 * Weights for grid layout scoring algorithm
 */
interface GridScoringWeights {
  /** Weight for showing all participants (0-1). Higher values prioritize fitting all participants. (default: 0.4) */
  participantCoverage: number;
  /** Weight for tile size (0-1). Higher values prioritize larger tiles. (default: 0.4) */
  tileSize: number;
  /** Weight for penalizing wasted space (0-1). Higher values penalize empty grid spots and unused container space. (default: 0.1) */
  spaceEfficiency: number;
  /** Weight for grid shape (0-1). Higher values prefer square grids (equal rows/columns). (default: 0) */
  gridBalance: number;
  /** Weight for tile aspect ratio (0-1). Higher values prefer tiles closer to the preferred aspect ratio. (default: 0.05) */
  tileAspectRatio: number;
  /** Weight for penalizing empty spots (0-1). Higher values heavily penalize grids with empty spots. (default: 0.05) */
  emptySpotsPenalty: number;
}
/**
 * Types of events that can trigger layout changes
 */
type AnimationTrigger = "resize" | "participantJoined" | "participantLeft" | "participantChange" | "screenShareStart" | "screenShareEnd" | "modeChange" | "stageSizeChange" | "initial";
/**
 * Animation settings for a specific trigger or globally
 */
interface AnimationSettings {
  /** Whether animations are enabled for this trigger (default: true) */
  enabled?: boolean;
  /** Animation duration in milliseconds (default: 300) */
  duration?: number;
  /** Animation timing function (default: cubic-bezier(0.4, 0, 0.2, 1)) */
  easing?: string;
  /** Properties to animate (default: ["transform", "width", "height"]) */
  properties?: ("transform" | "width" | "height" | "opacity")[];
}
/**
 * Configuration options for tile layout
 */
interface LayoutConfig {
  /** Layout mode selection (default: auto) */
  mode?: LayoutMode;
  /** Gap between tiles in pixels (default: 8) */
  gap?: number;
  /** Padding around the container in pixels (default: 16) */
  padding?: number;
  /** Debounce time for resize events in milliseconds (default: 150) */
  debounceMs?: number;
  /** Maximum number of tiles per page (default: 12) */
  maxTilesPerPage?: number;
  /** Target aspect ratio for tiles */
  aspectRatio?: number;
  /** Minimum tile width in pixels (default: 150) */
  minTileWidth?: number;
  /** Minimum tile height in pixels (default: 100) */
  minTileHeight?: number;
  /** Minimum aspect ratio for tiles (default: 0.75) */
  minTileAspectRatio?: number;
  /** Maximum aspect ratio for tiles (default: 1.8) */
  maxTileAspectRatio?: number;
  /** Prioritize the active speaker in layouts (default: true) */
  prioritizeSpeaker?: boolean;
  /** Prioritize screen share in layouts (default: true) */
  prioritizeScreenShare?: boolean;
  /** Enable smooth CSS transitions for tile position and size (default: true) */
  enableAnimations?: boolean;
  /**
   * Animation configuration options
   * Can be a simple object for global settings, or include per-trigger overrides
   */
  animationConfig?: AnimationSettings & {
    /**
     * Per-trigger animation overrides
     * Example: { triggers: { resize: { enabled: false }, participantJoined: { duration: 500 } } }
     */
    triggers?: Partial<Record<AnimationTrigger, AnimationSettings>>;
  };
  /** Fixed width for audience in sidebar layouts */
  audienceWidth?: number;
  /** Maximum percentage of container height that tiles can consume */
  maxHeightPercent?: number;
  /** Grid scoring weights for layout optimization */
  gridScoringWeights?: GridScoringWeights;
  /** Stage-audience specific options */
  stageAudienceConfig?: StageAudienceConfig;
  /** Picture-in-picture specific options */
  pipConfig?: {
    /** Initial corner position for floating tile (default: bottom-right) */
    initialCorner?: PiPCorner;
    /** Enable drag-to-reposition for floating tile (default: true) */
    enableDrag?: boolean;
    /** Size ratio of the floating tile relative to the container (default: 0.3) */
    pipSizeRatio?: number;
  };
  /** Pagination UI options */
  paginationConfig?: {
    /** Show pagination only on hover (default: true on desktop, false on touch) */
    showOnHoverOnly?: boolean;
    /** Position of pagination controls (default: bottom) */
    position?: "bottom" | "top" | "left" | "right";
    /** Disable pagination space reservation */
    disabled?: boolean;
    /** Override the space reserved for pagination controls in px (default: 56 vertical, 48 horizontal) */
    bufferSize?: number;
  };
  /**
   * Horizontal alignment of grid layouts within the container.
   * Default: "center".
   */
  align?: "start" | "center" | "end";
  /**
   * How an incomplete final grid row fills the width:
   * - "center" (default): keep tile size and center the short row
   * - "mosaic": stretch the final row's tiles to span the full grid width
   */
  lastRowPolicy?: "center" | "mosaic";
  /**
   * Per-tile transition contract options.
   * Exit retention is off by default in 1.x (rendered output unchanged);
   * 2.0 turns it on by default.
   */
  tileTransitions?: {
    /** Retain exiting tiles so they can animate out. Default: false. */
    exitRetention?: boolean;
    /** Upper bound on retained exiting tiles. Default: 8. */
    maxExitingTiles?: number;
  };
  /** Aspect ratio tracking options */
  aspectRatioTracking?: {
    /** Enable aspect ratio tracking (default: false) */
    enabled?: boolean;
    /** Debounce time for aspect ratio updates in milliseconds (default: 50) */
    debounceMs?: number;
  };
  /** Debug overlay options */
  debugOverlays?: {
    /** Enable debug overlays (default: false) */
    enabled?: boolean;
    /** Show stage/audience area overlays */
    showAreaOverlays?: boolean;
    /** Show grid lines between tiles */
    showGridLines?: boolean;
    /** Show tile information overlays */
    showTileInfo?: boolean;
  };
  /** Face visibility configuration for grid optimization */
  faceVisibilityConfig?: FaceVisibilityConfig;
  /**
   * Responsive config overrides keyed by container width breakpoints (in pixels).
   * When the container width is <= a breakpoint, the corresponding config is merged
   * on top of the base config using the same one-level object merge semantics as the
   * main layout config. Multiple breakpoints can match; they are applied in
   * descending order so the smallest matching breakpoint wins.
   *
   * @example
   * breakpoints: {
   *   768: {
   *     gap: 4,
   *     minTileAspectRatio: 7 / 16,
   *     maxTileAspectRatio: 3 / 4,
   *     stageAudienceConfig: { stageSize: 60, minStagePercent: 60, maxStagePercent: 60 },
   *     pipConfig: { pipSizeRatio: 0.3 },
   *     paginationConfig: { bufferSize: 24 },
   *   },
   * }
   */
  breakpoints?: Record<number, Omit<LayoutConfig, "breakpoints">>;
}
type PiPCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right";
interface StageAudienceLayout {
  stage: StageContainer;
  audience: AudienceContainer;
  orientation: "horizontal" | "vertical";
  dividerPosition: number;
}
interface StageContainer {
  participants: Participant[];
  tiles: TilePosition[];
  width: number;
  height: number;
  x: number;
  y: number;
}
interface AudienceContainer {
  participants: Participant[];
  tiles: TilePosition[];
  width: number;
  height: number;
  x: number;
  y: number;
  currentPage?: number;
  totalPages?: number;
}
/**
 * Configuration options for stage-audience layout
 */
interface StageAudienceConfig {
  /** Percentage of container allocated to stage (0-100) (default: 70) */
  stageSize?: number;
  /** Minimum stage size as percentage (0-100) when dragging (default: 20) */
  minStagePercent?: number;
  /** Maximum stage size as percentage (0-100) when dragging (default: 85) */
  maxStagePercent?: number;
  /** Whether to allow dragging the divider (default: false) */
  allowResize?: boolean;
  /** Force specific orientation instead of auto-selection */
  forceOrientation?: "horizontal" | "vertical";
  /** Maximum participants in audience before pagination */
  maxAudienceParticipants?: number;
  /** Maintain screen share aspect ratio in stage (default: false) */
  fitScreenshareAspectRatio?: boolean;
  /**
   * Extra non-video chrome around a single screen share tile.
   * The layout fits the shared content inside the remaining space, then adds
   * these fixed offsets back onto the final tile frame.
   */
  screenShareContentInsets?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}
//#endregion
//#region src/components/DefaultDraggableDivider.d.ts
interface DefaultDraggableDividerProps {
  renderProps: DraggableDividerRenderProps;
  handleColor?: string;
  handleSize?: {
    width: number;
    height: number;
  };
  showOnHover?: boolean;
}
declare function DefaultDraggableDivider({ renderProps, handleColor, handleSize, showOnHover }: DefaultDraggableDividerProps): ReactElement;
//#endregion
//#region src/components/PaginationDots.d.ts
interface PaginationDotsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  style?: React$1.CSSProperties;
  showButtons?: boolean;
  dotClassName?: string;
  activeDotClassName?: string;
  buttonClassName?: string;
  ellipsisClassName?: string;
}
declare const PaginationDots: React$1.FC<PaginationDotsProps>;
//#endregion
//#region src/config.d.ts
/**
 * Complete layout configuration with all required fields.
 * Used internally after merging with user config.
 */
interface CompleteLayoutConfig extends Omit<Required<LayoutConfig>, "pipConfig" | "paginationConfig" | "stageAudienceConfig" | "audienceWidth" | "gridScoringWeights" | "faceVisibilityConfig" | "breakpoints" | "tileTransitions" | "align" | "lastRowPolicy"> {
  mode: NonNullable<LayoutConfig["mode"]>;
  pipConfig: Required<NonNullable<LayoutConfig["pipConfig"]>>;
  paginationConfig: Required<NonNullable<LayoutConfig["paginationConfig"]>>;
  stageAudienceConfig: Omit<Required<NonNullable<LayoutConfig["stageAudienceConfig"]>>, "forceOrientation"> & {
    forceOrientation?: "horizontal" | "vertical";
  };
  audienceWidth?: LayoutConfig["audienceWidth"];
  gridScoringWeights?: LayoutConfig["gridScoringWeights"];
  faceVisibilityConfig?: LayoutConfig["faceVisibilityConfig"];
  breakpoints?: LayoutConfig["breakpoints"];
  tileTransitions?: LayoutConfig["tileTransitions"];
  align?: LayoutConfig["align"];
  lastRowPolicy?: LayoutConfig["lastRowPolicy"];
}
/**
 * Default layout configuration
 * This is the base configuration that will be merged with user-provided config
 */
declare const DEFAULT_LAYOUT_CONFIG: {
  readonly mode: "auto";
  readonly maxTilesPerPage: 12;
  readonly aspectRatio: number;
  readonly prioritizeSpeaker: true;
  readonly prioritizeScreenShare: true;
  readonly enableAnimations: true;
  readonly animationConfig: {
    readonly duration: 300;
    readonly easing: "cubic-bezier(0.4, 0, 0.2, 1)";
  };
  readonly minTileWidth: 120;
  readonly minTileHeight: 90;
  readonly minTileAspectRatio: 0.75;
  readonly maxTileAspectRatio: 1.8;
  readonly gridScoringWeights: {
    readonly participantCoverage: 0.4;
    readonly tileSize: 0.4;
    readonly spaceEfficiency: 0.1;
    readonly gridBalance: 0;
    readonly tileAspectRatio: 0.05;
    readonly emptySpotsPenalty: 0.05;
  };
  readonly maxHeightPercent: 1;
  readonly stageAudienceConfig: {
    readonly allowResize: true;
    readonly minStagePercent: number;
    readonly maxStagePercent: number;
    readonly stageSize: number;
    readonly forceOrientation: undefined;
    readonly maxAudienceParticipants: 25;
    readonly fitScreenshareAspectRatio: true;
    readonly screenShareContentInsets: undefined;
  };
  readonly pipConfig: {
    readonly initialCorner: "bottom-right";
    readonly enableDrag: true;
    readonly pipSizeRatio: 0.3;
  };
  readonly paginationConfig: {
    readonly showOnHoverOnly: true;
    readonly position: "bottom";
    readonly disabled: false;
  };
  readonly aspectRatioTracking: {
    readonly enabled: false;
    readonly debounceMs: 50;
  };
  readonly tileTransitions: {
    readonly exitRetention: true;
    readonly maxExitingTiles: 8;
  };
  readonly debugOverlays: {
    readonly enabled: false;
    readonly showAreaOverlays: false;
    readonly showGridLines: false;
    readonly showTileInfo: false;
  };
};
/**
 * Shared meeting-oriented defaults for app-level video layouts.
 * Consumers can layer product-specific mode and responsive overrides on top.
 */
declare const DEFAULT_MEETING_LAYOUT_CONFIG: {
  readonly aspectRatioTracking: {
    readonly enabled: true;
    readonly debounceMs: 0;
  };
  readonly debounceMs: 0;
  readonly gap: 8;
  readonly maxTilesPerPage: 12;
  readonly padding: 16;
  readonly prioritizeScreenShare: true;
  readonly gridScoringWeights: {
    readonly participantCoverage: 0.9;
    readonly tileSize: 0;
    readonly spaceEfficiency: 0.4;
    readonly gridBalance: 0;
    readonly tileAspectRatio: 0.3;
    readonly emptySpotsPenalty: 0.1;
  };
  readonly animationConfig: {
    readonly duration: 300;
    readonly easing: "cubic-bezier(0.4, 0, 0.2, 1)";
    readonly properties: readonly ["transform", "width", "height"];
    readonly triggers: {
      readonly resize: {
        readonly enabled: false;
      };
      readonly stageSizeChange: {
        readonly enabled: true;
      };
    };
  };
  readonly stageAudienceConfig: {
    readonly allowResize: false;
    readonly stageSize: 70;
    readonly minStagePercent: 5;
    readonly maxStagePercent: 70;
    readonly fitScreenshareAspectRatio: true;
    readonly forceOrientation: undefined;
    readonly maxAudienceParticipants: 25;
    readonly screenShareContentInsets: undefined;
  };
  readonly pipConfig: {
    readonly enableDrag: false;
    readonly initialCorner: "bottom-right";
    readonly pipSizeRatio: 0.3;
  };
  readonly paginationConfig: {
    readonly position: "bottom";
    readonly bufferSize: 32;
    readonly showOnHoverOnly: true;
    readonly disabled: false;
  };
  readonly mode: "auto";
  readonly aspectRatio: number;
  readonly prioritizeSpeaker: true;
  readonly enableAnimations: true;
  readonly minTileWidth: 120;
  readonly minTileHeight: 90;
  readonly minTileAspectRatio: 0.75;
  readonly maxTileAspectRatio: 1.8;
  readonly maxHeightPercent: 1;
  readonly tileTransitions: {
    readonly exitRetention: true;
    readonly maxExitingTiles: 8;
  };
  readonly debugOverlays: {
    readonly enabled: false;
    readonly showAreaOverlays: false;
    readonly showGridLines: false;
    readonly showTileInfo: false;
  };
};
interface MeetingLayoutConfigOptions {
  /** Apply the meeting preset's mobile defaults before custom overrides. */
  isMobile?: boolean;
  /** Product-specific overrides layered on top of the shared meeting preset. */
  overrides?: LayoutConfig;
}
/**
 * Device and viewport context for configuration optimization.
 */
interface ConfigContext {
  containerWidth: number;
  containerHeight: number;
  participantCount: number;
  hasScreenShare?: boolean;
  hasPinnedParticipants?: boolean;
  isTouchDevice?: boolean;
  isPortrait?: boolean;
}
/**
 * Creates a shared meeting-oriented layout config with optional mobile defaults
 * and product-specific overrides layered on top.
 */
declare function createMeetingLayoutConfig(options?: MeetingLayoutConfigOptions): CompleteLayoutConfig;
//#endregion
//#region src/constants.d.ts
/**
 * Central constants file for tile-layouts package
 * All default values and magic numbers should be defined here
 */
declare const ASPECT_RATIOS: {
  readonly MIN: number;
  readonly MAX: number;
  readonly IDEAL: number;
  readonly DEFAULT_MIN: 0.75;
  readonly DEFAULT_MAX: 1.8;
  readonly SCREEN_SHARE: number;
  readonly SCREEN_SHARE_TOLERANCE: 0.05;
  readonly SINGLE_ROW_TILE: number;
  readonly STAGE: {
    readonly MIN: 0.5;
    readonly MAX: 3;
  };
  readonly AUDIENCE: {
    readonly MIN: 0.75;
    readonly MAX: 1.8;
    readonly RELAXED_MIN: 0.5;
    readonly RELAXED_MAX: 2.5;
  };
  readonly SIMPLE_GRID: {
    readonly MIN: 0.5;
    readonly MAX: 2;
  };
};
declare const DEFAULT_SCREEN_SHARE_ASPECT_RATIO: number;
declare const SPACING: {
  readonly DEFAULT_GAP: 8;
  readonly DEFAULT_PADDING: 16;
  readonly FLOATING_TILE_OFFSET: 16;
  readonly PAGINATION_OVERLAY_OFFSET: 16;
  readonly STAGE_AUDIENCE_OFFSET: 100;
};
declare const MIN_TILE_SIZES: {
  readonly DEFAULT: {
    readonly width: 100;
    readonly height: 100;
  };
  readonly STAGE: {
    readonly width: 200;
    readonly height: 200;
  };
  readonly AUDIENCE: {
    readonly width: 100;
    readonly height: 100;
  };
  readonly EDGE_CASE: {
    readonly width: 50;
    readonly height: 50;
  };
  readonly GRID: {
    readonly width: 120;
    readonly height: 90;
  };
  readonly SIDEBAR: {
    readonly width: 80;
    readonly height: 60;
  };
  readonly SIDEBAR_OPTIMIZED: {
    readonly width: 100;
    readonly height: 100;
  };
};
declare const PAGINATION: {
  readonly DEFAULT_MAX_TILES_PER_PAGE: 12;
  readonly FOCUS_MAX_OTHERS: 4;
  readonly SIDEBAR_MAX_PARTICIPANTS: 4;
  readonly DEFAULT_MAX_AUDIENCE_PARTICIPANTS: 25;
  readonly DOTS: {
    readonly ICON_SIZE: 16;
    readonly MAX_VISIBLE_DOTS: 7;
    readonly ELLIPSIS_LEFT_OFFSET: 2;
    readonly ELLIPSIS_RIGHT_OFFSET: 2;
  };
};
declare const GRID_SCORING: {
  readonly PREFERRED_ASPECT_RATIO: number;
  readonly SMALL_GROUP_PREFERRED_ASPECT_RATIO: number;
  readonly SMALL_GROUP_SPACE_EFFICIENCY_BONUS: 0.5;
  readonly MAX_ITERATIONS: 300;
  readonly EXCELLENT_SCORE_THRESHOLD: 0.95;
  readonly DEFAULT_WEIGHTS: {
    readonly participantCoverage: 0.4;
    readonly tileSize: 0.4;
    readonly spaceEfficiency: 0.1;
    readonly gridBalance: 0;
    readonly tileAspectRatio: 0.05;
    readonly emptySpotsPenalty: 0.05;
  };
  readonly EMPTY_SPOTS_PENALTY_POWER: 2;
  readonly MAX_REASONABLE_AREA_MULTIPLIER: 25;
  readonly MIN_SPACE_UTILIZATION: 0.7;
  readonly EXHAUSTIVE: {
    readonly MAX_DIMENSION_MULTIPLIER: 2;
    readonly MAX_DIMENSION_CAP: 20;
    readonly ROWS_COLS_SCALE: 1.5;
    readonly ROWS_COLS_CAP: 15;
    readonly MAX_GRID_ASPECT_RATIO: 10;
    readonly MIN_GRID_ASPECT_RATIO: 0.1;
  };
};
declare const PERFORMANCE: {
  readonly DEFAULT_DEBOUNCE_MS: 160;
  readonly DEBOUNCE_BUFFER_MS: 50;
  readonly FRAME_TIME_MS: 16;
  readonly WARNING_THRESHOLD_MS: 16;
};
declare const ANIMATION: {
  readonly DEFAULT_DURATION: 300;
  readonly DEFAULT_EASING: "cubic-bezier(0.4, 0, 0.2, 1)";
  readonly DEFAULT_PROPERTIES: readonly ["transform", "width", "height"];
  readonly PRESETS: {
    readonly FAST: {
      readonly duration: 150;
      readonly easing: "cubic-bezier(0.4, 0, 1, 1)";
    };
    readonly NORMAL: {
      readonly duration: 300;
      readonly easing: "cubic-bezier(0.4, 0, 0.2, 1)";
    };
    readonly SLOW: {
      readonly duration: 500;
      readonly easing: "cubic-bezier(0.4, 0, 0.2, 1)";
    };
    readonly SMOOTH: {
      readonly duration: 400;
      readonly easing: "cubic-bezier(0.16, 1, 0.3, 1)";
    };
    readonly SPRING: {
      readonly duration: 600;
      readonly easing: "cubic-bezier(0.34, 1.56, 0.64, 1)";
    };
  };
  readonly TRIGGER_DEFAULTS: {
    readonly resize: {
      readonly enabled: false;
      readonly duration: 300;
      readonly easing: "cubic-bezier(0.4, 0, 0.2, 1)";
    };
    readonly participantJoined: {
      readonly enabled: true;
      readonly duration: 300;
      readonly easing: "cubic-bezier(0.4, 0, 0.2, 1)";
    };
    readonly participantLeft: {
      readonly enabled: true;
      readonly duration: 300;
      readonly easing: "cubic-bezier(0.4, 0, 0.2, 1)";
    };
    readonly participantChange: {
      readonly enabled: true;
      readonly duration: 300;
      readonly easing: "cubic-bezier(0.4, 0, 0.2, 1)";
    };
    readonly screenShareStart: {
      readonly enabled: true;
      readonly duration: 250;
      readonly easing: "cubic-bezier(0.4, 0, 0.2, 1)";
    };
    readonly screenShareEnd: {
      readonly enabled: true;
      readonly duration: 250;
      readonly easing: "cubic-bezier(0.4, 0, 0.2, 1)";
    };
    readonly modeChange: {
      readonly enabled: true;
      readonly duration: 400;
      readonly easing: "cubic-bezier(0.16, 1, 0.3, 1)";
    };
    readonly stageSizeChange: {
      readonly enabled: true;
      readonly duration: 0;
      readonly easing: "cubic-bezier(0.4, 0, 0.2, 1)";
    };
    readonly initial: {
      readonly enabled: false;
      readonly duration: 0;
      readonly easing: "linear";
    };
  };
};
declare const SWIPE: {
  readonly MIN_DISTANCE: 50;
  readonly MAX_TIME: 300;
  readonly VELOCITY_THRESHOLD: 0.3;
  readonly RUBBER_BAND_FACTOR: 0.3;
};
declare const BREAKPOINTS: {
  readonly MOBILE: 768;
};
declare const SIZE_RATIOS: {
  readonly STAGE: {
    readonly DEFAULT: 0.85;
    readonly MIN: 0.2;
    readonly MAX: 0.85;
    readonly MIN_SINGLE_PARTICIPANT: 0.6;
    readonly MIN_MULTIPLE_PARTICIPANTS: 0.65;
  };
  readonly SIDEBAR: {
    readonly WIDTH_RATIO: 0.25;
    readonly MAX_WIDTH: 300;
    readonly MAIN_CONTENT_RATIO: 0.75;
  };
  readonly FOCUS_MOBILE: {
    readonly PRIMARY_HEIGHT_RATIO: 0.6;
    readonly OTHERS_HEIGHT_RATIO: 0.4;
  };
  readonly FLOATING: {
    readonly MAX_WIDTH_RATIO: 0.3;
    readonly MAX_WIDTH: 250;
  };
  readonly MIXED_CONTENT: {
    readonly SCREEN_SHARE_RATIO: 0.6;
    readonly ON_STAGE_RATIO: 0.4;
  };
};
declare const Z_INDEX: {
  readonly DEFAULT: 0;
  readonly FLOATING_TILE: 10;
  readonly DRAGGABLE_DIVIDER: 20;
  readonly OVERLAY: 50;
};
declare const DRAGGABLE_DIVIDER: {
  readonly DEFAULT_HANDLE_SIZE: 24;
  readonly HOVER_HIT_AREA_PADDING: 8;
  readonly VISUAL_HANDLE: {
    readonly VERTICAL: {
      readonly width: 16;
      readonly height: 40;
    };
    readonly HORIZONTAL: {
      readonly width: 40;
      readonly height: 16;
    };
  };
};
declare const UI_POSITIONING: {
  readonly PAGINATION_BOTTOM_OFFSET: 8;
  readonly DIMENSION_INDICATOR_OFFSET: 2;
  readonly PAGINATION_CONTROL_HEIGHT: 25;
  readonly PAGINATION_BUFFER_VERTICAL: 56;
  readonly PAGINATION_BUFFER_HORIZONTAL: 130;
};
declare const STAGE_AUDIENCE: {
  readonly MIN_STAGE_PIXELS: 200;
  readonly ORIENTATION_SWITCH_RATIO: 1.05;
};
declare const SMALL_GROUP: {
  readonly MAX_PARTICIPANTS: 4;
  readonly MAX_HEIGHT_PERCENT: 0.8;
  readonly MIN_TILE_WIDTH: 150;
  readonly MIN_HEIGHT_PERCENT: 0.5;
};
declare const FACE_VISIBILITY: {
  /** Default maximum allowed face clipping (0-1). 0.3 = 30% clipped allowed */
  readonly DEFAULT_MAX_CLIP_THRESHOLD: 0.3;
  /** Default behavior when no config passes: use best-score */
  readonly DEFAULT_FALLBACK_BEHAVIOR: "best-score";
  /** Relaxed thresholds for fallback (progressively more permissive) */
  readonly RELAXED_THRESHOLDS: readonly [0.5, 0.7, 1];
  /** Default video aspect ratio when participant doesn't specify one */
  readonly DEFAULT_VIDEO_ASPECT_RATIO: number;
};
declare const DEFAULT_VALUES: {
  readonly LAYOUT_MODE: "auto";
  readonly PRIORITIZE_SPEAKER: true;
  readonly PRIORITIZE_SCREEN_SHARE: true;
  readonly ENABLE_ANIMATIONS: true;
  readonly PIP_INITIAL_CORNER: "bottom-right";
  readonly PIP_ENABLE_DRAG: true;
  readonly PAGINATION_SHOW_ON_HOVER_ONLY: true;
  readonly PAGINATION_POSITION: "bottom";
  readonly PAGINATION_DISABLED: false;
  readonly MAX_HEIGHT_PERCENT: 1;
  readonly STAGE_AUDIENCE_ALLOW_RESIZE: true;
};
type AspectRatioConfig = {
  minAspectRatio?: number;
  maxAspectRatio?: number;
};
type SpacingConfig = {
  gap?: number;
  padding?: number;
};
type MinTileSizeConfig = {
  minTileWidth?: number;
  minTileHeight?: number;
};
//#endregion
//#region src/hooks/useDividerDrag.d.ts
interface UseDividerDragOptions {
  layout: TileLayout;
  dimensions: LayoutDimensions;
  config: LayoutConfig;
  setStageSize: (size: number, isManual?: boolean) => void;
}
interface UseDividerDragResult {
  isDraggingDivider: boolean;
  dividerPosition: number | null;
  handleDividerMove: (clientX: number, clientY: number, options: DraggableDividerOptions) => void;
  startDividerDrag: (position: number, clientPos: number, options?: DraggableDividerOptions) => void;
  stopDividerDrag: () => void;
}
/**
 * Hook that manages draggable divider functionality for stage-audience layouts.
 * Handles the drag state, position calculations, and bounds checking.
 */
declare function useDividerDrag({ layout, dimensions, config, setStageSize }: UseDividerDragOptions): UseDividerDragResult;
//#endregion
//#region src/layouts/compute-layout.d.ts
/**
 * Sequence-dependent state threaded between layout computations.
 * All three fields feed the next computation's decisions and MUST come from
 * a committed render, never from a speculative one.
 */
interface LayoutFeedback {
  /** Sorted participant ids from the previous computation (sort stability). */
  previousSortedIds: readonly string[];
  /** Tiles actually shown previously (bounds speaker promotion in sorting). */
  actualTilesPerPage: number | null;
  /** Orientation previously shown (stage-audience flip-flop hysteresis). */
  previousOrientation: "horizontal" | "vertical" | undefined;
}
declare const INITIAL_LAYOUT_FEEDBACK: LayoutFeedback;
interface ComputeLayoutInput {
  participants: Participant[];
  dimensions: LayoutDimensions;
  config: CompleteLayoutConfig;
  currentPage: number;
  stageSize: number;
  pipCorner: PiPCorner;
  fullscreenParticipantId?: string | null | undefined;
}
interface ComputeLayoutResult {
  layout: TileLayout;
  adjustedDimensions: LayoutDimensions;
  sortedParticipants: Participant[];
  willNeedPagination: boolean;
  isMobile: boolean;
  isStageAudienceMode: boolean;
}
/**
 * Run the full layout pipeline for one page.
 *
 * Returns the computed result plus the feedback the *next* computation should
 * receive. Callers that render the result commit `nextFeedback`; speculative
 * callers (adjacent-page carousel) simply drop it.
 */
declare function computeLayout(input: ComputeLayoutInput, feedback: LayoutFeedback): {
  result: ComputeLayoutResult;
  nextFeedback: LayoutFeedback;
};
//#endregion
//#region src/hooks/useLayoutCalculation.d.ts
interface UseLayoutCalculationOptions {
  participants: Participant[];
  dimensions: LayoutDimensions;
  config: CompleteLayoutConfig;
  currentPage: number;
  stageSize: number;
  pipCorner: PiPCorner;
  fullscreenParticipantId?: string | null;
}
interface UseLayoutCalculationResult extends ComputeLayoutResult {
  /**
   * The feedback produced by this computation. Pass it to `computeLayout`
   * for speculative sibling computations (adjacent swipe page) so they share
   * this render's sort order and hysteresis without committing their own.
   */
  feedback: LayoutFeedback;
}
/**
 * Thin React wrapper around the pure `computeLayout` pipeline.
 *
 * Reads the previous committed feedback from a ref during render and commits
 * the new feedback in a passive effect — a render React discards (StrictMode
 * double-invoke, interrupted concurrent render) can no longer poison sort
 * stability or orientation hysteresis.
 */
declare function useLayoutCalculation({ participants, dimensions, config, currentPage, stageSize, pipCorner, fullscreenParticipantId }: UseLayoutCalculationOptions): UseLayoutCalculationResult;
//#endregion
//#region src/utils/animationContext.d.ts
/**
 * Context about what triggered a layout change
 */
interface AnimationContext {
  /** The primary trigger that caused the layout change */
  trigger: AnimationTrigger;
  /** Resolved animation settings for the current trigger */
  settings: Required<AnimationSettings>;
}
/**
 * Snapshot of layout state used to detect changes between renders
 */
interface LayoutSnapshot {
  participantIds: Set<string>;
  tiles: TilePosition[];
  participantCount: number;
  hasScreenShare: boolean;
  dimensionWidth: number;
  dimensionHeight: number;
  layoutId: LayoutId;
  stageSize: number;
  currentPage: number;
}
/**
 * Creates a snapshot of the current layout state for change detection
 */
declare function createLayoutSnapshot(participants: Participant[], dimensions: LayoutDimensions, layoutId: LayoutId, stageSize: number, tiles: TilePosition[], currentPage: number): LayoutSnapshot;
/**
 * Detects what type of change triggered a layout recalculation
 * by comparing the current state with the previous snapshot.
 *
 * The detection logic lives in `tile-transitions.detectTrigger` (where the
 * per-tile diffing shares it); this wrapper keeps the historical export and
 * its semantics unchanged.
 */
declare function detectAnimationTrigger(current: LayoutSnapshot, previous: LayoutSnapshot | null, isResizing: boolean, isDraggingDivider: boolean): AnimationTrigger;
/**
 * Resolves the animation settings for a given trigger, merging defaults
 * with global config and trigger-specific overrides.
 */
declare function resolveAnimationSettings(trigger: AnimationTrigger, config: LayoutConfig): Required<AnimationSettings>;
/**
 * Creates an animation context by detecting the trigger and resolving settings.
 * This is a convenience function that combines detection and resolution.
 */
declare function createAnimationContext(current: LayoutSnapshot, previous: LayoutSnapshot | null, config: LayoutConfig, isResizing: boolean, isDraggingDivider: boolean): AnimationContext;
//#endregion
//#region src/utils/tile-transitions.d.ts
/** Position/size deltas at or below this many pixels are float noise, not motion. */
declare const DEFAULT_TRANSITION_EPSILON = 0.5;
/** Default bound on how many exiting tiles are retained at once. */
declare const DEFAULT_MAX_EXITING_TILES = 8;
interface TileRect {
  x: number;
  y: number;
  width: number;
  height: number;
}
type TileChange = "entered" | "exited" | "moved" | "resized" | "unchanged";
interface TileDiff {
  participantId: string;
  change: TileChange;
  /** Rect on the previous snapshot; null for tiles that just entered. */
  from: TileRect | null;
  /** Rect on the current snapshot; null for tiles that just exited. */
  to: TileRect | null;
}
interface LayoutDiff {
  /** The layout-level trigger, identical to `detectAnimationTrigger`. */
  trigger: AnimationTrigger;
  /** One entry per current tile plus one per tile that just exited. */
  tiles: TileDiff[];
  /** Convenience id lists per change kind. */
  entered: string[];
  exited: string[];
  moved: string[];
  resized: string[];
  unchanged: string[];
}
interface DiffLayoutOptions {
  isResizing?: boolean;
  isDraggingDivider?: boolean;
  /** Pixel tolerance below which a delta is "unchanged". Default 0.5. */
  epsilon?: number;
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
declare function diffLayout(current: LayoutSnapshot, previous: LayoutSnapshot | null, options?: DiffLayoutOptions): LayoutDiff;
interface ExitingTile {
  participantId: string;
  /** Where the tile was when it exited — the rect to animate out from. */
  from: TileRect;
  /** The presence generation at which the tile exited. */
  generation: number;
}
interface TilePresence {
  /** Monotonic counter, bumped once per `advancePresence` call. */
  generation: number;
  /** Tiles retained for exit animation, newest first. */
  exiting: ExitingTile[];
}
declare const INITIAL_TILE_PRESENCE: TilePresence;
interface AdvancePresenceOptions {
  /**
   * Upper bound on retained exiting tiles; oldest are dropped first so
   * emptying a large room cannot retain every departed tile. Default 8.
   */
  maxExitingTiles?: number;
}
/**
 * Fold a layout diff into the exit-retention state. Newly exited tiles are
 * retained (newest first); tiles that re-entered stop exiting immediately.
 * Callers drop a tile via `removeExitedTiles` once its exit animation ends.
 */
declare function advancePresence(presence: TilePresence, diff: LayoutDiff, options?: AdvancePresenceOptions): TilePresence;
/** Drop tiles whose exit animation has finished. */
declare function removeExitedTiles(presence: TilePresence, participantIds: readonly string[]): TilePresence;
//#endregion
//#region src/hooks/useSwipeGestures.d.ts
type SwipePhase = "idle" | "dragging" | "snapping";
type SwipeDirection = "next" | "previous" | null;
interface UseSwipeGesturesOptions {
  totalPages: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  nextPage: () => void;
  previousPage: () => void;
  containerWidth: number;
  gap: number;
}
interface UseSwipeGesturesResult {
  swipeHandlers: {
    onTouchStart?: (e: React$1.TouchEvent) => void;
    onTouchMove?: (e: React$1.TouchEvent) => void;
    onTouchEnd?: (e: React$1.TouchEvent) => void;
  };
  swipeDragOffset: number;
  swipePhase: SwipePhase;
  /** Which adjacent page is being swiped toward (used to render it off-screen) */
  swipeDirection: SwipeDirection;
}
/**
 * Hook that manages swipe gesture functionality for mobile pagination.
 * Implements a three-phase state machine (idle → dragging → snapping → idle)
 * with real-time drag offset tracking for carousel-style swipe animations.
 *
 * During dragging and snapping, both the current page and the adjacent page
 * should be rendered simultaneously — the swipe direction tells the renderer
 * which adjacent page to show and where to place it.
 */
declare function useSwipeGestures({ totalPages, canGoNext, canGoPrevious, nextPage, previousPage, containerWidth, gap }: UseSwipeGesturesOptions): UseSwipeGesturesResult;
//#endregion
//#region src/hooks/useLayoutRenderers.d.ts
interface UseLayoutRenderersOptions {
  layout: TileLayout;
  dimensions: LayoutDimensions;
  config: LayoutConfig;
  stageSize: number;
  isDraggingDivider: boolean;
  dividerPosition: number | null;
  startDividerDrag: (position: number, clientPos: number, options?: DraggableDividerOptions) => void;
  isCalculating: boolean;
  totalPages: number;
  validPage: number;
  goToPage: (page: number) => void;
  paginationStyles?: React$1.CSSProperties;
  isDraggingPip: boolean;
  pipDragOffset: {
    x: number;
    y: number;
  };
  exitingFullscreenId: string | null;
  handlePipDragStart: (e: React$1.MouseEvent | React$1.TouchEvent, tile: any) => void;
  /** Resolved animation settings for the current layout change trigger */
  animationSettings?: Required<AnimationSettings>;
  /** Current swipe drag offset in pixels (0 when idle) */
  swipeDragOffset: number;
  /** Current swipe phase */
  swipePhase: SwipePhase;
  /** Swipe direction for adjacent page rendering */
  swipeDirection: SwipeDirection;
  /** Layout for the adjacent page (only set during active swipe) */
  adjacentLayout: TileLayout | null;
  /** Per-tile transition data (headless animation contract). */
  tileTransitions: {
    diff: LayoutDiff;
    settings: Required<AnimationSettings>;
    generation: number;
    exitingTiles: ExitingTile[];
  };
}
interface UseLayoutRenderersResult {
  renderDraggableDivider: (options?: DraggableDividerOptions) => React$1.ReactElement | null;
  renderAreaPlaceholders: (options?: AreaPlaceholdersOptions) => React$1.ReactElement | null;
  renderPaginationControls: (options?: PaginationControlsOptions) => React$1.ReactElement | null;
  renderLayoutStateIndicators: (options?: LayoutStateIndicatorsOptions) => React$1.ReactElement;
  renderTiles: (renderFn: TileRenderFunction, options?: TileRenderOptions) => (React$1.ReactElement | null)[];
}
/**
 * Hook that provides render function factories for various UI components.
 * This includes dividers, area placeholders, pagination controls, state indicators, and tiles.
 */
declare function useLayoutRenderers({ layout, dimensions, config, stageSize, isDraggingDivider, dividerPosition, startDividerDrag, isCalculating, totalPages, validPage, goToPage, paginationStyles, isDraggingPip, pipDragOffset, handlePipDragStart, animationSettings, exitingFullscreenId, swipeDragOffset, swipePhase, swipeDirection, adjacentLayout, tileTransitions }: UseLayoutRenderersOptions): UseLayoutRenderersResult;
//#endregion
//#region src/hooks/usePaginationState.d.ts
interface UsePaginationStateOptions {
  layout: TileLayout;
  config: LayoutConfig;
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
}
interface UsePaginationStateResult {
  currentPage: number;
  totalPages: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  validPage: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  paginationStyles?: React$1.CSSProperties;
  isPaginationVisible: boolean;
  setContainerHovered: (hovered: boolean) => void;
}
/**
 * Hook that manages pagination state and styling for layouts with multiple pages.
 * Handles page navigation, visibility logic, and positioning calculations.
 */
declare function usePaginationState({ layout, config, currentPage: externalCurrentPage, setCurrentPage: externalSetCurrentPage }: UsePaginationStateOptions): UsePaginationStateResult;
//#endregion
//#region src/hooks/usePipDrag.d.ts
interface UsePipDragOptions {
  config: LayoutConfig;
  dimensions: LayoutDimensions;
  setPipCorner: (corner: PiPCorner) => void;
  tiles: TilePosition[];
}
interface UsePipDragResult {
  isDraggingPip: boolean;
  pipDragOffset: {
    x: number;
    y: number;
  };
  handlePipDragStart: (e: React$1.MouseEvent | React$1.TouchEvent, tile: TilePosition) => void;
}
/**
 * Hook that manages Picture-in-Picture tile dragging functionality.
 * Handles drag state, position tracking, and corner snapping logic.
 */
declare function usePipDrag({ config, dimensions, setPipCorner, tiles }: UsePipDragOptions): UsePipDragResult;
//#endregion
//#region src/hooks/useStageAudienceState.d.ts
interface UseStageAudienceStateOptions {
  config: LayoutConfig;
  dimensions: LayoutDimensions;
  participants: Participant[];
}
interface UseStageAudienceStateResult {
  stageSize: number;
  setStageSize: (size: number, isManualAdjustment?: boolean) => void;
}
/**
 * Hook that manages stage size state for stage-audience layouts.
 * Handles automatic optimal size calculations and manual adjustments.
 */
declare function useStageAudienceState({ config, dimensions, participants }: UseStageAudienceStateOptions): UseStageAudienceStateResult;
//#endregion
//#region src/hooks/useTileLayout.d.ts
/**
 * Input for container - can be either a ref to an HTML element or explicit dimensions
 */
type ContainerInput = React$1.RefObject<HTMLElement | null> | LayoutDimensions;
/**
 * Result object returned by the useTileLayout hook
 */
interface UseTileLayoutResult {
  /** The calculated tile layout with tile positions and dimensions */
  layout: TileLayout;
  /** Generic tile visibility window for consumers that need current and adjacent tile IDs */
  visibilityWindow: TileVisibilityWindow;
  /** Whether the layout is currently being calculated (useful for loading states) */
  isCalculating: boolean;
  /** Whether the container is currently resizing */
  isResizing: boolean;
  /**
   * Whether the container has a real (non-zero) measurement. False on mount
   * when using a ref container until the first ResizeObserver delivery, and
   * whenever the container measures 0×0. While false, `layout.tiles` is empty
   * and no pagination is reported — gate loading states and chrome on this
   * instead of duplicating a "has measured" guard in the consumer.
   */
  isMeasured: boolean;
  /** Current page index (0-based) for paginated layouts */
  currentPage: number;
  /** Total number of pages in the current layout */
  totalPages: number;
  /** Whether there is a next page available */
  canGoNext: boolean;
  /** Whether there is a previous page available */
  canGoPrevious: boolean;
  /** Navigate to a specific page (will be clamped to valid range) */
  goToPage: (page: number) => void;
  /** Navigate to the next page if available */
  nextPage: () => void;
  /** Navigate to the previous page if available */
  previousPage: () => void;
  /** CSS styles for positioning the pagination controls (absolute positioning) */
  paginationStyles?: React$1.CSSProperties;
  /**
   * Render the draggable divider for stage-audience layouts
   * @example
   * // Simplest usage - uses default styling
   * {renderDraggableDivider({ onPositionChange: setStageSize })}
   *
   * // With custom UI
   * {renderDraggableDivider({
   *   onPositionChange: setStageSize,
   *   children: (props) => <MyCustomDivider {...props} />
   * })}
   */
  renderDraggableDivider: (options?: DraggableDividerOptions) => React$1.ReactElement | null;
  /** Render area placeholders shown during divider dragging */
  renderAreaPlaceholders: (options?: AreaPlaceholdersOptions) => React$1.ReactElement | null;
  /** Render pagination controls */
  renderPaginationControls: (options?: PaginationControlsOptions) => React$1.ReactElement | null;
  /** Render layout state indicators (calculating state, dimensions) */
  renderLayoutStateIndicators: (options?: LayoutStateIndicatorsOptions) => React$1.ReactElement | null;
  /** Whether the divider is currently being dragged */
  isDraggingDivider: boolean;
  /** Current divider position in pixels (null when not dragging) */
  dividerPosition: number | null;
  /** Current stage size percentage (0-100) for stage-audience layouts */
  stageSize: number;
  /** Update stage size (useful for external controls) */
  setStageSize: (size: number) => void;
  /** Render tiles with a custom render function */
  renderTiles: (renderFn: TileRenderFunction, options?: TileRenderOptions) => (React$1.ReactElement | null)[];
  /** Current PiP corner position */
  pipCorner: PiPCorner;
  /** Update PiP corner position */
  setPipCorner: (corner: PiPCorner) => void;
  /** Whether pagination should be visible based on hover state and configuration */
  isPaginationVisible: boolean;
  /** Set hover state for the container (use with onMouseEnter/onMouseLeave) */
  setContainerHovered: (hovered: boolean) => void;
  /** Whether the device supports touch (for mobile detection) */
  isTouchDevice: boolean;
  /** Whether a swipe gesture is currently active (dragging or snapping) */
  isSwiping: boolean;
  /** Touch event handlers for swipe gesture pagination on mobile */
  swipeHandlers: {
    onTouchStart?: (e: React$1.TouchEvent) => void;
    onTouchMove?: (e: React$1.TouchEvent) => void;
    onTouchEnd?: (e: React$1.TouchEvent) => void;
  };
  /** Currently fullscreened participant ID */
  fullscreenParticipantId: string | null;
  /** Set a participant to fullscreen mode */
  setFullscreenParticipant: (participantId: string | null) => void;
  /** Exit fullscreen mode */
  exitFullscreen: () => void;
  /** Toggle fullscreen for a participant */
  toggleFullscreen: (participantId: string) => void;
  /** Update aspect ratio for a participant (debounced internally) */
  updateParticipantAspectRatio: (participantId: string, aspectRatio: number | undefined) => void;
  /** Get current aspect ratio for a participant */
  getParticipantAspectRatio: (participantId: string) => number | undefined;
  /** Props to spread on the container element (includes hover handlers) */
  containerProps: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onTouchStart?: (e: React$1.TouchEvent) => void;
    onTouchMove?: (e: React$1.TouchEvent) => void;
    onTouchEnd?: (e: React$1.TouchEvent) => void;
    style?: React$1.CSSProperties;
  };
  /** O(1) participant lookup by ID */
  getParticipant: (participantId: string) => Participant | undefined;
  /** Direct access to participant map for advanced use cases */
  participantMap: Map<string, Participant>;
  /** Debug overlay controls */
  debugOverlays: {
    showAreaOverlays: boolean;
    toggleAreaOverlays: () => void;
    showGridLines: boolean;
    toggleGridLines: () => void;
    showTileInfo: boolean;
    toggleTileInfo: () => void;
  };
  /** The trigger that caused the most recent layout change */
  animationTrigger: AnimationTrigger;
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
declare function useTileLayout(participants: Participant[], container: ContainerInput, config?: LayoutConfig): UseTileLayoutResult;
//#endregion
//#region src/hooks/useTileTransitions.d.ts
/** @public */
interface UseTileTransitionsOptions {
  layout: TileLayout;
  participants: Participant[];
  dimensions: LayoutDimensions;
  stageSize: number;
  currentPage: number;
  isResizing: boolean;
  isDraggingDivider: boolean;
  swipePhase: SwipePhase;
  config: CompleteLayoutConfig;
}
/** @public */
interface UseTileTransitionsResult {
  /** Per-tile diff for the current layout against the previous committed one. */
  diff: LayoutDiff;
  /** The layout-level trigger (same semantics as before). */
  animationTrigger: AnimationTrigger;
  /** Resolved animation settings for the trigger. */
  animationSettings: Required<AnimationSettings>;
  /** Tiles retained for exit animation (empty unless exitRetention is on). */
  exitingTiles: ExitingTile[];
  /** Monotonic generation for consumers keying animation restarts. */
  generation: number;
  /** Remove tiles whose exit animation finished (also called by the timer). */
  commitExit: (participantIds: string[]) => void;
  /**
   * Tiles of the previous committed layout (used by the fullscreen
   * enter-merge). Read during render, committed in a passive effect.
   */
  getPreviousTiles: () => TilePosition[] | null;
}
declare function useTileTransitions({ layout, participants, dimensions, stageSize, currentPage, isResizing, isDraggingDivider, swipePhase, config }: UseTileTransitionsOptions): UseTileTransitionsResult;
//#endregion
//#region src/layouts/auto.d.ts
interface AutoLayoutConfig {
  maxTilesPerPage: number;
  currentPage?: number;
  minTileSize?: {
    width: number;
    height: number;
  };
  minAspectRatio?: number;
  maxAspectRatio?: number;
  maxHeightPercent?: number;
  stageSize?: number;
  /** Orientation currently shown, threaded through to add hysteresis to stage-audience layouts */
  currentOrientation?: "horizontal" | "vertical";
  pipPosition?: PiPCorner;
  pipSizeRatio?: number;
  fitScreenshareAspectRatio?: boolean;
  screenShareContentInsets?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  scoringWeights?: {
    participantCoverage?: number;
    tileSize?: number;
    spaceEfficiency?: number;
    gridBalance?: number;
    tileAspectRatio?: number;
    emptySpotsPenalty?: number;
  };
  allowResize?: boolean;
  /** Horizontal alignment for grid dispatches. Default "center". */
  align?: "start" | "center" | "end";
  /** Final-row fill policy for grid dispatches. Default "center". */
  lastRowPolicy?: "center" | "mosaic";
  fullscreenParticipantId?: string | null;
  /** Face visibility configuration for grid optimization */
  faceVisibilityConfig?: FaceVisibilityConfig;
}
declare function autoLayout(participants: Participant[], dimensions: LayoutDimensions, config: AutoLayoutConfig): TileLayout;
//#endregion
//#region src/layouts/focus.d.ts
interface SimpleFocusConfig {
  primaryId?: string;
  maxTilesPerPage?: number;
  currentPage?: number;
  minTileSize?: {
    width: number;
    height: number;
  };
  isMobile?: boolean;
  minAspectRatio?: number;
  maxAspectRatio?: number;
}
declare function simpleFocusLayout(participants: Participant[], dimensions: LayoutDimensions, config?: SimpleFocusConfig): TileLayout;
//#endregion
//#region src/layouts/fullscreen.d.ts
interface FullscreenLayoutConfig {
  /** Current page index (0-based) for cycling through participants */
  currentPage?: number;
  /** Minimum aspect ratio constraint (optional) */
  minAspectRatio?: number;
  /** Maximum aspect ratio constraint (optional) */
  maxAspectRatio?: number;
  /** Specific participant ID to show in fullscreen (takes precedence over currentPage) */
  fullscreenParticipantId?: string | null;
}
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
declare function fullscreenLayout(participants: Participant[], dimensions: LayoutDimensions, config?: FullscreenLayoutConfig): TileLayout;
//#endregion
//#region src/layouts/grid.d.ts
interface SimpleGridConfig {
  maxTilesPerPage?: number;
  currentPage?: number;
  minTileSize?: {
    width: number;
    height: number;
  };
  minAspectRatio?: number;
  maxAspectRatio?: number;
  scoringWeights?: {
    participantCoverage?: number;
    tileSize?: number;
    spaceEfficiency?: number;
    gridBalance?: number;
    tileAspectRatio?: number;
    emptySpotsPenalty?: number;
  };
  /** Face visibility configuration for grid optimization */
  faceVisibilityConfig?: FaceVisibilityConfig;
  /** Horizontal alignment of the grid within the container. Default "center". */
  align?: "start" | "center" | "end";
  /** How an incomplete final row fills the grid width. Default "center". */
  lastRowPolicy?: "center" | "mosaic";
}
declare function simpleGridLayout(participants: Participant[], dimensions: LayoutDimensions, config?: SimpleGridConfig): TileLayout;
//#endregion
//#region src/layouts/picture-in-picture.d.ts
interface PictureInPictureConfig {
  pipPosition?: PiPCorner;
  pipSizeRatio?: number;
  minAspectRatio?: number;
  maxAspectRatio?: number;
}
declare function pictureInPictureLayout(participants: Participant[], dimensions: LayoutDimensions, config?: PictureInPictureConfig): TileLayout;
//#endregion
//#region src/layouts/small-group.d.ts
interface SmallGroupConfig {
  maxParticipants?: number;
  targetAspectRatio?: number;
  maxHeightPercent?: number;
}
/**
 * Small group layout optimized for 2-4 participants
 * Arranges tiles horizontally with a 3:4 aspect ratio
 * Ensures good visibility by limiting height usage
 */
declare function smallGroupLayout(participants: Participant[], dimensions: LayoutDimensions, config?: SmallGroupConfig): TileLayout;
/**
 * Check if small group layout should be used
 * Returns true if all participants can fit horizontally with 3:4 aspect ratio
 * AND the container is wide enough that a horizontal row makes sense
 * AND (if face visibility is enabled) faces won't be clipped
 */
declare function shouldUseSmallGroupLayout({ participantCount, containerWidth, containerHeight, gap, padding, maxParticipants, maxTilesPerPage, targetAspectRatio, maxHeightPercent, participants, faceVisibilityConfig }: {
  participantCount: number;
  containerWidth: number;
  containerHeight: number;
  gap?: number;
  padding?: number;
  maxParticipants?: number;
  targetAspectRatio?: number;
  maxHeightPercent?: number;
  maxTilesPerPage?: number;
  /** Participants for face visibility checking (optional) */
  participants?: Participant[];
  /** Face visibility configuration (optional) */
  faceVisibilityConfig?: FaceVisibilityConfig;
}): boolean;
//#endregion
//#region src/layouts/stage-audience.d.ts
interface SimpleStageAudienceConfig extends StageAudienceConfig {
  maxAudiencePerPage: number;
  currentPage?: number;
  orientation?: "auto" | "horizontal" | "vertical";
  /**
   * Orientation currently shown on screen (from the previous render). Enables
   * hysteresis so auto orientation doesn't flip-flop on minor resize events.
   */
  currentOrientation?: "horizontal" | "vertical";
  minAspectRatio?: number;
  maxAspectRatio?: number;
  fitScreenshareAspectRatio?: boolean;
  scoringWeights?: {
    participantCoverage?: number;
    tileSize?: number;
    spaceEfficiency?: number;
    gridBalance?: number;
    tileAspectRatio?: number;
    emptySpotsPenalty?: number;
  };
}
declare function simpleStageAudienceLayout(participants: Participant[], dimensions: LayoutDimensions, config?: SimpleStageAudienceConfig): TileLayout;
declare function layoutSingleParticipant({ participant, area, aspectRatioConstraints, minTileSize, defaultScreenShareAspectRatio, screenShareContentInsets }: {
  participant: Participant;
  area: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  aspectRatioConstraints: {
    minAspectRatio: number;
    maxAspectRatio: number;
  };
  minTileSize: {
    width: number;
    height: number;
  };
  defaultScreenShareAspectRatio?: number;
  screenShareContentInsets?: StageAudienceConfig["screenShareContentInsets"];
}): {
  tiles: TilePosition[];
  overflowParticipants: string[];
  rows: number;
  columns: number;
};
//#endregion
//#region src/utils/bounds-manager.d.ts
interface BoundsResult {
  /** Minimum stage percentage (0-100) */
  minStagePercent: number;
  /** Maximum stage percentage (0-100) */
  maxStagePercent: number;
  /** Whether this is a manual adjustment that should skip auto-sizing */
  isManualAdjustment: boolean;
  /** The bounds source for debugging */
  source: "dynamic" | "config" | "hardcoded";
}
interface BoundsCalculationInput {
  /** Container dimensions */
  dimensions: LayoutDimensions;
  /** Whether this is a vertical layout (stage top/bottom) */
  isVertical: boolean;
  /** User configuration */
  config?: StageAudienceConfig;
  /** Whether this is a manual adjustment (dragging) */
  isManualAdjustment?: boolean;
  /** Context for debugging */
  context?: string;
  /** Participant counts for more accurate bounds */
  participantCounts?: {
    stage: number;
    audience: number;
  };
}
/**
 * THE single function that calculates bounds for stage-audience layouts
 * All other systems MUST use this function - no exceptions!
 */
declare function calculateStageBounds(input: BoundsCalculationInput): BoundsResult;
/**
 * Validates and clamps a stage size percentage using calculated bounds
 */
declare function clampStageSize(stagePercent: number, bounds: BoundsResult, context?: string): number;
//#endregion
//#region src/utils/bounds-wrapper.d.ts
/**
 * Simple helper for drag handlers to get consistent bounds
 */
declare function getDragBounds(dimensions: LayoutDimensions, isVertical: boolean, config?: any, participantCounts?: {
  stage: number;
  audience: number;
}): BoundsResult;
//#endregion
//#region src/utils/debounce.d.ts
declare function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void;
//#endregion
//#region src/utils/device-detection.d.ts
/**
 * Detects if the current device has touch capabilities.
 * This is primarily used for enabling/disabling swipe gestures and touch-specific interactions.
 *
 * Note: This is a one-time detection that runs when called. It does not track changes
 * to touch capability (which is rare outside of browser DevTools).
 *
 * @returns true if the device supports touch input, false otherwise
 */
declare function isTouchDevice(): boolean;
//#endregion
//#region src/utils/face-visibility.d.ts
/**
 * Represents the visible region of a video after object-fit: cover is applied.
 * Coordinates are in normalized 0-1000 space.
 */
interface VisibleRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}
/**
 * Result of face visibility evaluation for a grid configuration.
 */
interface FaceVisibilityResult {
  /** Whether the configuration passes the face visibility check */
  isValid: boolean;
  /** Maximum clip percentage found among all participants with faces */
  maxClipPercentage: number;
  /** Details per participant (only those with faceBox defined) */
  participantDetails: Array<{
    participantId: string;
    clipPercentage: number;
    isClipped: boolean;
  }>;
}
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
declare function calculateVisibleRegion(videoAspectRatio: number, tileAspectRatio: number): VisibleRegion;
/**
 * Calculate what percentage of a face is clipped (not visible) when displayed
 * in a tile with object-fit: cover.
 *
 * @param faceBox - The face bounding box in normalized 0-1000 coordinates
 * @param visibleRegion - The visible region of the video after cropping
 * @returns Clip percentage (0 = fully visible, 1 = fully clipped)
 */
declare function calculateFaceClipPercentage(faceBox: FaceBoundingBox, visibleRegion: VisibleRegion): number;
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
declare function evaluateFaceVisibility(participants: Participant[], tileAspectRatio: number, maxClipThreshold?: number): FaceVisibilityResult;
/**
 * Check if any participants have 2+ faces that require visibility checking.
 * Single faces are handled by face zoom/centering, so we only check when
 * there are multiple faces.
 */
declare function hasAnyFaceData(participants?: Participant[]): boolean;
/**
 * Get the resolved face visibility configuration with defaults.
 */
declare function resolveFaceVisibilityConfig(config?: FaceVisibilityConfig): Required<FaceVisibilityConfig>;
/**
 * Result of checking if a layout should be rejected for face visibility.
 */
interface FaceVisibilityCheckResult {
  /** Whether the layout should be rejected */
  shouldReject: boolean;
  /** Reason for rejection (if rejected) */
  reason?: string;
  /** Face visibility evaluation details (if participants have face data) */
  faceVisibility?: {
    maxClipPercentage: number;
    isValid: boolean;
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
declare function checkFaceVisibility(participants: Participant[] | undefined, tileAspectRatio: number, config?: FaceVisibilityConfig): FaceVisibilityCheckResult;
//#endregion
//#region src/utils/layout-utils.d.ts
/**
 * Grid calculation result
 */
interface GridResult {
  rows: number;
  columns: number;
  tileWidth: number;
  tileHeight: number;
  valid: boolean;
}
/**
 * Options for grid calculation
 */
interface GridCalculationOptions {
  minTileWidth?: number;
  minTileHeight?: number;
  minAspectRatio?: number;
  maxAspectRatio?: number;
  /** Preferred aspect ratio target for scoring tileAspectRatio component */
  preferredAspectRatio?: number;
  scoringWeights?: {
    participantCoverage?: number;
    tileSize?: number;
    spaceEfficiency?: number;
    gridBalance?: number;
    tileAspectRatio?: number;
    emptySpotsPenalty?: number;
  };
  /** Participants for face visibility checking */
  participants?: Participant[];
  /** Face visibility configuration */
  faceVisibilityConfig?: FaceVisibilityConfig;
}
/**
 * Options for positioning tiles
 */
interface PositionTilesOptions {
  gap: number;
  padding?: number;
  centerLastRow?: boolean;
  centerHorizontally?: boolean;
  centerVertically?: boolean;
  /**
   * Horizontal alignment of the whole grid inside the area. Overrides
   * `centerHorizontally` when set. Default: center.
   */
  align?: "start" | "center" | "end";
  /**
   * How an incomplete final row fills the grid width:
   * - "center" (default): keep tile size, center the short row
   * - "mosaic": stretch the final row's tiles to span the full grid width
   */
  lastRowPolicy?: "center" | "mosaic";
}
/**
 * Calculates the final content size within a container to fit a target aspect ratio.
 * Used by focus and stage-audience layouts.
 */
declare function fitAspectRatio(containerWidth: number, containerHeight: number, targetRatio: number): {
  contentWidth: number;
  contentHeight: number;
};
/**
 * Calculate optimal grid dimensions for a given tile count.
 * Evaluates all possible configurations and returns the best.
 * Returns both the grid result and configuration details for comparison/logging.
 */
declare function calculateOptimalGrid({ tileCount, containerWidth, containerHeight, gap, options }: {
  tileCount: number;
  containerWidth: number;
  containerHeight: number;
  gap: number;
  options?: GridCalculationOptions;
}): {
  grid: GridResult;
  configDetails: ConfigDetails;
} | null;
/**
 * Interface for tracking configuration details for comparison
 */
interface ConfigDetails {
  rows: number;
  cols: number;
  score: number;
  scoreBreakdown: ScoringComponents;
  weights: ScoringWeights;
  tileWidth: number;
  tileHeight: number;
  containerWidth: number;
  containerHeight: number;
  minTileWidth: number;
  minTileHeight: number;
  minAspectRatio: number;
  maxAspectRatio: number;
  gap: number;
}
/**
 * Calculate optimal grid with reduced tile count.
 * Tries progressively fewer tiles until a valid grid is found.
 */
declare function calculateOptimalGridWithReducedCount({ maxTileCount, containerWidth, containerHeight, gap, options }: {
  maxTileCount: number;
  containerWidth: number;
  containerHeight: number;
  gap: number;
  options?: GridCalculationOptions;
}): {
  grid: GridResult;
  actualTileCount: number;
} | null;
/**
 * Position tiles within a grid layout.
 * Handles centering of the last row if it's not full.
 */
declare function positionTilesInGrid(participants: Participant[], area: {
  x: number;
  y: number;
  width: number;
  height: number;
}, grid: GridResult, options: PositionTilesOptions): TilePosition[];
/**
 * Calculate the maximum number of tiles that can fit in a grid.
 * Useful for determining pagination limits.
 */
declare function calculateGridCapacity({ width, height, gap, minTileSize, minAspectRatio, maxAspectRatio }: {
  width: number;
  height: number;
  gap: number;
  minTileSize: {
    width: number;
    height: number;
  };
  minAspectRatio?: number;
  maxAspectRatio?: number;
}): number;
//#endregion
//#region src/utils/layout-scoring.d.ts
/**
 * Core scoring components calculated from layout metrics
 */
interface ScoringComponents {
  participantCoverage: number;
  tileSize: number;
  spaceEfficiency: number;
  gridBalance: number;
  tileAspectRatio: number;
  emptySpotsPenalty: number;
}
/**
 * Weights for scoring components
 */
interface ScoringWeights {
  participantCoverage: number;
  tileSize: number;
  spaceEfficiency: number;
  gridBalance: number;
  tileAspectRatio: number;
  emptySpotsPenalty: number;
}
/**
 * Normalizes scoring weights to ensure they sum to 1.0
 * This ensures consistent scoring across different weight configurations.
 */
declare function normalizeScoringWeights(weights: Partial<ScoringWeights>): ScoringWeights;
/**
 * Unified function to calculate grid scoring components and final score.
 * This is the single source of truth for all scoring logic.
 */
declare function calculateGridScore({ participantCoverage, averageTileArea, spaceUtilization, gridBalance, averageAspectRatio, emptySpotsPenalty, minTileWidth, minTileHeight, containerArea, visibleTiles, scoringWeights, preferredAspectRatio }: {
  participantCoverage: number;
  averageTileArea: number;
  spaceUtilization: number;
  gridBalance: number;
  averageAspectRatio: number;
  emptySpotsPenalty: number;
  minTileWidth: number;
  minTileHeight: number;
  containerArea: number;
  visibleTiles: number;
  scoringWeights?: GridCalculationOptions["scoringWeights"];
  preferredAspectRatio?: number;
}): {
  score: number;
  scoreBreakdown: ScoringComponents;
  weights: ScoringWeights;
};
/**
 * Calculate the overall score for a complete layout including all tiles
 * This evaluates the layout as a whole, treating all tiles uniformly
 */
declare function calculateLayoutScore({ totalTiles, visibleTiles, containerWidth, containerHeight, tilePositions, minTileWidth, minTileHeight, scoringWeights }: {
  totalTiles: number;
  visibleTiles: number;
  containerWidth: number;
  containerHeight: number;
  tilePositions: Array<{
    width: number;
    height: number;
    x: number;
    y: number;
  }>;
  minTileWidth?: number;
  minTileHeight?: number;
  scoringWeights?: GridCalculationOptions["scoringWeights"];
}): {
  score: number;
  scoreBreakdown: ScoringComponents;
  weights: ScoringWeights;
  metrics: {
    averageTileWidth: number;
    averageTileHeight: number;
    averageTileArea: number;
    minTileArea: number;
    maxTileArea: number;
    totalTilesArea: number;
    containerArea: number;
    spaceUtilization: number;
  };
};
//#endregion
//#region src/utils/sorting.d.ts
declare function sortParticipants(participants: Participant[], options?: {
  prioritizeSpeaker?: boolean;
  prioritizeScreenShare?: boolean;
  prioritizePinned?: boolean;
  currentPageInfo?: {
    maxTilesPerPage: number;
  };
}): Participant[];
//#endregion
//#region src/utils/stage-audience-helpers.d.ts
/**
 * Determines which participants should be on the stage
 */
declare function getStageParticipants(participants: Participant[]): {
  stage: Participant[];
  audience: Participant[];
};
/**
 * Determines the optimal orientation based on container dimensions and participant counts
 */
declare function determineOrientation({ containerWidth, containerHeight, stageCount, audienceCount: _audienceCount, forceOrientation }: {
  containerWidth: number;
  containerHeight: number;
  stageCount: number;
  audienceCount: number;
  forceOrientation?: "horizontal" | "vertical";
}): "horizontal" | "vertical";
/**
 * Calculate optimal stage size percentage based on participant configuration and container dimensions
 */
declare function calculateOptimalStageSize({ stageParticipantCount, audienceParticipantCount, containerWidth, containerHeight, hasScreenShare, minStagePercent, maxStagePercent, stageParticipants }: {
  stageParticipantCount: number;
  audienceParticipantCount: number;
  containerWidth: number;
  containerHeight: number;
  hasScreenShare?: boolean;
  minStagePercent?: number;
  maxStagePercent?: number;
  stageParticipants?: Participant[];
}): number;
//#endregion
export { ANIMATION, ASPECT_RATIOS, type AdvancePresenceOptions, type AnimationContext, type AnimationSettings, type AnimationTrigger, type AreaPlaceholdersOptions, AspectRatioConfig, type AudienceContainer, type AudienceInfo, BREAKPOINTS, type BoundsCalculationInput, type BoundsResult, type CompleteLayoutConfig, type ComputeLayoutInput, type ComputeLayoutResult, type ConfigContext, type ConfigDetails, type ContainerInput, DEFAULT_LAYOUT_CONFIG, DEFAULT_MAX_EXITING_TILES, DEFAULT_MEETING_LAYOUT_CONFIG, DEFAULT_SCREEN_SHARE_ASPECT_RATIO, DEFAULT_TRANSITION_EPSILON, DEFAULT_VALUES, DRAGGABLE_DIVIDER, DefaultDraggableDivider, type DiffLayoutOptions, type DividerHandleIconProps, type DraggableDividerOptions, type DraggableDividerRenderProps, type ExitingTile, FACE_VISIBILITY, type FaceBoundingBox, type FaceVisibilityCheckResult, type FaceVisibilityConfig, type FaceVisibilityResult, type FullscreenLayoutConfig, GRID_SCORING, type GridCalculationOptions, type GridResult, type GridScoringWeights, INITIAL_LAYOUT_FEEDBACK, INITIAL_TILE_PRESENCE, type LayoutConfig, type LayoutDiff, type LayoutDimensions, type LayoutFeedback, type LayoutId, type LayoutMode, type LayoutSnapshot, type LayoutStateIndicatorsOptions, type LayoutTile, MIN_TILE_SIZES, type MeetingLayoutConfigOptions, MinTileSizeConfig, PAGINATION, PERFORMANCE, type PaginationControlsOptions, PaginationDots, type PaginationInfo, type Participant, type PiPCorner, type PictureInPictureConfig, type PositionTilesOptions, SIZE_RATIOS, SMALL_GROUP, SPACING, STAGE_AUDIENCE, SWIPE, type ScoringComponents, type ScoringWeights, type SimpleFocusConfig, type SimpleGridConfig, type SmallGroupConfig, SpacingConfig, type StageAudienceConfig, type StageAudienceLayout, type StageContainer, type SwipeDirection, type SwipePhase, type TileChange, type TileDiff, type TileLayout, type TileLayoutRenderFunctions, type TilePosition, type TilePresence, type TileRect, type TileRenderFunction, type TileRenderOptions, type TileRenderProps, type TileTransition, type TileVisibilityWindow, UI_POSITIONING, type UseTileLayoutResult, type UseTileTransitionsOptions, type UseTileTransitionsResult, type VisibleRegion, Z_INDEX, advancePresence, autoLayout, calculateFaceClipPercentage, calculateGridCapacity, calculateGridScore, calculateLayoutScore, calculateOptimalGrid, calculateOptimalGridWithReducedCount, calculateOptimalStageSize, calculateStageBounds, calculateVisibleRegion, checkFaceVisibility, clampStageSize, computeLayout, createAnimationContext, createLayoutSnapshot, createMeetingLayoutConfig, debounce, detectAnimationTrigger, determineOrientation, diffLayout, evaluateFaceVisibility, fitAspectRatio, fullscreenLayout, getDragBounds, getStageParticipants, hasAnyFaceData, isTouchDevice, layoutSingleParticipant, normalizeScoringWeights, pictureInPictureLayout, positionTilesInGrid, removeExitedTiles, resolveAnimationSettings, resolveFaceVisibilityConfig, shouldUseSmallGroupLayout, simpleFocusLayout, simpleGridLayout, simpleStageAudienceLayout, smallGroupLayout, sortParticipants, useDividerDrag, useLayoutCalculation, useLayoutRenderers, usePaginationState, usePipDrag, useStageAudienceState, useSwipeGestures, useTileLayout, useTileTransitions };