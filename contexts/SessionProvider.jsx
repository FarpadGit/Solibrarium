"use client";

import { SessionProvider as AuthSessionProvider } from "next-auth/react";

export default function SessionProvider({ children, session }) {
  return (
    <AuthSessionProvider session={session}>{children}</AuthSessionProvider>
  );
}
