import { cn } from "../lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-secondary motion-reduce:animate-none",
        className
      )}
      data-slot="skeleton"
      {...props}
    />
  );
}

export { Skeleton };
