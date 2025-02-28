import { type Sheet, type User } from "@prisma/client";

import { format } from "date-fns";
import { id as locale } from "date-fns/locale";
import React from "react";
import {
  ActionFunctionArgs,
  Link,
  redirect,
  useFetcher,
  useLoaderData,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "react-router";

import Navigation from "~/components/navigation";
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

import { useMediaQuery } from "~/hooks/use-media-query";

import {
  deletePermanentlySheet,
  getDeletedSheets,
  recoverSheet,
} from "~/utils/sheet.server";

import { getSession } from "~/lib/session.server";

export const meta: MetaFunction = () => {
  return [{ title: "Baru Dihapus" }, { name: "", content: "" }];
};

enum ActionType {
  DELETE_PERMANENTLY = "DELETE_PERMANENTLY",
  RECOVER = "RECOVER",
}
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const id = formData.get("id");
  const actionType = formData.get("actionType") as
    | keyof typeof ActionType
    | null;

  const session = await getSession(request.headers.get("Cookie"));
  const user: User = session.get("user");
  if (typeof id !== "string" || !user || !actionType) return {};

  if (actionType === "RECOVER") {
    await recoverSheet(id, user.id);
    return redirect("/folder/deleted");
  }
  if (actionType === "DELETE_PERMANENTLY") {
    await deletePermanentlySheet(id, user.id);
    return redirect("/folder/deleted");
  }
  return {};
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user: User = session.get("user");

  const deletedSheets = await getDeletedSheets(user.id);
  return { deletedSheets, bool: { hasDeleteSheets: deletedSheets.length > 0 } };
}

export default function Index() {
  const {
    deletedSheets,
    bool: { hasDeleteSheets },
  } = useLoaderData<typeof loader>();

  const fetcher = useFetcher({ key: "sheet-action" });
  const isSubmitting = fetcher.state !== "idle" || fetcher.formData != null;

  return (
    <ShellPage>
      <Navigation />
      <Link
        to="/folder"
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
      <div className="flex flex-col gap-3  mx-auto">
        <Section
          loading={isSubmitting}
          className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0 rounded-xl 2xl:rounded-2xl"
        >
          <div className="px-4 py-3 lg:py-4 lg:px-6 bg-neutral-50 border-b lg:border-none lg:bg-white">
            <h2 className="text-sm font-medium lg:font-bold">Baru Dihapus</h2>
          </div>
          <Divide>
            {hasDeleteSheets ? (
              deletedSheets.map((sheet) => {
                return <SheetItem key={sheet.id} {...sheet} />;
              })
            ) : (
              <EmptyTransaction />
            )}
          </Divide>
        </Section>
      </div>
    </ShellPage>
  );
}
function EmptyTransaction() {
  return (
    <div className="w-full h-16 flex justify-center items-center">
      <span className="text-sm font-medium text-neutral-400">Kosong..</span>
    </div>
  );
}

function SheetItem({ id, title, createdAt }: Sheet) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const fetcher = useFetcher({ key: "sheet-action" });
  const isSubmitting = fetcher.state !== "idle" || fetcher.formData != null;

  const date = format(new Date(createdAt), "MM/dd/yyyy", {
    locale,
  });

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="transparent"
            className="px-4 lg:px-6 active:scale-[0.99] [&_svg]:size-5 active:bg-transparent h-14 lg:h-16 flex w-full items-center hover:bg-primary-50 cursor-pointer rounded-none border-x-0"
          >
            <div className="inline-flex gap-3 items-center w-full">
              <span className="text-sm font-medium text-wrap">{title}</span>
            </div>
            <span className="text-sm font-normal text-neutral-500 text-wrap">
              {date}
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Pulihkan</DialogTitle>
            <DialogDescription>
              Apakah Anda ingin lembaran <b>{title}</b> dipulihkan?
            </DialogDescription>
          </DialogHeader>
          <ProfileForm />
          <DialogFooter>
            <fetcher.Form action="." method="post">
              <Button
                type="submit"
                variant="outlined-danger"
                disabled={isSubmitting}
                className="w-full"
              >
                Hapus Selamanya
              </Button>
              <input type="hidden" name="id" value={id} />
              <input
                type="hidden"
                name="actionType"
                value={ActionType.DELETE_PERMANENTLY}
              />
            </fetcher.Form>
            <fetcher.Form action="." method="post">
              <DrawerClose asChild>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  className="w-full"
                >
                  Ya, Pulihkan
                </Button>
              </DrawerClose>
              <input type="hidden" name="id" value={id} />
              <input
                type="hidden"
                name="actionType"
                value={ActionType.RECOVER}
              />
            </fetcher.Form>
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
          className="px-4 lg:px-6 active:scale-[0.99] [&_svg]:size-5 active:bg-transparent h-14 lg:h-16 flex w-full items-center hover:bg-primary-50 cursor-pointer rounded-none border-x-0"
        >
          <div className="inline-flex gap-3 items-center w-full">
            <span className="text-sm font-medium text-wrap">{title}</span>
          </div>
          <span className="text-sm font-normal text-neutral-500 text-wrap">
            {date}
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Pulihkan</DrawerTitle>
          <DrawerDescription>
            Apakah Anda ingin lembaran <b>{title}</b> dipulihkan?
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm />
        <DrawerFooter className="pt-2">
          <fetcher.Form action="." method="post">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              loading={isSubmitting}
              className="w-full"
            >
              Ya, Pulihkan
            </Button>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="actionType" value={ActionType.RECOVER} />
          </fetcher.Form>
          <DrawerClose asChild>
            <Button variant="outlined-primary">Batal</Button>
          </DrawerClose>
          <div className="my-4 border-b"></div>
          <fetcher.Form action="." method="post">
            <Button
              type="submit"
              variant="outlined-danger"
              disabled={isSubmitting}
              className="w-full"
            >
              Hapus Selamanya
            </Button>
            <input type="hidden" name="id" value={id} />
            <input
              type="hidden"
              name="actionType"
              value={ActionType.DELETE_PERMANENTLY}
            />
          </fetcher.Form>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm() {
  return <form></form>;
}
