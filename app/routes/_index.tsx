import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Cashflow" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div>
      <p>Cashflow by Ommi Putera</p>
    </div>
  );
}