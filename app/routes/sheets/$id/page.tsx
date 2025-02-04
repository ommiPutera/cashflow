import React from "react";
import { MetaFunction, useParams } from "react-router";

import ShellPage, { Divide, Section } from "~/components/shell-page";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";

import { useMediaQuery } from "~/hooks/use-media-query";

export const meta: MetaFunction = ({ params }) => {
  const title = params.id?.split("-").join(" ");
  return [{ title }, { name: "", content: "" }];
};

export default function Sheet() {
  return (
    <ShellPage>
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
        <SumItem title="Pemasukan" totalAmount="Rp10.000.000" from="in" />
        <SumItem title="Pengeluaran" totalAmount="Rp10.000.000" from="out" />
        <SumItem title="Tersedia" totalAmount="Rp10.000.000" from="available" />
      </Divide>
      <Button
        variant="transparent"
        className="!h-14 lg:!h-20 bg-neutral-50 inline-flex gap-2"
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
  return (
    <Section className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0 rounded-2xl 2xl:rounded-3xl">
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

type TSumItem = {
  title: string;
  totalAmount: string;
  from: string;
};
function SumItem({ title, totalAmount }: TSumItem) {
  return (
    <div className="px-4 lg:px-6 h-14 lg:h-16 flex w-full items-center hover:bg-neutral-50 cursor-pointer">
      <div className="flex justify-between items-center w-full">
        <span className="text-sm font-medium text-wrap">{title}</span>
        <span className="text-sm font-semibold text-neutral-700 text-wrap">
          {totalAmount}
        </span>
      </div>
    </div>
  );
}

type TTransaction = {
  title: string;
  id: string;
  type: string;
  amount: number;
};
function Transaction({ title, amount }: TTransaction) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="transparent"
            className="px-4 lg:px-6 h-14 lg:h-16 flex w-full items-center hover:bg-neutral-50 cursor-pointer rounded-none border-x-0"
          >
            <div className="flex justify-between items-center w-full">
              <span className="text-sm font-medium text-wrap">{title}</span>
              <span className="text-sm font-semibold text-neutral-700 text-wrap">
                {amount}
              </span>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>Form</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="transparent"
          className="px-4 lg:px-6 h-14 lg:h-16 flex w-full items-center hover:bg-neutral-50 cursor-pointer rounded-none border-x-0"
        >
          <div className="flex justify-between items-center w-full">
            <span className="text-sm font-medium text-wrap">{title}</span>
            <span className="text-sm font-semibold text-neutral-700 text-wrap">
              {amount}
            </span>
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pt-2">Form</div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outlined-primary" size="sm">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const data: TTransaction[] = [
  {
    id: "12345678",
    title: "Kredivo",
    type: "out",
    amount: 890000,
  },
  {
    id: "123456",
    title: "Traveloka",
    type: "out",
    amount: 1780000,
  },
];
