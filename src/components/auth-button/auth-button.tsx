"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Button variant="default" disabled>
        Loading...
      </Button>
    );
  }

  if (session) {
    return (
      <>
        <span className="mx-2">Signed in as {session.user?.name}</span>
        <Button onClick={() => signOut()} variant="outline">
          Sign Out
        </Button>
      </>
    );
  }

  return (
    <Button
      onClick={() => signIn("google", { callbackUrl: "/" })}
      variant="default"
    >
      Login with Google
    </Button>
  );
}