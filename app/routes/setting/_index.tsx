import type { MetaFunction } from "react-router";

import ShellPage from "~/components/shell-page";

export const meta: MetaFunction = () => {
  return [{ title: "Account" }, { name: "", content: "" }];
};

export default function Index() {
  return (
    <ShellPage>
      <h1>Account</h1>
      <p>Cashflow by Ommi Putera</p>
    </ShellPage>
  );
}
