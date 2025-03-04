import React from "react";

import { cn } from "~/lib/utils";

import { Loading } from "./loading";

export default function ShellPage({
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { withoutFooter?: boolean }) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[var(--shell-page-width)] lg:max-w-full",
        props.className,
      )}
    >
      <section className="flex flex-col relative">
        <div className="h-fit bg-white dark:bg-black relative">
          <main role="main" className="p-3 lg:px-6 lg:py-8">
            {props.children}
          </main>
        </div>
        {!props.withoutFooter && (
          <div className="w-full max-w-[var(--shell-page-width)] mx-auto flex flex-col space-y-1 h-[var(--bottom-border-height-mobile)] md:h-[var(--bottom-border-height)] md:space-y-2 sticky bottom-0">
            <footer
              role="contentinfo"
              className="px-6 text-center pt-10 pb-36 md:px-6 bg-background h-full w-full absolute"
            >
              <p className="inline-flex items-center justify-center whitespace-nowrap text-center text-sm font-medium text-gray-600">
                Expense Sheet by
                <a
                  href="https://www.ommiputera.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center ml-1 font-semibold text-gray-800 transition duration-200 hover:-translate-y-1"
                >
                  Ommi Putera
                </a>
              </p>
            </footer>
          </div>
        )}
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
