import { User, type Sheet } from "@prisma/client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  LoaderFunctionArgs,
  useLoaderData,
  type MetaFunction,
} from "react-router";

import Navigation from "~/components/navigation";
import ShellPage, { Divide, Section } from "~/components/shell-page";
import { Button, ButtonLink } from "~/components/ui/button";

import { getSession } from "~/lib/session.server";

import { toIDR } from "~/utils/currency";
import { getGroupedSheets, getSheets } from "~/utils/sheet.server";

export const meta: MetaFunction = () => {
  return [{ title: "Beranda" }, { name: "", content: "" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user: User = session.get("user");

  const groupedSheets = await getGroupedSheets(user.id);
  const sheets = await getSheets(user.id);

  return {
    groupedSheets,
    sheets,
  };
}

export default function Sheets() {
  return (
    <ShellPage>
      <Navigation noNavigationOnMobile={false} />
      <div className="flex flex-col lg:flex-row-reverse gap-4 mx-auto xl:mx-0 max-w-[var(--shell-page-width)] lg:gap-10 lg:max-w-[1150px]">
        <div className="w-full lg:max-w-[400px]">
          <BalanceSheet />
        </div>
        <div className="w-full">
          <div className="flex items-center gap-3 lg:mb-6 w-full justify-between">
            <h2 className="text-lg lg:text-xl font-bold koh-santepheap-bold">
              Lembar Anda
            </h2>
            <CreateSheet />
          </div>
          <EmptyState />
          <GroupedSheet />
        </div>
      </div>
    </ShellPage>
  );
}

function CreateSheet() {
  const { sheets } = useLoaderData<typeof loader>();
  if (!sheets.length) return <></>;
  return (
    <ButtonLink
      to="/sheets/create"
      variant="transparent"
      className="w-fit lg:hidden px-2 text-primary-500 overflow-hidden [&_svg]:size-4 gap-3 rounded-2xl inline-flex"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        viewBox="0 0 24 24"
      >
        <path d="M5 12h14M12 5v14"></path>
      </svg>
      <span className="text-sm font-bold">Buat Lembar</span>
    </ButtonLink>
  );
}

function EmptyState() {
  const { sheets } = useLoaderData<typeof loader>();
  if (sheets.length) return <></>;
  return (
    <Section className="bg-white dark:bg-black border-transparent p-0 lg:p-0 rounded-xl">
      <div className="my-28 items-center w-full mx-auto text-center flex flex-col gap-3 max-w-xs lg:max-w-sm">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-400">
          Lembaran kosong
        </h1>
        <p className="text-base font-medium text-neutral-400">
          Buat lembar pengeluaran baru, dan semuanya akan muncul di sini
        </p>
        <ButtonLink
          to="/sheets/create"
          variant="outlined-primary"
          className="w-fit rounded-full mt-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5v14"></path>
          </svg>
          <span>Buat baru</span>
        </ButtonLink>
      </div>
    </Section>
  );
}

function GroupedSheet() {
  const { groupedSheets } = useLoaderData<typeof loader>();
  const groups = [
    {
      propKey: "today",
      title: "Hari Ini",
    },
    {
      propKey: "yesterday",
      title: "Kemarin",
    },
    {
      propKey: "last7Days",
      title: "7 Hari Sebelumnya",
    },
    {
      propKey: "last30Days",
      title: "30 Hari Sebelumnya",
    },
    {
      propKey: "more",
    },
  ];
  return groups.map((group, index) => {
    if (!groupedSheets[group.propKey as keyof typeof groupedSheets].length) {
      return null;
    }
    if (index === 0) {
      return (
        <div key={group.propKey} className="mb-6">
          {group.title && (
            <div className="px-4 py-3 inline-flex justify-between w-full items-center lg:py-4 lg:px-6 bg-white">
              <h2 className="text-xs lg:text-sm font-medium">{group.title}</h2>
              <span className="text-xs lg:text-sm font-medium">
                Terakhir dibuka oleh saya
              </span>
            </div>
          )}
          <Section className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0 rounded-xl">
            <Divide>
              {groupedSheets[group.propKey as keyof typeof groupedSheets].map(
                (sheet) => (
                  <SheetItem key={sheet.id} {...sheet} />
                ),
              )}
            </Divide>
          </Section>
        </div>
      );
    }
    return (
      <SheetsLinks
        key={group.propKey}
        title={group.title}
        sheets={groupedSheets[group.propKey as keyof typeof groupedSheets]}
      />
    );
  });
}
type TGroupSheet = {
  title?: string;
  sheets: Sheet[];
};
function SheetsLinks({ title, sheets }: TGroupSheet) {
  return (
    <div className="mb-6">
      {title && (
        <div className="px-4 py-3 items-center lg:py-4 lg:px-6 bg-white">
          <h2 className="text-xs lg:text-sm font-medium">{title}</h2>
        </div>
      )}
      <Section className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0 rounded-xl">
        <Divide>
          {sheets.map((sheet) => (
            <SheetItem key={sheet.id} {...sheet} />
          ))}
        </Divide>
      </Section>
    </div>
  );
}
function SheetItem({ title, titleId, updatedAt }: Sheet) {
  const date = format(new Date(updatedAt), "dd MMM yyyy", {
    locale: id,
  });
  return (
    <ButtonLink
      to={`/sheets/${titleId}`}
      variant="transparent"
      className="px-4 lg:px-6  active:bg-transparent h-14 lg:h-16 flex w-full items-center hover:bg-primary-50 cursor-pointer rounded-none border-x-0"
    >
      <div className="flex flex-col w-full">
        <span className="text-sm font-medium text-wrap">{title}</span>
      </div>
      <span className="text-xs font-medium text-right text-neutral-500 whitespace-nowrap">
        {date}
      </span>
    </ButtonLink>
  );
}

function BalanceSheet() {
  return (
    <Section className="dark:bg-black border bg-primary-50/50 dark:border-neutral-800 p-0 lg:p-0 rounded-xl">
      <div className="p-4 mt-4 text-center">
        <div className="flex flex-col gap-2 justify-center items-center">
          <span className="text-xs lg:text-sm font-medium text-wrap">
            Kekayaan Bersih
          </span>
          <h3 className="text-lg lg:text-xl font-bold text-neutral-700 text-wrap text-primary-500">
            {toIDR(0)}
          </h3>
        </div>
        <p className="text-xs lg:text-sm font-normal text-wrap mt-4">
          Kekayaan Bersih = Total Aset - Total Liabilitas
        </p>
      </div>
      <Divide className="flex flex-row divide-x divide-y-0 py-6 lg:py-12">
        <Button
          variant="transparent"
          className="px-4 lg:px-6  [&_svg]:size-5 active:bg-transparent flex flex-col w-full items-center cursor-pointer rounded-none border-x-0"
        >
          <div className="inline-flex gap-3 justify-center items-center w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="8" cy="8" r="6"></circle>
              <path d="M18.09 10.37A6 6 0 1 1 10.34 18M7 6h1v4"></path>
              <path d="m16.71 13.88.7.71-2.82 2.82"></path>
            </svg>
            <span className="text-xs lg:text-sm font-normal text-wrap">
              Total Liabilitas
            </span>
          </div>
          <h3 className="text-base lg:text-lg font-bold text-neutral-700 text-wrap">
            {toIDR(0)}
          </h3>
        </Button>
        <Button
          variant="transparent"
          className="px-4 lg:px-6  [&_svg]:size-5 active:bg-transparent flex flex-col w-full items-center cursor-pointer rounded-none border-x-0"
        >
          <div className="inline-flex gap-3 justify-center items-center w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"></path>
              <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9M2 16l6 6"></path>
              <circle cx="16" cy="9" r="2.9"></circle>
              <circle cx="6" cy="5" r="3"></circle>
            </svg>
            <span className="text-xs lg:text-sm font-normal text-wrap">
              Total Aset
            </span>
          </div>
          <h3 className="text-base lg:text-lg font-bold text-neutral-700 text-wrap">
            {toIDR(0)}
          </h3>
        </Button>
      </Divide>
    </Section>
  );
}
