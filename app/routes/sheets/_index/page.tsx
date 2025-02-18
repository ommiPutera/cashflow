import { User, type Sheet } from "@prisma/client";

import {
  LoaderFunctionArgs,
  useLoaderData,
  type MetaFunction,
} from "react-router";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import Navigation from "~/components/navigation";
import ShellPage, { Divide, Section } from "~/components/shell-page";
import { ButtonLink } from "~/components/ui/button";

import { getSession } from "~/lib/session.server";

import { getGroupedSheets, getSheets } from "~/utils/sheet.server";

export const meta: MetaFunction = () => {
  return [{ title: "Beranda" }, { name: "", content: "" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user: User = session.get("user");

  const groupedSheets = await getGroupedSheets(user.id);
  const sheets = await getSheets(user.id);
  return { groupedSheets, sheets };
}

export default function Sheets() {
  return (
    <ShellPage>
      <Navigation />
      <div className="flex flex-col gap-3 my-6 lg:my-12 mx-auto">
        <CreateSheet />
        <EmptyState />
        <GroupedSheet />
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
      className="!h-16 lg:!h-20 w-fit px-6 lg:mb-12 text-primary-500 overflow-hidden shadow-sm [&_svg]:size-4 fixed bottom-12 right-6 lg:bottom-12 lg:right-12 bg-neutral-50 gap-3 rounded-2xl 2xl:rounded-4xl border inline-flex"
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
    <Section className="bg-white dark:bg-black border-transparent p-0 lg:p-0 rounded-xl 2xl:rounded-2xl">
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
      propKey: "last30Days",
      title: "30 Hari Sebelumnya",
    },
    {
      propKey: "more",
    },
  ];
  return groups.map((group) => {
    if (!groupedSheets[group.propKey as keyof typeof groupedSheets].length) {
      return <></>;
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
    <Section className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0 rounded-xl 2xl:rounded-2xl">
      {title && (
        <div className="px-4 py-3 lg:py-4 lg:px-6 bg-neutral-50 border-b lg:border-none lg:bg-white">
          <h2 className="text-sm font-bold">{title}</h2>
        </div>
      )}
      <Divide>
        {sheets.map((sheet) => (
          <SheetItem key={sheet.id} {...sheet} />
        ))}
      </Divide>
    </Section>
  );
}
function SheetItem({ title, titleId, createdAt }: Sheet) {
  const date = format(new Date(createdAt), "MM/dd/yyyy", {
    locale: id,
  });
  const time = format(new Date(createdAt), "hh:mm", {
    locale: id,
  });
  return (
    <ButtonLink
      to={`/sheets/${titleId}`}
      variant="transparent"
      className="px-4 lg:px-6 active:scale-[0.99] active:bg-transparent h-14 lg:h-16 flex w-full items-center hover:bg-primary-50 cursor-pointer rounded-none border-x-0"
    >
      <div className="flex flex-col w-full">
        <span className="text-sm font-medium text-wrap">{title}</span>
        <span className="text-sm font-normal text-neutral-500 text-wrap">
          {time}
        </span>
      </div>
      <span className="text-sm font-normal text-neutral-500 text-wrap">
        {date}
      </span>
    </ButtonLink>
  );
}
