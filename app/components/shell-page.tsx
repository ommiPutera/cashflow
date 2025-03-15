import React from "react";

import { cn } from "~/lib/utils";

import { Loading } from "./loading";

export default function ShellPage({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[var(--shell-page-width)] lg:max-w-full",
        props.className,
      )}
    >
      <section className="flex flex-col relative">
        <div className="h-fit bg-white dark:bg-black relative">
          <main role="main" className="px-4 py-8 lg:px-10 lg:py-12 mb-32">
            {props.children}
          </main>
        </div>
      </section>
    </div>
  );
}

export function Section({
  loading,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { loading?: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col p-3 lg:py-8 lg:px-6 relative overflow-hidden",
        props.className,
      )}
    >
      {loading && (
        <div className="bg-black/20 absolute w-full h-full flex flex-col items-center justify-center">
          <Loading dark />
        </div>
      )}
      {props.children}
    </div>
  );
}

export function Divide({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("divide-y divide-neutral-100", props.className)}>
      {props.children}
    </div>
  );
}
