import { useState } from "react";
import { LucideSearch } from "@/vendor/hyper-ui/icons";
import { Button } from "@/vendor/hyper-ui/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/vendor/hyper-ui/ui/components/dialog";
import { Input } from "@/vendor/hyper-ui/ui/components/input";

export default function MeetingSearch({
  onLayoutChange,
  onMoreOpen,
}: {
  onLayoutChange: (focused: boolean) => void;
  onMoreOpen: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const commands = [
    { label: "Dynamic layout", action: () => onLayoutChange(false) },
    { label: "Focus on Jon", action: () => onLayoutChange(true) },
    { label: "More options", action: onMoreOpen },
  ].filter((command) => command.label.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setQuery("");
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="icon-sm" aria-label="Search meeting">
          <LucideSearch />
        </Button>
      </DialogTrigger>
      <DialogContent className="dark text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search meeting</DialogTitle>
          <DialogDescription>Find a meeting control or panel.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            aria-label="Search meeting controls"
            placeholder="Search controls…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="space-y-1">
            {commands.map((command) => (
              <Button
                key={command.label}
                type="button"
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setOpen(false);
                  command.action();
                }}
              >
                {command.label}
              </Button>
            ))}
            {commands.length === 0 ? (
              <p role="status" className="p-3 text-sm text-muted-foreground">
                No matching controls.
              </p>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
