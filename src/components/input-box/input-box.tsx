"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, SubmitEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, ChevronDownIcon, Globe2, Sparkles } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GUEST_CHAT_LIMIT, useChatStore } from "@/store/chat-store";
import { buildChatRequestInit } from "@/lib/chat-request";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Switch } from "../ui/switch";
import { InputGroupButton } from "../ui/input-group";
import { Label } from "../ui/label";
import {
  CHAT_MODEL_PROVIDERS,
  DEFAULT_CHAT_MODEL,
  type ChatModelId,
} from "@/lib/chat-models";

const InputBox = () => {
  const { status } = useSession();
  const router = useRouter();
  const [messageContent, setMessageContent] = useState("");
  const [model, setModel] = useState<ChatModelId>(DEFAULT_CHAT_MODEL);
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
  const selectedModelName =
    CHAT_MODEL_PROVIDERS
      .flatMap((provider) => provider.models)
      .find((providerModel) => providerModel.id === model)?.name ??
    CHAT_MODEL_PROVIDERS[0].models[0].name;
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
      const response = await fetch("/api/chat", {
        ...buildChatRequestInit({
          content: message,
          chatId,
          title: activeChat?.title,
          messages: activeChat?.messages ?? [],
          isGuest,
          guestChatsUsed,
          model,
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const errorPayload = await response.json().catch(() => null);
        throw new Error(errorPayload?.error ?? "Chat request failed.");
      }

      const assistantMessageId = addChatMessageToChat(chatId, "", "assistant");
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
          You&apos;ve used your {GUEST_CHAT_LIMIT} free chats. Sign in to
          continue chatting.
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
        className="mx-auto flex flex-col w-full max-w-5xl items-end gap-3 rounded-2xl border border-[#e9e5f2] bg-white p-3 shadow-[0_8px_30px_rgba(47,37,96,0.07)] sm:p-4"
      >
        <Field className="">
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
        </Field>
        <div className="flex w-full items-center gap-2">
          <Label
            htmlFor="web-search"
            className="flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-transparent bg-[#f5f3fa] px-2.5 text-xs font-medium text-[#625d70] transition-colors hover:border-[#ded9e8] hover:bg-[#efecf6]"
          >
            <Globe2 className="size-3.5" />
            <span className="sr-only">Web</span>
            <Switch id="web-search" size="sm" className="ml-0.5" />
          </Label>

          <Field className="w-fit shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <InputGroupButton
                    size="sm"
                    className="h-8 w-fit whitespace-nowrap rounded-full border border-transparent bg-[#f5f3fa] px-2.5 text-xs font-medium text-[#625d70] hover:border-[#ded9e8] hover:bg-[#efecf6]"
                  />
                }
              >
                <Sparkles className="size-3.5 text-[#4932c4]" />
                <span>{selectedModelName}</span>
                <ChevronDownIcon className="size-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuRadioGroup value={model} onValueChange={setModel}>
                  {CHAT_MODEL_PROVIDERS.map((provider) => (
                    <>
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="sr-only">
                          {provider.name}
                        </DropdownMenuLabel>
                        {provider.models.map((model) => (
                          <>
                            <DropdownMenuRadioItem
                              value={model.id}
                              closeOnClick
                            >
                              {model.name}
                            </DropdownMenuRadioItem>
                          </>
                        ))}
                      </DropdownMenuGroup>
                    </>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </Field>

          <Button
            variant="default"
            type="submit"
            size="icon-lg"
            disabled={isSending}
            aria-label="Send message"
            className="ml-auto size-10 rounded-full bg-[#4932c4] text-white shadow-sm shadow-[#4932c4]/20 hover:bg-[#3924ad]"
          >
            <ArrowUp className="size-5" />
          </Button>
        </div>

        {errorMessage && (
          <div className="w-full">
            <FieldError id="chat-error">{errorMessage}</FieldError>
          </div>
        )}
      </form>
    </>
  );
};

export default InputBox;
