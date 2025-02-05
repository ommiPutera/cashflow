"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-neutral-50 hover:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500/50 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:border-neutral-400 data-[state=on]:bg-neutral-100 data-[state=on]:text-neutral-700 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border bg-neutral-50",
        outline:
          "border bg-transparent shadow-sm hover:bg-neutral-50 hover:text-accent-foreground",
      },
      size: {
        sm: "h-8 px-1.5 min-w-8 rounded-lg",
        lg: "h-14 lg:h-12 px-4 rounded-xl text-sm min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "lg",
    },
  },
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
