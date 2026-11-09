"use client";

import { SubmitEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
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
      className="flex items-center justify-between w-full gap-4 p-4"
    >
      <Field>
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
      >
        <Send />
        <span className="sr-only">Send</span>
      </Button>
    </form>
  );
};

export default InputBox;
