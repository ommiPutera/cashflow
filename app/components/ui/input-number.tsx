import React from "react";

import { type VariantProps } from "class-variance-authority";
import {
  NumberFormatBase,
  NumericFormat,
  type NumberFormatBaseProps,
  type NumericFormatProps,
} from "react-number-format";

import { cn } from "~/lib/utils";

import { inputVariants } from "./input";

interface InputProps
  extends NumericFormatProps,
    VariantProps<typeof inputVariants> {
  error?: boolean;
}

const InputNumber = React.forwardRef<HTMLDivElement, InputProps>(
  ({ className, variant, name, error = false, inputSize, ...props }, ref) => {
    return (
      <div className="relative w-full" ref={ref}>
        <NumericFormat
          className={cn(
            inputVariants({ variant, inputSize, className }),
            error &&
              "border-danger-500 focus:border-danger-500 focus-visible:border-danger-500 hover:border-danger-500",
          )}
          allowNegative
          name={name}
          {...props}
        />
      </div>
    );
  },
);
InputNumber.displayName = "InputNumber";

interface InputNumberFormatBaseProps
  extends NumberFormatBaseProps,
    VariantProps<typeof inputVariants> {
  error?: boolean;
}
const InputNumberFormatBase = React.forwardRef<
  HTMLDivElement,
  InputNumberFormatBaseProps
>(
  (
    {
      className = "px-0 overflow-hidden",
      variant,
      name,
      error = false,
      inputSize,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="relative w-full" ref={ref}>
        <div
          className={cn(
            inputVariants({ variant, inputSize, className }),
            error &&
              "border-danger-500 focus:border-danger-500 focus-visible:border-danger-500 hover:border-danger-500",
          )}
        >
          <label
            htmlFor={props.id}
            className="border-r border-neutral-300 w-[50px] flex items-center justify-center text-neutral-700 font-medium text-sm"
          >
            Rp
          </label>
          <NumberFormatBase id={props.id} name={name} {...props} />
        </div>
      </div>
    );
  },
);
InputNumberFormatBase.displayName = "InputNumberFormatBase";

export {
  InputNumber,
  InputNumberFormatBase,
  type InputNumberFormatBaseProps,
  type InputProps,
};
