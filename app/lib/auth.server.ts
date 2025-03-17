import { Authenticator } from "remix-auth";
import { TOTPStrategy } from "remix-auth-totp";
import { redirect } from "react-router";
import { Resend } from "resend";

import { PrismaClient } from "@prisma/client";

const resend = new Resend("re_G4eFM8hG_74d41fNLcSQJzCNWmDbAVdix");

import { getSession, commitSession } from "./session.server";

const prisma = new PrismaClient();

type User = {
  email: string;
};

export const authenticator = new Authenticator<User>();

authenticator.use(
  new TOTPStrategy(
    {
      secret: process.env.ENCRYPTION_SECRET || "",
      emailSentRedirect: "/auth/verify",
      magicLinkPath: "/auth/verify",
      successRedirect: "/sheets",
      failureRedirect: "/auth/verify",
      cookieOptions: {
        ...(process.env.NODE_ENV === "production" ? { secure: true } : {}),
      },
      sendTOTP: async ({ email, code, magicLink }) => {
        // My email sending function.
        // await sendEmail(email, code, magicLink);
        await resend.emails.send({
          from: "Ommi <onboarding@resend.dev>",
          to: email,
          subject: "Verify",
          html: `<p>OTP <strong>${code}</strong> <br /> ${magicLink}</p>`,
        });

        // Development Only.
        console.log({
          email,
          code,
          magicLink,
        });
      },
    },
    async ({ email, request }) => {
      let user = await prisma.user.findFirst({
        where: { email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name: "",
          },
        });
      }

      const session = await getSession(request.headers.get("Cookie"));
      session.set("user", user);

      const sessionCookie = await commitSession(session);
      throw redirect("/sheets", {
        headers: {
          "Set-Cookie": sessionCookie,
        },
      });
    },
  ),
);
