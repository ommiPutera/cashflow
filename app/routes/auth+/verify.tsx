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

import { SVGLogo } from "~/components/navigation";
import ShellPage from "~/components/shell-page";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { authenticator } from "~/lib/auth.server";
import { getSession } from "~/lib/session.server";

export function meta() {
  return [
    { title: "Expense Sheet - Verifikasi akun Anda" },
    { name: "description", content: "Welcome to Expense Sheet" },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user: User = session.get("user");

  if (user) return redirect("/sheets");

  const cookie = new Cookie(request.headers.get("Cookie") || "");
  const totpCookie = cookie.get("_totp");

  const url = new URL(request.url);
  const token = url.searchParams.get("t");

  if (token) {
    try {
      return await authenticator.authenticate("TOTP", request);
    } catch (error) {
      if (error instanceof Response) return error;
      if (error instanceof Error) return { error: error.message };
      return { error: "Invalid TOTP" };
    }
  }

  let email = null;
  if (totpCookie) {
    const params = new URLSearchParams(totpCookie);
    email = params.get("email");
  }

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
      <div className="my-8 items-center w-full mx-auto flex flex-col gap-44 max-w-xs">
        <div>
          <SVGLogo />
        </div>
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-neutral-800 koh-santepheap-bold">
              Periksa email kamu
            </h1>
            <p className="text-base font-medium text-neutral-600">
              {" "}
              {email ? (
                <>Kami mengirimkan kode otp pada {email}</>
              ) : (
                <>Periksa email Anda untuk medapatkan kode verifikasi</>
              )}
            </p>
          </div>
          <div className="w-full">
            <fetcher.Form method="post" className="w-full">
              <input type="hidden" name="code" value={value} />
              <div className="grid w-full items-center gap-4 py-4">
                <Input
                  minLength={6}
                  maxLength={6}
                  required
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Masukkan 6 digit kode"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                className="w-full rounded-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Memverifikasi..." : "Verifikasi Kode"}
              </Button>
            </fetcher.Form>
            {errors && (
              <p className="text-sm text-red-500 text-center my-2">{errors}</p>
            )}
            <div className="flex flex-col mt-20 gap-4">
              <p className="text-sm text-gray-600 text-center font-normal">
                Tidak menerima kode?
              </p>
              <fetcher.Form
                method="POST"
                action="/auth/login"
                autoComplete="off"
                className="flex w-full flex-col gap-2"
              >
                <Button
                  variant="outlined-primary"
                  type="submit"
                  className="w-full rounded-full"
                >
                  Minta kode baru
                </Button>
              </fetcher.Form>
            </div>
          </div>
        </div>
      </div>
    </ShellPage>
  );
}
