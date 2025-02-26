import { useLoaderData, useParams } from "react-router";

import { Divide, Section } from "~/components/shell-page";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

import { toIDR } from "~/utils/currency";

import { loader } from "./page";

export default function SheetSum() {
  const { sum } = useLoaderData<typeof loader>();
  const title = useParams().id?.replace(/-/g, " ");
  return (
    <Accordion type="single" defaultValue="item" collapsible asChild>
      <Section className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0 rounded-xl 2xl:rounded-2xl">
        <AccordionItem value="item" className="border-none">
          <AccordionTrigger className="px-4 py-5 lg:py-6 lg:px-6 bg-neutral-50 lg:bg-white">
            <h2 className="text-sm font-bold">{title}</h2>
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

type TSumItem = {
  title: string;
  totalAmount: string;
  from: string;
};
export function SumItem({ title, totalAmount, from }: TSumItem) {
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
        <span className="text-sm font-normal text-wrap">{title}</span>
        <span className="text-sm inline-flex gap-2 font-normal text-neutral-700 text-wrap">
          {totalAmount}
          {symbol}
        </span>
      </div>
    </div>
  );
}
