import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const labelVariants = cva(
  "text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants> & { required?: boolean }
>(({ className, required = false, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  >
    {props.children}
    {required && (
      <span className="text-danger-500" aria-hidden="true">
        *
      </span>
    )}
  </LabelPrimitive.Root>
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
