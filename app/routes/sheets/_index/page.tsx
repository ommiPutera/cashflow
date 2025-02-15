import { type MetaFunction } from "react-router";

import ShellPage, { Divide, Section } from "~/components/shell-page";
import { ButtonLink } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [{ title: "Sheets" }, { name: "", content: "" }];
};

export default function Sheets() {
  return (
    <ShellPage>
      <div className="flex flex-col gap-3 mb-24">
        {data.map((item) => (
          <SheetsLinks key={item.id} {...item} />
        ))}
      </div>
    </ShellPage>
  );
}

function SheetsLinks({ title, sheets }: TData) {
  return (
    <Section className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0 rounded-xl 2xl:rounded-2xl">
      <div className="px-4 py-3 lg:py-4 lg:px-6 bg-neutral-50 border-b lg:border-none lg:bg-white">
        <h2 className="text-sm font-bold">{title}</h2>
      </div>
      <Divide>
        {sheets.map((sheet) => (
          <Sheet key={sheet.id} {...sheet} />
        ))}
      </Divide>
    </Section>
  );
}

function Sheet({ title, id, day }: TSheet) {
  return (
    <ButtonLink
      to={`/sheets/${id}`}
      variant="transparent"
      className="px-4 lg:px-6 active:scale-[0.99] active:bg-transparent h-14 lg:h-16 flex w-full items-center hover:bg-neutral-50 cursor-pointer rounded-none border-x-0"
    >
      <div className="flex flex-col w-full">
        <span className="text-sm font-medium text-wrap">{title}</span>
        <span className="text-sm font-normal text-neutral-500 text-wrap">
          {day}
        </span>
      </div>
    </ButtonLink>
  );
}

type TData = {
  id: string;
  title: string;
  sheets: TSheet[];
};
type TSheet = { title: string; id: string; day: string };
const data: TData[] = [
  {
    id: "123abc",
    title: "Kemarin",
    sheets: [
      {
        title: "Tagihan Jan 2025",
        id: "Tagihan-Jan-2025",
        day: "Kamis",
      },
      {
        title: "Tagihan Feb 2025",
        id: "Tagihan-Feb-2025",
        day: "Rabu",
      },
    ],
  },
  {
    id: "321cba",
    title: "30 hari sebelumnya",
    sheets: [
      {
        title: "Tagihan Des 2024",
        id: "Tagihan-Des-2024",
        day: "Senin",
      },
    ],
  },
];
