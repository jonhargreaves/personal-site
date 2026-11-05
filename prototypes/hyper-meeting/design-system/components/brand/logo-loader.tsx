"use client";

import { type ComponentProps, Fragment, type ReactNode, useId } from "react";

import { Progress } from "../progress";
import { cn } from "../../lib/utils";

// Styles live in styles/logo-loader.css, imported by globals.css.

/**
 * The Hyper mark is five nested "signal" arcs radiating from a point on the
 * left. Paths are lifted verbatim from `logo-full.svg` and ordered innermost ->
 * outermost so animations can stagger along the radiating axis.
 */
const MARK_ARCS = [
  {
    d: "M9.18 94.5C9.18 104.64 7.12499 112.86 4.59 112.86C2.05501 112.86 0 104.64 0 94.5C0 84.3601 2.05501 76.14 4.59 76.14C7.12499 76.14 9.18 84.3601 9.18 94.5Z",
    evenOdd: false,
  },
  {
    d: "M27.81 129.06C32.4326 129.06 36.18 113.587 36.18 94.5C36.18 75.413 32.4326 59.94 27.81 59.94C23.1874 59.94 19.44 75.413 19.44 94.5C19.44 113.587 23.1874 129.06 27.81 129.06ZM30.24 76.41C31.92 90.232 32.0184 98.0544 30.24 112.32C30.24 112.32 26.73 108 26.73 94.23C26.73 80.46 30.24 76.41 30.24 76.41Z",
    evenOdd: true,
  },
  {
    d: "M51.5697 157.14C60.0694 157.14 66.9597 129.095 66.9597 94.5C66.9597 59.9049 60.0694 31.86 51.5697 31.86C46.1046 31.86 41.3048 43.4545 38.5741 60.9297L45.6297 55.89L53.7334 50.2625C54.5708 49.6809 55.6929 50.0162 55.9883 50.992C57.3072 55.3479 60.2097 67.9087 60.2097 94.095C60.2097 120.703 57.2129 133.244 55.9258 137.402C55.6467 138.304 54.6415 138.668 53.8175 138.207C50.8697 136.559 44.2088 132.707 38.6514 128.56C41.3948 145.762 46.1558 157.14 51.5697 157.14Z",
    evenOdd: false,
  },
  {
    d: "M80.7294 174.42C92.2114 174.42 101.519 138.639 101.519 94.5C101.519 50.3614 92.2114 14.58 80.7294 14.58C73.8906 14.58 67.823 27.2736 64.0341 46.8662L69.5002 46.4199C73.7395 46.0739 77.9997 46.0691 82.2398 46.4057L88.5055 46.903C89.1025 46.9504 89.6195 47.3239 89.8111 47.8914C90.9353 51.2221 94.4994 64.1334 94.4994 93.96C94.4994 124.505 90.7614 137.31 89.7341 140.253C89.5785 140.699 89.2182 141.019 88.7626 141.144C85.7238 141.971 73.5676 144.879 63.893 141.396C67.6714 161.407 73.8051 174.42 80.7294 174.42Z",
    evenOdd: false,
  },
  {
    d: "M113.401 189C126.225 189 136.621 146.691 136.621 94.5C136.621 42.3091 126.225 0 113.401 0C104.295 0 101.314 21.3328 100.351 52.3885C114.353 61.1747 123.661 76.7503 123.661 94.5C123.661 112.25 114.353 127.825 100.351 136.612C101.314 167.667 104.295 189 113.401 189Z",
    evenOdd: false,
  },
] as const;

/** `hyper` wordmark glyphs, ordered left -> right. */
const WORDMARK_GLYPHS = [
  "M198.877 129.435H185.915V35.8171H198.877V72.4785C203.853 67.1102 211.578 63.706 220.22 63.706C239.074 63.706 249.68 76.2756 249.68 95.9156V129.435H236.717V97.225C236.717 85.8337 230.432 76.0137 218.256 76.0137C206.864 76.0137 198.877 85.1791 198.877 97.6178V129.435Z",
  "M290.981 160.597C277.364 160.597 266.104 154.836 260.343 143.445L271.079 137.553C274.745 144.492 281.947 148.551 290.719 148.551C304.336 148.551 311.407 138.338 311.407 124.459V118.829C307.61 126.03 300.801 130.351 291.112 130.351C271.472 130.351 261.914 117.389 261.914 98.5343V65.2772H274.745V97.8797C274.745 109.926 281.03 118.174 292.683 118.174C303.944 118.174 311.276 108.747 311.276 96.9631V65.2772H324.369V124.328C324.369 145.801 311.8 160.597 290.981 160.597Z",
  "M350.157 158.895H337.194V97.2249C337.194 78.1086 351.99 63.7059 371.368 63.7059C390.746 63.7059 405.411 78.8942 405.411 97.2249C405.411 116.603 391.401 131.006 371.892 131.006C363.25 131.006 355.394 127.209 350.157 121.448V158.895ZM371.368 118.829C383.283 118.829 392.448 109.009 392.448 97.3558C392.448 85.5718 383.283 76.0137 371.368 76.0137C359.322 76.0137 350.157 85.5718 350.157 97.3558C350.157 109.009 359.322 118.829 371.368 118.829Z",
  "M443.488 130.875C423.979 130.875 409.445 116.734 409.445 96.9631C409.445 78.5014 422.67 63.4441 441.917 63.4441C461.295 63.4441 473.341 77.454 473.341 95.3919V100.629H422.015C423.455 111.628 431.835 119.353 443.357 119.353C451.213 119.353 458.284 115.948 462.081 108.878L472.032 113.984C466.401 124.983 456.058 130.875 443.488 130.875ZM422.539 92.2495H460.378C459.855 82.0366 452.392 75.0972 441.786 75.0972C430.918 75.0972 423.848 82.6913 422.539 92.2495Z",
  "M495.232 129.435H482.27V91.2021C482.27 75.621 491.173 63.9679 507.933 63.9679C511.991 63.9679 516.181 64.7535 519.455 66.3247V79.1562C516.312 77.3231 512.646 76.4066 509.111 76.4066C500.469 76.4066 495.232 82.2986 495.232 91.7258V129.435Z",
] as const;

const MARK_VIEWBOX_WIDTH = 137;
const FULL_VIEWBOX_WIDTH = 520;
const VIEWBOX_HEIGHT = 189;

export const LOGO_LOADER_VARIANTS = ["ripple", "sweep", "trace"] as const;

export type LogoLoaderVariant = (typeof LOGO_LOADER_VARIANTS)[number];

/**
 * Per-arc animation offset, in milliseconds, multiplied by the arc index, so
 * the loop travels along the radiating axis instead of firing all at once.
 * `sweep` animates a mask rather than the arcs, so it needs no offset.
 */
const ARC_STAGGER_MS = {
  ripple: 110,
  sweep: 0,
  trace: 50,
} satisfies Record<LogoLoaderVariant, number>;

/** Glyphs only animate in `trace`; they draw after the arcs finish. */
const GLYPH_LEAD_MS = 320;
const GLYPH_STAGGER_MS = 45;

function Arcs({
  stagger,
  withStroke = false,
}: {
  stagger: number;
  withStroke?: boolean;
}) {
  return (
    <g className="logo-loader-mark">
      {MARK_ARCS.map((arc, index) => {
        const style = { animationDelay: `${index * stagger}ms` };

        return (
          <Fragment key={arc.d}>
            <path
              className="logo-loader-arc"
              clipRule={arc.evenOdd ? "evenodd" : undefined}
              d={arc.d}
              fillRule={arc.evenOdd ? "evenodd" : undefined}
              style={style}
            />
            {withStroke ? (
              <path
                className="logo-loader-arc-stroke"
                d={arc.d}
                pathLength={1}
                style={style}
              />
            ) : null}
          </Fragment>
        );
      })}
    </g>
  );
}

function Wordmark({ withStroke = false }: { withStroke?: boolean }) {
  return (
    <g className="logo-loader-word">
      {WORDMARK_GLYPHS.map((d, index) => {
        const style = {
          animationDelay: `${GLYPH_LEAD_MS + index * GLYPH_STAGGER_MS}ms`,
        };

        return (
          <Fragment key={d}>
            <path className="logo-loader-glyph" d={d} style={style} />
            {withStroke ? (
              <path
                className="logo-loader-glyph-stroke"
                d={d}
                pathLength={1}
                style={style}
              />
            ) : null}
          </Fragment>
        );
      })}
    </g>
  );
}

/**
 * Animated Hyper logo loading state.
 *
 * Three looping treatments of the brand mark, all pure CSS so they cost nothing
 * at runtime and pause under `prefers-reduced-motion`:
 *
 * - `ripple` — arcs light up in sequence from the origin outward.
 * - `sweep` — a specular highlight travels across a dimmed mark.
 * - `trace` — the mark draws itself, then fills in.
 */
export function LogoLoader({
  className,
  decorative = false,
  label = "Loading",
  showLabel = false,
  size = 48,
  variant = "ripple",
  withWordmark = false,
}: {
  className?: string;
  /**
   * Render as pure decoration, without a status role or announced label. Set
   * this when an ancestor already owns the `role="status"` live region, so
   * assistive tech does not announce the same loading state twice.
   */
  decorative?: boolean;
  /** Announced to assistive tech, and rendered when `showLabel` is set. */
  label?: string;
  showLabel?: boolean;
  /** Rendered height of the logo, in pixels. */
  size?: number;
  variant?: LogoLoaderVariant;
  withWordmark?: boolean;
}) {
  const maskId = useId();
  const gradientId = useId();

  const viewBoxWidth = withWordmark ? FULL_VIEWBOX_WIDTH : MARK_VIEWBOX_WIDTH;
  const width = (size * viewBoxWidth) / VIEWBOX_HEIGHT;
  const stagger = ARC_STAGGER_MS[variant];

  const content: ReactNode = (
    <>
      <Arcs stagger={stagger} withStroke={variant === "trace"} />
      {withWordmark ? <Wordmark withStroke={variant === "trace"} /> : null}
    </>
  );

  return (
    <div
      aria-live={decorative ? undefined : "polite"}
      className={cn(
        "inline-flex flex-col items-center gap-3 text-foreground",
        className
      )}
      role={decorative ? undefined : "status"}
    >
      <svg
        aria-hidden="true"
        className={cn("logo-loader", `logo-loader-${variant}`)}
        height={size}
        viewBox={`0 0 ${viewBoxWidth} ${VIEWBOX_HEIGHT}`}
        width={width}
        xmlns="http://www.w3.org/2000/svg"
      >
        {variant === "sweep" ? (
          <defs>
            <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#000" />
              <stop offset="0.5" stopColor="#fff" />
              <stop offset="1" stopColor="#000" />
            </linearGradient>
            <mask
              height={VIEWBOX_HEIGHT}
              id={maskId}
              maskUnits="userSpaceOnUse"
              width={viewBoxWidth}
              x="0"
              y="0"
            >
              <rect
                className={cn(
                  "logo-loader-band",
                  withWordmark && "logo-loader-band-wide"
                )}
                fill={`url(#${gradientId})`}
                height={VIEWBOX_HEIGHT}
                width="160"
                x="-160"
                y="0"
              />
            </mask>
          </defs>
        ) : null}

        {variant === "sweep" ? (
          <>
            <g className="logo-loader-base">{content}</g>
            <g mask={`url(#${maskId})`}>{content}</g>
          </>
        ) : (
          content
        )}
      </svg>

      {showLabel ? (
        <span className="text-muted-foreground text-sm">{label}</span>
      ) : decorative ? null : (
        <span className="sr-only">{label}</span>
      )}
    </div>
  );
}

export type LogoLoaderProgressProps = Omit<
  ComponentProps<"div">,
  "children"
> & {
  /** Overall progress from 0 to 100. The caller owns timing and stage changes. */
  value: number;
  /** Current stage, announced when it changes. */
  label: string;
  description?: ReactNode;
  /** Rendered height of the logo, in pixels. */
  size?: number;
  variant?: LogoLoaderVariant;
  withWordmark?: boolean;
};

/** A branded, determinate loading state with animated progress and stage copy. */
export function LogoLoaderProgress({
  className,
  description,
  label,
  size = 64,
  value,
  variant = "trace",
  withWordmark = false,
  ...props
}: LogoLoaderProgressProps) {
  const labelId = useId();
  const descriptionId = useId();
  const progress = Number.isFinite(value)
    ? Math.min(100, Math.max(0, value))
    : 0;

  return (
    <div
      {...props}
      className={cn(
        "logo-loader-progress flex w-full max-w-80 flex-col items-center text-center text-foreground",
        className
      )}
      data-complete={progress === 100 ? "" : undefined}
      data-slot="logo-loader-progress"
    >
      <LogoLoader
        decorative
        size={size}
        variant={variant}
        withWordmark={withWordmark}
      />
      <div className="mt-8 w-full space-y-2" role="status" aria-atomic="true">
        <p
          className="logo-loader-stage font-medium text-base"
          id={labelId}
          key={label}
        >
          {label}
        </p>
        {description != null ? (
          <p className="text-muted-foreground text-sm" id={descriptionId}>
            {description}
          </p>
        ) : null}
      </div>
      <Progress
        aria-describedby={description != null ? descriptionId : undefined}
        aria-labelledby={labelId}
        className="logo-loader-progress-track mt-7 h-2 w-full bg-muted"
        value={progress}
      />
      <span
        aria-hidden="true"
        className="mt-3 text-sm tabular-nums"
        data-slot="logo-loader-progress-value"
      >
        {Math.round(progress)}%
      </span>
    </div>
  );
}
