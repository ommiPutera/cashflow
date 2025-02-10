import React from "react";

import Navigation from "~/components/navigation";

import { cn } from "~/lib/utils";

export default function ShellPage({
  noNavigation,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { noNavigation?: boolean }) {
  const tabs = [
    {
      title: "Sheets",
      to: "/sheets",
      icon: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path>
          <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path>
          <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path>
        </svg>
      ),
    },
    {
      title: "Saya",
      to: "/account",
      icon: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="8" r="5"></circle>
          <path d="M20 21a8 8 0 0 0-16 0"></path>
        </svg>
      ),
    },
    {
      title: "Pengaturan",
      to: "/setting",
      icon: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[var(--shell-page-width)]">
      <div className="flex flex-col relative">
        <div className="relative overflow-hidden">
          <div className="h-fit relative">
            {!noNavigation && (
              <header
                role="banner"
                className="z-10 hidden shadow-sm flex-col-reverse lg:flex-row gap-2 fixed bottom-0 mx-auto left-0 cursor-pointer h-[var(--header-height-mobile)] md:h-[var(--header-height)] w-full justify-center items-center"
              >
                <Navigation tabs={tabs} />
              </header>
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
