import { Link, useLocation } from "react-router";

import { cn } from "~/lib/utils";

export default function Navigation() {
  const location = useLocation();
  const tabs = [
    {
      title: "Beranda",
      to: "/sheets",
    },
    {
      title: "Akun",
      to: "/account",
    },
  ];
  return (
    <>
      <nav className="fixed top-0 w-full bg-background left-0 flex items-center justify-center z-20 shadow-sm border-b lg:border-b-transparent lg:shadow-none h-[var(--header-height-mobile)] lg:h-[var(--header-height)]">
        <div className="max-w-screen-2xl lg:px-14 flex flex-col lg:flex-row items-center w-full h-full justify-between lg:gap-2 mx-auto px-6">
          <div className="flex-1 inline-flex">
            <Link
              to="/"
              prefetch="intent"
              className="flex justify-start items-center tap-highlight-transparent w-fit h-full"
            >
              <img src="/text-logo.png" alt="" className="h-7 block" />
            </Link>
          </div>
          <div
            className={cn(
              "flex flex-1 justify-center items-center lg:justify-end w-full h-full",
            )}
          >
            {tabs.map((tab) => {
              const isMatch = location.pathname === tab.to;
              return (
                <Link
                  to={tab.to}
                  key={tab.title}
                  className={cn(
                    "h-full w-full lg:w-fit lg:px-4 border-b-[1.5px] border-neutral-100 inline-flex justify-center items-center lg:border-transparent",
                    isMatch && "border-neutral-950",
                  )}
                >
                  <div
                    className={cn(
                      "flex gap-1 items-center text-neutral-300",
                      isMatch && "text-neutral-950",
                    )}
                  >
                    <span className="text-sm font-bold lg:text-base lg:font-semibold">
                      {tab.title}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      <div className="h-[calc(var(--header-height-mobile)_-_32px)] lg:h-[calc(var(--header-height)_-_56px)] bg-background"></div>
    </>
  );
}

export function PublicNavigation() {
  return (
    <>
      <nav className="fixed top-0 w-full bg-background left-0 flex items-center justify-center z-20 h-[var(--header-height-mobile)] lg:h-[var(--header-height)]">
        <div className="max-w-screen-2xl lg:px-14 flex items-center w-full h-full justify-between lg:gap-2 mx-auto px-6">
          <Link
            to="/"
            prefetch="intent"
            className="flex-1 lg:flex-initial inline-flex justify-start items-center tap-highlight-transparent w-fit h-full"
          >
            <img src="/text-logo.png" alt="" className="h-7 block" />
          </Link>
          <div className="flex items-center justify-end gap-2 h-full flex-1">
            <a
              href="https://github.com/dev-xo/remix-auth-totp"
              className="flex h-8 w-8 items-center justify-center gap-2 rounded-md hover:opacity-60"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-neutral-950"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
        </div>
      </nav>
      <div className="h-[calc(var(--header-height-mobile)_-_32px)] lg:h-[calc(var(--header-height)_-_56px)] bg-background"></div>
    </>
  );
}
