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
      /**
       * Generate a 64-character secret: https://www.grc.com/passwords.htm
       */
      secret: process.env.ENCRYPTION_SECRET || "",
      emailSentRedirect: "/auth/verify",
      magicLinkPath: "/auth/verify",
      successRedirect: "/sheets",
      failureRedirect: "/auth/verify",
      cookieOptions: {
        // Safari doesn't support secure cookies on localhost.
        ...(process.env.NODE_ENV === "production" ? { secure: true } : {}),
      },
      sendTOTP: async ({ email, code, magicLink }) => {
        /**
         * TODO: Implement email sending functionality.
         *
         * This is where you would call your email service to send the verification code.
         * Parameters available:
         * @param email - The user's email address.
         * @param code - The 6-digit verification code.
         * @param magicLink - The verification link containing the code.
         */

        // My email sending function.
        // await sendEmail(email, code, magicLink);
        await resend.emails.send({
          from: "Ommi <onboarding@resend.dev>",
          to: email,
          subject: "Verify",
          html: `<p>OTP <strong>${code}</strong>! <br /> ${magicLink}</p>`,
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

      // Store user in session.
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
