import { LucideEllipsis } from "../../../../../icons/index";

import { Spinner } from "../../../spinner";

function MediaTogglePendingIcon({
  className,
  prefersReducedMotion,
}: {
  readonly className: string;
  readonly prefersReducedMotion: boolean;
}) {
  return prefersReducedMotion ? (
    <LucideEllipsis
      aria-hidden="true"
      className={className}
      data-slot="media-toggle-pending-icon"
    />
  ) : (
    <Spinner
      aria-hidden="true"
      className={className}
      data-slot="media-toggle-pending-icon"
      variant="ellipsis"
    />
  );
}

export { MediaTogglePendingIcon };
