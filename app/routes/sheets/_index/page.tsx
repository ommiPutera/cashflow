import { Link, type MetaFunction } from "react-router";

import ShellPage, { Divide, Section } from "~/components/shell-page";

export const meta: MetaFunction = () => {
  return [{ title: "Sheets" }, { name: "", content: "" }];
};

export default function Sheets() {
  return (
    <ShellPage>
      <div className="flex flex-col gap-1">
        <CreateSheet />
        {data.map((item) => (
          <SheetsLinks key={item.id} {...item} />
        ))}
      </div>
    </ShellPage>
  );
}

function CreateSheet() {
  return (
    <Section className="bg-white dark:bg-black border hover:bg-neutral-50 border-neutral-200 dark:border-neutral-800 p-0 lg:p-0 cursor-pointer">
      <div className="p-4 lg:py-6 lg:px-6 flex items-center gap-2 lg:gap-3">
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
            className="w-4 h-4 lg:w-5 lg:h-5"
            viewBox="0 0 24 24"
          >
            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
          </svg>
        </span>
        <h2 className="text-sm font-bold">Sheet baru</h2>
      </div>
    </Section>
  );
}

function SheetsLinks({ title, sheets }: TData) {
  return (
    <Section className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0">
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
    <div>
      <Link to={`/sheets/${id}`}>
        <div className="py-2 px-4 lg:px-6 hover:bg-neutral-50 cursor-pointer">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-wrap">{title}</span>
            <span className="text-sm font-normal text-neutral-500 text-wrap">
              {day}
            </span>
          </div>
        </div>
      </Link>
    </div>
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
