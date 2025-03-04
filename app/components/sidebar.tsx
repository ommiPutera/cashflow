import { Link, useLocation } from "react-router";

import { SVGLogo, tabs } from "~/components/navigation";
import { ButtonLink } from "~/components/ui/button";

import { cn } from "~/lib/utils";

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  return <div className="xl:ml-[var(--sidebar-width)]">{children}</div>;
}

export default function Sidebar() {
  const location = useLocation();
  return (
    <div className="hidden xl:block">
      <div className="fixed left-0 top-0 px-2 h-svh w-[var(--sidebar-width)] bg-neutral-100/50 border border-neutral-100">
        <div className="h-32 mx-3">
          <Link
            to="/sheets"
            prefetch="intent"
            className="flex justify-start items-center tap-highlight-transparent w-fit h-full"
          >
            <SVGLogo />
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <ButtonLink
            to="/sheets/create"
            variant="outlined-primary"
            className="w-fit pl-5 pr-8 py-8 justify-start font-semibold border border-primary-50 gap-6 text-primary-500 bg-primary-100/20"
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
            <span className="text-xs">Buat Lembar</span>
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
                    "px-5 justify-start text-xs font-normal border border-transparent gap-6 hover:bg-primary-50",
                    isMatch && "text-primary-500 font-bold",
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
  );
}
