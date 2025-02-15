import React from "react";

import Navigation from "~/components/navigation";

import { cn } from "~/lib/utils";

export default function ShellPage({
  noNavigation,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { noNavigation?: boolean }) {
  return (
    <div className="mx-auto w-full max-w-[var(--shell-page-width)] min-h-screen mb-12">
      <div className="flex flex-col relative">
        <div className="relative overflow-hidden">
          <div className="h-fit relative">
            <div className="z-20 bg-white">
              <Navigation noNavigation={noNavigation} />
            </div>
            <main
              role="main"
              className={cn(
                "px-4 py-7 lg:px-14 overflow-scroll",
                props.className,
              )}
            >
              {props.children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Section({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col p-3 lg:py-8 lg:px-6 relative overflow-hidden",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}

export function Divide({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("divide-y divide-neutral-200", props.className)}>
      {props.children}
    </div>
  );
}
