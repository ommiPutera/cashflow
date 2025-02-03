import { Link, type MetaFunction } from "react-router";

import ShellPage, { Divide, Section } from "~/components/shell-page";

export const meta: MetaFunction = () => {
  return [{ title: "Sheets" }, { name: "", content: "" }];
};

export default function Sheets() {
  return (
    <ShellPage>
      <Section>
        <h1 className="text-2xl font-bold">Sheets</h1>
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
        {/* <PenLine className="lg:w-5 lg:h-5 w-4 h-4" /> */}
        <span>pen</span>
        <h2 className="text-sm lg:text-base font-semibold">Buat Sheet</h2>
      </div>
    </Section>
  );
}

function SheetsLinks({ title, sheets }: Data) {
  return (
    <Section className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0">
      <div className="px-4 py-3 lg:py-6 lg:px-6 bg-neutral-50 border-b lg:border-none lg:bg-white">
        <h2 className="text-sm lg:text-base font-semibold">{title}</h2>
      </div>
      <Divide>
        {sheets.map((sheet) => (
          <Sheet
            key={sheet.id}
            title={sheet.title}
            to={`/sheets/${sheet.id}`}
          />
        ))}
      </Divide>
    </Section>
  );
}

function Sheet({ title, to }: { title: string; to: string }) {
  return (
    <div>
      <Link to={to}>
        <div className="py-8 px-4 lg:px-6 hover:bg-neutral-50 cursor-pointer">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span>
                sheet
                {/* <SheetIcon className="lg:w-5 lg:h-5 w-4 h-4" /> */}
              </span>
              <span className="text-sm font-semibold">{title}</span>
            </div>
            <div className="inline-flex flex-wrap gap-3 items-center justify-between">
              <p className="text-xs text-neutral-600 whitespace-nowrap font-semibold">
                Rp11.000.000
              </p>
              <p className="text-xs text-red-600 whitespace-nowrap font-semibold">
                -Rp10.000.000
              </p>
              <p className="text-xs text-green-600 whitespace-nowrap font-semibold">
                +Rp22.000.000
              </p>
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
  sheets: { title: string; id: string }[];
};
const data: Data[] = [
  {
    id: "123abc",
    title: "Kemarin",
    sheets: [
      {
        title: "Tagihan Jan 2025",
        id: "tagihan-jan-2025",
      },
      {
        title: "Tagihan Feb 2025",
        id: "tagihan-feb-2025",
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
      },
    ],
  },
];
