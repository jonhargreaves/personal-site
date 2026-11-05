import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg p-6 text-center md:p-12",
        className
      )}
      data-slot="empty"
      {...props}
    />
  );
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex max-w-sm flex-col items-center gap-2 text-center",
        className
      )}
      data-slot="empty-header"
      {...props}
    />
  );
}

function EmptyActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 sm:flex-row",
        className
      )}
      data-slot="empty-actions"
      {...props}
    />
  );
}

const emptyMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg:not([class*='size-'])]:size-6",
        illustration:
          "w-full bg-transparent [&_svg]:h-auto [&_svg]:w-[clamp(5.5rem,40%,7.5rem)] [&_svg]:opacity-90",
      },
    },
    defaultVariants: {
      variant: "illustration",
    },
  }
);

function EmptyMedia({
  className,
  variant = "illustration",
  icon,
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof emptyMediaVariants> & {
    /** Pass a custom icon/element to override the default illustration. Automatically switches to "icon" variant. */
    icon?: React.ReactNode;
  }) {
  const effectiveVariant = icon ? "icon" : variant;
  const media = icon ?? children;

  if (media == null) {
    return null;
  }

  return (
    <div
      className={cn(
        emptyMediaVariants({ variant: effectiveVariant, className })
      )}
      data-slot="empty-icon"
      data-variant={effectiveVariant}
      {...props}
    >
      {media}
    </div>
  );
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "text-balance font-medium text-lg tracking-tight",
        className
      )}
      data-slot="empty-title"
      {...props}
    />
  );
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      className={cn(
        "text-balance text-muted-foreground text-sm/relaxed [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      data-slot="empty-description"
      {...props}
    />
  );
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex w-full min-w-0 max-w-sm flex-col items-center gap-4 text-sm",
        className
      )}
      data-slot="empty-content"
      {...props}
    />
  );
}

export {
  Empty,
  EmptyActions,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
};
