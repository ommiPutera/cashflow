import React from "react";
import {
  ActionFunctionArgs,
  Link,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
  useActionData,
  useFetcher,
  useLoaderData,
  useSearchParams,
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
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { InputNumber } from "~/components/ui/input-number";
import { Label, labelVariants } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import Navigation from "~/components/navigation";

import { cn } from "~/lib/utils";

import {
  deleteTransaction,
  getTransactionById,
  updateTransaction,
} from "~/utils/transaction.server";
import { getSheetById } from "~/utils/sheet.server";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { ErrorMessage } from "~/components/errors";
import { getSession } from "~/lib/session.server";
import { User } from "@prisma/client";
import { getFinancialGoals } from "~/utils/financialGoal.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = data?.name;
  return [{ title }, { name: "", content: "" }];
};

enum ActionType {
  DELETE = "DELETE",
  UPDATE = "UPDATE",
}
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: editTransactionSchema });

  const {
    titleId,
    sheetId,
    name,
    type,
    expenseClassification,
    nominal,
    notes,
    balanceSheet,
    financialGoalId,
  } = submission.payload;
  const transactionId = params.id || "";

  const actionType = submission.payload.actionType as
    | keyof typeof ActionType
    | null;
  if (actionType === ActionType.DELETE) {
    const transansation = await deleteTransaction(transactionId);
    if (transansation) return redirect(`/sheets/${titleId}`);
  }

  if (
    actionType === ActionType.UPDATE &&
    typeof titleId === "string" &&
    typeof financialGoalId === "string" &&
    typeof sheetId === "string" &&
    typeof name === "string" &&
    typeof notes === "string" &&
    typeof expenseClassification === "string" &&
    typeof balanceSheet === "string" &&
    typeof nominal === "string" &&
    (type === "in" || type === "out")
  ) {
    const nominalValue = nominal?.split("Rp")[1].split(".").join("");
    const newTransaction = await updateTransaction({
      id: transactionId,
      sheetId,
      name,
      type,
      nominal: parseInt(nominalValue),
      expenseClassification: type === "out" ? expenseClassification : "",
      assets: balanceSheet === "assets",
      liabilities: balanceSheet === "liabilities",
      notes,
      financialGoalId,
    });
    if (newTransaction) return redirect(`/sheets/${titleId}`);
  }

  return {};
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const user: User = session.get("user");

  const transaction = await getTransactionById(params.id || "");
  const sheet = await getSheetById(transaction?.sheetId || "");
  const financialGoals = await getFinancialGoals(user.id || "");
  return {
    ...transaction,
    ...sheet,
    financialGoals,
  };
};

const editTransactionSchema = z
  .object({
    name: z
      .string({ required_error: "Nama transaksi harus diisi" })
      .max(30, "Maksimal 30 karakter"),
    nominal: z
      .string({ required_error: "Nominal transaksi harus diisi" })
      .max(30, "Maksimal 30 karakter"),
    notes: z.string().max(72, "Maksimal 72 karakter").optional(),
    balanceSheet: z.string({ required_error: "Pertanyaan harus dijawab" }),
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
const formId = "edit-transaction";
export default function Edit() {
  const {
    name,
    nominal,
    notes,
    type,
    assets,
    expenseClassification,
    financialGoalId,
    titleId,
  } = useLoaderData<typeof loader>();

  const fetcher = useFetcher();
  const actionData = useActionData<typeof action>();
  const [form] = useForm({
    id: formId,
    lastResult: actionData,
    constraint: getZodConstraint(editTransactionSchema),
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: editTransactionSchema }),
    defaultValue: {
      name,
      nominal: nominal?.toString(),
      notes,
      type,
      expenseClassification,
      balanceSheet: assets ? "assets" : "liabilities",
      financialGoalId,
    },
    shouldValidate: "onInput",
  });

  const [searchParams] = useSearchParams();
  const backUrl = decodeURI(searchParams.get("back-url") || "");

  return (
    <FormProvider context={form.context}>
      <ShellPage>
        <Navigation />
        <div className="w-full h-12">
          <Link
            to={backUrl || `/sheets/${titleId}`}
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
        <div className="flex flex-col gap-1">
          <fetcher.Form
            action="."
            method="post"
            className="flex relative flex-col gap-4 h-full pb-32"
            {...getFormProps(form)}
          >
            <FormEditTransaction />
            <div className="fixed border-t border-neutral-200 left-0 lg:left-[var(--sidebar-width)] bg-background bottom-0 py-6 px-4 w-full lg:w-[calc(100%_-_var(--sidebar-width))] xl:w-[calc(100%_-_var(--sidebar-width)_-_var(--sidebar-width))]">
              <div className="max-w-[var(--shell-page-width)] lg:max-w-[520px] mx-auto w-full flex flex-col gap-2 justify-between">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!form.dirty}
                  className="w-full border-2 font-bold text-white border-primary-500 rounded-full"
                >
                  Ubah
                </Button>
                <DeleteTransaction />
              </div>
            </div>
          </fetcher.Form>
        </div>
      </ShellPage>
    </FormProvider>
  );
}

function FormEditTransaction() {
  const { name, titleId, sheetId } = useLoaderData<typeof loader>();
  const title = titleId?.replace(/-/g, " ");

  const [nameMeta] = useField("name");
  const [notesMeta] = useField("notes");
  const [typeMeta] = useField("type");
  const [financialGoalIdMeta] = useField("financialGoalId");

  return (
    <div className="flex flex-col gap-2 h-full mb-52 lg:mb-0">
      <input type="hidden" name="sheetId" value={sheetId} />
      <input type="hidden" name="titleId" value={titleId} />
      <input type="hidden" name="actionType" value={ActionType.UPDATE} />
      <Nominal />
      <div className="mx-auto w-full max-w-[240px]">
        <p className="text-center text-sm text-neutral-600 mb-4">
          *Anda dapat mengubah transaksi ini melalui formulir dibawah
        </p>
      </div>
      <div className="border-b border-neutral-400 border-dashed w-full mb-6"></div>
      <Section className="bg-white border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0 rounded-xl 2xl:rounded-2xl overflow-hidden">
        <div className="h-1 bg-primary-500 w-full"></div>
        <div className="px-4 py-5 lg:py-6 lg:px-6 flex flex-col gap-2">
          <h2 className="text-lg font-bold koh-santepheap-bold">
            Ubah Transaksi: <span className="underline">{name}</span>
          </h2>
          <p className="text-sm font-medium">
            Transaksi ini tercatat pada lembar <b>{title}</b>
          </p>
        </div>
      </Section>
      <Section className="bg-white border border-neutral-200 dark:border-neutral-800 rounded-xl 2xl:rounded-2xl">
        <div className="grid w-full items-center gap-2 py-4">
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
        </div>
      </Section>
      <Section className="bg-white border border-neutral-200 dark:border-neutral-800 rounded-xl 2xl:rounded-2xl">
        <div className="grid w-full items-center gap-2 py-4">
          <Label htmlFor={typeMeta.id} className="font-semibold" required>
            Tipe Transaksi
          </Label>
          <Type />
          {typeMeta.errors && <ErrorMessage>{typeMeta.errors}</ErrorMessage>}
        </div>
      </Section>
      <ExpenseClassification />
      <BalanceSheet />
      <Section className="bg-white border border-neutral-200 dark:border-neutral-800 rounded-xl 2xl:rounded-2xl">
        <div className="grid w-full items-center gap-2 py-4">
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
        </div>
      </Section>
      <Section className="bg-white border border-neutral-200 dark:border-neutral-800 rounded-xl 2xl:rounded-2xl">
        <div className="grid w-full items-center gap-2 py-4">
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
function Nominal() {
  const { name, notes, type, titleId } = useLoaderData<typeof loader>();
  const title = titleId?.replace(/-/g, " ");

  const [nominalMeta] = useField("nominal");
  return (
    <div className="flex flex-col w-full items-center justify-center min-h-[calc(100svh-22rem)] lg:min-h-[calc(100svh-35.5rem)] lg:my-32">
      {type === "out" ? (
        <Label
          htmlFor={nominalMeta.id}
          className="bg-danger-50 h-12 w-12 mb-4 flex justify-center items-center rounded-full border border-danger-200"
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
          htmlFor={nominalMeta.id}
          className="bg-green-50 h-12 w-12 mb-4 flex justify-center items-center rounded-full border border-green-400"
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
        htmlFor={nominalMeta.id}
        className="text-base font-semibold text-neutral-700"
      >
        {name}
      </Label>
      {notes && (
        <Label
          htmlFor={nominalMeta.id}
          className="text-xs font-normal truncate text-neutral-500"
        >
          {notes}
        </Label>
      )}
      <InputNumber
        placeholder="Rp"
        className="border-none bg-transparent text-center px-0 text-4xl font-extrabold"
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
      <Label
        htmlFor={nominalMeta.id}
        className="text-base mt-2 text-primary-600 font-semibold"
      >
        {title}
      </Label>
    </div>
  );
}

export function ExpenseClassification() {
  const [meta, form] = useField("expenseClassification");
  const [typeMeta] = useField("type");

  return (
    <Section
      className={cn(
        "hidden",
        typeMeta.value === "out" &&
          "block bg-white border border-neutral-200 dark:border-neutral-800 rounded-xl 2xl:rounded-2xl",
      )}
    >
      <div className="grid w-full items-center gap-4 py-4">
        <input
          type="hidden"
          name={meta.name}
          value={String(meta.value || "")}
        />
        <Label className="font-semibold" required>
          Apakah nominal pengeluaran ini biasanya sama setiap bulan?
        </Label>
        <RadioGroup
          onValueChange={(value) => {
            if (value) {
              form.update({ name: meta.name, value });
            }
          }}
          defaultValue={String(meta.initialValue)}
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
              Tidak, ini hanya terjadi karena keadaan mendesak{" "}
            </label>
          </div>
        </RadioGroup>
        {meta.errors && <ErrorMessage>{meta.errors}</ErrorMessage>}
      </div>
    </Section>
  );
}

function FinancialGoal() {
  const { financialGoals } = useLoaderData<typeof loader>();

  const [financialGoalIdMeta, form] = useField("financialGoalId");
  const [typeMeta] = useField("type");
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
          if (value) {
            form.update({ name: financialGoalIdMeta.name, value });
          }
        }}
        defaultValue={String(financialGoalIdMeta.initialValue || "")}
        className="flex w-full items-center gap-2"
      >
        {financialGoals.map((item) => (
          <ToggleGroupItem
            key={item.id}
            value={item.id}
            aria-label="Pemasukan"
            className={cn(
              "w-full h-14",
              item.type === "debt" &&
                "data-[state=on]:border-warning-500 data-[state=on]:text-warning-600 data-[state=on]:bg-warning-50",
              item.type === "saving" &&
                "data-[state=on]:border-success-500 data-[state=on]:text-success-600 data-[state=on]:bg-success-50",
              item.type === "investment" &&
                "data-[state=on]:border-primary-500 data-[state=on]:text-primary-600 data-[state=on]:bg-primary-50",
            )}
          >
            <span>
              {typeMeta.value === "out" ? "Bayar: " : "Tambah: "}
              <b>{item.title}</b>
            </span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
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
        defaultValue={String(meta.initialValue || "")}
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

function BalanceSheet() {
  const [meta, form] = useField("balanceSheet");
  return (
    <Section className="block bg-white border border-neutral-200 dark:border-neutral-800 rounded-xl 2xl:rounded-2xl">
      <div className="grid w-full items-center gap-4 py-4">
        <input
          type="hidden"
          name={meta.name}
          value={String(meta.value || "")}
        />
        <Label className="font-semibold" required>
          Apakah transaksi ini akan menambah nilai kekayaan Anda atau justru
          kewajiban yang harus Anda bayar?
        </Label>
        <RadioGroup
          onValueChange={(value) => {
            if (value) {
              form.update({ name: meta.name, value });
            }
          }}
          defaultValue={String(meta.initialValue)}
        >
          <div className="flex items-center space-x-4">
            <RadioGroupItem value="assets" id="assets" />
            <label className={labelVariants()} htmlFor="assets">
              Menambah nilai kekayaan (Aset)
            </label>
          </div>
          <div className="flex items-center space-x-4">
            <RadioGroupItem value="liabilities" id="liabilities" />
            <label className={labelVariants()} htmlFor="liabilities">
              Menambah kewajiban yang harus dibayar (Liabilitas)
            </label>
          </div>
        </RadioGroup>
        {meta.errors && <ErrorMessage>{meta.errors}</ErrorMessage>}
      </div>
    </Section>
  );
}

function DeleteTransaction() {
  const [isRequest, setIsRequest] = React.useState(false);

  const fetcher = useFetcher({ key: "transaction-delete" });
  const isSubmitting = fetcher.state !== "idle" || fetcher.formData != null;

  const { titleId } = useLoaderData<typeof loader>();
  return (
    <div>
      <Button
        variant="outlined-danger"
        type="button"
        onClick={() => setIsRequest(true)}
        className={cn(
          "w-full border-2 font-bold rounded-full",
          isRequest && "hidden",
        )}
      >
        Hapus Transaksi
      </Button>
      <div
        className={cn(
          "hidden border-2 border-danger-500 h-14 lg:h-12 justify-between rounded-full overflow-hidden",
          isRequest && "flex",
        )}
      >
        <fetcher.Form action="." method="post" className="w-full">
          <input type="hidden" name="actionType" value={ActionType.DELETE} />
          <input type="hidden" name="titleId" value={titleId} />
          <Button
            variant="outlined-danger"
            type="submit"
            size="sm"
            disabled={isSubmitting}
            onClick={() => setIsRequest(true)}
            className="border-none w-full rounded-none bg-danger-50 h-14 lg:h-11"
          >
            Ya, Hapus
          </Button>
        </fetcher.Form>
        <Button
          variant="transparent"
          type="button"
          size="sm"
          onClick={() => setIsRequest(false)}
          className="border-none w-full rounded-none h-14 lg:h-11"
        >
          Batal
        </Button>
      </div>
    </div>
  );
}
