import React from "react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  useActionData,
  useFetcher,
  useLoaderData,
} from "react-router";
import { z } from "zod";

import {
  FormProvider,
  getInputProps,
  useField,
  useForm,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

import ShellPage from "~/components/shell-page";
import { Button, ButtonLink } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { InputNumber } from "~/components/ui/input-number";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = data?.name;
  return [{ title }, { name: "", content: "" }];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  console.log("formData: ", JSON.stringify(formData));
  return {};
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const trx = transactions.find((t) => t.id === params.id);
  return {
    ...trx,
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

export default function Edit() {
  const { sheetId } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <ShellPage noNavigation>
      <div className="w-full h-12">
        <ButtonLink
          asChild
          to={`/sheets/${sheetId}`}
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
      <div className="flex flex-col gap-1 p-2">
        <fetcher.Form
          action="."
          method="post"
          className="flex flex-col gap-8 min-h-screen lg:min-h-fit mb-12 lg:mb-0"
        >
          <div className="lg:mt-2">
            <FormEditTransaction />
          </div>
          <div className="fixed bg-white lg:relative bottom-0 lg:bg-transparent w-full left-0 px-1.5 py-3 lg:p-0 flex flex-col gap-1.5">
            <Button variant="primary" type="submit" className="w-full">
              Ubah
            </Button>
            <ButtonLink
              to={`/sheets/${sheetId}`}
              prefetch="intent"
              type="button"
              variant="outlined-primary"
              className="w-full"
            >
              Batal
            </ButtonLink>
          </div>
        </fetcher.Form>
      </div>
    </ShellPage>
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
  notes: z.string().max(30, "Maksimal 30 karakter").optional(),
});
const formId = "edit-transaction";
function FormEditTransaction() {
  const { name, nominal, notes, type, sheetId } =
    useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [form, fields] = useForm({
    id: formId,
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createBankSchema });
    },
    defaultValue: {
      name,
      nominal: nominal?.toString(),
      notes,
    },
    shouldValidate: "onInput",
    shouldRevalidate: "onInput",
  });
  return (
    <FormProvider context={form.context}>
      <div className="flex flex-col gap-3 h-full">
        <div className="flex flex-col w-full items-center justify-center mb-14 mt-6">
          {type === "out" ? (
            <Label
              htmlFor={fields.nominal.id}
              className="bg-danger-50 h-16 w-16 mb-2 flex justify-center items-center rounded-full border border-danger-200"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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
            </Label>
          ) : (
            <Label
              htmlFor={fields.nominal.id}
              className="bg-green-50 h-16 w-16 mb-2 flex justify-center items-center rounded-full border border-green-400"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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
            </Label>
          )}
          <Label htmlFor={fields.nominal.id} className="text-base font-bold">
            {name}
          </Label>
          {notes && (
            <Label
              htmlFor={fields.nominal.id}
              className="text-sm font-normal truncate"
            >
              {notes}
            </Label>
          )}
          <InputNumber
            allowNegative={false}
            placeholder="Rp"
            maxLength={14}
            prefix="Rp"
            pattern="[0-9]*"
            inputMode="decimal"
            thousandSeparator="."
            decimalSeparator=","
            className="border-none bg-transparent text-center px-0 text-3xl font-bold"
            error={!!fields.nominal.errors}
            {...getInputProps(fields.nominal, {
              type: "text",
              ariaDescribedBy: fields.nominal.descriptionId,
            })}
            key={fields.nominal.key}
          />
          <Label
            htmlFor={fields.nominal.id}
            className="text-sm text-neutral-500 font-normal"
          >
            {sheetId?.split("-").join(" ")}
          </Label>
        </div>
        <div className="grid w-full items-center gap-1">
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
        <div className="grid w-full items-center gap-1">
          <Label htmlFor={fields.type.id}>Tipe Transaksi</Label>
          <Type type={type ?? ""} />
        </div>
        <div className="grid w-full items-center gap-1">
          <Label htmlFor={fields.notes.id}>Catatan</Label>
          <Textarea
            placeholder="Masukkan catatan terkait transaksi"
            rows={4}
            error={!!fields.notes.errors}
            {...getInputProps(fields.notes, {
              type: "text",
              ariaDescribedBy: fields.notes.descriptionId,
            })}
            key={fields.notes.key}
          />
        </div>
      </div>
    </FormProvider>
  );
}
function Type({ type }: { type: TTransaction["type"] }) {
  const [field] = useField("type");

  const [value, setValue] = React.useState(type);
  return (
    <div>
      <input
        {...getInputProps(field, {
          type: "hidden",
          ariaDescribedBy: field.descriptionId,
        })}
      />
      <ToggleGroup
        type="single"
        onValueChange={setValue}
        defaultValue={value}
        className="flex w-full items-center gap-2"
      >
        <ToggleGroupItem
          value="in"
          aria-label="Pemasukan"
          className="w-full h-14 data-[state=on]:border-green-500 data-[state=on]:text-green-600 data-[state=on]:bg-green-50"
        >
          <span>
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
          </span>
          <span>Pemasukan</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="out"
          aria-label="Pengeluaran"
          className="w-full h-14 data-[state=on]:border-danger-500 data-[state=on]:text-danger-400 data-[state=on]:bg-danger-50"
        >
          <span>
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
              <path d="M5 12h14"></path>
            </svg>
          </span>
          <span>Pengeluaran</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
