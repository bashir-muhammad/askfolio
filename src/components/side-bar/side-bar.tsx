"use client";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { useChatStore } from "@/store/chat-store";

const SideBar = () => {
  const { chats, activeChatId, createNewChat, setActiveChat } = useChatStore();
  return (
    <aside className="border-r p-4 bg-white/50">
      {chats.length > 0 && (
        <Button onClick={() => createNewChat()} className="w-full">
          <Plus data-icon="inline-start" />
          New Chat
        </Button>
      )}
      <ul className="mt-4 space-y-2">
        {chats.map((chat) => (
          <li key={chat.id}>
            <Button
              onClick={() => setActiveChat(chat.id)}
              variant="ghost"
              className={`${chat.id === activeChatId ? "font-bold" : ""}`}
            >
              {chat.title}
            </Button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SideBar;
