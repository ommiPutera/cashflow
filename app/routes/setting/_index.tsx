import type { MetaFunction } from "react-router";

import ShellPage from "~/components/shell-page";
import { ButtonLink } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [{ title: "Account" }, { name: "", content: "" }];
};

export default function Index() {
  return (
    <ShellPage>
      <h1>Account</h1>
      <ButtonLink variant="danger" to="/auth/logout">
        Logout
      </ButtonLink>
    </ShellPage>
  );
}
