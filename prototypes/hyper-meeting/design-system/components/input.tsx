import { Input as BaseInput } from "@base-ui/react/input";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../lib/utils";

const inputVariants = cva(
  "flex w-full min-w-0 rounded-xs border bg-transparent outline-none transition-[border-color,box-shadow] duration-200 selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/20 dark:bg-input/30",
  {
    variants: {
      variant: {
        default: "border-input",
        ghost: "border-transparent shadow-none",
      },
      inputSize: {
        sm: "h-8 px-2.5 text-sm",
        default: "h-9 px-3 text-base md:text-sm",
        lg: "h-10 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
);

type InputProps = React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants> & {
    allowPasswordManager?: boolean;
  };

function Input({
  className,
  type,
  autoComplete,
  variant,
  inputSize,
  allowPasswordManager = false,
  ...props
}: InputProps) {
  const resolvedAutoComplete =
    autoComplete ?? (allowPasswordManager ? undefined : "off");

  return (
    <BaseInput
      autoComplete={resolvedAutoComplete}
      className={cn(inputVariants({ variant, inputSize, className }))}
      data-1p-ignore={allowPasswordManager ? undefined : "true"}
      data-lpignore={allowPasswordManager ? undefined : "true"}
      data-slot="input"
      type={type}
      {...props}
    />
  );
}

export { Input, inputVariants };
