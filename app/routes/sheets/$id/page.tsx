import {
  ActionFunctionArgs,
  Link,
  LoaderFunctionArgs,
  MetaFunction,
  useLoaderData,
  useParams,
} from "react-router";

import ShellPage, { Divide, Section } from "~/components/shell-page";
import { Button, ButtonLink } from "~/components/ui/button";

import { toIDR } from "~/utils/currency";

export const meta: MetaFunction = ({ params }) => {
  const title = params.id?.split("-").join(" ");
  return [{ title }, { name: "", content: "" }];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  console.log("formData: ", JSON.stringify(formData));
  return {};
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const trxs = transactions.filter((trx) => trx.sheetId === params.id);
  if (!trxs.length) throw new Error("Data not found");

  return {
    transactions: trxs,
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
  {
    id: "4",
    sheetId: "Tagihan-Des-2024",
    name: "Bayar listrik",
    type: "out",
    nominal: 201500,
    notes: null,
  },
  {
    id: "5",
    sheetId: "Tagihan-Feb-2025",
    name: "Jajan Indomaret",
    type: "out",
    nominal: 11200,
    notes: null,
  },
];

export default function Sheet() {
  return (
    <ShellPage>
      <div className="w-full h-12">
        <Link
          to="/sheets"
          prefetch="intent"
          className="p-0 h-fit font-normal inline-flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="m15 18-6-6 6-6"></path>
          </svg>
          <span className="text-sm font-medium">Kembali</span>
        </Link>
      </div>
      <div className="flex flex-col gap-1 mb-24">
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
    </Section>
  );
}

function SheetTransactions() {
  const { transactions } = useLoaderData<typeof loader>();
  return (
    <Section className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0 rounded-2xl 2xl:rounded-3xl">
      <Button
        variant="outlined-primary"
        className="!h-14 lg:!h-20 bg-neutral-50 inline-flex gap-2 rounded-t-2xl 2xl:rounded-t-3xl rounded-b-none border-b"
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
              <div className="flex items-center gap-3">
                {trx.type === "out" ? (
                  <div className="bg-danger-50 h-6 w-6 flex justify-center items-center rounded-full border border-danger-200">
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="text-danger-500"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7 7h10v10M7 17 17 7"></path>
                      </svg>
                    </span>
                  </div>
                ) : (
                  <div className="bg-green-50 h-6 w-6 flex justify-center items-center rounded-full border border-green-400">
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="text-green-500"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17V3M6 11l6 6 6-6M19 21H5"></path>
                      </svg>
                    </span>
                  </div>
                )}
                <p className="text-sm font-medium text-wrap">{trx.name}</p>
              </div>
              <span className="text-sm font-semibold text-neutral-700 text-wrap">
                {toIDR(trx.nominal)}
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
