import {
  ActionFunctionArgs,
  Link,
  LoaderFunctionArgs,
  MetaFunction,
  useLoaderData,
  useParams,
  useSearchParams,
} from "react-router";

import ShellPage, { Divide, Section } from "~/components/shell-page";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";

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

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const trxs = transactions.filter((trx) => trx.sheetId === params.id);

  const url = new URL(request.url);
  const isExpectationModeActive = !!parseInt(
    url.searchParams.get("expectation-mode") === "1" ? "1" : "0",
  );

  const totalOut = 100000;
  const totalIn = 250000;
  return {
    transactions: trxs,
    bool: {
      isExpectationModeActive,
      transactions: !!trxs.length,
    },
    sum: {
      totalOut,
      totalIn,
      available: totalIn - totalOut,
    },
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
    <ShellPage noNavigation>
      <div className="w-full h-12">
        <Link
          to="/sheets"
          prefetch="viewport"
          className="p-0 h-fit active:scale-[0.97] font-normal inline-flex items-center tap-highlight-transparent"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="m15 18-6-6 6-6"></path>
          </svg>
          <span className="text-xs font-medium">Kembali</span>
        </Link>
      </div>
      <div className="flex flex-col gap-3 mb-24">
        <SheetSum />
        <AvailableMinus />
        <div className="mx-auto w-full max-w-[240px]">
          <p className="text-center text-sm text-neutral-600 mb-6 mt-2">
            *Selalu jaga Dana Tersedia Anda, demi kelancaran finansial.
          </p>
        </div>
        <SheetTransactions />
      </div>
    </ShellPage>
  );
}

function SheetSum() {
  const {
    sum: { totalIn, totalOut, available },
  } = useLoaderData<typeof loader>();
  const params = useParams();

  const title = params.id?.split("-").join(" ");
  return (
    <Section className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0 rounded-xl 2xl:rounded-2xl">
      <div className="px-4 py-5 lg:py-6 lg:px-6 bg-neutral-50 border-b lg:border-none lg:bg-white">
        <h2 className="text-sm font-bold">Hitungan {title}</h2>
      </div>
      <Divide>
        <SumItem title="Pengeluaran" totalAmount={toIDR(totalOut)} from="out" />
        <SumItem title="Pemasukan" totalAmount={toIDR(totalIn)} from="in" />
        <SumItem
          title="Dana Tersedia"
          totalAmount={toIDR(available)}
          from="available"
        />
      </Divide>
    </Section>
  );
}

function AvailableMinus() {
  const {
    sum: { totalIn, totalOut, available },
  } = useLoaderData<typeof loader>();

  if (totalIn && totalOut && available > 0) return <></>;
  return (
    <Section className="bg-white dark:bg-black border border-danger-200 dark:border-neutral-800 p-0 lg:p-0 rounded-xl 2xl:rounded-2xl">
      <div className="px-4 py-3 lg:py-4 lg:px-6 bg-danger-50 text-danger-500 border-none">
        <span className="text-sm font-medium">
          Finansialmu sedang dalam masalah..
        </span>
      </div>
    </Section>
  );
}

function SheetTransactions() {
  const {
    transactions,
    bool: { transactions: trxs },
  } = useLoaderData<typeof loader>();
  return (
    <Section className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0 rounded-xl 2xl:rounded-2xl">
      <Button
        variant="outlined-primary"
        className="!h-14 lg:!h-20 bg-neutral-50 inline-flex gap-2 rounded-t-xl 2xl:rounded-t-2xl rounded-b-none border-t-transparent border-x-transparent border-b"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          className="w-4 h-4 lg:w-5 lg:h-5"
          viewBox="0 0 24 24"
        >
          <path d="M5 12h14M12 5v14"></path>
        </svg>
        <span>Buat transaksi</span>
      </Button>
      <div className="px-4 py-5 lg:py-6 lg:px-6 bg-neutral-50 border-b lg:border-none lg:bg-white flex justify-between items-center">
        <h2 className="text-sm font-bold">Transaksi</h2>
        <ExpectationMode />
      </div>
      <Divide>
        {trxs ? (
          transactions.map((trx) => <Transaction key={trx.id} {...trx} />)
        ) : (
          <div className="w-full h-16 flex justify-center items-center">
            <span className="text-sm font-medium text-neutral-400">
              Belum ada Transaksi..
            </span>
          </div>
        )}
      </Divide>
    </Section>
  );
}
function Transaction(props: TTransaction) {
  const {
    bool: { isExpectationModeActive },
  } = useLoaderData<typeof loader>();
  const { id } = props;

  if (isExpectationModeActive) {
    return (
      <TransactionCheckbox id={id}>
        <TransactionContent {...props} />
      </TransactionCheckbox>
    );
  }
  return (
    <Link key={id} to={`/sheets/edit/${id}`}>
      <TransactionContentLayout id={id}>
        <TransactionContent {...props} />
      </TransactionContentLayout>
    </Link>
  );
}
function TransactionCheckbox({
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { id: string }) {
  const { id } = props;
  return (
    <TransactionContentLayout id={id}>
      <div className="flex items-center gap-4 w-full">
        <Checkbox id={id} />
        {props.children}
      </div>
    </TransactionContentLayout>
  );
}
function TransactionContentLayout({
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { id: string }) {
  const { id } = props;
  return (
    <label
      htmlFor={id}
      className="px-4 lg:px-6 h-14 lg:h-16 flex w-full items-center hover:bg-neutral-50 cursor-pointer rounded-none border-x-0"
    >
      <div className="active:scale-[0.97] active:bg-transparent w-full">
        {props.children}
      </div>
    </label>
  );
}
function TransactionContent({ type, nominal, name }: TTransaction) {
  return (
    <div className="flex justify-between items-center w-full flex-wrap">
      <div className="flex items-center gap-3">
        {type === "out" ? (
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
        <p className="text-sm font-medium text-wrap">{name}</p>
      </div>
      <span className="text-sm font-semibold text-neutral-700 text-wrap">
        {toIDR(nominal)}
      </span>
    </div>
  );
}

function ExpectationMode() {
  const {
    bool: { isExpectationModeActive, transactions },
  } = useLoaderData<typeof loader>();
  const [, setSearchParams] = useSearchParams();
  return (
    <div className="flex items-center space-x-2">
      <Switch
        disabled={!transactions}
        id="expectation-mode"
        checked={isExpectationModeActive}
        onCheckedChange={(checked) => {
          const params = new URLSearchParams();
          params.set("expectation-mode", checked ? "1" : "0");
          setSearchParams(params, {
            preventScrollReset: true,
          });
        }}
      />
      <Label htmlFor="expectation-mode" className="font-semibold">
        Mode Ekspetasi
      </Label>
    </div>
  );
}

type TSumItem = {
  title: string;
  totalAmount: string;
  from: string;
};
function SumItem({ title, totalAmount, from }: TSumItem) {
  let symbol = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="text-neutral-500"
      viewBox="0 0 24 24"
    >
      <path d="M20 6 9 17l-5-5"></path>
    </svg>
  );
  switch (from) {
    case "in":
      symbol = (
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
      );
      break;
    case "out":
      symbol = (
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
      );
      break;
    default:
      symbol;
  }
  return (
    <div className="px-4 lg:px-6 h-14 lg:h-16 flex w-full items-center hover:bg-neutral-50 cursor-pointer">
      <div className="flex justify-between items-center w-full flex-wrap">
        <span className="text-sm font-medium text-wrap">{title}</span>
        <span className="text-sm inline-flex gap-2 font-semibold text-neutral-700 text-wrap underline">
          {totalAmount}
          {symbol}
        </span>
      </div>
    </div>
  );
}
