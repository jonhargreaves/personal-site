"use client";

import Image from "next/image";
import { useState } from "react";
import { playCardSound, type CardSound } from "./card-sound";

const backgrounds = {
  red: "bg-[#ff1500]",
  blue: "bg-[#0055ff]",
  yellow: "bg-[#ffbf00]",
};

const nextColor = { red: "blue", blue: "yellow", yellow: "red" } as const;

type PixelEmojiCardProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  color: keyof typeof backgrounds;
  offsetY?: number;
  sound: CardSound;
  onColorChange?: (color: keyof typeof backgrounds, button: HTMLButtonElement) => void;
};

export default function PixelEmojiCard({
  src,
  alt,
  width,
  height,
  color,
  offsetY = 0,
  sound,
  onColorChange,
}: PixelEmojiCardProps) {
  const [localColor, setLocalColor] = useState(color);
  const currentColor = onColorChange ? color : localColor;

  return (
    <button
      type="button"
      aria-label={`${alt}: ${currentColor} card. Change to ${nextColor[currentColor]}.`}
      onClick={(event) => {
        const updatedColor = nextColor[currentColor];
        if (onColorChange) onColorChange(updatedColor, event.currentTarget);
        else setLocalColor(updatedColor);
        void playCardSound(sound);
      }}
      className={`pixel-emoji-card flex aspect-square min-h-0 min-w-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-0 p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${backgrounds[currentColor]}`}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        unoptimized
        className="max-w-none shrink-0"
        style={{ width, height, transform: `translateY(${offsetY}px)` }}
      />
    </button>
  );
}
