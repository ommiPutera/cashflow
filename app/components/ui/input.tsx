import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

import { cn } from "~/lib/utils";

const inputVariants = cva(
  "flex h-9 w-full border bg-white appearance-none transition-colors file:border-0 file:bg-transparent focus:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-700 focus-visible:outline-none outline-primary-500 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-border hover:border-neutral-800 hover:disabled:border-neutral-300 disabled:border-neutral-300 disabled:bg-neutral-100 disabled:text-neutral-500 disabled:opacity-100 focus-visible:border-primary-500",
      },
      inputSize: {
        sm: "h-11 lg:h-9 rounded-lg px-3 text-sm",
        lg: "h-14 lg:h-12 px-4 rounded-xl text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "lg",
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, variant, name, error = false, inputSize, ...props },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const inputType = type === "password" && showPassword ? "text" : type;
    return (
      <div className="relative w-full">
        {name === "search" && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-4 h-4 lg:w-5 lg:h-5"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </span>
          </div>
        )}
        <input
          type={inputType}
          className={cn(
            inputVariants({ variant, inputSize, className }),
            error &&
              "border-danger-500 focus:border-danger-500 focus-visible:border-danger-500 hover:border-danger-500",
            type === "password" && "pr-14",
          )}
          ref={ref}
          name={name}
          {...props}
        />
        {type === "password" && (
          <button
            className="focus-visible:outline-primary-500 absolute right-2 top-1/2 flex h-full w-11 -translate-y-1/2 items-center justify-center rounded-md"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-4 h-4 lg:w-5 lg:h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </span>
            ) : (
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-4 h-4 lg:w-5 lg:h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.8 10.8 0 0 1-1.444 2.49M14.084 14.158a3 3 0 0 1-4.242-4.242"></path>
                  <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143M2 2l20 20"></path>
                </svg>
              </span>
            )}
          </button>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input, inputVariants };
