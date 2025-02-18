import { type Transaction, type User } from "@prisma/client";
import React from "react";
import {
  ActionFunctionArgs,
  Link,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
  useFetcher,
  useLoaderData,
  useParams,
  useSearchParams,
} from "react-router";

import ShellPage, { Divide, Section } from "~/components/shell-page";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button, ButtonLink } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";

import { toIDR } from "~/utils/currency";
import { deleteSheet, getSheet } from "~/utils/sheet.server";

import { getSession } from "~/lib/session.server";

export const meta: MetaFunction = ({ params }) => {
  const title = params.id?.split("-").join(" ");
  return [{ title }, { name: "", content: "" }];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const id = formData.get("id");

  const session = await getSession(request.headers.get("Cookie"));
  const user: User = session.get("user");
  if (typeof id !== "string" || !user) return {};
  const sheet = await deleteSheet(id, user.id);
  if (sheet) return redirect("/sheets");

  return {};
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const isExpectationModeActive =
    url.searchParams.get("expectation-mode") === "1";

  const session = await getSession(request.headers.get("Cookie"));
  const user: User = session.get("user");
  const sheet = await getSheet(params.id || "", user.id);
  if (!sheet) return redirect("/sheets");

  const transactions: Transaction[] = [];

  const isPinned = true;

  const totalOut = 100000;
  const totalIn = 250000;
  return {
    transactions,
    flag: {
      isPinned,
    },
    bool: {
      isExpectationModeActive,
      hasTransactions: transactions.length > 0,
    },
    sheet,
    sheetId: params.id,
    sum: {
      totalOut,
      totalIn,
      available: totalIn - totalOut,
    },
  };
};

export default function Sheet() {
  return (
    <ShellPage>
      <Header />
      <Content />
    </ShellPage>
  );
}

function Header() {
  return (
    <div className="w-full h-12 flex justify-between items-start">
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
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button className="p-1 !h-7 !w-7 rounded-full border bg-white dark:bg-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="lucide lucide-ellipsis"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[240px]">
          <DropdownMenuGroup>
            <PinnedSheet />
            <DropdownMenuSeparator />
            <DeleteSheet />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function PinnedSheet() {
  const {
    flag: { isPinned },
  } = useLoaderData<typeof loader>();
  return (
    <DropdownMenuItem className="justify-between">
      <span>{isPinned ? "Lepas Pin" : "Pin"}</span>
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
      >
        {isPinned ? (
          <path d="M12 17v5M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89M2 2l20 20M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11"></path>
        ) : (
          <path d="M12 17v5M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"></path>
        )}
      </svg>
    </DropdownMenuItem>
  );
}

function DeleteSheet() {
  const { sheet } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  return (
    <DropdownMenuItem
      className="text-danger-500 hover:!text-danger-500 hover:!bg-red-50 justify-between"
      onClick={() =>
        fetcher.submit({ id: sheet.id }, { action: ".", method: "post" })
      }
    >
      <span>Hapus</span>
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
      >
        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"></path>
      </svg>
    </DropdownMenuItem>
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
        to={`/sheets/${sheetId}/create`}
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
      <div className="px-4 py-5 lg:py-6 lg:px-6 bg-neutral-50 lg:bg-white flex flex-wrap gap-2 justify-between items-center">
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

function Transaction(props: Transaction) {
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
      className="px-4 lg:px-6 min-h-14 lg:h-16 flex w-full items-center hover:bg-primary-50 cursor-pointer rounded-none border-x-0"
    >
      <div className="active:scale-[0.99] active:bg-transparent w-full">
        {props.children}
      </div>
    </label>
  );
}
function TransactionContent({ type, nominal, name }: Transaction) {
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
    <div className="px-4 lg:px-6 h-14 lg:h-16 flex w-full items-center hover:bg-primary-50 cursor-pointer">
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
