import { useId, useRef, type FormEvent } from "react";
import { Button } from "@/prototypes/hyper-meeting/design-system/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/prototypes/hyper-meeting/design-system/components/dialog";
import { Input } from "@/prototypes/hyper-meeting/design-system/components/input";
import { Label } from "@/prototypes/hyper-meeting/design-system/components/label";

export default function MeetingRenameDialog({
  open,
  draft,
  onOpenChange,
  onDraftChange,
  onTitleChange,
  returnFocus,
}: {
  open: boolean;
  draft: string;
  onOpenChange: (open: boolean) => void;
  onDraftChange: (title: string) => void;
  onTitleChange: (title: string) => void;
  returnFocus: () => HTMLElement | null;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = draft.trim();
    if (!name) return;
    onTitleChange(name);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="dark text-foreground sm:max-w-[425px]"
        initialFocus={inputRef}
        finalFocus={returnFocus}
      >
        <DialogHeader>
          <DialogTitle>Rename meeting</DialogTitle>
          <DialogDescription>Change the name shown in this meeting.</DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-6" onSubmit={save}>
          <div className="grid gap-2">
            <Label htmlFor={inputId}>Meeting name</Label>
            <Input
              id={inputId}
              ref={inputRef}
              value={draft}
              onChange={(event) => onDraftChange(event.target.value)}
              onFocus={(event) => event.currentTarget.select()}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!draft.trim()}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
