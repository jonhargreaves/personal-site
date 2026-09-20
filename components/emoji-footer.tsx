"use client";

import { useRef, useState } from "react";
import PixelEmojiCard from "@/components/PixelEmojiCard/pixel-emoji-card";
import AboutMeDialog from "@/components/about-me-dialog";
import type { AboutMeVariant } from "@/components/about-me-content";
import { initialTileColors, matchEmojiCombination, type TileColor, type TileId } from "@/lib/emoji-combinations";

const tiles = [
  { id: "smile", src: "slight-smile", alt: "Smiling face", width: 128, height: 128 },
  { id: "heart", src: "heart", alt: "Heart", width: 128, height: 112, offsetY: 4 },
  { id: "hands", src: "hands-pressed-together", alt: "Hands pressed together", width: 128, height: 128 },
  { id: "eyes", src: "eyes", alt: "Eyes", width: 128, height: 112 },
  { id: "ok", src: "ok-hand-sign", alt: "OK hand sign", width: 96, height: 128 },
  { id: "fire", src: "fire", alt: "Fire", width: 100, height: 128 },
] as const;

export default function EmojiFooter() {
  const [colors, setColors] = useState(initialTileColors);
  const [variant, setVariant] = useState<AboutMeVariant>(1);
  const [open, setOpen] = useState(false);
  const lastTile = useRef<HTMLButtonElement | null>(null);

  function changeColor(id: TileId, color: TileColor, button: HTMLButtonElement) {
    const updated = { ...colors, [id]: color };
    setColors(updated);
    const match = matchEmojiCombination(updated);
    if (match) {
      lastTile.current = button;
      setVariant(match);
      setOpen(true);
    }
  }

  return (
    <>
      <footer
        className="grid w-full grid-flow-col grid-cols-2 grid-rows-3 gap-2 min-[480px]:grid-flow-row min-[480px]:grid-cols-3 min-[480px]:grid-rows-2 min-[480px]:gap-3"
        aria-label="Pixel emoji cards"
      >
        {tiles.map(({ id, src, ...tile }) => (
          <PixelEmojiCard
            key={id}
            {...tile}
            src={`/pixel-emoji/${src}.svg`}
            sound={id}
            color={colors[id]}
            onColorChange={(color, button) => changeColor(id, color, button)}
          />
        ))}
      </footer>
      <AboutMeDialog variant={variant} open={open} onOpenChange={setOpen} finalFocus={lastTile} />
    </>
  );
}
