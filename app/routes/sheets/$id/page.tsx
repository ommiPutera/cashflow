import React from "react";
import {
  ActionFunctionArgs,
  MetaFunction,
  useActionData,
  useFetcher,
  useParams,
} from "react-router";
import { z } from "zod";

import { FormProvider, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

import ShellPage, { Divide, Section } from "~/components/shell-page";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Input } from "~/components/ui/input";
import { InputNumber } from "~/components/ui/input-number";
import { Label } from "~/components/ui/label";

import { useMediaQuery } from "~/hooks/use-media-query";
import { DialogClose } from "@radix-ui/react-dialog";

export const meta: MetaFunction = ({ params }) => {
  const title = params.id?.split("-").join(" ");
  return [{ title }, { name: "", content: "" }];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  console.log("formData: ", formData);
  return {};
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
      <div className="flex justify-between items-center w-full">
        <span className="text-sm font-medium text-wrap">{title}</span>
        <span className="text-sm font-semibold text-neutral-700 text-wrap">
          {symbol}
          {totalAmount}
        </span>
      </div>
    </div>
  );
}

type TTransaction = {
  name: string;
  id: string;
  type: string;
  nominal: number;
};
function Transaction(props: TTransaction) {
  const { name, nominal } = props;
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
              <span className="text-sm font-medium text-wrap">{name}</span>
              <span className="text-sm font-semibold text-neutral-700 text-wrap">
                {nominal}
              </span>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[495px]">
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <FormEditTransaction {...props} />
          </div>
          <DialogFooter className="pt-4">
            <Button variant="primary" className="w-full">
              Simpan
            </Button>
            <DialogClose asChild>
              <Button variant="outlined-primary" className="w-full">
                Batalkan
              </Button>
            </DialogClose>
          </DialogFooter>
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
            <span className="text-sm font-medium text-wrap">{name}</span>
            <span className="text-sm font-semibold text-neutral-700 text-wrap">
              {nominal}
            </span>
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{name}</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pt-2 mt-2">
          <FormEditTransaction {...props} />
        </div>
        <DrawerFooter className="pt-4">
          <Button variant="primary">Simpan</Button>
          <DrawerClose asChild>
            <Button variant="outlined-primary">Batalkan</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const createBankSchema = z.object({
  name: z
    .string({ required_error: "Nama transaksi harus diunggah" })
    .max(30, "Maksimal 30 karakter"),
  type: z
    .string({ required_error: "Tipe transaksi harus diisi" })
    .max(30, "Maksimal 30 karakter"),
  nominal: z
    .string({ required_error: "Nominal transaksi harus diisi" })
    .max(30, "Maksimal 30 karakter"),
});
function FormEditTransaction({ name, nominal }: TTransaction) {
  const fetcher = useFetcher();
  const actionData = useActionData<typeof action>();

  const [form, fields] = useForm({
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createBankSchema });
    },
    defaultValue: {
      name,
      nominal: nominal.toString(),
    },
    shouldValidate: "onInput",
    shouldRevalidate: "onInput",
  });
  return (
    <fetcher.Form>
      <FormProvider context={form.context}>
        <div className="flex flex-col gap-5">
          <div className="grid w-full items-center gap-1">
            <Label htmlFor={fields.name.id}>Nominal</Label>
            <InputNumber
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              allowNegative={false}
              placeholder="Rp"
              maxLength={16}
              prefix="Rp"
              thousandSeparator="."
              decimalSeparator=","
              className="border-none bg-transparent px-0 text-2xl font-bold"
              error={!!fields.nominal.errors}
              {...getInputProps(fields.nominal, {
                type: "text",
                ariaDescribedBy: fields.nominal.descriptionId,
              })}
              key={fields.nominal.key}
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor={fields.name.id}>Nama Transaksi</Label>
            <Input
              placeholder="Masukkan nama transaksi"
              error={!!fields.name.errors}
              {...getInputProps(fields.name, {
                type: "text",
                ariaDescribedBy: fields.name.descriptionId,
              })}
              key={fields.name.key}
            />
          </div>
        </div>
      </FormProvider>
    </fetcher.Form>
  );
}

const data: TTransaction[] = [
  {
    id: "12345678",
    name: "Kredivo",
    type: "out",
    nominal: 890000,
  },
  {
    id: "123456",
    name: "Traveloka",
    type: "out",
    nominal: 1780000,
  },
];
