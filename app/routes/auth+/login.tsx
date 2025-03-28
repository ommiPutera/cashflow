import { User } from "@prisma/client";
import {
  ActionFunctionArgs,
  Link,
  LoaderFunctionArgs,
  redirect,
  useFetcher,
} from "react-router";
import { SVGLogo } from "~/components/navigation";

import ShellPage from "~/components/shell-page";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { authenticator } from "~/lib/auth.server";
import { getSession } from "~/lib/session.server";

export function meta() {
  return [
    { title: "Expense Sheet - Masuk" },
    { name: "description", content: "Welcome to Expense Sheet" },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user: User = session.get("user");

  if (user) return redirect("/sheets");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    return await authenticator.authenticate("TOTP", request);
  } catch (error) {
    console.log("error", error);
    if (error instanceof Response) {
      return error;
    }
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
      <div className="flex justify-center items-center min-h-[calc(100svh_-_30svh)]">
        <div className="items-start w-full mx-auto flex flex-col max-w-xs">
          <Link to="/">
            <div className="w-fit mb-12">
              <SVGLogo width={180} />
            </div>
          </Link>
          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-800 koh-santepheap-bold">
                Selamat datang kembali.
              </h1>
              <p className="text-base font-normal text-neutral-600">
                Masuk ke akun kamu
              </p>
            </div>
            <fetcher.Form method="post" className="w-full">
              <div className="grid w-full items-center gap-4 py-4">
                <Label
                  htmlFor="email-address"
                  className="font-semibold text-left"
                >
                  Alamat Email
                </Label>
                <Input
                  id="email-address"
                  placeholder="you@example.com"
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
                {isSubmitting ? "Tunggu..." : "Lanjutkan"}
              </Button>
            </fetcher.Form>
          </div>
        </div>
      </div>
    </ShellPage>
  );
}
