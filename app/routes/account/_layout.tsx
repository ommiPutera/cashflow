import { User } from "@prisma/client";
import { LoaderFunctionArgs, Outlet, redirect } from "react-router";

import { SidebarWrapper } from "~/components/sidebar";

import { getSession } from "~/lib/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user: User = session.get("user");

  if (!user) {
    return redirect("/auth/login");
  }
  return { user };
}

export default function Layout() {
  return (
    <SidebarWrapper>
      <Outlet />
    </SidebarWrapper>
  );
}
