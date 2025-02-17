import { LoaderFunctionArgs, redirect } from "react-router";

import { sessionStorage } from "~/lib/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  // Get the session.
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );

  // Destroy the session and redirect to login.
  return redirect("/auth/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export default function Route() {
  return null;
}
