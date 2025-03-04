import { type User } from "@prisma/client";
import {
  Link,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
  useLocation,
} from "react-router";

import Navigation from "~/components/navigation";
import ShellPage, { Divide, Section } from "~/components/shell-page";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Progress } from "~/components/ui/progress";

import { toIDR } from "~/utils/currency";
import { getFinancialGoalById } from "~/utils/financialGoal.server";

import { getSession } from "~/lib/session.server";
import { cn } from "~/lib/utils";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const user: User = session.get("user");

  const debt = await getFinancialGoalById(params.id || "", user.id);
  if (!debt) return redirect("/goals");

  let prevTotal = debt.targetAmount;
  const history: {
    prevTotal: number;
    nominal: number;
    mark: "+" | "-";
    currentNominal: number;
    link: string;
  }[] = [];

  for (const transaction of debt.transactions) {
    const mark = transaction.type === "in" ? "+" : "-";
    const currentNominal =
      transaction.type === "in"
        ? prevTotal + transaction.nominal
        : prevTotal - transaction.nominal;

    history.push({
      prevTotal,
      nominal: transaction.nominal,
      mark,
      currentNominal,
      link: `/sheets/edit/${transaction.id}`,
    });

    prevTotal = currentNominal;
  }

  return {
    ...debt,
    history,
    historyLength: history.length,
  };
};

export default function Debt() {
  const { title, description } = useLoaderData<typeof loader>();
  return (
    <ShellPage>
      <Navigation />
      <Header />
      <div className="flex flex-col gap-3  max-w-[var(--shell-page-width)] mx-auto">
        <h2 className="text-xl font-bold koh-santepheap-bold mb-2">{title}</h2>
        {description && (
          <span className="text-xs lg:text-sm font-normal text-wrap">
            {description}
          </span>
        )}
        <DebtGoal />
        <br />
        <h2 className="text-lg lg:text-xl font-bold koh-santepheap-bold mb-2">
          Riwayat
        </h2>
        <History />
      </div>
    </ShellPage>
  );
}

function DebtGoal() {
  const { targetAmount, totalIn, totalOut } = useLoaderData<typeof loader>();
  const progress = (totalOut / targetAmount) * 100;
  return (
    <Section className="dark:bg-black border bg-warning-50/50 dark:border-neutral-800 p-0 lg:p-0 rounded-xl 2xl:rounded-2xl">
      <div className="px-4 py-3 lg:py-4 lg:px-6 bg-neutral-50 border-b lg:bg-white">
        <h2 className="text-sm font-medium text-center">Gambaran</h2>
      </div>
      <Divide className="flex flex-row divide-x divide-y-0 py-6">
        <Button
          variant="transparent"
          className="px-4 lg:px-6 active:scale-[0.99] [&_svg]:size-5 active:bg-transparent flex flex-col w-full items-center cursor-pointer rounded-none border-x-0"
        >
          <div className="inline-flex gap-3 justify-center items-center w-full">
            <span className="text-xs lg:text-sm font-normal text-wrap">
              {totalIn ? "Hutang" : "Hutang awal"}
            </span>
          </div>
          <h3 className="text-base lg:text-lg font-bold text-neutral-700 text-wrap">
            {toIDR(targetAmount + totalIn)}
          </h3>
        </Button>
        <Button
          variant="transparent"
          className="px-4 lg:px-6 active:scale-[0.99] [&_svg]:size-5 active:bg-transparent flex flex-col w-full items-center cursor-pointer rounded-none border-x-0"
        >
          <div className="inline-flex gap-3 justify-center items-center w-full">
            <span className="text-xs lg:text-sm font-normal text-wrap">
              Harus dibayarkan
            </span>
          </div>
          <h3 className="text-base lg:text-lg font-bold text-neutral-700 text-wrap">
            {toIDR(targetAmount + totalIn - totalOut)}
          </h3>
        </Button>
      </Divide>
      <div className="mx-10 flex flex-col gap-2 items-center mt-2 mb-6">
        <p className="text-sm text-neutral-700 font-medium">
          {progress.toFixed(2)}%
        </p>
        <Progress value={progress} />
      </div>
    </Section>
  );
}

function History() {
  const { history, historyLength } = useLoaderData<typeof loader>();
  const location = useLocation();
  return (
    <div>
      <ul className="mt-2">
        {history.map((item, index) => (
          <li key={index} className="text-gray-700 inline-flex w-full">
            <span className="inline-flex gap-4">
              <span className="min-w-4">{index + 1}.</span>
              <span>{toIDR(item.prevTotal, false)}</span>
            </span>
            <span className="min-w-4 mr-4 ml-6">{item.mark}</span>
            <Link
              to={`${item.link}?back-url=${encodeURI(location.pathname)}`}
              prefetch="intent"
              className={cn(
                "underline font-medium",
                item.mark === "-" ? "text-danger-500" : "text-success-500",
              )}
            >
              {item.nominal > 0 ? `${toIDR(item.nominal, false)}` : ""}
            </Link>
          </li>
        ))}
        {!!historyLength && (
          <li className="text-gray-700">
            <span className="inline-flex gap-4">
              <span className="min-w-4">{historyLength + 1}.</span>
              <span>
                {toIDR(history[historyLength - 1]?.currentNominal, false)}
              </span>
            </span>
          </li>
        )}
      </ul>
    </div>
  );
}

function Header() {
  return (
    <div className="w-full h-12 flex justify-between items-start">
      <Link
        to="/goals"
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
