import type { Message } from "@/store/chat-store";

interface BuildChatRequestInput {
  content: string;
  chatId: string;
  title?: string;
  messages: Message[];
  isGuest: boolean;
  guestChatsUsed: number;
}

export function buildChatRequestInit({
  content,
  chatId,
  title,
  messages,
  isGuest,
  guestChatsUsed,
}: BuildChatRequestInput): RequestInit {
  const history = isGuest
    ? messages.flatMap((message) =>
        message.role === "user" || message.role === "assistant"
          ? [{ role: message.role, content: message.content }]
          : [],
      )
    : undefined;

  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-guest-chat-count": String(isGuest ? guestChatsUsed : 0),
    },
    body: JSON.stringify({
      content,
      chatId,
      title,
      history,
      guestChatCount: isGuest ? guestChatsUsed : 0,
    }),
  };
}
