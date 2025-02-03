import React from "react";

import { cn } from "~/lib/utils";

export default function ShellPage({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="mx-auto w-full max-w-[var(--shell-page-width)]">
      <div className="flex flex-col relative">
        <div className="px-3 lg:px-14 relative overflow-hidden">
          <div className="h-fit relative">
            <main role="main" className="">
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
        "flex flex-col px-4 py-3 lg:py-6 lg:px-6 overflow-hidden relative rounded-xl",
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
