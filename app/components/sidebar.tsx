import { Link, useLocation } from "react-router";

import { SVGLogo, tabs } from "~/components/navigation";
import { ButtonLink } from "~/components/ui/button";

import { cn } from "~/lib/utils";

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="lg:ml-[var(--sidebar-width)] 2xl:ml-0">{children}</div>
  );
}

export default function Sidebar() {
  const location = useLocation();
  return (
    <div className="hidden lg:block">
      <div className="fixed left-0 top-0 px-6 h-svh w-[var(--sidebar-width)] bg-neutral-50 border-r">
        <div className="h-28 mx-5">
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
            className="w-fit px-5 py-8 justify-start text-neutral-500 font-semibold border border-transparent gap-6 text-primary-500 bg-primary-50"
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
                    "px-5 justify-start text-neutral-500 font-semibold border border-transparent gap-6 hover:bg-primary-50",
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
  );
}
