import React from "react";

import { cn } from "~/lib/utils";

import { Loading } from "./loading";

export default function ShellPage({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="mx-auto w-full max-w-[var(--shell-page-width)]">
      <section className="flex flex-col relative">
        <div className="z-10 w-full max-w-[var(--shell-page-width)] bg-background mx-auto flex flex-col space-y-1 h-[var(--header-height-mobile)] md:h-[var(--header-height)] md:space-y-2 sticky top-0">
          <RoundedBorder />
        </div>
        <div className="px-2.5 md:px-14 relative overflow-hidden">
          <div className="h-fit bg-white dark:bg-black border-x border-b border-neutral-100 dark:border-neutral-800 relative">
            <main role="main" className="p-3 lg:px-6 lg:py-8">
              {props.children}
            </main>
          </div>
        </div>
        <div className="z-10 w-full max-w-[var(--shell-page-width)] mx-auto flex flex-col space-y-1 h-[var(--bottom-border-height-mobile)] md:h-[var(--bottom-border-height)] md:space-y-2 sticky bottom-0">
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
          <RoundedBorderBottom />
        </div>
      </section>
    </div>
  );
}

function RoundedBorder() {
  return (
    <div>
      <div className="w-full h-[1px] top-[var(--header-height-mobile)] md:top-[var(--header-height)] z-10 absolute overflow-hidden">
        <div className="h-[1px] w-[calc(100%_-_96px)] md:w-[calc(100%_-_190px)] left-1/2 -translate-x-1/2 absolute bottom-0 border-t border-neutral-100 dark:border-neutral-800"></div>
      </div>
      <div className="w-10 h-10 top-[var(--header-height-mobile)] md:top-[var(--header-height)] absolute overflow-hidden left-2.5 md:left-14">
        <div className="absolute top-0 left-0 w-14 h-12 border border-neutral-100 dark:border-neutral-800 rounded-tl-2xl 2xl:rounded-tl-3xl shadow-circle"></div>
      </div>
      <div className="w-10 h-10 top-[var(--header-height-mobile)] md:top-[var(--header-height)] absolute overflow-hidden right-2.5 md:right-14">
        <div className="absolute top-0 right-0 w-14 h-12 border border-neutral-100 dark:border-neutral-800 rounded-tr-2xl 2xl:rounded-tr-3xl shadow-circle"></div>
      </div>
    </div>
  );
}

function RoundedBorderBottom() {
  return (
    <div>
      <div className="w-full h-[1px] bottom-[var(--bottom-border-height-mobile)] md:bottom-[var(--bottom-border-height)] z-10 absolute overflow-hidden">
        <div className="h-[1px] w-[calc(100%_-_96px)] md:w-[calc(100%_-_190px)] left-1/2 -translate-x-1/2 absolute top-0 border-t border-neutral-100 dark:border-neutral-800"></div>
      </div>
      <div className="w-10 h-10 bottom-[var(--bottom-border-height-mobile)] md:bottom-[var(--bottom-border-height)] absolute overflow-hidden left-2.5 md:left-14">
        <div className="absolute bottom-0 left-0 w-14 h-12 border border-neutral-100 dark:border-neutral-800 rounded-bl-2xl 2xl:rounded-bl-3xl shadow-circle"></div>
      </div>
      <div className="w-10 h-10 bottom-[var(--bottom-border-height-mobile)] md:bottom-[var(--bottom-border-height)] absolute overflow-hidden right-2.5 md:right-14">
        <div className="absolute bottom-0 right-0 w-14 h-12 border border-neutral-100 dark:border-neutral-800 rounded-br-2xl 2xl:rounded-br-3xl shadow-circle"></div>
      </div>
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
