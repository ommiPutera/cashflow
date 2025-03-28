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
} from "react-router";
import { dataWithError, redirectWithSuccess } from "remix-toast";
import { z } from "zod";

import { ErrorMessage } from "~/components/errors";
import Navigation from "~/components/navigation";
import ShellPage, { Section } from "~/components/shell-page";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { getSession } from "~/lib/session.server";

import { createSheet } from "~/utils/sheet.server";

export const meta: MetaFunction = () => {
  const title = "Buat sheet baru";
  return [{ title }, { name: "", content: "" }];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: createSheetSchema });
  if (submission.status !== "success") return submission.reply();
  const title = submission.payload.title;

  const session = await getSession(request.headers.get("Cookie"));
  const user: User = session.get("user");

  let titleId = "";
  if (typeof title === "string" && title) {
    const newSheet = await createSheet(title, user.id);
    if (newSheet.message !== "ok") {
      return dataWithError(submission.reply(), newSheet.message);
    }
    titleId = newSheet.data?.titleId || "";
  }
  return redirectWithSuccess(`/sheets/${titleId}`, "Berhasil");
};

const createSheetSchema = z.object({
  title: z
    .string({ required_error: "Judul sheet harus diisi" })
    .max(30, "Maksimal 30 karakter"),
});
const formId = "create-sheet";
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

  return (
    <FormProvider context={form.context}>
      <ShellPage>
        <Navigation />
        <div className="w-full h-12">
          <Link
            to="/sheets"
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
        <div className="flex flex-col gap-2 lg:mb-0 max-w-[var(--shell-page-width)] mx-auto">
          <Section className="bg-white border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0 rounded-xl 2xl:rounded-2xl overflow-hidden">
            <div className="h-1 bg-primary-500 w-full"></div>
            <div className="px-4 py-5 lg:py-6 lg:px-6 flex justify-between items-center">
              <h2 className="text-lg font-bold koh-santepheap-bold">
                Buat Lembar Baru
              </h2>
            </div>
          </Section>
          <Form
            action="."
            method="post"
            className="flex relative flex-col gap-3 h-full pb-32"
            {...getFormProps(form)}
          >
            <FormCreateTransaction />
            <Button variant="outlined-primary" type="submit">
              Simpan
            </Button>
          </Form>
        </div>
      </ShellPage>
    </FormProvider>
  );
}

function FormCreateTransaction() {
  const [meta] = useField("title");

  return (
    <div className="flex flex-col gap-2 h-full">
      <Section className="bg-white border border-neutral-200 dark:border-neutral-800 rounded-xl 2xl:rounded-2xl">
        <div className="grid w-full items-center gap-4 py-4">
          <Label htmlFor={meta.id} className="font-semibold">
            Judul
          </Label>
          <Input
            placeholder="Masukkan judul sheet"
            error={!!meta.errors}
            {...getInputProps(meta, {
              type: "text",
              ariaDescribedBy: meta.descriptionId,
            })}
            key={meta.key}
          />
          {meta.errors && <ErrorMessage>{meta.errors}</ErrorMessage>}
        </div>
      </Section>
    </div>
  );
}
