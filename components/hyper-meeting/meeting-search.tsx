import { LucideSearch } from "@/vendor/hyper-ui/icons";
import { Button } from "@/vendor/hyper-ui/ui/components/button";

export default function MeetingSearch() {
  return (
    <Button type="button" variant="outline" size="icon-sm" aria-label="Search meeting">
      <LucideSearch />
    </Button>
  );
}
