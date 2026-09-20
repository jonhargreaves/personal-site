"use client";

import type { RefObject } from "react";
import AboutMeContent, { type AboutMeVariant } from "@/components/about-me-content";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AboutMeDialog({
  variant,
  open,
  onOpenChange,
  finalFocus,
}: {
  variant: AboutMeVariant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  finalFocus?: RefObject<HTMLElement | null>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-2 p-2 font-mono" finalFocus={finalFocus}>
        <DialogHeader>
          <DialogTitle className="p-1 text-center text-[14px]">About me ({variant}/5)</DialogTitle>
          <DialogDescription className="hidden">
            A few things about me.
          </DialogDescription>
        </DialogHeader>
        <AboutMeContent variant={variant} />
      </DialogContent>
    </Dialog>
  );
}
