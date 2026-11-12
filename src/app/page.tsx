"use client";

import { useEffect } from "react";
import InputBox from "@/components/input-box/input-box";
import MessageList from "@/components/message-list/message-list";
import SideBar from "@/components/side-bar/side-bar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-[#faf9ff] text-[#5140bd]">
        Loading your workspace...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#faf9ff] lg:flex-row">
      <SideBar />
      <main className="flex min-h-0 min-w-0 w-full flex-1 flex-col">
        <MessageList />
        <div className="shrink-0 px-4 pb-4 pt-3 sm:px-8 lg:px-12">
          <InputBox />
        </div>
      </main>
    </div>
  );
}
