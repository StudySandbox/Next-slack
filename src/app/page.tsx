"use client";

import { Button } from "@/components/ui/button";
import { UserButton } from "@/features/auth/components/user-button";
import { useAuthActions } from "@convex-dev/auth/react";

export default function Home() {
  const { signOut } = useAuthActions();

  return (
    <>
      <main className="flex h-full flex-col items-center justify-center gap-4">
        Logged In!
        <UserButton />
        <Button onClick={signOut}>Sign Out</Button>
      </main>
    </>
  );
}
