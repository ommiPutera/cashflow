import {
  ActionFunctionArgs,
  Link,
  MetaFunction,
  useActionData,
  useFetcher,
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
import { Label } from "~/components/ui/label";

import { createSheet } from "~/utils/sheet.server";

export const meta: MetaFunction = () => {
  const title = "Buat sheet baru";
  return [{ title }, { name: "", content: "" }];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title");

  if (typeof title === "string" && title) {
    const newSheet = await createSheet(title, "test");
    console.log("newSheet: ", newSheet);
  }

  console.log("title: ", title);
  return {};
};

const createSheetSchema = z.object({
  title: z
    .string({ required_error: "Judul sheet harus diisi" })
    .max(30, "Maksimal 30 karakter"),
});
const formId = "create-sheet";
export default function Create() {
  const fetcher = useFetcher();
  const actionData = useActionData<typeof action>();
  const [form] = useForm({
    id: formId,
    lastResult: actionData,
    constraint: getZodConstraint(createSheetSchema),
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: createSheetSchema }),
    shouldValidate: "onInput",
  });

  return (
    <FormProvider context={form.context}>
      <ShellPage noNavigation>
        <div className="w-full h-12">
          <Link
            to="/sheets"
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
          <Section className="bg-white border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0 rounded-xl 2xl:rounded-2xl">
            <div className="h-2 bg-primary-500 w-full"></div>
            <div className="px-4 py-5 lg:py-6 lg:px-6 flex justify-between items-center">
              <h2 className="text-sm font-bold">Buat Sheet: Baru</h2>
            </div>
          </Section>
          <fetcher.Form
            action="."
            method="post"
            className="flex relative flex-col gap-3 h-full pb-32"
            {...getFormProps(form)}
          >
            <FormCreateTransaction />
            <Button
              variant="primary"
              type="submit"
              size="sm"
              className="border-2 font-bold w-fit px-8 border-primary-500 text-white"
            >
              Buat
            </Button>
          </fetcher.Form>
        </div>
      </ShellPage>
    </FormProvider>
  );
}

function FormCreateTransaction() {
  const [titleField] = useField("title");

  return (
    <div className="flex flex-col gap-2 h-full">
      <Section className="bg-white border border-neutral-200 dark:border-neutral-800 rounded-xl 2xl:rounded-2xl">
        <div className="grid w-full items-center gap-2 py-4">
          <Label htmlFor={titleField.id} className="font-semibold">
            Judul
          </Label>
          <Input
            placeholder="Masukkan judul sheet"
            error={!!titleField.errors}
            {...getInputProps(titleField, {
              type: "text",
              ariaDescribedBy: titleField.descriptionId,
            })}
            key={titleField.key}
          />
        </div>
      </Section>
    </div>
  );
}
