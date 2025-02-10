import {
  ActionFunctionArgs,
  MetaFunction,
  useLoaderData,
  useParams,
} from "react-router";

import ShellPage, { Divide, Section } from "~/components/shell-page";
import { Button, ButtonLink } from "~/components/ui/button";

export const meta: MetaFunction = ({ params }) => {
  const title = params.id?.split("-").join(" ");
  return [{ title }, { name: "", content: "" }];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  console.log("formData: ", JSON.stringify(formData));
  return {};
};

export const loader = async () => {
  return {
    transactions,
  };
};

const transactions: TTransaction[] = [
  {
    id: "1",
    sheetId: "Tagihan-Jan-2025",
    name: "Kredivo",
    type: "out",
    nominal: 890000,
    notes: null,
  },
  {
    id: "2",
    sheetId: "Tagihan-Jan-2025",
    name: "Traveloka",
    type: "out",
    nominal: 1780000,
    notes: "Lunas",
  },
  {
    id: "3",
    sheetId: "Tagihan-Jan-2025",
    name: "Transfer",
    type: "in",
    nominal: 90000000,
    notes: "Sudah diterima",
  },
];

export default function Sheet() {
  return (
    <ShellPage>
      <div className="w-full h-12">
        <ButtonLink
          asChild
          to="/sheets"
          prefetch="intent"
          className="p-0 h-fit items-center"
          variant="transparent"
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
            className="lucide lucide-chevron-left"
            viewBox="0 0 24 24"
          >
            <path d="m15 18-6-6 6-6"></path>
          </svg>
          <span>Kembali</span>
        </ButtonLink>
      </div>
      <div className="flex flex-col gap-1">
        <SheetSum />
        <SheetTransactions />
      </div>
    </ShellPage>
  );
}

function SheetSum() {
  const params = useParams();

  const title = params.id?.split("-").join(" ");
  return (
    <Section className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0 rounded-2xl 2xl:rounded-3xl">
      <div className="px-4 py-3 lg:py-4 lg:px-6 bg-neutral-50 border-b lg:border-none lg:bg-white">
        <h2 className="text-sm font-bold">{title}</h2>
      </div>
      <Divide className="border-b">
        <SumItem title="Pemasukan" totalAmount="Rp10000000" from="in" />
        <SumItem title="Pengeluaran" totalAmount="Rp10000000" from="out" />
        <SumItem title="Tersedia" totalAmount="Rp10000000" from="available" />
      </Divide>
      <Button
        variant="transparent"
        className="!h-14 lg:!h-20 bg-neutral-50 inline-flex gap-2 rounded-b-2xl 2xl:rounded-b-3xl rounded-t-none"
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
        <span>Buat transaksi</span>
      </Button>
    </Section>
  );
}

function SheetTransactions() {
  const { transactions } = useLoaderData<typeof loader>();
  return (
    <Section className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0 rounded-2xl 2xl:rounded-3xl">
      <div className="px-4 py-3 lg:py-4 lg:px-6 bg-neutral-50 border-b lg:border-none lg:bg-white">
        <h2 className="text-sm font-bold">Transaksi</h2>
      </div>
      <Divide>
        {transactions.map((trx) => (
          <ButtonLink
            key={trx.id}
            to={`/sheets/edit/${trx.id}`}
            variant="transparent"
            className="px-4 lg:px-6 h-14 lg:h-16 flex w-full items-center hover:bg-neutral-50 cursor-pointer rounded-none border-x-0"
          >
            <div className="flex justify-between items-center w-full flex-wrap">
              <span className="text-sm font-medium text-wrap">{trx.name}</span>
              <span className="text-sm font-semibold text-neutral-700 text-wrap">
                {trx.nominal}
              </span>
            </div>
          </ButtonLink>
        ))}
      </Divide>
    </Section>
  );
}

type TSumItem = {
  title: string;
  totalAmount: string;
  from: string;
};
function SumItem({ title, totalAmount, from }: TSumItem) {
  let symbol = "";
  switch (from) {
    case "in":
      symbol = "+";
      break;
    case "out":
      symbol = "-";
      break;
    default:
      symbol;
  }
  return (
    <div className="px-4 lg:px-6 h-14 lg:h-16 flex w-full items-center hover:bg-neutral-50 cursor-pointer">
      <div className="flex justify-between items-center w-full flex-wrap">
        <span className="text-sm font-medium text-wrap">{title}</span>
        <span className="text-sm font-semibold text-neutral-700 text-wrap">
          {symbol}
          {totalAmount}
        </span>
      </div>
    </div>
  );
}
