import React from "react";
import { Link, useLocation } from "react-router";

import { cn } from "~/lib/utils";

export default function ShellPage({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const location = useLocation();
  return (
    <div className="mx-auto w-full max-w-[var(--shell-page-width)]">
      <div className="flex flex-col relative">
        <div className="relative overflow-hidden">
          <div className="h-fit relative">
            <header
              role="banner"
              className="inline-flex gap-8 cursor-pointer h-[var(--header-height-mobile)] md:h-[var(--header-height)] w-full justify-center items-center"
            >
              <span
                className={cn(
                  "text-xs text-muted-foreground/80 font-semibold",
                  location.pathname === "/sheets" && "text-foreground",
                )}
              >
                <Link to="/sheets">Sheets</Link>
              </span>
              <span
                className={cn(
                  "text-xs text-muted-foreground/80 font-semibold",
                  location.pathname === "/account" && "text-foreground",
                )}
              >
                <Link to="/account">Account</Link>
              </span>
              <span
                className={cn(
                  "text-xs text-muted-foreground/80 font-semibold",
                  location.pathname === "/setting" && "text-foreground",
                )}
              >
                <Link to="/setting">Setting</Link>
              </span>
            </header>
            <main role="main" className="px-3 lg:px-14">
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
        "flex flex-col p-3 lg:py-8 lg:px-6 overflow-hidden relative",
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
