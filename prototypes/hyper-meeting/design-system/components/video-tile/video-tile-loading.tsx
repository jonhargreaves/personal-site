import { cn } from "../../lib/utils";
import { Spinner } from "../spinner";

interface VideoTileLoadingProps {
  className?: string;
  spinnerClassName?: string;
  spinnerSize?: number;
  visible?: boolean;
}

export function VideoTileLoading({
  visible = true,
  className,
  spinnerClassName,
  spinnerSize = 40,
}: VideoTileLoadingProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-20 flex items-center justify-center",
        className
      )}
    >
      <Spinner
        className={cn("text-white/80", spinnerClassName)}
        size={spinnerSize}
        variant="circle-filled"
      />
    </div>
  );
}
