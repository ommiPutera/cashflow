import type { LoaderFunction, MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "Cashflow" }, { name: "", content: "" }];
};

export const loader: LoaderFunction = async () => {
  return {};
};

export default function Index() {
  return (
    <div>
      <p>Cashflow by Ommi Putera</p>
    </div>
  );
}
