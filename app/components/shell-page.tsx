import React from "react";

import { cn } from "~/lib/utils";

import { Footer } from "./footer";

export default function ShellPage({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="mx-auto w-full max-w-[var(--shell-page-width)] lg:max-w-screen-sm mb-12">
      <div className="flex flex-col relative">
        <div className="relative overflow-hidden">
          <div className="h-fit relative">
            <main
              role="main"
              className={cn(
                "px-4 py-8 lg:py-14 lg:px-14 overflow-scroll min-h-svh h-full",
                props.className,
              )}
            >
              {props.children}
            </main>
            <Footer />
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
