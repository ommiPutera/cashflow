import { Link, useLocation } from "react-router";

import { cn } from "~/lib/utils";

export default function Navigation({
  noNavigation,
}: {
  noNavigation: boolean | undefined;
}) {
  const location = useLocation();

  if (noNavigation) return <></>;
  return (
    <>
      <nav
        className={cn(
          "flex flex-wrap flex-col lg:flex-row items-center shadow-sm border-b lg:border-b-transparent lg:shadow-none justify-between lg:gap-2 lg:px-8 bg-white fixed top-0 z-50 left-0 w-full h-[var(--header-height-mobile)] lg:h-[var(--header-height)]",
        )}
      >
        <Link
          to="/sheets"
          className="flex-1 inline-flex justify-start items-center tap-highlight-transparent"
        >
          <img src="/text-logo.png" alt="" className="h-7 block" />
        </Link>
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
                  "h-full w-full lg:w-fit lg:px-8 border-b-[1.5px] border-neutral-100 inline-flex justify-center items-center lg:border-transparent",
                  isMatch && "border-primary-500",
                )}
              >
                <div
                  className={cn(
                    "flex gap-1 items-center text-neutral-400",
                    isMatch && "text-primary-500",
                  )}
                >
                  <span className="text-sm font-bold">{tab.title}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
      <div
        className={cn(
          "h-[var(--header-height-mobile)] lg:h-[var(--header-height)] bg-background",
        )}
      ></div>
    </>
  );
}

const tabs = [
  {
    title: "Sheets",
    to: "/sheets",
  },
  {
    title: "Pengaturan",
    to: "/setting",
  },
];

export function PublicNavigation() {
  return (
    <nav className="relative flex items-center justify-between">
      <Link
        to="/"
        className="flex-1 inline-flex justify-start items-center tap-highlight-transparent"
      >
        <img src="/text-logo.png" alt="" className="h-7 block" />
      </Link>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
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
  );
}
