import { type User } from "@prisma/client";

import React from "react";
import type { LinksFunction, LoaderFunctionArgs } from "react-router";
import {
  data,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import { getToast } from "remix-toast";

import ProgerssBar from "~/components/progress-bar";
import { Toaster } from "~/components/ui/toaster";

import { useToast } from "~/hooks/use-toast";

import interStyles from "~/styles/inter.css?url";
import tailwindStyles from "~/styles/tailwind.css?url";

import { getSession } from "./lib/session.server";

export function meta() {
  return [
    { title: "Expense Sheet" },
    { name: "description", content: "Welcome to Expense Sheet" },
  ];
}

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Koh+Santepheap:wght@100;300;400;700;900&family=Playwrite+GB+S:ital,wght@0,100..400;1,100..400&display=swap",
  },
  { rel: "stylesheet", href: tailwindStyles },
  { rel: "stylesheet", href: interStyles },
  { rel: "manifest", href: "/site.webmanifest" },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers } = await getToast(request);
  const session = await getSession(request.headers.get("Cookie"));
  const user: User = session.get("user");
  return data({ toastData: toast, user }, { headers });
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { toastData } = useLoaderData<typeof loader>();

  const { toast } = useToast();
  React.useEffect(() => {
    switch (toastData?.type) {
      case "success":
        toast({ title: toastData?.message, variant: "success" });
        break;
      case "error":
        toast({ title: toastData?.message, variant: "destructive" });
        break;
      case "info":
        toast({ title: toastData?.message, variant: "default" });
        break;
      default:
        break;
    }
  }, [toast, toastData]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,viewport-fit=cover,maximum-scale=1"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <ProgerssBar />
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
