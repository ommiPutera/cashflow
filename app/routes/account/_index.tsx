import type { MetaFunction } from "react-router";

import ShellPage from "~/components/shell-page";

export const meta: MetaFunction = () => {
  return [{ title: "Setting" }, { name: "", content: "" }];
};

export default function Index() {
  return (
    <ShellPage>
      <h1>Setting</h1>
      <p>Cashflow by Ommi Putera</p>
    </ShellPage>
  );
}
