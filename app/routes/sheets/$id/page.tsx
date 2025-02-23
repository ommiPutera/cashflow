import { type User } from "@prisma/client";
import {
  ActionFunctionArgs,
  Link,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
  useFetcher,
  useLoaderData,
} from "react-router";

import Navigation from "~/components/navigation";
import ShellPage, { Section } from "~/components/shell-page";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { deleteSheet, getSheet } from "~/utils/sheet.server";

import { getSession } from "~/lib/session.server";

import {
  getTotalInAndOut,
  getTransactionsBySheet,
} from "~/utils/transaction.server";
import SheetSum from "./sheet-sum";
import Transactions from "./transactions";

export const meta: MetaFunction = ({ params }) => {
  const title = params.id?.split("-").join(" ");
  return [{ title }, { name: "", content: "" }];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const id = formData.get("id");

  const session = await getSession(request.headers.get("Cookie"));
  const user: User = session.get("user");
  if (typeof id !== "string" || !user) return {};
  const sheet = await deleteSheet(id, user.id);
  if (sheet) return redirect("/sheets");

  return {};
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const isExpectationModeActive =
    url.searchParams.get("expectation-mode") === "1";

  const session = await getSession(request.headers.get("Cookie"));
  const user: User = session.get("user");
  const sheet = await getSheet(params.id || "", user.id);
  if (!sheet) return redirect("/sheets");

  const transactions = await getTransactionsBySheet(sheet.id);
  const sum = await getTotalInAndOut(sheet.id);
  const totalIn = sum.totalIn;
  const totalOut = sum.totalOut;

  const isPinned = true;

  return {
    transactions,
    flag: {
      isPinned,
    },
    bool: {
      isExpectationModeActive,
      hasTransactions: transactions.length > 0,
    },
    sheet,
    sheetId: params.id,
    sum: {
      totalOut,
      totalIn,
      available: totalIn - totalOut,
    },
  };
};

export default function Sheet() {
  return (
    <ShellPage>
      <Navigation />
      <Header />
      <div className="flex flex-col gap-3 mb-24">
        <SheetSum />
        <AvailableMinus />
        <Transactions />
      </div>
    </ShellPage>
  );
}

function Header() {
  return (
    <div className="w-full h-12 flex justify-between items-start">
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
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button className="p-1 !h-7 !w-7 rounded-full border bg-white dark:bg-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="lucide lucide-ellipsis"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[240px]">
          <DropdownMenuGroup>
            <Edit />
            <DropdownMenuSeparator />
            <PinnedSheet />
            <DropdownMenuSeparator />
            <DeleteSheet />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function Edit() {
  return (
    <DropdownMenuItem className="justify-between">
      <span>Ubah</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M12 20h9M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854zM15 5l3 3"></path>
      </svg>
    </DropdownMenuItem>
  );
}

function PinnedSheet() {
  const {
    flag: { isPinned },
  } = useLoaderData<typeof loader>();
  return (
    <DropdownMenuItem className="justify-between">
      <span>{isPinned ? "Lepas Pin" : "Pin"}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        {isPinned ? (
          <path d="M12 17v5M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89M2 2l20 20M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11"></path>
        ) : (
          <path d="M12 17v5M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"></path>
        )}
      </svg>
    </DropdownMenuItem>
  );
}

function DeleteSheet() {
  const { sheet } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  return (
    <DropdownMenuItem
      className="text-danger-500 hover:!text-danger-500 hover:!bg-red-50 justify-between"
      onClick={() =>
        fetcher.submit({ id: sheet.id }, { action: ".", method: "post" })
      }
    >
      <span>Hapus</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"></path>
      </svg>
    </DropdownMenuItem>
  );
}

function AvailableMinus() {
  const {
    sum: { totalIn, totalOut, available },
  } = useLoaderData<typeof loader>();

  if ((totalIn >= 0 || totalOut >= 0) && available > -1) return <></>;
  return (
    <Section className="bg-white dark:bg-black border border-danger-200 dark:border-neutral-800 p-0 lg:p-0 rounded-xl 2xl:rounded-2xl">
      <div className="px-4 py-3 lg:py-4 lg:px-6 bg-danger-50 text-danger-500 border-none">
        <span className="text-sm font-medium">
          Finansialmu sedang dalam masalah..
        </span>
      </div>
    </Section>
  );
}
