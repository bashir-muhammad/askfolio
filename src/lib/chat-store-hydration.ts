"use client";

import { useEffect } from "react";
import { useChatStore } from "@/store/chat-store";

const ChatStoreHydration = () => {
  useEffect(() => {
    void Promise.resolve(useChatStore.persist.rehydrate()).catch(
      (error: unknown) => {
        console.error("Failed to restore chat history from local storage.", error);
      },
    );
  }, []);

  return null;
};

export default ChatStoreHydration;
