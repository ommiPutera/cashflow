import { Link, MetaFunction, useParams } from "react-router";

import ShellPage, { Divide, Section } from "~/components/shell-page";
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
      <div className="flex flex-col gap-1">
        <Section className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0">
          <div className="px-4 py-3 lg:py-4 lg:px-6 lg:bg-white">
            <h1 className="text-sm font-bold">{title}</h1>
          </div>
          <div className="px-4 py-3 lg:py-4 lg:px-6 border-b lg:bg-white flex justify-between">
            <dt className="min-w-[130px] max-w-[130px] text-sm lg:min-w-44 lg:max-w-44 break-words lg:flex-shrink-0 text-neutral-700 font-medium">
              Pengeluaran
            </dt>
            <dd className="inline-flex justify-end font-medium break-words text-right w-full text-sm">
              Rp10.000.000
            </dd>
          </div>
          <Button
            variant="transparent"
            className="px-4 py-3 lg:py-8 bg-neutral-50 inline-flex gap-2"
          >
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
              <path d="M5 12h14M12 5v14"></path>
            </svg>
            <span>Buat Transaksi</span>
          </Button>
        </Section>
        <SheetTransactions />
      </div>
    </ShellPage>
  );
}

function SheetTransactions() {
  return (
    <Section className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0">
      <div className="px-4 py-3 lg:py-4 lg:px-6 bg-neutral-50 border-b lg:border-none lg:bg-white">
        <h2 className="text-sm font-bold">Transaksi</h2>
      </div>
      <Divide>
        {data.map((transaction) => (
          <Transaction key={transaction.id} {...transaction} />
        ))}
      </Divide>
    </Section>
  );
}

function Transaction({ title, id, amount }: TTransactions) {
  return (
    <div>
      <Link to={`/sheets/${id}`}>
        <div className="py-2 px-4 lg:px-6 hover:bg-neutral-50 cursor-pointer">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-wrap">{title}</span>
            <span className="text-sm font-normal text-neutral-500 text-wrap">
              {amount}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

type TTransactions = {
  title: string;
  id: string;
  type: string;
  amount: number;
};
const data: TTransactions[] = [
  {
    id: "123456",
    title: "Traveloka",
    type: "out",
    amount: 1780000,
  },
  {
    id: "12345678",
    title: "Kredivo",
    type: "out",
    amount: 890000,
  },
];
