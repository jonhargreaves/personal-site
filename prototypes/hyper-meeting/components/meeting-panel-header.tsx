import { LucideChevronLeft } from "@/prototypes/hyper-meeting/design-system/icons/index";
import { Button } from "@/prototypes/hyper-meeting/design-system/components/button";
import { MeetingSidePanelHeader } from "@/prototypes/hyper-meeting/design-system/components/meeting-ui/surfaces/side-panel/side-panel";

export default function MeetingPanelHeader({ title, onBack, onClose }: {
  title: string;
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <MeetingSidePanelHeader
      className="gap-2 [&_h2]:font-medium"
      title={title}
      onClose={onClose}
      leadingAction={
        <Button aria-label="Back to More" variant="ghost" size="icon-sm" onClick={onBack}>
          <LucideChevronLeft className="size-4" />
        </Button>
      }
    />
  );
}
