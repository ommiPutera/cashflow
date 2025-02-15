import React from "react";
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
import { ButtonLink } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

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
  const url = new URL(request.url);
  const isExpectationModeActive =
    url.searchParams.get("expectation-mode") === "1";
  const transactions = mockTransactions.filter(
    (trx) => trx.sheetId === params.id,
  );

  const totalOut = 100000;
  const totalIn = 250000;
  return {
    transactions,
    bool: {
      isExpectationModeActive,
      hasTransactions: transactions.length > 0,
    },
    sheetId: params.id,
    sum: {
      totalOut,
      totalIn,
      available: totalIn - totalOut,
    },
  };
};

// const sheets = [
//   {
//     title: "Tagihan Jan 2025",
//     id: "Tagihan-Jan-2025",
//     day: "Kamis",
//   },
//   {
//     title: "Tagihan Feb 2025",
//     id: "Tagihan-Feb-2025",
//     day: "Rabu",
//   },
//   {
//     title: "Tagihan Des 2024",
//     id: "Tagihan-Des-2024",
//     day: "Senin",
//   },
// ]

const mockTransactions = [
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
      <Header />
      <Content />
    </ShellPage>
  );
}

function Header() {
  return (
    <div className="w-full h-12">
      <Link
        to="/sheets"
        prefetch="viewport"
        className="p-0 h-fit active:scale-[0.99] font-normal inline-flex items-center tap-highlight-transparent"
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
  );
}

function Content() {
  return (
    <div className="flex flex-col gap-3 mb-24">
      <SheetSum />
      <AvailableMinus />
      <SheetTransactions />
    </div>
  );
}

function SheetSum() {
  const { sum } = useLoaderData<typeof loader>();
  const title = useParams().id?.replace(/-/g, " ");
  return (
    <Accordion type="single" defaultValue="item" collapsible asChild>
      <Section className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0 rounded-xl 2xl:rounded-2xl">
        <AccordionItem value="item" className="border-none">
          <AccordionTrigger className="px-4 py-5 lg:py-6 lg:px-6 bg-neutral-50 lg:bg-white">
            <h2 className="text-sm font-bold">Penjumlahan {title}</h2>
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            <Divide>
              <SumItem
                title="Pemasukan"
                totalAmount={toIDR(sum.totalIn)}
                from="in"
              />
              <SumItem
                title="Pengeluaran"
                totalAmount={toIDR(sum.totalOut)}
                from="out"
              />
              <SumItem
                title="Dana Tersedia"
                totalAmount={toIDR(sum.available)}
                from="available"
              />
            </Divide>
          </AccordionContent>
        </AccordionItem>
      </Section>
    </Accordion>
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
  const { sheetId } = useLoaderData<typeof loader>();
  return (
    <Section className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0 rounded-xl 2xl:rounded-2xl">
      <ButtonLink
        to={`/sheets/create/${sheetId}`}
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
      </ButtonLink>
      <div className="px-4 py-5 lg:py-6 lg:px-6 bg-neutral-50 lg:bg-white flex justify-between items-center">
        <h2 className="text-sm font-bold">Transaksi</h2>
        <ExpectationMode />
      </div>
      <Transactions />
    </Section>
  );
}

type TExpectationSumProps = {
  totalOut: number;
  totalIn: number;
  calculate: (
    nominal: number,
    type: "out" | "in",
    operation: "add" | "sub",
  ) => void;
  clearAllState: () => void;
};
type ExpectationSumContext = Partial<TExpectationSumProps>;
const ExpectationSumContext = React.createContext<ExpectationSumContext>({});
const useExpectationSumContext = () => React.useContext(ExpectationSumContext);
function Transactions() {
  const {
    transactions,
    bool: { isExpectationModeActive, hasTransactions: trxs },
  } = useLoaderData<typeof loader>();

  const [totalOut, setTotalOut] = React.useState(0);
  const [totalIn, setTotalIn] = React.useState(0);
  const calculate = (
    nominal: number,
    type: "out" | "in",
    operation: "add" | "sub",
  ) => {
    if (type === "in") {
      setTotalIn((prev) =>
        Math.max(0, prev + (operation === "add" ? nominal : -nominal)),
      );
    }
    if (type === "out") {
      setTotalOut((prev) =>
        Math.max(0, prev + (operation === "add" ? nominal : -nominal)),
      );
    }
  };

  React.useEffect(() => {
    if (!isExpectationModeActive) {
      setTotalOut(0);
      setTotalIn(0);
    }
  }, [isExpectationModeActive]);

  return (
    <ExpectationSumContext.Provider value={{ totalOut, totalIn, calculate }}>
      <Divide>
        <ExpectationSum />
        {trxs ? (
          transactions.map((trx) => <Transaction key={trx.id} {...trx} />)
        ) : (
          <EmptyTransaction />
        )}
      </Divide>
    </ExpectationSumContext.Provider>
  );
}
function EmptyTransaction() {
  return (
    <div className="w-full h-16 flex justify-center items-center">
      <span className="text-sm font-medium text-neutral-400">
        Belum ada Transaksi..
      </span>
    </div>
  );
}

function ExpectationSum() {
  const {
    bool: { isExpectationModeActive },
  } = useLoaderData<typeof loader>();

  const { totalOut, totalIn } = useExpectationSumContext();
  const available = (totalIn || 0) - (totalOut || 0);

  if (!isExpectationModeActive) return <></>;
  return (
    <Section className="bg-neutral-50 m-2 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0 rounded-xl 2xl:rounded-2xl">
      <Divide>
        <SumItem
          title="Pemasukan"
          totalAmount={toIDR(totalIn || 0)}
          from="in"
        />
        <SumItem
          title="Pengeluaran"
          totalAmount={toIDR(totalOut || 0)}
          from="out"
        />
        <SumItem
          title="Dana Tersedia"
          totalAmount={toIDR(available)}
          from="available"
        />
      </Divide>
    </Section>
  );
}

function Transaction(props: TTransaction) {
  const {
    bool: { isExpectationModeActive },
  } = useLoaderData<typeof loader>();
  const { id, nominal, type } = props;

  if (isExpectationModeActive) {
    return (
      <TransactionCheckbox
        id={id}
        nominal={nominal}
        type={type === "in" ? "in" : "out"}
      >
        <TransactionContent {...props} />
      </TransactionCheckbox>
    );
  }
  return (
    <TransactionContentLayout id={id}>
      <Link key={id} to={`/sheets/edit/${id}`}>
        <TransactionContent {...props} />
      </Link>
    </TransactionContentLayout>
  );
}
function TransactionCheckbox({
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  id: string;
  nominal: number;
  type: "in" | "out";
}) {
  const { id, nominal, type } = props;
  const { calculate } = useExpectationSumContext();
  return (
    <TransactionContentLayout id={id}>
      <div className="flex items-center gap-4 w-full">
        <Checkbox
          id={id}
          onCheckedChange={(checked) =>
            typeof calculate === "function" &&
            calculate(nominal, type, checked ? "add" : "sub")
          }
        />
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
      <div className="active:scale-[0.99] active:bg-transparent w-full">
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
    bool: { isExpectationModeActive, hasTransactions },
  } = useLoaderData<typeof loader>();
  const [, setSearchParams] = useSearchParams();
  return (
    <div className="flex items-center space-x-2 active:scale-[0.99]">
      <Switch
        disabled={!hasTransactions}
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
        <span className="text-sm inline-flex gap-2 font-semibold text-neutral-700 text-wrap">
          {totalAmount}
          {symbol}
        </span>
      </div>
    </div>
  );
}
