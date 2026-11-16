"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, SubmitEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GUEST_CHAT_LIMIT, useChatStore } from "@/store/chat-store";
import { buildChatRequestInit } from "@/lib/chat-request";

const InputBox = () => {
  const { status } = useSession();
  const router = useRouter();
  const [messageContent, setMessageContent] = useState("");
  const addChatMessage = useChatStore((s) => s.addChatMessage);
  const addChatMessageToChat = useChatStore((s) => s.addChatMessageToChat);
  const removeChatMessages = useChatStore((s) => s.removeChatMessages);
  const beginGuestChat = useChatStore((s) => s.beginGuestChat);
  const endGuestChat = useChatStore((s) => s.endGuestChat);
  const guestChatsUsed = useChatStore((s) => s.guestChatsUsed);
  const updateChatMessage = useChatStore((s) => s.updateChatMessage);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const activeRequestController = useRef<AbortController | null>(null);
  const remainingGuestChats = Math.max(GUEST_CHAT_LIMIT - guestChatsUsed, 0);
  const guestLimitReached =
    status === "unauthenticated" && guestChatsUsed >= GUEST_CHAT_LIMIT;

  useEffect(
    () => () => {
      activeRequestController.current?.abort();
    },
    [],
  );

  const onMessageKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  const onSendMessage = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = messageContent.trim();
    if (!message || isSending) {
      return;
    }

    const isGuest = status === "unauthenticated";
    if (isGuest && !beginGuestChat()) {
      return;
    }

    const storeState = useChatStore.getState();
    const activeChat = storeState.chats.find(
      (chat) => chat.id === storeState.activeChatId,
    );
    const { chatId, messageId } = addChatMessage(message);
    const optimisticMessageIds = [messageId];
    const originalTitle = activeChat?.title ?? "New Chat";
    let completed = false;
    const controller = new AbortController();
    activeRequestController.current = controller;
    setErrorMessage("");
    setIsSending(true);

    try {
      const response = await fetch(
        "/api/chat",
        {
          ...buildChatRequestInit({
            content: message,
            chatId,
            title: activeChat?.title,
            messages: activeChat?.messages ?? [],
            isGuest,
            guestChatsUsed,
          }),
          signal: controller.signal,
        },
      );

      if (!response.ok || !response.body) {
        const errorPayload = await response.json().catch(() => null);
        throw new Error(errorPayload?.error ?? "Chat request failed.");
      }

      const assistantMessageId = addChatMessageToChat(
        chatId,
        "",
        "assistant",
      );
      if (!assistantMessageId) {
        throw new Error("Unable to add the assistant response to this chat.");
      }
      optimisticMessageIds.push(assistantMessageId);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        assistantMessage += decoder.decode(value, { stream: true });
        updateChatMessage(chatId, assistantMessageId, assistantMessage);
      }

      assistantMessage += decoder.decode();
      updateChatMessage(chatId, assistantMessageId, assistantMessage);
      completed = true;
      setMessageContent("");
    } catch (error) {
      removeChatMessages(chatId, optimisticMessageIds, originalTitle);
      if (!controller.signal.aborted) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to send message. Please try again.";
        setErrorMessage(message);
      }
    } finally {
      setIsSending(false);
      if (isGuest) {
        endGuestChat(completed);
      }
      if (activeRequestController.current === controller) {
        activeRequestController.current = null;
      }
    }
  };

  if (guestLimitReached && !isSending) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-3 rounded-2xl border border-[#e9e5f2] bg-white p-4 text-center shadow-[0_8px_30px_rgba(47,37,96,0.07)] sm:flex-row sm:px-6 sm:text-left">
        <p className="text-sm text-[#625d70]">
          You&apos;ve used your {GUEST_CHAT_LIMIT} free chats. Sign in to continue chatting.
        </p>
        <Button
          type="button"
          onClick={() => router.push("/login")}
          className="rounded-xl bg-[#4932c4] text-white hover:bg-[#3924ad]"
        >
          Sign in to continue
        </Button>
      </div>
    );
  }

  return (
    <>
      {status === "unauthenticated" && (
        <div className="mb-2 flex w-full items-center justify-center">
          <div className="flex items-center gap-2 rounded-full border bg-white px-2">
            <p className="pl-3 text-sm text-[#625d70]">
              {remainingGuestChats} of {GUEST_CHAT_LIMIT} free queries remaining
            </p>
            <Button
              type="button"
              variant="link"
              onClick={() => router.push("/login")}
            >
              Sign in
            </Button>
          </div>
        </div>
      )}
      <form
        onSubmit={onSendMessage}
        className="mx-auto flex w-full max-w-5xl items-end gap-3 rounded-2xl border border-[#e9e5f2] bg-white p-3 shadow-[0_8px_30px_rgba(47,37,96,0.07)] sm:p-4"
      >
        <Field className="min-w-0">
          <FieldLabel htmlFor="message" className="sr-only">
            Message input
          </FieldLabel>
          <Textarea
            id="message"
            placeholder="Type your message here..."
            value={messageContent}
            onChange={(event) => setMessageContent(event.target.value)}
            onKeyDown={onMessageKeyDown}
            disabled={isSending}
            aria-describedby={
              errorMessage ? "message-hint chat-error" : "message-hint"
            }
            className="min-h-11 rounded-xl border-0 bg-transparent px-3 py-2.5 text-sm shadow-none placeholder:text-[#9993a8] focus-visible:ring-0 md:text-sm"
          />
          <p
            id="message-hint"
            className="px-3 text-xs text-[#9993a8]"
          >
            Enter to send; Shift+Enter for a new line.
          </p>
          {errorMessage && <FieldError id="chat-error">{errorMessage}</FieldError>}
        </Field>
        <Button
          variant="default"
          type="submit"
          size="icon-lg"
          disabled={isSending}
          aria-label="Send message"
          className="size-11 rounded-xl bg-[#4932c4] text-white shadow-sm shadow-[#4932c4]/20 hover:bg-[#3924ad]"
        >
          <ArrowUp />
        </Button>
      </form>
    </>
  );
};

export default InputBox;
