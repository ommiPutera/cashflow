import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
  useFetcher,
} from "react-router";

import { PublicNavigation } from "~/components/navigation";
import ShellPage from "~/components/shell-page";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { authenticator } from "~/lib/auth.server";
import { getSession } from "~/lib/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");

  if (user) return redirect("/sheets");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    return await authenticator.authenticate("TOTP", request);
  } catch (error) {
    console.log("error", error);

    // The error from TOTP includes the redirect Response with the cookie.
    if (error instanceof Response) {
      return error;
    }

    // For other errors, return with error message.
    return {
      error: "An error occurred during login. Please try again.",
    };
  }
}

export default function Route() {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle" || fetcher.formData != null;
  const errors = fetcher.data?.error;

  return (
    <ShellPage>
      <PublicNavigation />
      <div className="my-28 items-center w-full mx-auto text-center flex flex-col gap-12 max-w-xs">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-800">
            Log in ke akun kamu
          </h1>
          <p className="text-base font-medium text-neutral-600">
            Selamat datang kembali
          </p>
        </div>
        <fetcher.Form method="post" className="w-full">
          <div className="grid w-full items-center gap-2 py-4">
            <Label htmlFor="email-address" className="font-semibold text-left">
              Alamat Email
            </Label>
            <Input
              id="email-address"
              placeholder="Masukkan alamat email"
              error={errors}
              type="email"
              name="email"
              required
              disabled={isSubmitting}
            />
            {errors && <p className="text-danger-500 text-sm">{errors}</p>}
          </div>
          <Button
            type="submit"
            variant="primary"
            className="w-full rounded-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Tunggu..." : "Lanjutkan dengan Email"}
          </Button>
        </fetcher.Form>
      </div>
    </ShellPage>
  );
}
