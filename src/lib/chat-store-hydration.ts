"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useChatStore } from "@/store/chat-store";

const ChatStoreHydration = () => {
  const { status } = useSession();

  useEffect(() => {
    const rehydrate = async () => {
      try {
        await useChatStore.persist.rehydrate();

        if (status !== "authenticated") {
          return;
        }

        const response = await fetch("/api/chats");
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { chats?: Array<{ id: string; title: string; messages: Array<{ id: string; role?: "user" | "assistant"; content: string }>; updatedAt?: string }> };
        if (!payload.chats) {
          return;
        }

        useChatStore.setState({
          chats: payload.chats,
          activeChatId: payload.chats[0]?.id ?? null,
        });
      } catch (error) {
        console.error("Failed to restore chat history.", error);
      }
    };

    void rehydrate();
  }, [status]);

  return null;
};

export default ChatStoreHydration;
