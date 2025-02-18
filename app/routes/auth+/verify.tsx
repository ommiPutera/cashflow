import { Cookie } from "@mjackson/headers";
import { User } from "@prisma/client";

import { useState } from "react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
  useFetcher,
  useLoaderData,
} from "react-router";

import { PublicNavigation } from "~/components/navigation";
import ShellPage from "~/components/shell-page";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { authenticator } from "~/lib/auth.server";
import { getSession } from "~/lib/session.server";

/**
 * Loader function that checks if the user is already authenticated.
 * - If the user is already authenticated, redirect to sheets.
 * - If the user is not authenticated, check if the intent is to verify via magic-link URL.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  // Check for existing session.
  const session = await getSession(request.headers.get("Cookie"));
  const user: User = session.get("user");

  // If the user is already authenticated, redirect to sheets.
  if (user) return redirect("/sheets");

  // Get the TOTP cookie and the token from the URL.
  const cookie = new Cookie(request.headers.get("Cookie") || "");
  const totpCookie = cookie.get("_totp");

  const url = new URL(request.url);
  const token = url.searchParams.get("t");

  // Authenticate the user via magic-link URL.
  if (token) {
    try {
      return await authenticator.authenticate("TOTP", request);
    } catch (error) {
      if (error instanceof Response) return error;
      if (error instanceof Error) return { error: error.message };
      return { error: "Invalid TOTP" };
    }
  }

  // Get the email from the TOTP cookie.
  let email = null;
  if (totpCookie) {
    const params = new URLSearchParams(totpCookie);
    email = params.get("email");
  }

  // If no email is found, redirect to login.
  if (!email) return redirect("/auth/login");

  return { email };
}

/**
 * Action function that handles the TOTP verification form submission.
 * - Authenticates the user via TOTP (Form submission).
 */
export async function action({ request }: ActionFunctionArgs) {
  try {
    return await authenticator.authenticate("TOTP", request);
  } catch (error) {
    if (error instanceof Response) {
      const cookie = new Cookie(error.headers.get("Set-Cookie") || "");
      const totpCookie = cookie.get("_totp");
      if (totpCookie) {
        const params = new URLSearchParams(totpCookie);
        return { error: params.get("error") };
      }

      throw error;
    }
    return { error: "Invalid TOTP" };
  }
}

export default function VerifyPage() {
  const loaderData = useLoaderData<typeof loader>();

  const [value, setValue] = useState("");
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle" || fetcher.formData != null;

  // const code = "code" in loaderData ? loaderData.code : undefined;
  const email = "email" in loaderData ? loaderData.email : undefined;
  const error = "error" in loaderData ? loaderData.error : null;
  const errors = fetcher.data?.error || error;

  return (
    <ShellPage>
      <PublicNavigation />
      <div className="my-28 items-center w-full mx-auto text-center flex flex-col gap-12 max-w-xs">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-800">
            Periksa email kamu
          </h1>
          <p className="text-base font-medium text-neutral-600">
            {" "}
            {email ? (
              <>Kami mengirim kode otp pada {email}</>
            ) : (
              <>Periksa email Anda untuk kode verifikasi</>
            )}
          </p>
        </div>
        <fetcher.Form method="post" className="space-y-2 w-full">
          <input type="hidden" name="code" value={value} />
          <Input
            minLength={6}
            maxLength={6}
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={isSubmitting}
            placeholder="Masuk 6 digit kode OTP"
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full rounded-full"
            disabled={isSubmitting || value.length !== 6}
          >
            {isSubmitting ? "Memverifikasi..." : "Verifikasi Kode OTP"}
          </Button>
        </fetcher.Form>
        {errors && <p className="text-sm text-red-500 text-center">{errors}</p>}
        <div className="flex flex-col mt-8 gap-2">
          <p className="text-sm text-gray-600 text-center font-normal">
            Tidak menerima kodenya?
          </p>
          <fetcher.Form
            method="POST"
            action="/auth/login"
            autoComplete="off"
            className="flex w-full flex-col gap-2"
          >
            <Button
              variant="outlined-primary"
              size="sm"
              type="submit"
              className="w-full rounded-full"
            >
              Minta kode baru
            </Button>
          </fetcher.Form>
        </div>
      </div>
    </ShellPage>
  );
}
