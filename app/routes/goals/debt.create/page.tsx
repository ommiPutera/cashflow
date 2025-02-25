import {
  FormProvider,
  getFormProps,
  getInputProps,
  useField,
  useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { User } from "@prisma/client";

import {
  ActionFunctionArgs,
  Form,
  Link,
  MetaFunction,
  useActionData,
  useSearchParams,
} from "react-router";
import { dataWithError, redirectWithSuccess } from "remix-toast";
import { z } from "zod";

import { ErrorMessage } from "~/components/errors";
import Navigation from "~/components/navigation";
import ShellPage, { Section } from "~/components/shell-page";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { InputNumber } from "~/components/ui/input-number";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

import { getSession } from "~/lib/session.server";

import { createFinancialGoal } from "~/utils/financialGoal.server";

export const meta: MetaFunction = () => {
  const title = "Buat Hutang baru";
  return [{ title }, { name: "", content: "" }];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: createSheetSchema });
  if (submission.status !== "success") return submission.reply();
  const title = submission.payload.title;
  const targetAmount = submission.payload.targetAmount;
  const description = submission.payload.description || "";

  const session = await getSession(request.headers.get("Cookie"));
  const user: User = session.get("user");

  if (
    typeof title === "string" &&
    title &&
    typeof targetAmount === "string" &&
    typeof description === "string"
  ) {
    const targetAmountValue = targetAmount?.split("Rp")[1].split(".").join("");
    const newGoal = await createFinancialGoal({
      title,
      targetAmount: parseInt(targetAmountValue),
      userId: user.id,
      description,
      type: "debt",
    });
    if (newGoal.message !== "ok") {
      return dataWithError(submission.reply(), newGoal.message);
    }
  }
  return redirectWithSuccess("/goals", "Berhasil");
};

const createSheetSchema = z.object({
  title: z
    .string({ required_error: "Judul hutang harus diisi" })
    .max(30, "Maksimal 30 karakter"),
  targetAmount: z.string({ required_error: "Nominal awal hutang harus diisi" }),
  description: z.string().max(72, "Maksimal 72 karakter").optional(),
});
const formId = "create-debt-goals";
export default function Create() {
  const actionData = useActionData<typeof action>();
  const [form] = useForm({
    id: formId,
    lastResult: actionData,
    constraint: getZodConstraint(createSheetSchema),
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: createSheetSchema }),
    shouldValidate: "onInput",
    shouldRevalidate: "onInput",
  });

  const [searchParams] = useSearchParams();
  const backUrl = decodeURI(searchParams.get("back-url") || "");

  return (
    <FormProvider context={form.context}>
      <ShellPage>
        <Navigation />
        <div className="w-full h-12">
          <Link
            to={backUrl || "/goals"}
            prefetch="render"
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
              <h2 className="text-lg font-bold koh-santepheap-bold">
                Buat Hutang Baru
              </h2>
            </div>
          </Section>
          <Form
            action="."
            method="post"
            className="flex relative flex-col gap-3 h-full pb-32"
            {...getFormProps(form)}
          >
            <FormCreateFinancialGoal />
            <Button variant="outlined-primary" type="submit">
              Simpan
            </Button>
          </Form>
        </div>
      </ShellPage>
    </FormProvider>
  );
}

function FormCreateFinancialGoal() {
  const [titleMeta] = useField("title");
  const [targetAmountMeta] = useField("targetAmount");
  const [descriptionMeta] = useField("description");

  return (
    <div className="flex flex-col gap-2 h-full">
      <Section className="bg-white border border-neutral-200 dark:border-neutral-800 rounded-xl 2xl:rounded-2xl">
        <div className="grid w-full items-center gap-4 py-4">
          <Label htmlFor={titleMeta.id} className="font-semibold" required>
            Judul Hutang
          </Label>
          <Input
            placeholder="Masukkan judul sheet"
            error={!!titleMeta.errors}
            {...getInputProps(titleMeta, {
              type: "text",
              ariaDescribedBy: titleMeta.descriptionId,
            })}
            key={titleMeta.key}
          />
          {titleMeta.errors && <ErrorMessage>{titleMeta.errors}</ErrorMessage>}
        </div>
      </Section>
      <Section className="bg-white border border-neutral-200 dark:border-neutral-800 rounded-xl 2xl:rounded-2xl">
        <div className="grid w-full items-start gap-2 py-4">
          <Label
            htmlFor={targetAmountMeta.id}
            className="font-semibold"
            required
          >
            Nominal Awal Hutang
          </Label>
          <InputNumber
            placeholder="Rp0"
            className="border-none bg-transparent px-0 text-3xl font-bold"
            error={!!targetAmountMeta.errors}
            {...getInputProps(targetAmountMeta, {
              type: "text",
              ariaDescribedBy: targetAmountMeta.descriptionId,
            })}
            prefix="Rp"
            pattern="[0-9]*"
            inputMode="decimal"
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={false}
            maxLength={14}
            key={targetAmountMeta.key}
          />
          {targetAmountMeta.errors && (
            <ErrorMessage>{targetAmountMeta.errors}</ErrorMessage>
          )}
        </div>
      </Section>
      <Section className="bg-white border border-neutral-200 dark:border-neutral-800 rounded-xl 2xl:rounded-2xl">
        <div className="grid w-full items-center gap-4 py-4">
          <Label htmlFor={descriptionMeta.id} className="font-semibold">
            Deskripsi
          </Label>
          <Textarea
            placeholder="Masukkan deskripsi hutang"
            rows={4}
            maxLength={72}
            error={!!descriptionMeta.errors}
            {...getInputProps(descriptionMeta, {
              type: "text",
              ariaDescribedBy: descriptionMeta.descriptionId,
            })}
            key={descriptionMeta.key}
          />
        </div>
      </Section>
    </div>
  );
}
