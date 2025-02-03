import { MetaFunction, useParams } from "react-router";

import ShellPage, { Section } from "~/components/shell-page";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = ({ params }) => {
  const title = params.id?.split("-").join(" ");
  return [{ title }, { name: "", content: "" }];
};

export default function Sheet() {
  const params = useParams();

  const title = params.id?.split("-").join(" ");
  return (
    <ShellPage>
      <Section className="flex flex-col gap-2">
        <Button className="w-fit p-0 h-fit" variant="transparent">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="lucide lucide-arrow-left"
              viewBox="0 0 24 24"
            >
              <path d="m12 19-7-7 7-7M19 12H5"></path>
            </svg>
          </span>
          <span className="text-sm font-medium">Sheets</span>
        </Button>
        <h1 className="text-xl font-extrabold">{title}</h1>
      </Section>
      <div className="flex flex-col gap-2"></div>
    </ShellPage>
  );
}
