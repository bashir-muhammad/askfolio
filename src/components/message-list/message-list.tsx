"use client";

import { useLayoutEffect, useRef } from "react";
import UserMessage from "@/components/user-message/user-message";
import BotMessage from "@/components/bot-message/bot-message";
import { FileText, Sparkles } from "lucide-react";

import { useChatStore, type Message } from "@/store/chat-store";

const EMPTY_MESSAGES: Message[] = [];

const MessageList = () => {
  const { chats, activeChatId } = useChatStore();
  const activeChat = chats.find((chat) => chat.id === activeChatId);
  const messages = activeChat?.messages ?? EMPTY_MESSAGES;
  const messageListRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (messages.length === 0) return;
    messageListRef.current?.lastElementChild?.scrollIntoView({
      block: "end",
    });
  }, [activeChatId, messages]);

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-[76px] shrink-0 items-center justify-between border-b border-[#eeeaf5] bg-white/55 px-5 py-4 sm:px-8 lg:px-12">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#302b40]">
            <FileText size={17} className="shrink-0 text-primary" />
            <h2 className="truncate">{activeChat?.title ?? "New conversation"}</h2>
          </div>
          <div className="mt-1 flex items-center gap-1.5 pl-6 text-xs text-muted-foreground">
            <span className="rounded-full bg-[#eeebff] px-2 py-0.5 font-medium text-[#5140bd]">
              AskFolio AI
            </span>
            <span>·</span>
            <span>Research assistant</span>
          </div>
        </div>
        <Sparkles className="mr-1 hidden shrink-0 text-[#5947c5] sm:block" size={18} />
      </div>
      <div
        ref={messageListRef}
        className={`flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 py-6 sm:px-8 lg:px-12 ${
          messages.length === 0 ? "justify-center" : ""
        }`}
      >
        {messages.length === 0 && (
          <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-10 text-center">
            <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-[#eeebff] text-[#5140bd]">
              <Sparkles size={30} />
            </div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#6555c7]">
              Your AI research partner
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-[#302b40] sm:text-4xl">
              What would you like to explore?
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
              Ask a question, compare ideas, or start with a topic you&apos;re curious about.
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
    </section>
  );
};

export default MessageList;
