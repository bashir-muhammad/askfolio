"use client";

import UserMessage from "@/components/user-message/user-message";
import BotMessage from "@/components/bot-message/bot-message";

import { useChatStore } from "@/store/chat-store";

const MessageList = () => {
  const { chats, activeChatId } = useChatStore();
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full">
      {chats.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
          <h2 className="text-lg">No chats yet</h2>
          <p className="text-gray-900">Start a new chat with input field below</p>
        </div>
      )}
      {chats
        .find((chat) => chat.id === activeChatId)
        ?.messages.map((message) =>
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
