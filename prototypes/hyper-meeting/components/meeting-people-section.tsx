import { useState, type ReactNode } from "react";
import { LucideChevronUp } from "@/prototypes/hyper-meeting/design-system/icons/index";
import { Button } from "@/prototypes/hyper-meeting/design-system/components/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/prototypes/hyper-meeting/design-system/components/collapsible";

export default function MeetingPeopleSection({ label, count, defaultOpen = true, children }: {
  label: string;
  count: number;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="flex flex-col border-b border-border" data-slot="participants-panel-section">
      <div className="flex items-center justify-between gap-2 p-2">
        <span className="min-w-0 px-2 text-sm font-medium">{`${label} (${count})`}</span>
        <CollapsibleTrigger asChild>
          <Button
            aria-label={`${open ? "Collapse" : "Expand"} ${label.toLowerCase()}`}
            type="button"
            variant="ghost"
            size="icon-sm"
          >
            <LucideChevronUp aria-hidden="true" className={`size-4${open ? "" : " rotate-180"}`} />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent><div className="flex flex-col">{children}</div></CollapsibleContent>
    </Collapsible>
  );
}
