import { LoaderFunctionArgs, Outlet, redirect } from "react-router";

import { getSession } from "~/lib/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");

  if (!user) {
    return redirect("/auth/login");
  }
  return { user };
}

export default function Layout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
