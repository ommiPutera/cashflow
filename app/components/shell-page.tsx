import React from "react";

import Navigation from "~/components/navigation";

import { cn } from "~/lib/utils";

export default function ShellPage({
  noNavigation,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { noNavigation?: boolean }) {
  return (
    <div className="mx-auto w-full max-w-[var(--shell-page-width)]">
      <div className="flex flex-col relative">
        <div className="relative overflow-hidden">
          <div className="h-fit relative">
            {!noNavigation && (
              <>
                <Navigation />
                <div className="h-[var(--header-height-mobile)] lg:h-[var(--header-height)] bg-background"></div>
              </>
            )}
            <main role="main" className={cn("p-3 lg:px-14", props.className)}>
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
    <div
      className={cn(
        "divide-y divide-neutral-200 dark:divide-neutral-800",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}
