import { Slot } from "@radix-ui/react-slot";

import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { useNavigate } from "react-router";

import { Loading } from "~/components/loading";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import { cn } from "~/lib/utils";

import { AnchorOrLink } from "~/utils/misc";

const buttonVariants = cva(
  "inline-flex items-center  justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        transparent: "",
        primary:
          "bg-primary-500 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:bg-neutral-100 disabled:border-neutral-300 disabled:text-neutral-500",
        secondary: "bg-primary-50 text-primary-500",
        "secondary-danger": "bg-danger-50 text-danger-500",
        "outlined-danger":
          "border border-danger-300 text-danger-500 bg-neutral-50",
        "outlined-primary": "border text-primary-500 bg-white",
        danger: "bg-danger-500 text-white",
      },
      size: {
        sm: "h-11 lg:h-10 rounded-lg px-6 text-sm",
        lg: "h-14 lg:h-12 px-6 rounded-xl text-sm font-bold",
        xl: "h-[52px] px-6 rounded-2xl text-base font-bold",
        icon: "w-fit h-fit rounded-md",
      },
    },
    defaultVariants: {
      variant: "transparent",
      size: "lg",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  tooltip?: string;
  tooltipSide?: "bottom" | "left" | "right" | "top";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      asChild = false,
      tooltip = "",
      tooltipSide = "bottom",
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    if (tooltip) {
      return (
        <Tooltip disableHoverableContent delayDuration={200}>
          <TooltipTrigger asChild>
            <Comp
              className={cn(buttonVariants({ variant, size, className }))}
              ref={ref}
              {...props}
            >
              {loading ? <Loading dark={props.disabled} /> : props.children}
            </Comp>
          </TooltipTrigger>
          <TooltipContent align="center" side={tooltipSide} sideOffset={3}>
            {tooltip}
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {loading ? <Loading dark={props.disabled} /> : props.children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

/**
 * A button that looks like a link
 */
const ButtonLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithRef<typeof AnchorOrLink> &
    ButtonProps & { delay?: number }
>(function ButtonLink({ delay = 0, ...props }, ref) {
  const { variant, size, href, prefetch = "none" } = props;

  const navigate = useNavigate();
  const redirectTo = async () => {
    await wait(delay);
    if (href) navigate(href);
  };

  const Comp = delay ? Slot : AnchorOrLink;
  return (
    <Button asChild variant={variant} size={size} className={props.className}>
      <Comp
        ref={ref}
        prefetch={prefetch}
        onClick={() => (delay ? redirectTo() : null)}
        href={props.href}
        {...props}
      >
        {props.children}
      </Comp>
    </Button>
  );
});
ButtonLink.displayName = "ButtonLink";

function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export { Button, ButtonLink, buttonVariants };
