import { type Sheet, type User } from "@prisma/client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import React from "react";
import {
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
              return <SheetItem key={sheet.id} {...sheet} />;
            })}
          </Divide>
        </Section>
      </div>
    </ShellPage>
  );
}

function SheetItem({ title, createdAt }: Sheet) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const date = format(new Date(createdAt), "MM/dd/yyyy", {
    locale: id,
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
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when youre done.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm />
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
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when youre done.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outlined-primary">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm() {
  return <form>asd</form>;
}
