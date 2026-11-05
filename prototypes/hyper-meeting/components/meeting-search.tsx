import { LucideSearch } from "@/prototypes/hyper-meeting/design-system/icons/index";
import { Button } from "@/prototypes/hyper-meeting/design-system/components/button";

export default function MeetingSearch() {
  return (
    <Button type="button" variant="outline" size="icon-sm" aria-label="Search meeting">
      <LucideSearch />
    </Button>
  );
}
