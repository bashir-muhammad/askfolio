"use client";

import { useLayoutEffect, useRef } from "react";
import UserMessage from "@/components/user-message/user-message";
import BotMessage from "@/components/bot-message/bot-message";

import { useChatStore, type Message } from "@/store/chat-store";

const EMPTY_MESSAGES: Message[] = [];

const MessageList = () => {
  const { chats, activeChatId } = useChatStore();
  const messages =
    chats.find((chat) => chat.id === activeChatId)?.messages ?? EMPTY_MESSAGES;
  const messageListRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (messages.length === 0) return;
    messageListRef.current?.lastElementChild?.scrollIntoView({
      block: "end",
    });
  }, [activeChatId, messages]);

  return (
    <div
      ref={messageListRef}
      className={`flex flex-1 flex-col items-center gap-4 ${
        messages.length === 0 ? "justify-center" : "pb-8"
      }`}
    >
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
          <h2 className="text-lg">No chats yet</h2>
          <p className="text-gray-900">
            Start a new chat with input field below
          </p>
        </div>
      )}
      {messages.map((message) =>
        message.role === "user" ? (
          <UserMessage key={message.id} message={message.content} />
        ) : (
          <BotMessage key={message.id} message={message.content} />
        ),
      )}
    </div>
  );
};

export default MessageList;
