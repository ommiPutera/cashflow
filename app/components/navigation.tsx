import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";

export default function Navigation() {
  const location = useLocation();

  return (
    <header className="flex flex-wrap flex-col lg:flex-row items-center shadow-sm border-b lg:border-b-transparent lg:shadow-none justify-between gap-2.5 lg:gap-2 bg-white fixed left-0 w-full px-4 h-[var(--header-height-mobile)] lg:h-[var(--header-height)]">
      <div className="flex-1 flex justify-center lg:justify-start items-center">
        <h1 className="text-2xl font-bold tracking-tighter text-primary-500 ">
          flowsheet
        </h1>
      </div>
      <div className="flex flex-wrap gap-8 flex-1 w-full justify-center lg:justify-end">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isMatch = location.pathname === tab.to;
          return (
            <Link to={tab.to} key={tab.title}>
              <div
                className={cn(
                  "flex gap-1 items-center text-neutral-500 font-medium",
                  isMatch && "text-primary-500 font-semibold",
                )}
              >
                <span>
                  <Icon />
                </span>
                <span className="text-xs">{tab.title}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </header>
  );
}

const tabs = [
  {
    title: "Sheets",
    to: "/sheets",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
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
        width="18"
        height="18"
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
        width="18"
        height="18"
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
