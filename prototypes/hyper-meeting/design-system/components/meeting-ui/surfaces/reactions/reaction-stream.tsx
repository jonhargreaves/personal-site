"use client";

import { cva } from "class-variance-authority";
import { useReducedMotion } from "motion/react";
import {
  type ComponentPropsWithoutRef,
  type Ref,
  useEffect,
  useEffectEvent,
  useRef,
} from "react";

import { cn } from "../../../../lib/utils";

export type MeetingReactionEvent = {
  readonly emoji: string;
  readonly id: string;
  readonly label: string;
  readonly senderName: string;
};

export type MeetingReactionStreamPlacement = "center" | "left" | "right";
export type MeetingReactionStreamSize = "lg" | "md" | "sm";
export type MeetingReactionStreamVariant = "burst" | "cascade" | "float";

export interface MeetingReactionStreamProps extends ComponentPropsWithoutRef<"div"> {
  readonly laneCount?: number;
  readonly laneVariance?: number;
  readonly onReactionComplete: (reactionId: string) => void;
  readonly placement?: MeetingReactionStreamPlacement;
  readonly reactions: readonly MeetingReactionEvent[];
  readonly ref?: Ref<HTMLDivElement>;
  readonly size?: MeetingReactionStreamSize;
  readonly variant?: MeetingReactionStreamVariant;
}

export interface MeetingReactionStreamItemProps extends ComponentPropsWithoutRef<"div"> {
  readonly laneCount?: number;
  readonly laneVariance?: number;
  readonly onComplete: () => void;
  readonly reaction: MeetingReactionEvent;
  readonly size?: MeetingReactionStreamSize;
  readonly variant?: MeetingReactionStreamVariant;
}

const DEFAULT_LANE_COUNT = 3;
const DEFAULT_LANE_VARIANCE = 28;
const FLOAT_DURATION_MS = 3000;
const LABEL_EDGE_FADE_PX = 28;
const LABEL_EDGE_INSET_PX = 12;
const LABEL_GAP_PX = 4;
const LABEL_MAX_TEXT_WIDTH_PX = 128;
const MAX_CANVAS_DPR = 2;
const MAX_LANE_COUNT = 8;
const MAX_LANE_VARIANCE = 72;
const REACTION_STREAM_CANVAS_OVERSCAN_PX = 192;
const REDUCED_MOTION_DURATION_MS = 1400;

const meetingReactionStreamVariants = cva(
  "pointer-events-none absolute inset-y-0 z-10 overflow-visible",
  {
    variants: {
      placement: {
        center: "left-1/2 -translate-x-1/2",
        left: "left-0",
        right: "right-0",
      },
      size: {
        lg: "w-[min(24rem,72vw)] sm:w-[min(26rem,50vw)]",
        md: "w-[min(18rem,58vw)] sm:w-[min(20rem,38vw)]",
        sm: "w-[min(13rem,48vw)] sm:w-[min(15rem,30vw)]",
      },
    },
    defaultVariants: {
      placement: "right",
      size: "md",
    },
  }
);

const meetingReactionStreamVariantConfig = {
  burst: {
    maxDelay: 140,
    particleCount: 6,
    spread: 1.75,
  },
  cascade: {
    maxDelay: 320,
    particleCount: 2,
    spread: 0.72,
  },
  float: {
    maxDelay: 0,
    particleCount: 0,
    spread: 0,
  },
} as const satisfies Record<
  MeetingReactionStreamVariant,
  {
    readonly maxDelay: number;
    readonly particleCount: number;
    readonly spread: number;
  }
>;

const meetingReactionStreamSizeConfig = {
  lg: {
    emojiSize: 56,
    nameFontSize: 12,
    namePaddingX: 12,
    namePaddingY: 6,
  },
  md: {
    emojiSize: 44,
    nameFontSize: 11,
    namePaddingX: 10,
    namePaddingY: 5,
  },
  sm: {
    emojiSize: 34,
    nameFontSize: 10,
    namePaddingX: 8,
    namePaddingY: 4,
  },
} as const satisfies Record<
  MeetingReactionStreamSize,
  {
    readonly emojiSize: number;
    readonly nameFontSize: number;
    readonly namePaddingX: number;
    readonly namePaddingY: number;
  }
>;

type ReactionMotion = ReturnType<typeof getReactionMotion>;
type ReactionParticleMotion = ReturnType<typeof getReactionParticleMotion>;

type ReactionTexture = {
  readonly canvas: HTMLCanvasElement;
  readonly height: number;
  readonly visualHeight: number;
  readonly width: number;
};

type ReactionSpriteAssets = {
  readonly emoji: ReactionTexture;
  readonly nameTag: ReactionTexture;
};

type ReactionSprite = {
  assets: ReactionSpriteAssets;
  readonly labelParticleIndex: number | null;
  readonly motion: ReactionMotion;
  readonly particles: readonly ReactionParticleMotion[];
  readonly reaction: MeetingReactionEvent;
  readonly size: MeetingReactionStreamSize;
  readonly startedAt: number;
  readonly variant: MeetingReactionStreamVariant;
};

type CanvasSize = {
  readonly contentLeft: number;
  readonly contentWidth: number;
  readonly height: number;
  readonly width: number;
};

type ReactionTextureCache = {
  readonly devicePixelRatio: number;
  readonly emoji: Map<string, ReactionTexture>;
  readonly fontFamily: string;
  readonly nameTag: Map<string, ReactionTexture>;
};

function hashReactionId(id: string) {
  let hash = 2_166_136_261;

  for (const character of id) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16_777_619);
  }

  hash ^= hash >>> 16;
  hash = Math.imul(hash, 2_246_822_507);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 3_266_489_909);

  return (hash ^ (hash >>> 16)) >>> 0;
}

function normalizeLaneCount(laneCount: number) {
  if (!Number.isFinite(laneCount)) {
    return DEFAULT_LANE_COUNT;
  }

  return Math.max(1, Math.min(Math.round(laneCount), MAX_LANE_COUNT));
}

function normalizeLaneVariance(laneVariance: number) {
  if (!Number.isFinite(laneVariance)) {
    return DEFAULT_LANE_VARIANCE;
  }

  return Math.max(0, Math.min(laneVariance, MAX_LANE_VARIANCE));
}

function getSeededUnit(id: string, salt: string) {
  return hashReactionId(`${id}:${salt}`) / 4_294_967_295;
}

function getSeededOffset(id: string, salt: string, variance: number) {
  return Math.round((getSeededUnit(id, salt) * 2 - 1) * variance);
}

function biasOffsetTowardStream(
  offset: number,
  lane: number,
  laneCount: number
) {
  if (laneCount <= 1) {
    return offset;
  }

  if (lane === 0) {
    return Math.abs(offset);
  }

  if (lane === laneCount - 1) {
    return -Math.abs(offset);
  }

  return offset;
}

function getReactionMotion(
  id: string,
  laneCount: number,
  laneVariance: number
) {
  const lane = hashReactionId(id) % laneCount;
  const getLaneOffset = (salt: string, variance: number) =>
    biasOffsetTowardStream(
      getSeededOffset(id, salt, variance),
      lane,
      laneCount
    );
  const direction = getSeededUnit(id, "rotation") < 0.5 ? -1 : 1;

  return {
    curveOffset: getLaneOffset("curve", laneVariance),
    duration:
      FLOAT_DURATION_MS +
      Math.round((getSeededUnit(id, "duration") * 2 - 1) * 240),
    endOffset: getLaneOffset("end", laneVariance),
    lane,
    riseScale: 0.92 + getSeededUnit(id, "rise") * 0.16,
    rotation: direction * (3 + Math.round(getSeededUnit(id, "tilt") * 5)),
    startOffset: getLaneOffset("start", laneVariance),
  };
}

function getReactionParticleMotion({
  duration,
  id,
  index,
  lane,
  laneCount,
  laneVariance,
  variant,
}: {
  readonly duration: number;
  readonly id: string;
  readonly index: number;
  readonly lane: number;
  readonly laneCount: number;
  readonly laneVariance: number;
  readonly variant: MeetingReactionStreamVariant;
}) {
  const config = meetingReactionStreamVariantConfig[variant];
  const particleId = `${id}:particle:${index}`;
  const spread =
    Math.max(18, laneVariance + 18) *
    config.spread *
    (0.72 + getSeededUnit(particleId, "spread") * 0.68);
  const getLaneOffset = (salt: string, multiplier = 1) =>
    biasOffsetTowardStream(
      getSeededOffset(particleId, salt, spread * multiplier),
      lane,
      laneCount
    );
  const delay =
    variant === "cascade"
      ? 110 + index * 120
      : Math.round(getSeededUnit(particleId, "delay") * config.maxDelay);
  const direction =
    getSeededUnit(particleId, "rotation-direction") < 0.5 ? -1 : 1;

  return {
    curveX: getLaneOffset("curve"),
    delay,
    duration:
      duration - delay - Math.round(getSeededUnit(particleId, "finish") * 180),
    endX: getLaneOffset("end", 1.25),
    riseScale:
      variant === "cascade"
        ? 0.76 + index * 0.12
        : 0.68 + getSeededUnit(particleId, "rise") * 0.4,
    rotation:
      direction * (12 + Math.round(getSeededUnit(particleId, "rotation") * 30)),
    scale:
      variant === "cascade"
        ? 0.58 + index * 0.08
        : 0.38 + getSeededUnit(particleId, "scale") * 0.5,
    startX: getLaneOffset("start", 0.28),
  };
}

function clampUnit(value: number) {
  return Math.max(0, Math.min(value, 1));
}

function easeOutCubic(value: number) {
  return 1 - (1 - value) ** 3;
}

function easeInOutCubic(value: number) {
  return value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2;
}

function interpolate(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function quadraticCurve(
  start: number,
  control: number,
  end: number,
  progress: number
) {
  const inverse = 1 - progress;

  return (
    inverse * inverse * start +
    2 * inverse * progress * control +
    progress * progress * end
  );
}

function getOpacity(progress: number) {
  if (progress < 0.12) {
    return easeOutCubic(progress / 0.12);
  }

  if (progress > 0.72) {
    return 1 - easeInOutCubic((progress - 0.72) / 0.28);
  }

  return 1;
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const resolvedRadius = Math.min(radius, width / 2, height / 2);

  context.beginPath();
  context.moveTo(x + resolvedRadius, y);
  context.arcTo(x + width, y, x + width, y + height, resolvedRadius);
  context.arcTo(x + width, y + height, x, y + height, resolvedRadius);
  context.arcTo(x, y + height, x, y, resolvedRadius);
  context.arcTo(x, y, x + width, y, resolvedRadius);
  context.closePath();
}

function createTextureCanvas(
  width: number,
  height: number,
  devicePixelRatio: number
) {
  const canvas = document.createElement("canvas");
  canvas.height = Math.ceil(height * devicePixelRatio);
  canvas.width = Math.ceil(width * devicePixelRatio);
  const context = canvas.getContext("2d");

  context?.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

  return { canvas, context };
}

function createEmojiTexture(
  emoji: string,
  emojiSize: number,
  devicePixelRatio: number
): ReactionTexture {
  const textureSize = Math.ceil(emojiSize * 2.15);
  const { canvas, context } = createTextureCanvas(
    textureSize,
    textureSize,
    devicePixelRatio
  );

  if (context !== null) {
    context.font = `${emojiSize}px serif`;
    context.shadowBlur = 10;
    context.shadowColor = "rgb(0 0 0 / 0.3)";
    context.shadowOffsetY = 6;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(emoji, textureSize / 2, textureSize / 2);
  }

  return {
    canvas,
    height: textureSize,
    visualHeight: emojiSize,
    width: textureSize,
  };
}

function fitNameTagText(context: CanvasRenderingContext2D, senderName: string) {
  if (context.measureText(senderName).width <= LABEL_MAX_TEXT_WIDTH_PX) {
    return senderName;
  }

  const characters = Array.from(senderName);

  while (characters.length > 1) {
    characters.pop();
    const candidate = `${characters.join("")}…`;

    if (context.measureText(candidate).width <= LABEL_MAX_TEXT_WIDTH_PX) {
      return candidate;
    }
  }

  return "…";
}

function createNameTagTexture(
  senderName: string,
  size: MeetingReactionStreamSize,
  fontFamily: string,
  devicePixelRatio: number
): ReactionTexture {
  const sizeConfig = meetingReactionStreamSizeConfig[size];
  const measurementCanvas = document.createElement("canvas");
  const measurementContext = measurementCanvas.getContext("2d");
  const fallbackTextWidth = Math.min(
    senderName.length * sizeConfig.nameFontSize * 0.58,
    LABEL_MAX_TEXT_WIDTH_PX
  );

  if (measurementContext !== null) {
    measurementContext.font = `600 ${sizeConfig.nameFontSize}px ${fontFamily}`;
  }

  const fittedName =
    measurementContext === null
      ? senderName
      : fitNameTagText(measurementContext, senderName);
  const textWidth =
    measurementContext?.measureText(fittedName).width ?? fallbackTextWidth;
  const caretHeight = 4;
  const shadowPadding = 8;
  const pillHeight = sizeConfig.nameFontSize + sizeConfig.namePaddingY * 2 + 1;
  const pillWidth = Math.ceil(textWidth + sizeConfig.namePaddingX * 2);
  const textureHeight = pillHeight + caretHeight + shadowPadding * 2;
  const textureWidth = pillWidth + shadowPadding * 2;
  const { canvas, context } = createTextureCanvas(
    textureWidth,
    textureHeight,
    devicePixelRatio
  );

  if (context !== null) {
    const pillX = shadowPadding;
    const pillY = shadowPadding + caretHeight;
    const centerX = textureWidth / 2;
    const background = context.createLinearGradient(
      pillX,
      pillY,
      pillX,
      pillY + pillHeight
    );
    background.addColorStop(0, "rgb(38 38 38 / 0.94)");
    background.addColorStop(1, "rgb(10 10 10 / 0.9)");

    context.shadowBlur = 10;
    context.shadowColor = "rgb(0 0 0 / 0.34)";
    context.shadowOffsetY = 4;
    context.fillStyle = background;
    roundedRect(context, pillX, pillY, pillWidth, pillHeight, pillHeight / 2);
    context.fill();
    context.beginPath();
    context.moveTo(centerX - 4, pillY + 1);
    context.lineTo(centerX, pillY - caretHeight);
    context.lineTo(centerX + 4, pillY + 1);
    context.closePath();
    context.fill();

    context.shadowColor = "transparent";
    context.strokeStyle = "rgb(255 255 255 / 0.14)";
    context.lineWidth = 1;
    roundedRect(context, pillX, pillY, pillWidth, pillHeight, pillHeight / 2);
    context.stroke();

    context.fillStyle = "rgb(250 250 250)";
    context.font = `600 ${sizeConfig.nameFontSize}px ${fontFamily}`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(fittedName, centerX, pillY + pillHeight / 2);
  }

  return {
    canvas,
    height: textureHeight,
    visualHeight: pillHeight + caretHeight,
    width: textureWidth,
  };
}

function createReactionTextureCache(
  devicePixelRatio: number,
  fontFamily: string
): ReactionTextureCache {
  return {
    devicePixelRatio,
    emoji: new Map(),
    fontFamily,
    nameTag: new Map(),
  };
}

function getReactionSpriteAssets(
  cache: ReactionTextureCache,
  reaction: MeetingReactionEvent,
  size: MeetingReactionStreamSize
): ReactionSpriteAssets {
  const emojiKey = `${reaction.emoji}:${size}`;
  const nameTagKey = `${reaction.senderName}:${size}`;
  let emoji = cache.emoji.get(emojiKey);
  let nameTag = cache.nameTag.get(nameTagKey);

  if (emoji === undefined) {
    emoji = createEmojiTexture(
      reaction.emoji,
      meetingReactionStreamSizeConfig[size].emojiSize,
      cache.devicePixelRatio
    );
    cache.emoji.set(emojiKey, emoji);
  }

  if (nameTag === undefined) {
    nameTag = createNameTagTexture(
      reaction.senderName,
      size,
      cache.fontFamily,
      cache.devicePixelRatio
    );
    cache.nameTag.set(nameTagKey, nameTag);
  }

  return { emoji, nameTag };
}

function clampTextureX(
  x: number,
  texture: ReactionTexture,
  scale: number,
  canvasWidth: number
) {
  const inset = Math.min(texture.width * scale * 0.5 + 4, canvasWidth / 2);

  return Math.max(inset, Math.min(x, canvasWidth - inset));
}

function drawTexture(
  context: CanvasRenderingContext2D,
  texture: ReactionTexture,
  alpha: number,
  x: number,
  y: number,
  rotation: number,
  scale: number,
  devicePixelRatio: number
) {
  const radians = (rotation * Math.PI) / 180;
  const cosine = Math.cos(radians) * scale;
  const sine = Math.sin(radians) * scale;

  context.setTransform(
    devicePixelRatio * cosine,
    devicePixelRatio * sine,
    devicePixelRatio * -sine,
    devicePixelRatio * cosine,
    devicePixelRatio * x,
    devicePixelRatio * y
  );
  context.globalAlpha = alpha;
  context.drawImage(
    texture.canvas,
    -texture.width / 2,
    -texture.height / 2,
    texture.width,
    texture.height
  );
}

function makeReactionSprite(input: {
  readonly assets: ReactionSpriteAssets;
  readonly laneCount: number;
  readonly laneVariance: number;
  readonly reaction: MeetingReactionEvent;
  readonly reducedMotion: boolean;
  readonly size: MeetingReactionStreamSize;
  readonly startedAt: number;
  readonly variant: MeetingReactionStreamVariant;
}): ReactionSprite {
  const motion = getReactionMotion(
    input.reaction.id,
    input.laneCount,
    input.laneVariance
  );
  const particleCount = input.reducedMotion
    ? 0
    : meetingReactionStreamVariantConfig[input.variant].particleCount;
  const particles = Array.from({ length: particleCount }, (_, index) =>
    getReactionParticleMotion({
      duration: motion.duration,
      id: input.reaction.id,
      index,
      lane: motion.lane,
      laneCount: input.laneCount,
      laneVariance: input.laneVariance,
      variant: input.variant,
    })
  );
  let labelParticleIndex: number | null = null;

  if (input.variant === "burst") {
    let largestScale = Number.NEGATIVE_INFINITY;

    for (const [index, particle] of particles.entries()) {
      if (particle.scale > largestScale) {
        labelParticleIndex = index;
        largestScale = particle.scale;
      }
    }
  }

  return {
    assets: input.assets,
    labelParticleIndex,
    motion: input.reducedMotion
      ? { ...motion, duration: REDUCED_MOTION_DURATION_MS }
      : motion,
    particles,
    reaction: input.reaction,
    size: input.size,
    startedAt: input.startedAt,
    variant: input.variant,
  };
}

function drawReactionSprite(
  context: CanvasRenderingContext2D,
  sprite: ReactionSprite,
  canvasSize: CanvasSize,
  now: number,
  laneCount: number,
  devicePixelRatio: number
) {
  const elapsed = now - sprite.startedAt;
  const progress = clampUnit(elapsed / sprite.motion.duration);
  const easedProgress = easeInOutCubic(progress);
  const laneWidth = canvasSize.contentWidth / laneCount;
  const laneCenter =
    canvasSize.contentLeft + laneWidth * (sprite.motion.lane + 0.5);
  const sizeConfig = meetingReactionStreamSizeConfig[sprite.size];
  const burstStartOffset = sprite.variant === "burst" ? 18 : 0;
  const labelBottomReserve =
    LABEL_EDGE_INSET_PX +
    LABEL_EDGE_FADE_PX +
    LABEL_GAP_PX +
    sizeConfig.emojiSize * 0.58 +
    sprite.assets.nameTag.height * 0.5 +
    sprite.assets.nameTag.visualHeight * 0.5;
  const baseY = Math.max(
    sizeConfig.emojiSize * 0.6,
    canvasSize.height - labelBottomReserve - burstStartOffset
  );
  const rise =
    Math.max(160, Math.min(canvasSize.height * 0.74, 560)) *
    sprite.motion.riseScale;
  const rawX =
    laneCenter +
    quadraticCurve(
      sprite.motion.startOffset,
      sprite.motion.curveOffset,
      sprite.motion.endOffset,
      easedProgress
    );
  const y = baseY - rise * easedProgress;
  const opacity = getOpacity(progress);
  const emojiScale =
    progress < 0.12
      ? interpolate(0.86, 1.08, easeOutCubic(progress / 0.12))
      : interpolate(1.08, 0.98, (progress - 0.12) / 0.88);
  const x = clampTextureX(
    rawX,
    sprite.assets.emoji,
    emojiScale,
    canvasSize.width
  );
  let labelAnchorOpacity = opacity;
  let labelAnchorProgress = progress;
  let labelAnchorScale = emojiScale;
  let labelAnchorX = x;
  let labelAnchorY = y;

  if (sprite.variant !== "burst") {
    drawTexture(
      context,
      sprite.assets.emoji,
      opacity,
      x,
      y,
      interpolate(
        -sprite.motion.rotation,
        sprite.motion.rotation,
        easedProgress
      ),
      emojiScale,
      devicePixelRatio
    );
  } else {
    labelAnchorOpacity = 0;
  }

  for (let index = 0; index < sprite.particles.length; index += 1) {
    const particle = sprite.particles[index];

    if (particle === undefined) {
      continue;
    }

    const particleElapsed = elapsed - particle.delay;

    if (particleElapsed < 0) {
      continue;
    }

    const particleProgress = clampUnit(particleElapsed / particle.duration);
    const particleEase = easeInOutCubic(particleProgress);
    const particleOpacity = getOpacity(particleProgress) * 0.9;
    const particleScale =
      particle.scale *
      (particleProgress < 0.14
        ? interpolate(0.42, 1.18, easeOutCubic(particleProgress / 0.14))
        : interpolate(1.18, 0.86, (particleProgress - 0.14) / 0.86));
    const particleX = clampTextureX(
      laneCenter +
        quadraticCurve(
          particle.startX,
          particle.curveX,
          particle.endX,
          particleEase
        ),
      sprite.assets.emoji,
      particleScale,
      canvasSize.width
    );
    const particleY = baseY + 18 - rise * particle.riseScale * particleEase;

    drawTexture(
      context,
      sprite.assets.emoji,
      particleOpacity,
      particleX,
      particleY,
      interpolate(-particle.rotation * 0.35, particle.rotation, particleEase),
      particleScale,
      devicePixelRatio
    );

    if (index === sprite.labelParticleIndex) {
      labelAnchorOpacity = particleOpacity;
      labelAnchorProgress = particleProgress;
      labelAnchorScale = particleScale;
      labelAnchorX = particleX;
      labelAnchorY = particleY;
    }
  }

  if (labelAnchorOpacity > 0) {
    const labelScale = interpolate(
      0.88,
      1,
      easeOutCubic(clampUnit(labelAnchorProgress / 0.18))
    );
    const labelX = clampTextureX(
      labelAnchorX,
      sprite.assets.nameTag,
      labelScale,
      canvasSize.width
    );
    const labelY =
      labelAnchorY +
      sizeConfig.emojiSize * labelAnchorScale * 0.5 +
      LABEL_GAP_PX +
      sprite.assets.nameTag.visualHeight * 0.5;
    const labelHalfHeight = sprite.assets.nameTag.height * labelScale * 0.5;
    const labelTop = labelY - labelHalfHeight;
    const labelBottom = labelY + labelHalfHeight;
    const labelBoundaryOpacity = Math.min(
      clampUnit((labelTop - LABEL_EDGE_INSET_PX) / LABEL_EDGE_FADE_PX),
      clampUnit(
        (canvasSize.height - LABEL_EDGE_INSET_PX - labelBottom) /
          LABEL_EDGE_FADE_PX
      )
    );

    if (labelBoundaryOpacity > 0) {
      drawTexture(
        context,
        sprite.assets.nameTag,
        labelAnchorOpacity * labelBoundaryOpacity,
        labelX,
        labelY,
        0,
        labelScale,
        devicePixelRatio
      );
    }
  }

  return progress >= 1;
}

export function MeetingReactionStreamItem({
  laneCount,
  laneVariance,
  onComplete,
  reaction,
  size,
  variant,
  ...props
}: MeetingReactionStreamItemProps) {
  return (
    <MeetingReactionStream
      {...props}
      laneCount={laneCount}
      laneVariance={laneVariance}
      onReactionComplete={onComplete}
      reactions={[reaction]}
      size={size}
      variant={variant}
    />
  );
}

export function MeetingReactionStream({
  className,
  laneCount = DEFAULT_LANE_COUNT,
  laneVariance = DEFAULT_LANE_VARIANCE,
  onReactionComplete,
  placement = "right",
  reactions,
  ref,
  size = "md",
  variant = "cascade",
  ...props
}: MeetingReactionStreamProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const completedReactionIdsRef = useRef(new Set<string>());
  const requestFrameRef = useRef<() => void>(() => undefined);
  const spritesRef = useRef(new Map<string, ReactionSprite>());
  const textureCacheRef = useRef<ReactionTextureCache | null>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const completeReaction = useEffectEvent(onReactionComplete);
  const resolvedLaneCount = normalizeLaneCount(laneCount);
  const resolvedLaneVariance = normalizeLaneVariance(laneVariance);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas === null) {
      return;
    }

    const context = canvas.getContext("2d");

    if (context === null) {
      return;
    }

    let animationFrame: number | null = null;
    let canvasSize: CanvasSize = {
      contentLeft: REACTION_STREAM_CANVAS_OVERSCAN_PX,
      contentWidth: 1,
      height: 1,
      width: 1,
    };
    let devicePixelRatio = 1;
    let requestFrame = () => undefined;
    let textureCache = createReactionTextureCache(1, "sans-serif");
    textureCacheRef.current = textureCache;

    const syncCanvasSize = () => {
      const bounds = canvas.getBoundingClientRect();
      const nextDevicePixelRatio = Math.min(
        window.devicePixelRatio || 1,
        MAX_CANVAS_DPR
      );
      const nextFontFamily =
        getComputedStyle(canvas).fontFamily || "sans-serif";
      const height = Math.max(1, Math.round(bounds.height));
      const width = Math.max(1, Math.round(bounds.width));
      const pixelHeight = Math.round(height * nextDevicePixelRatio);
      const pixelWidth = Math.round(width * nextDevicePixelRatio);

      if (canvas.height !== pixelHeight || canvas.width !== pixelWidth) {
        canvas.height = pixelHeight;
        canvas.width = pixelWidth;
      }

      canvasSize = {
        contentLeft: REACTION_STREAM_CANVAS_OVERSCAN_PX,
        contentWidth: Math.max(
          1,
          width - REACTION_STREAM_CANVAS_OVERSCAN_PX * 2
        ),
        height,
        width,
      };
      devicePixelRatio = nextDevicePixelRatio;

      if (
        textureCache.devicePixelRatio !== nextDevicePixelRatio ||
        textureCache.fontFamily !== nextFontFamily
      ) {
        textureCache = createReactionTextureCache(
          nextDevicePixelRatio,
          nextFontFamily
        );
        textureCacheRef.current = textureCache;

        for (const sprite of spritesRef.current.values()) {
          sprite.assets = getReactionSpriteAssets(
            textureCache,
            sprite.reaction,
            sprite.size
          );
        }
      }

      requestFrame();
    };
    const renderFrame = (now: number) => {
      animationFrame = null;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.globalAlpha = 1;
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (const [reactionId, sprite] of spritesRef.current) {
        const complete = drawReactionSprite(
          context,
          sprite,
          canvasSize,
          now,
          resolvedLaneCount,
          devicePixelRatio
        );

        if (complete) {
          spritesRef.current.delete(reactionId);
          completedReactionIdsRef.current.add(reactionId);
          completeReaction(reactionId);
        }
      }

      if (spritesRef.current.size > 0) {
        animationFrame = requestAnimationFrame(renderFrame);
      }
    };
    requestFrame = () => {
      if (animationFrame === null) {
        animationFrame = requestAnimationFrame(renderFrame);
      }
    };
    requestFrameRef.current = requestFrame;
    syncCanvasSize();
    const resizeObserver =
      globalThis.ResizeObserver === undefined
        ? null
        : new ResizeObserver(syncCanvasSize);
    resizeObserver?.observe(canvas);
    window.addEventListener("resize", syncCanvasSize);

    return () => {
      requestFrameRef.current = () => undefined;
      textureCacheRef.current = null;
      resizeObserver?.disconnect();
      window.removeEventListener("resize", syncCanvasSize);
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [resolvedLaneCount]);

  useEffect(() => {
    const currentReactionIds = new Set(
      reactions.map((reaction) => reaction.id)
    );

    for (const reactionId of completedReactionIdsRef.current) {
      if (!currentReactionIds.has(reactionId)) {
        completedReactionIdsRef.current.delete(reactionId);
      }
    }

    for (const reactionId of spritesRef.current.keys()) {
      if (!currentReactionIds.has(reactionId)) {
        spritesRef.current.delete(reactionId);
      }
    }

    const startedAt = performance.now();
    const textureCache = textureCacheRef.current;

    if (textureCache === null) {
      return;
    }

    for (const reaction of reactions) {
      if (
        spritesRef.current.has(reaction.id) ||
        completedReactionIdsRef.current.has(reaction.id)
      ) {
        continue;
      }

      spritesRef.current.set(
        reaction.id,
        makeReactionSprite({
          assets: getReactionSpriteAssets(textureCache, reaction, size),
          laneCount: resolvedLaneCount,
          laneVariance: resolvedLaneVariance,
          reaction,
          reducedMotion: prefersReducedMotion,
          size,
          startedAt,
          variant,
        })
      );
    }

    requestFrameRef.current();
  }, [
    prefersReducedMotion,
    reactions,
    resolvedLaneCount,
    resolvedLaneVariance,
    size,
    variant,
  ]);

  return (
    <div
      aria-live="polite"
      aria-relevant="additions"
      className={cn(
        meetingReactionStreamVariants({ placement, size }),
        className
      )}
      data-lane-count={resolvedLaneCount}
      data-lane-variance={resolvedLaneVariance}
      data-placement={placement}
      data-size={size}
      data-slot="meeting-reaction-stream"
      data-variant={variant}
      ref={ref}
      role="log"
      {...props}
    >
      <canvas
        aria-hidden
        className="absolute inset-y-0 left-1/2 h-full max-w-none -translate-x-1/2 font-sans"
        data-slot="meeting-reaction-stream-canvas"
        ref={canvasRef}
        style={{
          width: `calc(100% + ${REACTION_STREAM_CANVAS_OVERSCAN_PX * 2}px)`,
        }}
      />
      {reactions.map((reaction) => (
        <span className="sr-only" key={reaction.id}>
          {reaction.senderName} reacted with {reaction.label}
        </span>
      ))}
    </div>
  );
}
