# @hypervideo/tile-layouts

A high-performance React library for arranging participant tiles in video conferencing UIs. Automatically selects the optimal layout based on participant count and properties.

## Features

- 🎯 **Zero-config with sensible defaults** - Works out of the box
- 🤖 **Intelligent layout selection** - Automatically chooses the best layout
- 🎨 **Responsive & performant** - ResizeObserver-based with debounced recalculations and container-width breakpoints
- 🚀 **Hook-based API** - Modern React patterns with built-in memoization
- 📱 **Mobile-friendly** - Touch gestures and adaptive layouts
- 🎭 **Priority system** - Automatic ordering by pinned, screen share, speaker
- ⚡ **Compositor-friendly positioning** - Absolute tiles moved with `transform: translate()`; per-tile transitions stay composited-only
- 🎬 **Headless animation contract** - Per-tile enter/exit/move/resize data (`tile.transition`) + `styleMode` for WAAPI/motion drivers

## Installation

This package is published to GitHub Packages. Configure the `@hypervideo` scope to
`https://npm.pkg.github.com` and provide an `NPM_TOKEN`, then install:

```bash
bun add @hypervideo/tile-layouts
# or
npm install @hypervideo/tile-layouts
# or
pnpm add @hypervideo/tile-layouts
```

## Basic Usage

```tsx
import { useTileLayout } from "@hypervideo/tile-layouts";

function VideoGrid({ participants }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate tile layout - dimensions are tracked automatically from the ref
  const { layout, renderTiles } = useTileLayout(participants, containerRef);

  return (
    <div ref={containerRef} className="video-container">
      {renderTiles()}
    </div>
  );
}
```

## Advanced Example

```tsx
import { useTileLayout, type LayoutConfig, type Participant } from "@hypervideo/tile-layouts";

function VideoConference({ participants }: { participants: Participant[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Configure behavior without specifying layout mode
  const config: LayoutConfig = {
    gap: 8, // Gap between tiles in pixels
    padding: 16, // Container padding in pixels
    debounceMs: 150, // Resize debounce delay
    maxTilesPerPage: 12, // the default
    prioritizeSpeaker: true,
    prioritizeScreenShare: true,
    enableAnimations: true, // CSS transitions for smooth tile movement
    // Configure stage behavior when stage-audience is auto-selected
    stageAudienceConfig: {
      stageSize: 75,
      allowResize: true,
      minStagePercent: 20,
      maxStagePercent: 85,
    },
  };

  const {
    layout,
    currentPage,
    totalPages,
    nextPage,
    previousPage,
    stageSize,
    setStageSize,
    renderTiles,
    renderDraggableDivider,
    renderPaginationControls,
  } = useTileLayout(participants, containerRef, config);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {/* Render participant tiles */}
      {renderTiles(({ tile, participant }) => (
        <VideoTile
          key={tile.participantId}
          participant={participant}
          style={{
            gridRow: tile.row + 1,
            gridColumn: tile.column + 1,
            width: tile.width,
            height: tile.height,
          }}
        />
      ))}

      {/* Draggable divider for stage-audience layouts */}
      {renderDraggableDivider()}

      {/* Pagination controls */}
      {renderPaginationControls()}
    </div>
  );
}
```

## Meeting Preset

If multiple apps in your product share the same general video-meeting behavior, start from the shared meeting preset and only layer product-specific deltas on top:

```tsx
import { createMeetingLayoutConfig, useTileLayout } from "@hypervideo/tile-layouts";

const config = createMeetingLayoutConfig({
  isMobile,
  overrides: {
    mode: "auto",
    prioritizeSpeaker: false,
    stageAudienceConfig: {
      stageSize: isMobile ? 62 : 72,
      minStagePercent: isMobile ? 62 : 72,
      maxStagePercent: isMobile ? 62 : 72,
    },
  },
});

const { layout, renderTiles } = useTileLayout(participants, containerRef, config);
```

## Responsive Breakpoints

`useTileLayout` always resolves layouts from the measured container width. The `breakpoints` option exists so you can switch to a different layout config as that container gets narrower.

This is useful when one static config cannot cover the full range of container widths well. For example, a config that works for a wide embedded grid may need different spacing, tile-count, aspect-ratio, PiP, or pagination settings once the same container shrinks into a narrow column.

Breakpoint overrides are keyed by maximum container width in pixels. When multiple breakpoints match, the library applies them in descending order so the smallest matching breakpoint wins.

```tsx
import { useTileLayout, type LayoutConfig } from "@hypervideo/tile-layouts";

const config: LayoutConfig = {
  gap: 8,
  padding: 16,
  maxTilesPerPage: 9,
  pipConfig: {
    pipSizeRatio: 0.3,
  },
  breakpoints: {
    768: {
      gap: 4,
      padding: 8,
      maxTilesPerPage: 4,
      minTileAspectRatio: 7 / 16,
      maxTileAspectRatio: 3 / 4,
      pipConfig: {
        pipSizeRatio: 0.36,
      },
      paginationConfig: {
        bufferSize: 28,
      },
    },
    560: {
      maxTilesPerPage: 2,
    },
  },
};
```

The base config remains active for wider containers, and narrower containers progressively layer on the matching overrides.

## Tile Visibility Window

`useTileLayout` exposes a `visibilityWindow` for consumers that need to align non-visual work with the same page/window state used by rendering. The window stays generic: it only reports tile IDs, so applications can map those IDs back to their own participant, stream, or media state.

```tsx
const { visibilityWindow } = useTileLayout(participants, containerRef, config);

const visibleTileIds = visibilityWindow.visibleTileIds;
const adjacentTileIds = visibilityWindow.adjacentTileIds;
const hiddenTileIds = visibilityWindow.allTileIds.filter(
  (tileId) => !visibleTileIds.includes(tileId) && !adjacentTileIds.includes(tileId),
);
```

`visibleTileIds` are the tiles currently rendered by the active layout. `adjacentTileIds` are tiles from immediately previous or next pages, excluding anything already visible. `allTileIds` contains every tile considered by the layout in layout order.

## How Layouts Are Selected

The library automatically selects the optimal layout based on your participants:

### Fullscreen

**When:** Single participant

- The participant fills the entire container
- Perfect for 1-on-1 calls or single presenter scenarios

### Picture-in-Picture

**When:** Two participants

- One participant as the main view
- Second participant in a draggable floating tile
- The floating tile can be positioned in any corner
- Users can drag the floating tile to reposition it
- Automatically swaps participants if the floating participant becomes the speaker

**Features:**

```tsx
// Configure PiP behavior when it's auto-selected
const config = {
  pipConfig: {
    initialCorner: "bottom-right", // Starting position
    enableDrag: true, // Allow drag-to-reposition
  },
};
```

### Grid

**When:** 3+ participants without special roles

- Equal-sized tiles arranged in an optimized grid
- Uses intelligent scoring algorithm that balances:
  - **Tile size**: Maximizes the size of each tile
  - **Aspect ratios**: Keeps tiles within reasonable proportions (0.75 to 1.8)
  - **Space utilization**: Minimizes wasted space
  - **Grid balance**: Prefers balanced grids over uneven ones
- Automatically centers the grid when aspect ratio constraints reduce tile sizes
- Paginates when participant count exceeds `maxTilesPerPage`

### Focus

**When:** Multiple participants with one having priority

- Triggered by: `isScreenSharing`, `isSpeaking`, or `isPinned` properties
- One large tile (75-80% of space) for the focused participant
- Other participants in smaller tiles arranged in a sidebar (landscape) or bottom strip (portrait)
- The focused participant is determined by priority order:
  1. Screen sharing participant
  2. Pinned participant
  3. Currently speaking participant
  4. First participant in the list

**Layout behavior:**

- **Landscape orientation**: Focus tile on left, others in right sidebar
- **Portrait orientation**: Focus tile on top, others below
- **Minimum sidebar size**: Ensures other participants remain visible

### Stage-Audience

**When:** Participants have explicit `isOnStage` property

- Creates two distinct areas: stage and audience
- Stage participants get larger, more prominent tiles
- Audience participants in smaller, uniform tiles
- Supports both horizontal (stage left/right) and vertical (stage top/bottom) orientations
- Automatically chooses orientation based on container aspect ratio

**Key features:**

- **Smart stage sizing**: Automatically adjusts stage size based on:
  - Number of stage participants (1-4 optimal)
  - Container dimensions
  - Prevents overly large stages when few participants
- **Draggable divider**: Users can manually adjust the stage/audience split
- **Audience pagination**: When audience exceeds capacity, enables pagination
- **Orientation selection**:
  - Landscape containers → Horizontal layout (stage left)
  - Portrait containers → Vertical layout (stage top)

**Stage-audience configuration:**

```tsx
const config = {
  stageAudienceConfig: {
    stageSize: 70, // Initial stage size (percentage)
    allowResize: true, // Enable draggable divider
    minStagePercent: 20, // Minimum stage size when dragging
    maxStagePercent: 85, // Maximum stage size when dragging
    maxAudienceParticipants: 50, // Paginate after this many
  },
};

// The hook provides helpers for stage-audience layouts
const {
  stageSize, // Current stage percentage
  setStageSize, // Update stage size programmatically
  renderDraggableDivider, // Render the resize handle
} = useTileLayout(participants, containerRef, config);
```

## Automatic Layout Examples

```tsx
// Single participant - automatically uses fullscreen
const { layout } = useTileLayout([participant], containerRef);

// Two participants - automatically uses picture-in-picture
const { layout } = useTileLayout([participant1, participant2], containerRef);

// Multiple participants - automatically uses grid
const { layout } = useTileLayout(manyParticipants, containerRef);

// With screen share - automatically uses focus layout
const participantsWithScreenShare = [{ id: "1", isScreenSharing: true }, { id: "2" }, { id: "3" }];
const { layout } = useTileLayout(participantsWithScreenShare, containerRef);

// With stage participants - automatically uses stage-audience
const participantsWithStage = [
  { id: "1", isOnStage: true },
  { id: "2", isOnStage: true },
  { id: "3" },
  { id: "4" },
];
const { layout } = useTileLayout(participantsWithStage, containerRef);
```

## Participant Properties

<!-- PARTICIPANT_INTERFACE_START -->
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | `string` | - | Required unique identifier for the participant |
| `aspectRatio?` | `number` | - | Video aspect ratio (e.g., 16/9 = 1.777, 9/16 = 0.5625) |
| `isSpeaking?` | `boolean` | - | Whether the participant is currently speaking |
| `isScreenSharing?` | `boolean` | - | Whether this participant is sharing their screen. |
| `isScreenShare?` | `boolean` | - | If this is a screen share participant |
| `isPinned?` | `boolean` | - | Whether the participant is pinned by the user |
| `isOnStage?` | `boolean` | - | Whether this participant should appear in the stage area |
| `isSelf?` | `boolean` | - | Whether this is the local participant (used for PiP layout) |
| `faceBoxes?` | `FaceBoundingBox[]` | - | Face bounding boxes in normalized 0-1000 coordinates.<br />When 2+ faces are present, layout optimization ensures faces aren't clipped.<br />When 0-1 faces are present, face zoom/centering handles visibility. |
<!-- PARTICIPANT_INTERFACE_END -->

## Configuration Options

All configuration is optional. The library uses smart defaults:

<!-- LAYOUT_CONFIG_INTERFACE_START -->
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `mode?` | `LayoutMode` | `auto` | Layout mode selection |
| `gap?` | `number` | `8` | Gap between tiles in pixels |
| `padding?` | `number` | `16` | Padding around the container in pixels |
| `debounceMs?` | `number` | `150` | Debounce time for resize events in milliseconds |
| `maxTilesPerPage?` | `number` | `12` | Maximum number of tiles per page |
| `aspectRatio?` | `number` | - | Target aspect ratio for tiles |
| `minTileWidth?` | `number` | `150` | Minimum tile width in pixels |
| `minTileHeight?` | `number` | `100` | Minimum tile height in pixels |
| `minTileAspectRatio?` | `number` | `0.75` | Minimum aspect ratio for tiles |
| `maxTileAspectRatio?` | `number` | `1.8` | Maximum aspect ratio for tiles |
| `prioritizeSpeaker?` | `boolean` | `true` | Prioritize the active speaker in layouts |
| `prioritizeScreenShare?` | `boolean` | `true` | Prioritize screen share in layouts |
| `enableAnimations?` | `boolean` | `true` | Enable smooth CSS transitions for tile position and size |
| `animationConfig?` | `AnimationSettings & { /** * Per-trigger animation overrides * Example: { triggers: { resize: { enabled: false }, participantJoined: { duration: 500 } } } */ triggers?: Partial<Record<AnimationTrigger, AnimationSettings>>; }` | - | Animation configuration options<br />Can be a simple object for global settings, or include per-trigger overrides |
| `audienceWidth?` | `number` | - | Fixed width for audience in sidebar layouts |
| `maxHeightPercent?` | `number` | - | Maximum percentage of container height that tiles can consume |
| `gridScoringWeights?` | `GridScoringWeights` | - | Grid scoring weights for layout optimization |
| `stageAudienceConfig?` | `StageAudienceConfig` | - | Stage-audience specific options |
| `pipConfig?` | `{ /** Initial corner position for floating tile (default: bottom-right) */ initialCorner?: PiPCorner; /** Enable drag-to-reposition for floating tile (default: true) */ enableDrag?: boolean; /** Size ratio of the floating tile relative to the container (default: 0.3) */ pipSizeRatio?: number; }` | - | Picture-in-picture specific options |
| `paginationConfig?` | `{ /** Show pagination only on hover (default: true on desktop, false on touch) */ showOnHoverOnly?: boolean; /** Position of pagination controls (default: bottom) */ position?: "bottom" \| "top" \| "left" \| "right"; /** Disable pagination space reservation */ disabled?: boolean; /** Override the space reserved for pagination controls in px (default: 56 vertical, 48 horizontal) */ bufferSize?: number; }` | - | Pagination UI options |
| `align?` | `"start" \| "center" \| "end"` | - | Horizontal alignment of grid layouts within the container.<br />Default: "center". |
| `lastRowPolicy?` | `"center" \| "mosaic"` | - | How an incomplete final grid row fills the width:<br />- "center" (default): keep tile size and center the short row<br />- "mosaic": stretch the final row's tiles to span the full grid width |
| `tileTransitions?` | `{ /** Retain exiting tiles so they can animate out. Default: false. */ exitRetention?: boolean; /** Upper bound on retained exiting tiles. Default: 8. */ maxExitingTiles?: number; }` | `in` | Per-tile transition contract options.<br />Exit retention is off by  1.x (rendered output unchanged);<br />2.0 turns it on by default. |
| `aspectRatioTracking?` | `{ /** Enable aspect ratio tracking (default: false) */ enabled?: boolean; /** Debounce time for aspect ratio updates in milliseconds (default: 50) */ debounceMs?: number; }` | - | Aspect ratio tracking options |
| `debugOverlays?` | `{ /** Enable debug overlays (default: false) */ enabled?: boolean; /** Show stage/audience area overlays */ showAreaOverlays?: boolean; /** Show grid lines between tiles */ showGridLines?: boolean; /** Show tile information overlays */ showTileInfo?: boolean; }` | - | Debug overlay options |
| `faceVisibilityConfig?` | `FaceVisibilityConfig` | - | Face visibility configuration for grid optimization |
| `breakpoints?` | `Record<number, Omit<LayoutConfig, "breakpoints">>` | - | Responsive config overrides keyed by container width breakpoints (in pixels).<br />When the container width is <= a breakpoint, the corresponding config is merged<br />on top of the base config using the same one-level object merge semantics as the<br />main layout config. Multiple breakpoints can match; they are applied in<br />descending order so the smallest matching breakpoint wins. |
<!-- LAYOUT_CONFIG_INTERFACE_END -->

### Stage-Audience Configuration

<!-- STAGE_AUDIENCE_CONFIG_INTERFACE_START -->
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `stageSize?` | `number` | `70` | Percentage of container allocated to stage (0-100) |
| `minStagePercent?` | `number` | `20` | Minimum stage size as percentage (0-100) when dragging |
| `maxStagePercent?` | `number` | `85` | Maximum stage size as percentage (0-100) when dragging |
| `allowResize?` | `boolean` | `false` | Whether to allow dragging the divider |
| `forceOrientation?` | `"horizontal" \| "vertical"` | - | Force specific orientation instead of auto-selection |
| `maxAudienceParticipants?` | `number` | - | Maximum participants in audience before pagination |
| `fitScreenshareAspectRatio?` | `boolean` | `false` | Maintain screen share aspect ratio in stage |
| `screenShareContentInsets?` | `{ top?: number; right?: number; bottom?: number; left?: number; }` | - | Extra non-video chrome around a single screen share tile.<br />The layout fits the shared content inside the remaining space, then adds<br />these fixed offsets back onto the final tile frame. |
<!-- STAGE_AUDIENCE_CONFIG_INTERFACE_END -->

### Grid Scoring Weights

<!-- GRID_SCORING_WEIGHTS_INTERFACE_START -->
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `participantCoverage` | `number` | `0.4` | Weight for showing all participants (0-1). Higher values prioritize fitting all participants. |
| `tileSize` | `number` | `0.4` | Weight for tile size (0-1). Higher values prioritize larger tiles. |
| `spaceEfficiency` | `number` | `0.1` | Weight for penalizing wasted space (0-1). Higher values penalize empty grid spots and unused container space. |
| `gridBalance` | `number` | `0` | Weight for grid shape (0-1). Higher values prefer square grids (equal rows/columns). |
| `tileAspectRatio` | `number` | `0.05` | Weight for tile aspect ratio (0-1). Higher values prefer tiles closer to the preferred aspect ratio. |
| `emptySpotsPenalty` | `number` | `0.05` | Weight for penalizing empty spots (0-1). Higher values heavily penalize grids with empty spots. |
<!-- GRID_SCORING_WEIGHTS_INTERFACE_END -->

### Layout Modes

<!-- LAYOUT_MODE_TYPE_START -->
- `"auto" // Intelligent selection based on participants`
- `"grid" // Equal-sized tiles in a grid`
- `"focus" // Primary participant with others in sidebar/below`
- `"small-group" // Optimized layout for 2-6 participants with 3:4 aspect ratio`
- `"stage-audience" // Two-container model for featured vs regular participants`
- `"picture-in-picture" // One-on-one layout with draggable floating tile`
- `"fullscreen"`
<!-- LAYOUT_MODE_TYPE_END -->

### Layout IDs

<!-- LAYOUT_ID_TYPE_START -->
- `"simple-grid" // Standard grid layout`
- `"simple-grid-fullscreen" // Single participant fullscreen
  // Focus layout variants`
- `"simple-focus-empty" // Focus layout with no participants`
- `"simple-focus-mobile" // Focus layout optimized for mobile`
- `"simple-focus-desktop" // Focus layout optimized for desktop
  // Stage-audience layout variants`
- `"stage-audience-horizontal" // Stage left, audience right`
- `"stage-audience-vertical" // Stage top, audience bottom`
- `"audience-only" // Only audience participants visible
  // Other layout types`
- `"picture-in-picture" // Two participants, one floating`
- `"small-group" // Small group optimized layout`
- `"fullscreen"`
<!-- LAYOUT_ID_TYPE_END -->

## Performance Tips

1. **Use pagination** - Limit tiles per page to maintain performance:

   ```tsx
   const config = {
     maxTilesPerPage: 12, // the default; use 6 for mobile
   };
   ```

2. **Debounce resize events** - Built-in debouncing prevents excessive recalculations

3. **Memoize participants** - Prevent unnecessary recalculations:

   ```tsx
   const sortedParticipants = useMemo(
     () => participants.filter((p) => p.isVideoEnabled),
     [participants],
   );
   ```

4. **Use the emitted transforms** - Tiles are absolutely positioned and moved with `transform: translate()`, which stays on the compositor:
   ```tsx
   <div
     style={{
       display: "grid",
       gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
       gridTemplateColumns: `repeat(${layout.columns}, 1fr)`,
       gap: "8px",
     }}
   >
     {layout.tiles.map((tile) => (
       <div
         key={tile.participantId}
         style={{
           gridRow: tile.row + 1,
           gridColumn: tile.column + 1,
         }}
       />
     ))}
   </div>
   ```

## TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  Participant,
  TileLayout,
  TilePosition,
  LayoutConfig,
  LayoutMode,
  LayoutDimensions,
} from "@hypervideo/tile-layouts";
```

## Browser Support

- Modern browsers with ResizeObserver support
- Touch events for mobile gestures

## License

MPL-2.0. See the repo root `LICENSE`.
