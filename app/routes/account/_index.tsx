import type { MetaFunction } from "react-router";
import Navigation from "~/components/navigation";

import ShellPage from "~/components/shell-page";
import { ButtonLink } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [{ title: "Account" }, { name: "", content: "" }];
};

export default function Index() {
  return (
    <ShellPage>
      <Navigation />
      <h1>Account</h1>
      <br />
      <ButtonLink
        variant="outlined-danger"
        size="sm"
        to="/auth/logout"
        className="w-full"
      >
        Logout
      </ButtonLink>
    </ShellPage>
  );
}
