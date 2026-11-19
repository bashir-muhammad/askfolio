import type { Message } from "@/store/chat-store";
import type { ConversationMessage } from "@/lib/conversation-history";
import type { ChatModelId } from "@/lib/chat-models";

interface BuildChatRequestInput {
  content: string;
  chatId: string;
  title?: string;
  messages: Message[];
  isGuest: boolean;
  model: ChatModelId;
  webSearch: boolean;
  guestChatsUsed: number;
}

function getGuestHistory(messages: Message[]): ConversationMessage[] {
  return messages.flatMap((message) =>
    message.role === "user" || message.role === "assistant"
      ? [{ role: message.role, content: message.content }]
      : [],
  );
}

export function buildChatRequestInit({
  content,
  chatId,
  title,
  messages,
  isGuest,
  guestChatsUsed,
  model,
  webSearch,
}: BuildChatRequestInput): RequestInit {
  const history = isGuest
    ? getGuestHistory(messages)
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
      model,
      webSearch,
    }),
  };
}
