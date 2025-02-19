import {
  ActionFunctionArgs,
  Link,
  LoaderFunctionArgs,
  MetaFunction,
  useActionData,
  useFetcher,
  useLoaderData,
} from "react-router";
import React from "react";
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
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { InputNumber } from "~/components/ui/input-number";
import Navigation from "~/components/navigation";

export const meta: MetaFunction = ({ params }) => {
  const title = `Buat Transaksi | ${params.sheetId?.split("-").join(" ")}`;
  return [{ title }, { name: "", content: "" }];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  console.log("formData: ", JSON.stringify(formData));
  return {};
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return {
    sheetId: params.sheetId,
  };
};

const createTransactionchema = z.object({
  name: z
    .string({ required_error: "Nama transaksi harus diisi" })
    .max(30, "Maksimal 30 karakter"),
  type: z
    .string({ required_error: "Tipe transaksi harus diisi" })
    .max(30, "Maksimal 30 karakter"),
  nominal: z
    .string({ required_error: "Nominal transaksi harus diisi" })
    .max(30, "Maksimal 30 karakter"),
  notes: z.string().max(30, "Maksimal 30 karakter").optional(),
});
const formId = "create-transaction";
export default function Create() {
  const { sheetId } = useLoaderData<typeof loader>();
  const title = sheetId?.replace(/-/g, " ");

  const fetcher = useFetcher();
  const actionData = useActionData<typeof action>();
  const [form] = useForm({
    id: formId,
    lastResult: actionData,
    constraint: getZodConstraint(createTransactionchema),
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: createTransactionchema }),
    shouldValidate: "onInput",
  });

  return (
    <FormProvider context={form.context}>
      <ShellPage>
        <Navigation />
        <div className="w-full h-12">
          <Link
            to={`/sheets/${sheetId}`}
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
        <div className="flex flex-col gap-2 mb-52 lg:mb-0">
          <Section className="bg-white border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0 rounded-xl 2xl:rounded-2xl overflow-hidden">
            <div className="h-1 bg-primary-500 w-full"></div>
            <div className="px-4 py-5 lg:py-6 lg:px-6 flex justify-between items-center">
              <h2 className="text-sm font-bold">
                Buat Transaksi di Lembar{" "}
                <span className="underline">{title}</span>
              </h2>
            </div>
          </Section>
          <fetcher.Form
            action="."
            method="post"
            className="flex relative flex-col gap-3 h-full pb-32"
            {...getFormProps(form)}
          >
            <FormCreateTransaction />
            <Button variant="outlined-primary" type="submit">
              Simpan
            </Button>
          </fetcher.Form>
        </div>
      </ShellPage>
    </FormProvider>
  );
}

function FormCreateTransaction() {
  const [nominalField] = useField("nominal");
  const [nameField] = useField("name");
  const [notesField] = useField("notes");
  const [typeField] = useField("type");

  return (
    <div className="flex flex-col gap-2 h-full">
      <Section className="bg-white border border-neutral-200 dark:border-neutral-800 rounded-xl 2xl:rounded-2xl">
        <div className="grid w-full items-center gap-2 py-4">
          <Label
            htmlFor={nominalField.id}
            className="font-semibold text-center"
          >
            Nominal
          </Label>
          <InputNumber
            placeholder="Rp0"
            className="border-none bg-transparent text-center px-0 text-3xl font-bold"
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
        </div>
      </Section>
      <Section className="bg-white border border-neutral-200 dark:border-neutral-800 rounded-xl 2xl:rounded-2xl">
        <div className="grid w-full items-center gap-2 py-4">
          <Label htmlFor={nameField.id} className="font-semibold">
            Nama Transaksi
          </Label>
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
      <Section className="bg-white border border-neutral-200 dark:border-neutral-800 rounded-xl 2xl:rounded-2xl">
        <div className="grid w-full items-center gap-2 py-4">
          <Label htmlFor={typeField.id} className="font-semibold">
            Tipe Transaksi
          </Label>
          <Type />
        </div>
      </Section>
      <Section className="bg-white border border-neutral-200 dark:border-neutral-800 rounded-xl 2xl:rounded-2xl">
        <div className="grid w-full items-center gap-2 py-4">
          <Label htmlFor={notesField.id} className="font-semibold">
            Catatan
          </Label>
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

function Type() {
  const [field] = useField("type");
  const [value, setValue] = React.useState("");
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
          className="w-full h-14 bg-white data-[state=on]:border-green-500 data-[state=on]:text-green-600 data-[state=on]:bg-green-50"
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
              className="text-green-500 w-4 h-4 lg:w-5 lg:h-5"
              viewBox="0 0 24 24"
            >
              <path d="M12 17V3M6 11l6 6 6-6M19 21H5"></path>
            </svg>
          </span>
          <span>Pemasukan</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="out"
          aria-label="Pengeluaran"
          className="w-full h-14 bg-white data-[state=on]:border-danger-500 data-[state=on]:text-danger-400 data-[state=on]:bg-danger-50"
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
              className="text-danger-500 w-4 h-4 lg:w-5 lg:h-5"
              viewBox="0 0 24 24"
            >
              <path d="M7 7h10v10M7 17 17 7"></path>
            </svg>
          </span>
          <span>Pengeluaran</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
