import { Link, useLocation } from "react-router";

import { ButtonLink } from "~/components//ui/button";

import { cn } from "~/lib/utils";

export default function Navigation({
  noNavigationOnMobile = true,
}: {
  noNavigationOnMobile?: boolean;
}) {
  const location = useLocation();
  const tabs = [
    {
      title: "Beranda",
      to: "/sheets",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
          <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        </svg>
      ),
    },
    {
      title: "Folder",
      to: "/folder",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"></path>
        </svg>
      ),
    },
    {
      title: "Lainnya",
      to: "/account",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M4 12h16M4 6h16M4 18h16"></path>
        </svg>
      ),
    },
  ];
  return (
    <>
      {!noNavigationOnMobile && (
        <div className="lg:hidden">
          <nav className="fixed top-0 w-full bg-background left-0 flex items-center justify-center z-20 shadow-sm border-b lg:border-b-transparent lg:shadow-none h-[var(--header-height-mobile)] lg:h-[var(--header-height)]">
            <div className="max-w-screen-2xl lg:px-14 flex flex-col lg:flex-row items-center w-full h-full justify-between lg:gap-2 mx-auto">
              <div className="flex-1 inline-flex">
                <Link
                  to="/sheets"
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
                  const isMatch = location.pathname.startsWith(tab.to);
                  return (
                    <Link
                      to={tab.to}
                      key={tab.title}
                      prefetch="intent"
                      className={cn(
                        "h-full w-full lg:w-fit lg:px-6 cursor-pointer border-b-[3px] border-white inline-flex justify-center items-center lg:border-transparent",
                        isMatch && "border-primary-500",
                      )}
                    >
                      <div
                        className={cn(
                          "flex gap-1 items-center text-neutral-500",
                          isMatch && "text-primary-500",
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
        </div>
      )}
      <div className="hidden lg:block">
        <div className="fixed left-0 top-0 px-3 h-svh w-[var(--sidebar-width)] bg-neutral-50/50 border-r shadow-sm">
          <div className="h-28 mx-5">
            <Link
              to="/sheets"
              prefetch="intent"
              className="flex justify-start items-center tap-highlight-transparent w-fit h-full"
            >
              <img src="/text-logo.png" alt="" className="h-6 block" />
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <ButtonLink
              to="/sheets/create"
              variant="outlined-primary"
              className="w-fit px-5 justify-start text-neutral-500 font-semibold border border-transparent gap-6 text-primary-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5v14"></path>
              </svg>
              <span className="text-sm font-bold">Buat Lembar</span>
            </ButtonLink>
            <div className="flex flex-col">
              {tabs.map((tab) => {
                const isMatch = location.pathname.startsWith(tab.to);
                return (
                  <ButtonLink
                    variant="transparent"
                    to={tab.to}
                    key={tab.title}
                    prefetch="intent"
                    className={cn(
                      "hover:bg-white px-5 justify-start text-neutral-500 font-semibold border border-transparent gap-6",
                      isMatch && "text-primary-500",
                    )}
                  >
                    {tab.icon}
                    {tab.title}
                  </ButtonLink>
                );
              })}
            </div>
          </div>
        </div>
      </div>
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
            <img src="/text-logo.png" alt="" className="h-8 block" />
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
