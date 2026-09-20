import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

import ethiopiaWorka from "@/public/images/about-me/ethiopia-worka.png";
import scenery from "@/public/images/about-me/scenery.png";
import togoFiresideChair from "@/public/images/about-me/togo-fireside-chair.png";
import yoyogiShrine from "@/public/images/about-me/yoyogi-hachiman-gu-shrine.png";

export type AboutMeVariant = 1 | 2 | 3 | 4 | 5;

type AboutMeItem = {
  text: ReactNode;
  image?: StaticImageData;
  alt?: string;
};

export const aboutMeVariants: Record<AboutMeVariant, AboutMeItem> = {
  1: {
    text: "I really like the color blue. Specifically, #0055FF.",
  },
  2: {
    image: ethiopiaWorka,
    alt: "A bag of Red Rooster Ethiopia Worka coffee with purple and yellow artwork.",
    text: (
      <>
        The{" "}
        <a
          href="https://www.redroostercoffee.com/products/ethiopia-worka-sakaro-anaerobic-natural"
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit border-b border-white/25 text-white transition ease-in-out hover:border-white/50 active:border-white/50 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
        >
          Ethiopia Worka
        </a>{" "}
        from Red Rooster Coffee is the most flavorful coffee I’ve ever had.
      </>
    ),
  },
  3: {
    image: scenery,
    alt: "The red and black cover of Ryo Fukui’s Scenery album.",
    text: (
      <>
        My favorite album of all time is{" "}
        <a
          href="https://youtu.be/Hrr3dp7zRQY?si=MNKe6x8GvWZY8T_n"
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit border-b border-white/25 text-white transition ease-in-out hover:border-white/50 active:border-white/50 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
        >
          “Scenery” by Ryo Fukui
        </a>{" "}
        (and the album artwork is beautiful).
      </>
    ),
  },
  4: {
    image: togoFiresideChair,
    alt: "A sunlit living room furnished with cream-colored Togo seating.",
    text: (
      <>
        The{" "}
        <a
          href="https://www.dwell.com/article/ligne-roset-50th-anniversary-togo-sofa-2647bfd0"
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit border-b border-white/25 text-white transition ease-in-out hover:border-white/50 active:border-white/50 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
        >
          Togo Fireside chair
        </a>{" "}
        by Michel Ducaroy for Ligne Roset is my favorite chair. I won one in a raffle
        at the Togo’s 50th anniversary party at Ligne Roset’s Washington, D.C. showroom.
      </>
    ),
  },
  5: {
    image: yoyogiShrine,
    alt: "Sunlight filtering through a lush green tree canopy at Yoyogi Hachiman-gu Shrine.",
    text: (
      <>
        Sitting under the lush, sun-soaked canopy of Tokyo’s{" "}
        <a
          href="https://maps.app.goo.gl/t76VGydsq3pB22w5A"
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit border-b border-white/25 text-white transition ease-in-out hover:border-white/50 active:border-white/50 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
        >
          Yoyogi Hachiman-gu Shrine
        </a>{" "}
        is my most relaxing memory. Shot on 35mm film.
      </>
    ),
  },
};

export default function AboutMeContent({ variant }: { variant: AboutMeVariant }) {
  const content = aboutMeVariants[variant];

  return (
    <div className="grid gap-4 rounded-[4px] bg-white/5 p-4 text-popover-foreground ring-1 ring-foreground/10">
      {content.image ? (
        <div className="relative aspect-[4/3] w-full">
          <Image
            key={variant}
            src={content.image}
            alt={content.alt ?? ""}
            fill
            sizes="(min-width: 640px) 336px, calc(100vw - 80px)"
            className="object-contain outline outline-1 -outline-offset-1 outline-white/10"
            placeholder="blur"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] w-full bg-[#0055FF] outline outline-1 -outline-offset-1 outline-white/10" aria-hidden="true" />
      )}
      <p className="text-[14px]">{content.text}</p>
    </div>
  );
}
