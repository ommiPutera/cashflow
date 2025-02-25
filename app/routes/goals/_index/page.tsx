import { FinancialGoal, User } from "@prisma/client";

import { format } from "date-fns";
import { id as locale } from "date-fns/locale";

import {
  useLoaderData,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "react-router";

import Navigation from "~/components/navigation";
import ShellPage, { Divide, Section } from "~/components/shell-page";
import { ButtonLink } from "~/components/ui/button";

import { getSession } from "~/lib/session.server";
import { toIDR } from "~/utils/currency";

import { getFinancialGoals } from "~/utils/financialGoal.server";

export const meta: MetaFunction = () => {
  return [{ title: "Account" }, { name: "", content: "" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user: User = session.get("user");

  const debtFinancialGoal = await getFinancialGoals(user.id, "debt");
  return { debt: { data: debtFinancialGoal } };
}

export default function Index() {
  return (
    <ShellPage>
      <Navigation noNavigationOnMobile={false} />
      <div className="flex flex-col gap-3 my-6 lg:my-12 mx-auto">
        <h2 className="text-lg font-bold koh-santepheap-bold mb-2">Tujuan</h2>
        <Debt />
      </div>
    </ShellPage>
  );
}

function Debt() {
  const {
    debt: { data },
  } = useLoaderData<typeof loader>();
  return (
    <Section className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-0 lg:p-0 rounded-xl 2xl:rounded-2xl">
      <ButtonLink
        to="/goals/debt/create"
        variant="outlined-primary"
        className="!h-14 lg:!h-20 bg-neutral-50 inline-flex gap-2 rounded-t-xl 2xl:rounded-t-2xl rounded-b-none border-t-transparent border-x-transparent border-b"
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
          className="w-4 h-4 lg:w-5 lg:h-5"
          viewBox="0 0 24 24"
        >
          <path d="M5 12h14M12 5v14"></path>
        </svg>
        <span>Buat hutang</span>
      </ButtonLink>
      <div className="px-4 py-3 inline-flex justify-between items-center lg:py-4 lg:px-6 bg-neutral-50 border-b lg:border-none lg:bg-white">
        <h2 className="text-sm font-bold">Hutang / terakhir dibuka</h2>
        <span className="text-sm font-medium text-neutral-600">
          Sisa harus dibayarkan
        </span>
      </div>
      <Divide>
        {data.length ? (
          data.map((item) => <DebtItem key={item.id} {...item} />)
        ) : (
          <div className="w-full h-16 flex justify-center items-center">
            <span className="text-sm font-medium text-neutral-400">
              Belum ada Hutang..
            </span>
          </div>
        )}
      </Divide>
    </Section>
  );
}

function DebtItem({
  id,
  title,
  currentAmount,
  targetAmount,
  updatedAt,
}: FinancialGoal) {
  const date = format(new Date(updatedAt), "dd MMM yyyy", {
    locale,
  });
  const time = format(new Date(updatedAt), "EEEE, hh:mm", {
    locale,
  });
  return (
    <ButtonLink
      to={`/goals/debt/${id}`}
      variant="transparent"
      className="px-4 lg:px-6 active:scale-[0.99] active:bg-transparent h-14 lg:h-16 flex w-full items-center hover:bg-primary-50 cursor-pointer rounded-none border-x-0"
    >
      <div className="flex flex-col gap-0.5 w-full">
        <span className="text-sm font-medium text-wrap">{title}</span>
        <span className="text-xs font-normal text-left text-neutral-500 whitespace-nowrap">
          {time} WIB - {date}
        </span>
      </div>
      <div>
        <h4 className="text-sm">{toIDR(targetAmount - currentAmount)}</h4>
      </div>
    </ButtonLink>
  );
}
