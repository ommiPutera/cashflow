import { createCookieSessionStorage } from "react-router";

if (!process.env.ENCRYPTION_SECRET)
  throw new Error("ENCRYPTION_SECRET environment variable is required");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_auth",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secrets: [process.env.ENCRYPTION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
