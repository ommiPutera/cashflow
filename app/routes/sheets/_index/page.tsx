import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "Sheets" }, { name: "", content: "" }];
};

export default function Sheets() {
  return (
    <div className="mx-auto w-full">
      <h1 className="text-xl">Sheets</h1>
    </div>
  );
}
