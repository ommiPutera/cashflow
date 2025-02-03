import { Link, type MetaFunction } from "react-router";

import ShellPage, { Divide, Section } from "~/components/shell-page";

export const meta: MetaFunction = () => {
  return [{ title: "Sheets" }, { name: "", content: "" }];
};

export default function Sheets() {
  return (
    <ShellPage>
      <Section className="">
        <h1 className="text-2xl font-extrabold">Sheets</h1>
      </Section>
      <div className="flex flex-col gap-2">
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
            viewBox="0 0 24 24"
            className="lg:w-5 lg:h-5 w-4 h-4"
          >
            <path d="M12 20h9M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"></path>
          </svg>
        </span>
        <h2 className="text-sm lg:text-base font-bold">Buat Sheet</h2>
      </div>
    </Section>
  );
}

function SheetsLinks({ title, sheets }: Data) {
  return (
    <Section className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0">
      <div className="px-4 py-3 lg:py-6 lg:px-6 bg-neutral-50 border-b lg:border-none lg:bg-white">
        <h2 className="text-sm lg:text-base font-bold">{title}</h2>
      </div>
      <Divide>
        {sheets.map((sheet) => (
          <Sheet key={sheet.id} {...sheet} />
        ))}
      </Divide>
    </Section>
  );
}

function Sheet({ title, id, day }: Sheet) {
  return (
    <div>
      <Link to={`/sheets/${id}`}>
        <div className="py-8 px-4 lg:px-6 hover:bg-neutral-50 cursor-pointer">
          <div className="inline-flex justify-between items-center w-full gap-3">
            <div className="flex flex-col w-1/2 gap-1">
              <span className="text-sm font-semibold text-wrap">{title}</span>
              <span className="text-sm font-medium text-neutral-400 text-wrap">
                {day}
              </span>
            </div>
            <div className="w-1/2 text-right flex flex-col gap-2">
              <span className="text-xs text-green-600 font-medium">
                +Rp22.000.000
              </span>
              <span className="text-sm text-red-400 font-medium">
                -Rp10.000.000
              </span>
              <span className="text-xs text-neutral-500 font-medium">
                Rp11.000.000
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

type Data = {
  id: string;
  title: string;
  sheets: Sheet[];
};
type Sheet = { title: string; id: string; day: string };
const data: Data[] = [
  {
    id: "123abc",
    title: "Kemarin",
    sheets: [
      {
        title: "Tagihan Jan 2025",
        id: "tagihan-jan-2025",
        day: "Kamis",
      },
      {
        title: "Tagihan Feb 2025",
        id: "tagihan-feb-2025",
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
        id: "tagihan-Des-2024",
        day: "Senin",
      },
    ],
  },
];
