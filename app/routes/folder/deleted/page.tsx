import { User } from "@prisma/client";

import {
  useLoaderData,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "react-router";

import { format } from "date-fns";
import { id } from "date-fns/locale";

import Navigation from "~/components/navigation";
import ShellPage, { Divide, Section } from "~/components/shell-page";
import { Button } from "~/components/ui/button";

import { getDeletedSheets } from "~/utils/sheet.server";

import { getSession } from "~/lib/session.server";

export const meta: MetaFunction = () => {
  return [{ title: "Baru Dihapus" }, { name: "", content: "" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user: User = session.get("user");

  const deletedSheets = await getDeletedSheets(user.id);
  return { deletedSheets };
}

export default function Index() {
  const { deletedSheets } = useLoaderData<typeof loader>();
  return (
    <ShellPage>
      <Navigation />
      <div className="flex flex-col gap-3 my-6 lg:my-12 mx-auto">
        <Section className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0 rounded-xl 2xl:rounded-2xl">
          <div className="px-4 py-3 lg:py-4 lg:px-6 bg-neutral-50 border-b lg:border-none lg:bg-white">
            <h2 className="text-sm font-bold">Baru Dihapus</h2>
          </div>
          <Divide>
            {deletedSheets.map((sheet) => {
              const date = format(new Date(sheet.createdAt), "MM/dd/yyyy", {
                locale: id,
              });
              return (
                <Button
                  key={sheet.id}
                  variant="transparent"
                  className="px-4 lg:px-6 active:scale-[0.99] [&_svg]:size-5 active:bg-transparent h-14 lg:h-16 flex w-full items-center hover:bg-primary-50 cursor-pointer rounded-none border-x-0"
                >
                  <div className="inline-flex gap-3 items-center w-full">
                    <span className="text-sm font-medium text-wrap">
                      {sheet.title}
                    </span>
                  </div>
                  <span className="text-sm font-normal text-neutral-500 text-wrap">
                    {date}
                  </span>
                </Button>
              );
            })}
          </Divide>
        </Section>
      </div>
    </ShellPage>
  );
}
