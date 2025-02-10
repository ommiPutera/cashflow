import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const textareaVariants = cva(
  "flex w-full min-h-[70px] font-normal rounded-2xl border bg-neutral-50 px-4 py-3 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none placeholder:text-muted-foreground placeholder:font-normal disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-neutral-300 hover:border-neutral-800 focus-visible:border-primary-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, error = false, ...props }, ref) => {
    const [text, setText] = React.useState("");

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newText = event.target.value;
      if (
        props.maxLength &&
        newText.length <= parseInt(props.maxLength.toString())
      ) {
        setText(newText);
      }
      props.onChange?.(event);
    };
    return (
      <div className="relative">
        <textarea
          className={cn(
            textareaVariants({ variant }),
            className,
            error &&
              "border-danger-500 focus:border-danger-500 focus-visible:border-danger-500 hover:border-danger-500",
          )}
          onChange={handleChange}
          ref={ref}
          {...props}
        />
        <span className="text-neutral-700 text-xs absolute right-4 bottom-2">
          {text.length}/{props.maxLength} karakter
        </span>
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
