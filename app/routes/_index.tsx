import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "Cashflow" }, { name: "", content: "" }];
};

export default function Index() {
  return (
    <div>
      <p>Cashflow by Ommi Putera</p>
    </div>
  );
}
