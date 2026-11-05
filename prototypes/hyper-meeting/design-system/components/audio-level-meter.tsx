import { cn } from "../lib/utils";

/** Bar count from the Figma "Audio Meter" spec. */
const DEFAULT_BAR_COUNT = 9;
/** Bar width in px (Figma "Audio Meter"). */
const BAR_WIDTH = 2;
/**
 * Gap between bars in px. Figma specs 1.75px, but a fractional gap rounds
 * unevenly across bars at most pixel ratios, so we use an integer 2px for
 * consistent spacing.
 */
const BAR_GAP = 2;

/**
 * Continuous low→high gradient revealed through the bars, matching the Figma
 * "Audio Meter": emerald holds through the lower third, ramps to amber as the
 * signal gets hot, and only reaches red as it approaches clipping. Stops are
 * weighted from the Figma geometry (green to 34.4%, amber at 67.2%) rather than
 * spread evenly, so the first three bars read as solid green. Driven by theme
 * tokens so it tracks light/dark mode.
 */
const GRADIENT =
  "linear-gradient(to right, var(--success) 0%, var(--success) 34.4%, var(--warning) 67.2%, var(--destructive) 100%)";

export interface AudioLevelMeterProps {
  /** Normalized input level in the [0, 1] range. Values outside are clamped. */
  level: number;
  /** Number of bars to render. Defaults to 9 (Figma spec). */
  barCount?: number;
  /**
   * Bar coloring:
   * - `"solid"` (default): active bars in `--success` (emerald), rest muted.
   * - `"gradient"`: active bars reveal the shared emerald→amber→red gradient
   *   from the Figma "Audio Meter" design.
   */
  variant?: "solid" | "gradient";
  className?: string;
}

/**
 * Compact horizontal bar-graph that visualizes a normalized audio level.
 * Purely presentational — the caller owns peak metering, device wiring, and
 * any smoothing. Pass `level` between 0 and 1; the component lights up that
 * fraction of `barCount` bars.
 */
export function AudioLevelMeter({
  level,
  barCount = DEFAULT_BAR_COUNT,
  variant = "solid",
  className,
}: AudioLevelMeterProps) {
  const clamped = Math.min(1, Math.max(0, level));
  const activeBars = Math.round(clamped * barCount);
  const isGradient = variant === "gradient";

  // Total strip width so each bar can show its own slice of the shared
  // gradient via background-size + background-position.
  const stripWidth = barCount * BAR_WIDTH + (barCount - 1) * BAR_GAP;
  const step = BAR_WIDTH + BAR_GAP;

  return (
    <div
      aria-hidden="true"
      className={cn("inline-flex h-3 items-stretch gap-[2px]", className)}
    >
      {Array.from({ length: barCount }, (_, index) => {
        const active = index < activeBars;
        const gradientStyle =
          isGradient && active
            ? {
                backgroundImage: GRADIENT,
                backgroundSize: `${stripWidth}px 100%`,
                backgroundPositionX: `${-index * step}px`,
              }
            : undefined;

        return (
          <span
            className={cn(
              "w-[2px] transition-colors duration-75",
              // Only the outer corners are rounded, matching the Figma spec.
              index === 0 && "rounded-l-[2px]",
              index === barCount - 1 && "rounded-r-[2px]",
              active
                ? isGradient
                  ? undefined
                  : "bg-success"
                : "bg-muted-foreground/25"
            )}
            key={index}
            style={gradientStyle}
          />
        );
      })}
    </div>
  );
}
