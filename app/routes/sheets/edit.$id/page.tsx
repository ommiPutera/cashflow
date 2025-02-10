import React from "react";
import {
  ActionFunctionArgs,
  Link,
  LoaderFunctionArgs,
  MetaFunction,
  useActionData,
  useFetcher,
  useLoaderData,
} from "react-router";
import { z } from "zod";

import {
  FormProvider,
  getFormProps,
  getInputProps,
  useField,
  useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";

import ShellPage, { Section } from "~/components/shell-page";
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
export default function Edit() {
  const fetcher = useFetcher();
  const { name, nominal, notes, sheetId } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [form] = useForm({
    id: formId,
    lastResult: actionData,
    constraint: getZodConstraint(createBankSchema),
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: createBankSchema }),
    defaultValue: {
      name,
      nominal: nominal?.toString(),
      notes,
    },
    shouldValidate: "onInput",
  });

  return (
    <FormProvider context={form.context}>
      <ShellPage
        noNavigation
        className="h-svh lg:h-full w-full overflow-scroll"
      >
        <div className="w-full h-12">
          <Link
            to={`/sheets/${sheetId}`}
            prefetch="viewport"
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
        <div className="flex flex-col gap-1">
          <fetcher.Form
            action="."
            method="post"
            className="flex relative flex-col gap-4 h-full pb-12"
            {...getFormProps(form)}
          >
            <div className="lg:mt-2">
              <FormEditTransaction />
            </div>
            <div className="lg:relative sticky -bottom-3 py-4 px-4 lg:p-0 lg:py-0 bg-background w-full flex gap-3 justify-between">
              <Button
                variant="outlined-primary"
                type="submit"
                disabled={!form.dirty}
                className="w-full lg:w-fit border-2 font-bold text-primary-500 border-primary-500"
              >
                Ubah
              </Button>
              <ButtonLink
                variant="transparent"
                type="button"
                to={`/sheets/${sheetId}`}
                className="hidden lg:flex lg:w-fit"
              >
                Batal
              </ButtonLink>
            </div>
          </fetcher.Form>
        </div>
      </ShellPage>
    </FormProvider>
  );
}

function FormEditTransaction() {
  const { name, notes, type, sheetId } = useLoaderData<typeof loader>();
  const [nominalField] = useField("nominal");
  const [notesField] = useField("notes");
  const [nameField] = useField("name");
  const [typeField] = useField("type");

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex flex-col w-full items-center justify-center h-[calc(100svh-16rem)] lg:h-full lg:my-32">
        {type === "out" ? (
          <Label
            htmlFor={nominalField.id}
            className="bg-danger-50 h-14 w-14 mb-2 flex justify-center items-center rounded-full border border-danger-200"
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
                className="text-danger-500"
                viewBox="0 0 24 24"
              >
                <path d="M7 7h10v10M7 17 17 7"></path>
              </svg>
            </span>
          </Label>
        ) : (
          <Label
            htmlFor={nominalField.id}
            className="bg-green-50 h-14 w-14 mb-2 flex justify-center items-center rounded-full border border-green-400"
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
                className="text-green-500"
                viewBox="0 0 24 24"
              >
                <path d="M12 17V3M6 11l6 6 6-6M19 21H5"></path>
              </svg>
            </span>
          </Label>
        )}
        <Label
          htmlFor={nominalField.id}
          className="text-base font-semibold text-neutral-700"
        >
          {name}
        </Label>
        {notes && (
          <Label
            htmlFor={nominalField.id}
            className="text-xs font-normal truncate text-neutral-500"
          >
            {notes}
          </Label>
        )}
        <InputNumber
          placeholder="Rp"
          className="border-none bg-transparent text-center px-0 text-4xl font-bold"
          error={!!nominalField.errors}
          {...getInputProps(nominalField, {
            type: "text",
            ariaDescribedBy: nominalField.descriptionId,
          })}
          prefix="Rp"
          pattern="[0-9]*"
          inputMode="decimal"
          thousandSeparator="."
          decimalSeparator=","
          allowNegative={false}
          maxLength={14}
          key={nominalField.key}
        />
        <Label
          htmlFor={nominalField.id}
          className="text-sm text-neutral-500 font-medium"
        >
          {sheetId?.split("-").join(" ")}
        </Label>
      </div>
      <div className="mx-auto w-full max-w-[240px]">
        <p className="text-center text-sm text-neutral-600 mb-4">
          *Anda dapat mengubah transaksi ini melalui formulir dibawah
        </p>
      </div>
      <div className="border-b border-neutral-400 border-dashed w-full mb-6"></div>
      <Section className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl 2xl:rounded-2xl">
        <div className="grid w-full items-center gap-2">
          <Label htmlFor={nameField.id}>Nama Transaksi</Label>
          <Input
            placeholder="Masukkan nama transaksi"
            error={!!nameField.errors}
            {...getInputProps(nameField, {
              type: "text",
              ariaDescribedBy: nameField.descriptionId,
            })}
            key={nameField.key}
          />
        </div>
      </Section>
      <Section className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl 2xl:rounded-2xl">
        <div className="grid w-full items-center gap-2">
          <Label htmlFor={typeField.id}>Tipe Transaksi</Label>
          <Type type={type ?? ""} />
        </div>
      </Section>
      <Section className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl 2xl:rounded-2xl">
        <div className="grid w-full items-center gap-2">
          <Label htmlFor={notesField.id}>Catatan</Label>
          <Textarea
            placeholder="Masukkan catatan terkait transaksi"
            rows={4}
            maxLength={32}
            error={!!notesField.errors}
            {...getInputProps(notesField, {
              type: "text",
              ariaDescribedBy: notesField.descriptionId,
            })}
            key={notesField.key}
          />
        </div>
      </Section>
    </div>
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
