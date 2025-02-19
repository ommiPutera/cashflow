import { User } from "@prisma/client";

import {
  useLoaderData,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "react-router";

import Navigation from "~/components/navigation";
import ShellPage, { Divide, Section } from "~/components/shell-page";
import { ButtonLink } from "~/components/ui/button";

import { getDeletedSheets, getSheets } from "~/utils/sheet.server";

import { getSession } from "~/lib/session.server";

export const meta: MetaFunction = () => {
  return [{ title: "Folder" }, { name: "", content: "" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user: User = session.get("user");

  const sheetsCount = (await getSheets(user.id)).length;
  const deletedSheets = (await getDeletedSheets(user.id)).length;
  return { sheetsCount, deletedSheets };
}

export default function Index() {
  return (
    <ShellPage>
      <Navigation noNavigationOnMobile={false} />
      <div className="flex flex-col gap-3 my-6 lg:my-12 mx-auto">
        <Wealth />
        <Folder />
      </div>
    </ShellPage>
  );
}

function Wealth() {
  return (
    <Section className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0 rounded-xl 2xl:rounded-2xl">
      <div className="px-4 py-3 lg:py-4 lg:px-6 bg-neutral-50 border-b lg:border-none lg:bg-white">
        <h2 className="text-sm font-bold">Kekayaan</h2>
      </div>
      <Divide>
        <ButtonLink
          to="/folder"
          variant="transparent"
          className="px-4 lg:px-6 active:scale-[0.99] [&_svg]:size-5 active:bg-transparent h-14 lg:h-16 flex w-full items-center hover:bg-primary-50 cursor-pointer rounded-none border-x-0"
        >
          <div className="inline-flex gap-3 items-center w-full">
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
              <circle cx="8" cy="8" r="6"></circle>
              <path d="M18.09 10.37A6 6 0 1 1 10.34 18M7 6h1v4"></path>
              <path d="m16.71 13.88.7.71-2.82 2.82"></path>
            </svg>
            <span className="text-sm font-medium text-wrap">
              Total Liabilitas
            </span>
          </div>
          <span className="text-sm font-normal text-neutral-500 text-wrap">
            Rp.0
          </span>
        </ButtonLink>
        <ButtonLink
          to="/folder"
          variant="transparent"
          className="px-4 lg:px-6 active:scale-[0.99] [&_svg]:size-5 active:bg-transparent h-14 lg:h-16 flex w-full items-center hover:bg-primary-50 cursor-pointer rounded-none border-x-0"
        >
          <div className="inline-flex gap-3 items-center w-full">
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
              <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"></path>
              <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9M2 16l6 6"></path>
              <circle cx="16" cy="9" r="2.9"></circle>
              <circle cx="6" cy="5" r="3"></circle>
            </svg>
            <span className="text-sm font-medium text-wrap">Total Aset</span>
          </div>
          <span className="text-sm font-normal text-neutral-500 text-wrap">
            Rp.0
          </span>
        </ButtonLink>
      </Divide>
    </Section>
  );
}

function Folder() {
  const { sheetsCount, deletedSheets } = useLoaderData<typeof loader>();
  return (
    <Section className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0 rounded-xl 2xl:rounded-2xl">
      <div className="px-4 py-3 lg:py-4 lg:px-6 bg-neutral-50 border-b lg:border-none lg:bg-white">
        <h2 className="text-sm font-bold">Folder Lainnya</h2>
      </div>
      <Divide>
        <ButtonLink
          to="/sheets"
          variant="transparent"
          className="px-4 lg:px-6 active:scale-[0.99] [&_svg]:size-5 active:bg-transparent h-14 lg:h-16 flex w-full items-center hover:bg-primary-50 cursor-pointer rounded-none border-x-0"
        >
          <div className="inline-flex gap-3 items-center w-full">
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
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
              <path d="M3 9h18M3 15h18M9 9v12M15 9v12"></path>
            </svg>
            <span className="text-sm font-medium text-wrap">Semua Lembar</span>
          </div>
          <span className="text-sm font-normal text-neutral-500 text-wrap">
            {sheetsCount}
          </span>
        </ButtonLink>
        <ButtonLink
          to="/folder/deleted"
          variant="transparent"
          className="px-4 lg:px-6 active:scale-[0.99] [&_svg]:size-5 active:bg-transparent h-14 lg:h-16 flex w-full items-center hover:bg-primary-50 cursor-pointer rounded-none border-x-0"
        >
          <div className="inline-flex gap-3 items-center w-full">
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
              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
            <span className="text-sm font-medium text-wrap">Baru Dihapus</span>
          </div>
          <span className="text-sm font-normal text-neutral-500 text-wrap">
            {deletedSheets}
          </span>
        </ButtonLink>
      </Divide>
    </Section>
  );
}
