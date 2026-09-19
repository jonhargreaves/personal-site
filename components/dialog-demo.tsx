"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger className="mb-6 w-fit cursor-pointer border-b border-white/25 bg-transparent p-0 font-mono text-base text-white transition-colors hover:border-white/50 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none">
        Open dialog
      </DialogTrigger>
      <DialogContent className="gap-2 p-2 font-mono">
        <DialogHeader>
          <DialogTitle className="p-1 text-center text-[14px]">About me (1/5)</DialogTitle>
          <DialogDescription className="hidden">
            A few things about me.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 rounded-[4px] bg-white/5 p-4 text-popover-foreground ring-1 ring-foreground/10">
          <div className="aspect-[4/3] w-full bg-[#0055FF]" aria-hidden="true" />
          <p className="text-[14px]">
            I really like the color blue. Specifically, #0055FF.
          </p>
        </div>
        <DialogFooter className="hidden">
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <DialogClose render={<Button />}>Save changes</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
