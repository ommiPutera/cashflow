import * as React from "react";

import { Link, useLocation } from "react-router";

import { cn } from "~/lib/utils";

interface Tab {
  title: string;
  to: string;
  icon: React.ElementType;
  type?: never;
}

interface Separator {
  type: "separator";
  title?: never;
  icon?: never;
}

type TabItem = Tab | Separator;

interface ExpandableTabsProps {
  tabs: TabItem[];
  className?: string;
  activeColor?: string;
  onChange?: (index: number | null) => void;
}

export default function Navigation({
  tabs,
  className,
  activeColor = "text-primary-500",
}: ExpandableTabsProps) {
  const location = useLocation();

  const Separator = () => (
    <div className="mx-1 h-[24px] w-[1.2px] bg-border" aria-hidden="true" />
  );

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-full border bg-white p-1.5 h-12",
        className,
      )}
    >
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return <Separator key={`separator-${index}`} />;
        }

        const Icon = tab.icon;
        const isMatch = location.pathname === tab.to;
        return (
          <Link to={tab.to} key={tab.title}>
            <div
              className={cn(
                "relative flex items-center gap-2 rounded-full p-2 text-xs font-medium",
                isMatch
                  ? cn("bg-muted font-bold", activeColor)
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon />
              {isMatch && <span className="overflow-hidden">{tab.title}</span>}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
