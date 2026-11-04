"use client";
import InputBox from "@/components/input-box/input-box";
import UserMessage from "@/components/user-message/user-message";
import BotMessage from "@/components/bot-message/bot-message";
import MessageList from "@/components/message-list/message-list";
import { useChatStore } from "@/store/chat-store";

export default function Home() {
  const { chats, activeChatId } = useChatStore();

  return (
    <div className="flex items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <aside className="border-r p-4 bg-white/50">

        <p>Chat id: {activeChatId}</p>
        <p>Chat title: {chats.find((chat) => chat.id === activeChatId)?.title}</p>
      </aside>
      <main className="flex flex-col justify-between px-16 py-4 w-full h-full ">
        <MessageList>
          <div className="flex flex-col items-center justify-center gap-4">
            {chats.find((chat) => chat.id === activeChatId)?.messages.map((message) => (
              message.role === "user" ? (
                <UserMessage key={message.id} message={message.content} />
              ) : (
                <BotMessage key={message.id} message={message.content} />
              )
            ))}
          </div>
        </MessageList>
        <div className="sticky bottom-4 border rounded-2xl bg-white">
          <InputBox />
        </div>
      </main>
    </div>
  );
}
