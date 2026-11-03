"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useChatStore } from "@/store/chat-store";

const InputBox = () => {
  const [messageContent, setMessageContent] = useState("");
  const addChatMessage = useChatStore((s) => s.addChatMessage);
  const [errorMessage, setErrorMessage] = useState("");

  const onSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = messageContent.trim();
    if (!message) {
      return;
    }

    addChatMessage( message);

    // const response = await fetch("/api/chat", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ content: message }),
    // });

    // if (!response.ok) {
    //   setErrorMessage("Failed to send message. Please try again.");
    //   return;
    // }

    // const data = await response.json();
    // console.log("Bot reply:", data.message);
    setMessageContent("");
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
          aria-describedby={errorMessage ? "chat-error" : undefined}
        />
        {errorMessage && (
          <FieldError id="chat-error">{errorMessage}</FieldError>
        )}
      </Field>
      <Button variant="default" type="submit" size="icon-lg">
        <Send />
        <span className="sr-only">Send</span>
      </Button>
    </form>
  );
};

export default InputBox;
