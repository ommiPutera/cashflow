import { Link, useLocation } from "react-router";

import { cn } from "~/lib/utils";

export default function Navigation({
  noNavigation,
}: {
  noNavigation: boolean | undefined;
}) {
  const location = useLocation();

  if (noNavigation) return <></>
  return (
    <>
      <header
        className={cn(
          "flex flex-wrap flex-col lg:flex-row items-center shadow-sm border-b lg:border-b-transparent lg:shadow-none justify-between lg:gap-2 lg:px-8 bg-white fixed top-0 z-50 left-0 w-full h-[var(--header-height-mobile)] lg:h-[var(--header-height)]",
        )}
      >
        <Link
          to="/sheets"
          className="flex-1 inline-flex justify-start items-center tap-highlight-transparent"
        >
          <img src="/logo.png" alt="" className="h-10 block lg:hidden" />
          <img src="/logo_horizontal.png" alt="" className="h-7 lg:block hidden" />
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
                  "h-full w-full lg:w-fit lg:px-8 border-b border-neutral-100 inline-flex justify-center items-center lg:border-transparent",
                  isMatch && "border-neutral-950",
                )}
              >
                <div
                  className={cn(
                    "flex gap-1 items-center text-neutral-400",
                    isMatch && "text-neutral-950",
                  )}
                >
                  <span className="text-sm font-semibold">{tab.title}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </header>
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
