"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import {
  HugeCheckmarkCircle02Stroke,
  HugeCopy01Stroke,
} from "../icons/index";

import { Button } from "./button";
import { cn } from "../lib/utils";

const errorPageScreenVariants = cva(
  "flex items-center justify-center px-4 py-8 sm:px-6",
  {
    variants: {
      variant: {
        contained: "min-h-[60vh] bg-transparent",
        default: "min-h-svh bg-muted/35",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

const errorPageIconVariants = cva(
  "mx-auto grid size-12 place-items-center rounded-lg border shadow-xs [&_svg]:size-5",
  {
    variants: {
      variant: {
        destructive: "border-destructive/20 bg-destructive/10 text-destructive",
        primary: "border-primary/20 bg-primary/10 text-primary",
      },
    },
    defaultVariants: { variant: "destructive" },
  }
);

const errorPageEyebrowVariants = cva(
  "font-semibold text-xs uppercase tracking-wider",
  {
    variants: {
      variant: {
        destructive: "text-destructive",
        primary: "text-primary",
      },
    },
    defaultVariants: { variant: "destructive" },
  }
);

type ErrorPageScreenProps = React.ComponentProps<"main"> &
  VariantProps<typeof errorPageScreenVariants>;

function ErrorPageScreen({
  className,
  variant,
  ...props
}: ErrorPageScreenProps) {
  return (
    <main
      className={cn(errorPageScreenVariants({ variant }), className)}
      data-slot="error-page-screen"
      {...props}
    />
  );
}

function ErrorPage({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "mx-auto w-full max-w-lg overflow-hidden rounded-2xl border bg-background shadow-xl",
        className
      )}
      data-slot="error-page"
      {...props}
    />
  );
}

function ErrorPageContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("px-6 py-8 text-center sm:px-8 sm:py-9", className)}
      data-slot="error-page-content"
      {...props}
    />
  );
}

type ErrorPageIconProps = React.ComponentProps<"div"> &
  VariantProps<typeof errorPageIconVariants>;

function ErrorPageIcon({ className, variant, ...props }: ErrorPageIconProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(errorPageIconVariants({ variant }), className)}
      data-slot="error-page-icon"
      {...props}
    />
  );
}

function ErrorPageHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      className={cn("mt-6", className)}
      data-slot="error-page-header"
      {...props}
    />
  );
}

type ErrorPageEyebrowProps = React.ComponentProps<"p"> &
  VariantProps<typeof errorPageEyebrowVariants>;

function ErrorPageEyebrow({
  className,
  variant,
  ...props
}: ErrorPageEyebrowProps) {
  return (
    <p
      className={cn(errorPageEyebrowVariants({ variant }), className)}
      data-slot="error-page-eyebrow"
      {...props}
    />
  );
}

function ErrorPageTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "mt-2 text-balance font-semibold text-2xl tracking-tight",
        className
      )}
      data-slot="error-page-title"
      {...props}
    />
  );
}

function ErrorPageDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "mx-auto mt-2 max-w-md text-balance text-muted-foreground text-sm leading-relaxed",
        className
      )}
      data-slot="error-page-description"
      {...props}
    />
  );
}

function ErrorPageActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mt-7 flex flex-col justify-center gap-3 sm:flex-row",
        className
      )}
      data-slot="error-page-actions"
      {...props}
    />
  );
}

type CopyState =
  | { readonly status: "idle" }
  | { readonly status: "copied"; readonly value: string }
  | { readonly status: "error"; readonly value: string };

export type ErrorPageReferenceProps = Omit<
  React.ComponentProps<"footer">,
  "children"
> & {
  readonly label?: string;
  readonly onCopy?: (value: string) => Promise<void> | void;
  readonly value: string;
};

function ErrorPageReference({
  className,
  label = "Error reference",
  onCopy,
  value,
  ...props
}: ErrorPageReferenceProps) {
  const [copyState, setCopyState] = React.useState<CopyState>({
    status: "idle",
  });
  const currentCopyState =
    copyState.status !== "idle" && copyState.value === value
      ? copyState.status
      : "idle";
  const copyLabel =
    currentCopyState === "copied"
      ? "Error reference copied"
      : currentCopyState === "error"
        ? "Could not copy error reference"
        : "Copy error reference";
  const CopyIcon =
    currentCopyState === "copied"
      ? HugeCheckmarkCircle02Stroke
      : HugeCopy01Stroke;

  const copyReference = async () => {
    try {
      if (onCopy) {
        await onCopy(value);
      } else {
        if (
          globalThis.navigator === undefined ||
          navigator.clipboard?.writeText === undefined
        ) {
          throw new Error("Clipboard is unavailable.");
        }
        await navigator.clipboard.writeText(value);
      }
      setCopyState({ status: "copied", value });
    } catch {
      setCopyState({ status: "error", value });
    }
  };

  return (
    <footer
      className={cn("border-t bg-muted/20 px-6 py-4 sm:px-8", className)}
      data-slot="error-page-reference"
      {...props}
    >
      <div className="flex min-w-0 items-center gap-3 rounded-lg border bg-background/80 px-3 py-2 shadow-xs">
        <div className="min-w-0 flex-1 text-left">
          <p className="font-medium text-muted-foreground text-xs">{label}</p>
          <code
            className="mt-0.5 block truncate font-mono text-foreground text-xs"
            title={value}
          >
            {value}
          </code>
        </div>
        <Button
          aria-label={copyLabel}
          className={cn(
            "shrink-0 text-muted-foreground",
            currentCopyState === "copied" && "text-success",
            currentCopyState === "error" && "text-destructive"
          )}
          data-copy-state={currentCopyState}
          onClick={copyReference}
          size="icon-sm"
          title={copyLabel}
          type="button"
          variant="ghost"
        >
          <CopyIcon aria-hidden="true" className="size-4" />
        </Button>
        <span aria-live="polite" className="sr-only" role="status">
          {currentCopyState === "idle" ? "" : copyLabel}
        </span>
      </div>
    </footer>
  );
}

export {
  ErrorPage,
  ErrorPageActions,
  ErrorPageContent,
  ErrorPageDescription,
  ErrorPageEyebrow,
  ErrorPageHeader,
  ErrorPageIcon,
  ErrorPageReference,
  ErrorPageScreen,
  ErrorPageTitle,
};
