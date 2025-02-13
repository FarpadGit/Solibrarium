"use client";

import { send } from "@/utils/FetchRequest";
import {
  signIn,
  SessionProvider as AuthSessionProvider,
} from "next-auth/react";

async function handleRememberMe() {
  if (typeof window === "undefined") return;

  const rememberMeToken = JSON.parse(localStorage.getItem("RememberMe"));
  if (!rememberMeToken) return;

  const signInResult = await signIn("RememberMeProvider", {
    redirect: false,
    tokenKey: rememberMeToken.Key,
    tokenValue: rememberMeToken.Value,
  });

  if (signInResult.error) return;
  send("/api/rememberMe", {
    data: { tokenKey: rememberMeToken.Key },
  }).then((res) => {
    if (!res.error) localStorage.setItem("RememberMe", JSON.stringify(res));
  });
}

export default function SessionProvider({ children, session }) {
  handleRememberMe();
  return (
    <AuthSessionProvider session={session}>{children}</AuthSessionProvider>
  );
}
