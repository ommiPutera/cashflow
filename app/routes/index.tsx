import { PublicNavigation } from "~/components/navigation";
import ShellPage from "~/components/shell-page";
import { ButtonLink } from "~/components/ui/button";

export default function Home() {
  return (
    <ShellPage>
      <PublicNavigation />
      <div className="my-28 items-center w-full mx-auto text-center flex flex-col gap-3 max-w-xs lg:max-w-sm">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-800">
          Semua pengeluaran direncanakan
        </h1>
        <p className="text-base font-medium text-neutral-600">
          Catat arus kas, rencanakan pengeluaran, dan dapatkan gambaran keuangan
          yang lebih baik
        </p>
        <ButtonLink
          to="/auth/login"
          variant="primary"
          className="w-fit rounded-full px-12 mt-4"
        >
          <span>Masuk</span>
          <svg
            className="h-5 w-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.99995 12.9999L19 13.0001C19.5523 13.0001 20 12.5524 20 12.0001C20 11.4478 19.5523 11.0001 19 11.0001L3.99998 10.9999C3.4477 10.9999 2.99998 11.4476 2.99997 11.9998C2.99996 12.5521 3.44767 12.9999 3.99995 12.9999Z"
              fill="currentColor"
            />
            <path
              d="M14.2781 6.308C13.8959 6.7067 13.9093 7.33972 14.308 7.7219L18.771 12L14.308 16.2781C13.9093 16.6603 13.8959 17.2933 14.2781 17.692C14.6603 18.0907 15.2933 18.1041 15.692 17.7219L20.1994 13.4012C20.347 13.2599 20.5218 13.0925 20.652 12.929C20.8077 12.7334 21 12.4234 21 12C21 11.5766 20.8077 11.2666 20.652 11.071C20.5218 10.9075 20.347 10.7401 20.1994 10.5988L15.692 6.2781C15.2933 5.89592 14.6603 5.90931 14.2781 6.308Z"
              fill="currentColor"
            />
          </svg>
        </ButtonLink>
        <p className="text-sm text-neutral-600 font-bold mt-2">100% Gratis!</p>
      </div>
    </ShellPage>
  );
}
