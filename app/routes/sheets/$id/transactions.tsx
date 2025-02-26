import { type Transaction } from "@prisma/client";

import React from "react";
import { Link, useLoaderData, useSearchParams } from "react-router";

import { Divide, Section } from "~/components/shell-page";
import { ButtonLink } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";

import { toIDR } from "~/utils/currency";

import { loader } from "./page";
import { SumItem } from "./sheet-sum";

export default function Transactions() {
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
      <ListTransactions />
    </Section>
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
      <Label htmlFor="expectation-mode" className="font-semibold text-xs">
        Mode Ekspetasi
      </Label>
    </div>
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
function ListTransactions() {
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
          transactions.map((trx) => <TransactionItem key={trx.id} {...trx} />)
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
      <span className="text-sm font-normal text-neutral-400">
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

function TransactionItem(props: Transaction) {
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
    <Link key={id} to={`/sheets/edit/${id}`}>
      <TransactionContentLayout id={id}>
        <TransactionContent {...props} />
      </TransactionContentLayout>
    </Link>
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
        <p className="text-sm font-normal text-wrap">{name}</p>
      </div>
      <span className="text-sm font-normal text-neutral-700 text-wrap">
        {toIDR(nominal)}
      </span>
    </div>
  );
}
