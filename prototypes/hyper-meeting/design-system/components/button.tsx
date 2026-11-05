import { Button as BaseButton } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { isNumber, isString } from "es-toolkit/predicate";
import * as React from "react";

import { cn } from "../lib/utils";

import { Slot } from "./primitive/slot";
import { Spinner } from "./spinner";

type ButtonChildProps = {
  children?: React.ReactNode;
};

function wrapButtonLabels(children: React.ReactNode): React.ReactNode {
  const wrappedChildren: React.ReactNode[] = [];
  let labelParts: (number | string)[] = [];

  const flushLabel = () => {
    if (labelParts.length === 0) return;

    if (labelParts.some((part) => isNumber(part) || part.trim().length > 0)) {
      wrappedChildren.push(
        <span
          className="px-0.5"
          data-slot="button-label"
          key={`button-label-${wrappedChildren.length}`}
        >
          {labelParts}
        </span>
      );
    } else {
      wrappedChildren.push(...labelParts);
    }

    labelParts = [];
  };

  React.Children.forEach(children, (child) => {
    if (isString(child) || isNumber(child)) {
      labelParts.push(child);
      return;
    }

    if (child === null) return;

    flushLabel();

    wrappedChildren.push(
      React.isValidElement<ButtonChildProps>(child) &&
        child.type === React.Fragment
        ? React.cloneElement(
            child,
            undefined,
            wrapButtonLabels(child.props.children)
          )
        : child
    );
  });

  flushLabel();

  return wrappedChildren;
}

function wrapSlottedButtonLabels(children: React.ReactNode): React.ReactNode {
  if (!React.isValidElement<ButtonChildProps>(children)) return children;
  if (children.props.children == null) return children;

  return React.cloneElement(
    children,
    undefined,
    wrapButtonLabels(children.props.children)
  );
}

const buttonVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-button font-medium text-sm outline-none transition-[color,background-color,border-color,box-shadow,opacity,translate] motion-reduce:transition-none motion-reduce:active:translate-y-0 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:translate-y-px dark:bg-indigo-600 dark:hover:bg-indigo-600/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/50 active:translate-y-px dark:bg-red-600 dark:hover:bg-red-600/90",
        outline:
          "border border-input shadow-xs hover:shadow-sm hover:text-secondary-foreground active:translate-y-px active:shadow-none light:border-transparent light:bg-white light:shadow-ring light:hover:bg-secondary light:focus-visible:border-transparent light:focus-visible:ring-[3px] light:focus-visible:ring-primary/50 dark:border-border dark:bg-input/30 dark:shadow-none dark:hover:border-input dark:hover:bg-input/50 dark:hover:shadow-none [[data-slot=button-group]>&]:shadow-none [[data-slot=button-group]>&]:hover:shadow-none [[data-slot=button-group]>&]:light:border-input [[data-slot=button-group]>&]:light:[--shadow-ring-color:transparent]",
        secondary:
          "bg-foreground/[0.04] text-secondary-foreground hover:bg-foreground/[0.08] active:translate-y-px",
        ghost:
          "hover:bg-foreground/[0.08] hover:text-foreground data-[popup-open]:bg-foreground/[0.08] data-[popup-open]:text-foreground",
        link: "text-primary underline-offset-4 hover:underline dark:text-accent-foreground",
      },
      size: {
        default: "h-9 px-3 py-2",
        sm: "h-8 gap-1.5 px-2.5",
        lg: "h-10 px-3.5",
        icon: "size-9",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    loadingLabel?: string;
    testId?: string;
  };

function Button({
  children,
  className,
  disabled,
  loading = false,
  loadingLabel = "Loading",
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const { testId, ...rest } = props;
  const isDisabled = disabled || loading;

  if (asChild) {
    return (
      <Slot
        aria-busy={loading || undefined}
        aria-disabled={disabled || loading || undefined}
        className={cn(
          buttonVariants({ variant, size, className }),
          isDisabled && "pointer-events-none opacity-50"
        )}
        data-loading={loading || undefined}
        data-slot="button"
        data-testid={testId}
        {...rest}
        tabIndex={isDisabled ? -1 : rest.tabIndex}
        onClickCapture={(event: React.MouseEvent<HTMLButtonElement>) => {
          if (isDisabled) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          rest.onClickCapture?.(event);
        }}
        onKeyDownCapture={(event: React.KeyboardEvent<HTMLButtonElement>) => {
          if (isDisabled && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          rest.onKeyDownCapture?.(event);
        }}
      >
        {wrapSlottedButtonLabels(children)}
      </Slot>
    );
  }

  const { type, ...restWithoutType } = rest;

  return (
    <BaseButton
      className={cn(
        buttonVariants({ variant, size, className }),
        loading &&
          "[&>*:not([data-slot=button-spinner]):not(.sr-only)]:opacity-0"
      )}
      aria-busy={loading || undefined}
      disabled={isDisabled}
      data-loading={loading || undefined}
      data-slot="button"
      data-testid={testId}
      type={type ?? "submit"}
      {...restWithoutType}
    >
      {loading ? (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            data-slot="button-spinner"
          >
            <Spinner className="size-4" variant="circle" />
          </span>
          <span className="sr-only">{loadingLabel}</span>
        </>
      ) : null}
      {wrapButtonLabels(children)}
    </BaseButton>
  );
}

export { Button, buttonVariants };
