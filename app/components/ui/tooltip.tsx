import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "~/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipArrow = TooltipPrimitive.Arrow;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    arrowPadding={10}
    sideOffset={sideOffset}
    className={cn(
      "z-50 rounded-sm bg-neutral-50 py-3 px-4 text-xs font-normal shadow-xl min-h-11 flex items-center justify-center animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      className,
    )}
    style={{
      boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.12)",
    }}
    {...props}
  >
    {props.children}
    <TooltipArrow
      className="fill-neutral-50"
      width={16}
      height={8}
      style={{
        filter: "drop-shadow(0 0 14px #000)",
        clipPath: "inset(0 -14px -14px -14px)",
      }}
    />
  </TooltipPrimitive.Content>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipArrow,
};
