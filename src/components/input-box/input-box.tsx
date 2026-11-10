"use client";

import { SubmitEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useChatStore } from "@/store/chat-store";

const InputBox = () => {
  const [messageContent, setMessageContent] = useState("");
  const addChatMessage = useChatStore((s) => s.addChatMessage);
  const addChatMessageToChat = useChatStore((s) => s.addChatMessageToChat);
  const updateLastBotMessage = useChatStore((s) => s.updateLastBotMessage);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const onSendMessage = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = messageContent.trim();
    if (!message || isSending) {
      return;
    }

    const chatId = addChatMessage(message);
    setErrorMessage("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: message }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Chat request failed.");
      }

      addChatMessageToChat(chatId, "", "assistant");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        assistantMessage += decoder.decode(value, { stream: true });
        updateLastBotMessage(chatId, assistantMessage);
      }

      assistantMessage += decoder.decode();
      updateLastBotMessage(chatId, assistantMessage);
      setMessageContent("");
    } catch {
      setErrorMessage("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form
      onSubmit={onSendMessage}
      className="mx-auto flex w-full max-w-5xl items-end gap-3 rounded-2xl border border-[#e9e5f2] bg-white p-3 shadow-[0_8px_30px_rgba(47,37,96,0.07)] sm:p-4"
    >
      <Field className="min-w-0">
        <FieldLabel htmlFor="message" className="hidden">
          Message input
        </FieldLabel>
        <Textarea
          id="message"
          placeholder="Type your message here..."
          value={messageContent}
          onChange={(event) => setMessageContent(event.target.value)}
          disabled={isSending}
          aria-describedby={errorMessage ? "chat-error" : undefined}
          className="min-h-11 rounded-xl border-0 bg-transparent px-3 py-2.5 text-sm shadow-none placeholder:text-[#9993a8] focus-visible:ring-0 md:text-sm"
        />
        {errorMessage && (
          <FieldError id="chat-error">{errorMessage}</FieldError>
        )}
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
  );
};

export default InputBox;
