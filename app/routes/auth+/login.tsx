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
    { title: "Log in ke Expense Sheet" },
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
      <div className="my-28 items-center w-full mx-auto flex flex-col gap-2 max-w-xs">
        <Link to="/">
          <div className="mb-20">
            <SVGLogo />
          </div>
        </Link>
        <h1 className="text-2xl font-semibold text-center tracking-tight text-neutral-800">
          Log in ke akun kamu
        </h1>
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
