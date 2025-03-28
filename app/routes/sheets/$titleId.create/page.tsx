import {
  ActionFunctionArgs,
  Link,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
  useActionData,
  useFetcher,
  useLoaderData,
  useLocation,
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

import { ErrorMessage } from "~/components/errors";
import Navigation from "~/components/navigation";
import ShellPage, { Section } from "~/components/shell-page";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { InputNumber } from "~/components/ui/input-number";
import { Label, labelVariants } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Textarea } from "~/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";

import { cn } from "~/lib/utils";

import { createTransaction } from "~/utils/transaction.server";
import { getSheet } from "~/utils/sheet.server";
import { getSession } from "~/lib/session.server";
import { User } from "@prisma/client";
import { getFinancialGoals } from "~/utils/financialGoal.server";
import React from "react";

export const meta: MetaFunction = ({ params }) => {
  const title = `Buat Transaksi | ${params.titleId?.split("-").join(" ")}`;
  return [{ title }, { name: "", content: "" }];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: createTransactionchema });

  const { titleId, id, name, type, expenseClassification, nominal, notes } =
    submission.payload;

  if (
    typeof titleId === "string" &&
    typeof id === "string" &&
    typeof name === "string" &&
    typeof notes === "string" &&
    typeof expenseClassification === "string" &&
    typeof nominal === "string" &&
    (type === "in" || type === "out")
  ) {
    const nominalValue = nominal?.split("Rp")[1].split(".").join("");
    const newTransaction = await createTransaction({
      sheetId: id,
      name,
      type,
      nominal: parseInt(nominalValue),
      expenseClassification,
      notes,
    });
    if (newTransaction) return redirect(`/sheets/${titleId}`);
  }

  return {};
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const user: User = session.get("user");

  const sheet = await getSheet(params.titleId || "", user.id);
  const financialGoals = await getFinancialGoals(user.id || "");
  return {
    ...sheet,
    financialGoals,
  };
};

const createTransactionchema = z
  .object({
    name: z
      .string({ required_error: "Nama transaksi harus diisi" })
      .max(30, "Maksimal 30 karakter"),
    nominal: z
      .string({ required_error: "Nominal transaksi harus diisi" })
      .max(30, "Maksimal 30 karakter"),
    notes: z.string().max(72, "Maksimal 72 karakter").optional(),
    financialGoalId: z.string().optional(),
    type: z.enum(["in", "out"], {
      errorMap: () => ({ message: "Tipe transaksi harus diisi" }),
    }),
  })
  .and(
    z.discriminatedUnion("type", [
      z.object({
        type: z.literal("in"),
        expenseClassification: z
          .enum(["fixed", "variable", "occasional"])
          .optional(),
      }),
      z.object({
        type: z.literal("out"),
        expenseClassification: z.enum(["fixed", "variable", "occasional"], {
          errorMap: () => ({ message: "Pertanyaan harus dijawab" }),
        }),
      }),
    ]),
  );
const formId = "create-transaction";
export default function Create() {
  const { titleId } = useLoaderData<typeof loader>();
  const title = titleId?.replace(/-/g, " ");

  const fetcher = useFetcher();
  const actionData = useActionData<typeof action>();
  const [form] = useForm({
    id: formId,
    lastResult: actionData,
    constraint: getZodConstraint(createTransactionchema),
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: createTransactionchema }),
    shouldValidate: "onInput",
    shouldRevalidate: "onInput",
  });

  return (
    <FormProvider context={form.context}>
      <ShellPage>
        <Navigation />
        <div className="w-full h-12">
          <Link
            to={`/sheets/${titleId}`}
            prefetch="render"
            className="p-0 h-fit  font-normal inline-flex items-center tap-highlight-transparent"
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
        <div className="lg:max-w-[1150px]">
          <div className="flex flex-col gap-4 mx-auto xl:mx-0 max-w-[var(--shell-page-width)]">
            <Section className="bg-white border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0 rounded-xl 2xl:rounded-2xl overflow-hidden">
              <div className="h-1 bg-primary-500 w-full"></div>
              <div className="px-4 py-5 lg:py-6 lg:px-6 flex justify-between items-center">
                <h2 className="text-lg font-bold koh-santepheap-bold">
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
        </div>
      </ShellPage>
    </FormProvider>
  );
}

function FormCreateTransaction() {
  const { id, titleId } = useLoaderData<typeof loader>();

  const [nominalMeta] = useField("nominal");
  const [nameMeta] = useField("name");
  const [notesMeta] = useField("notes");
  const [typeMeta] = useField("type");
  const [financialGoalIdMeta] = useField("financialGoalId");

  return (
    <div className="flex flex-col gap-2 h-full">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="titleId" value={titleId} />
      <Section className="bg-white border border-neutral-200 dark:border-neutral-800 rounded-xl 2xl:rounded-2xl">
        <div className="grid w-full items-center gap-4 py-4">
          <Label htmlFor={nameMeta.id} className="font-semibold" required>
            Nama Transaksi
          </Label>
          <Input
            placeholder="Masukkan nama transaksi"
            error={!!nameMeta.errors}
            {...getInputProps(nameMeta, {
              type: "text",
              ariaDescribedBy: nameMeta.descriptionId,
            })}
            key={nameMeta.key}
          />
          {nameMeta.errors && <ErrorMessage>{nameMeta.errors}</ErrorMessage>}
        </div>
      </Section>
      <Section className="bg-white border border-neutral-200 dark:border-neutral-800 rounded-xl 2xl:rounded-2xl">
        <div className="grid w-full items-start gap-2 py-4">
          <Label htmlFor={nominalMeta.id} className="font-semibold" required>
            Nominal
          </Label>
          <InputNumber
            placeholder="Rp0"
            className="border-none bg-transparent px-0 text-3xl font-bold"
            error={!!nominalMeta.errors}
            {...getInputProps(nominalMeta, {
              type: "text",
              ariaDescribedBy: nominalMeta.descriptionId,
            })}
            prefix="Rp"
            pattern="[0-9]*"
            inputMode="decimal"
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={false}
            maxLength={14}
            key={nominalMeta.key}
          />
          {nominalMeta.errors && (
            <ErrorMessage>{nominalMeta.errors}</ErrorMessage>
          )}
        </div>
      </Section>
      <Section className="bg-white border border-neutral-200 dark:border-neutral-800 rounded-xl 2xl:rounded-2xl">
        <div className="grid w-full items-center gap-4 py-4">
          <Label htmlFor={typeMeta.id} className="font-semibold" required>
            Tipe Transaksi
          </Label>
          <Type />
          {typeMeta.errors && <ErrorMessage>{typeMeta.errors}</ErrorMessage>}
        </div>
      </Section>
      <ExpenseClassification />
      <Section className="bg-white border border-neutral-200 dark:border-neutral-800 rounded-xl 2xl:rounded-2xl">
        <div className="grid w-full items-center gap-4 py-4">
          <Label htmlFor={notesMeta.id} className="font-semibold">
            Catatan
          </Label>
          <Textarea
            placeholder="Masukkan catatan terkait transaksi"
            rows={4}
            maxLength={72}
            error={!!notesMeta.errors}
            {...getInputProps(notesMeta, {
              type: "text",
              ariaDescribedBy: notesMeta.descriptionId,
            })}
            key={notesMeta.key}
          />
          {notesMeta.errors && <ErrorMessage>{notesMeta.errors}</ErrorMessage>}
        </div>
      </Section>
      <Section className="bg-white border border-neutral-200 dark:border-neutral-800 rounded-xl 2xl:rounded-2xl">
        <div className="grid w-full items-center gap-4 py-4">
          <Label htmlFor={financialGoalIdMeta.id} className="font-semibold">
            Tujuan Transaksi
          </Label>
          <FinancialGoal />
          {financialGoalIdMeta.errors && (
            <ErrorMessage>{financialGoalIdMeta.errors}</ErrorMessage>
          )}
        </div>
      </Section>
    </div>
  );
}

export function ExpenseClassification() {
  const [meta, form] = useField("expenseClassification");
  const [typeMeta] = useField("type");

  const isValid = typeMeta.value !== "out";

  React.useEffect(() => {
    if (isValid) {
      form.update({ name: meta.name, value: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeMeta.value])

  return (
    <Section className="bg-white border border-neutral-200 dark:border-neutral-800 rounded-xl 2xl:rounded-2xl relative">
      <div className="grid w-full items-center gap-4 py-4">
        <input
          type="hidden"
          name={meta.name}
          value={String(meta.value || "")}
        />
        <Label className="font-semibold">
          Apakah nominal pengeluaran ini biasanya sama setiap bulan?
        </Label>
        <RadioGroup
          onValueChange={(value) => {
            if (value) {
              form.update({ name: meta.name, value });
            }
          }}
          value={meta.value as string}
          disabled={isValid}
        >
          <div className="flex items-center space-x-4">
            <RadioGroupItem value="fixed" id="fixed" />
            <label className={labelVariants()} htmlFor="fixed">
              Ya, selalu sama
            </label>
          </div>
          <div className="flex items-center space-x-4">
            <RadioGroupItem value="variable" id="variable" />
            <label className={labelVariants()} htmlFor="variable">
              Ya, sering tapi nominalnya berubah
            </label>
          </div>
          <div className="flex items-center space-x-4">
            <RadioGroupItem value="occasional" id="occasional" />
            <label className={labelVariants()} htmlFor="occasional">
              Tidak, hanya sekali atau ini hanya terjadi karena keadaan mendesak{" "}
            </label>
          </div>
        </RadioGroup>
        {meta.errors && <ErrorMessage>{meta.errors}</ErrorMessage>}
      </div>
      {isValid && (
        <div className="bg-red-100/50 absolute top-0 w-full h-full left-0"></div>
      )}
    </Section>
  );
}

function Type() {
  const [meta, form] = useField("type");
  return (
    <div>
      <input type="hidden" name={meta.name} value={String(meta.value || "")} />
      <ToggleGroup
        type="single"
        onValueChange={(value) => {
          if (value) {
            form.update({ name: meta.name, value });
          }
        }}
        className="flex w-full items-center gap-4"
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

function FinancialGoal() {
  const { financialGoals } = useLoaderData<typeof loader>();

  const [financialGoalIdMeta, form] = useField("financialGoalId");
  const [typeMeta] = useField("type");

  const location = useLocation();
  return (
    <div>
      <input
        type="hidden"
        name={financialGoalIdMeta.name}
        value={String(financialGoalIdMeta.value || "")}
      />
      <ToggleGroup
        type="single"
        onValueChange={(value) => {
          form.update({ name: financialGoalIdMeta.name, value });
        }}
        defaultValue={String(financialGoalIdMeta.initialValue || "")}
        className="flex flex-col w-full items-center gap-4"
      >
        <div className="px-4 py-6 w-full border rounded-xl flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <Label className="font-semibold">Hutang</Label>
            <Link
              to={`/goals/debt/create?back-url=${encodeURI(location.pathname)}`}
              className="cursor-pointer"
            >
              <Label className="font-semibold underline text-primary-500">
                + Buat Hutang Baru
              </Label>
            </Link>
          </div>
          {financialGoals
            .filter((item) => item.type === "debt")
            .map((item) => (
              <ToggleGroupItem
                key={item.id}
                value={item.id}
                aria-label="Pemasukan"
                className={cn(
                  "w-full h-20",
                  item.type === "debt" &&
                  "data-[state=on]:border-warning-500 data-[state=on]:text-warning-600 data-[state=on]:bg-warning-50",
                )}
              >
                <span>
                  {typeMeta.value === "out" ? "Bayar: " : "Tambah: "}
                  <b>{item.title}</b>
                </span>
              </ToggleGroupItem>
            ))}
        </div>
      </ToggleGroup>
    </div>
  );
}
