"use client";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Plus, X } from "lucide-react";
import { useChatStore } from "@/store/chat-store";

const SideBar = () => {
  const { chats, activeChatId, createNewChat, setActiveChat } = useChatStore();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const startNewChat = () => {
    createNewChat();
    dialogRef.current?.close();
  };

  const renderChatList = () => (
    <div className="pt-4">
      {chats.length > 0 && (
        <Button onClick={startNewChat} className="w-full">
          <Plus data-icon="inline-start" />
          New Chat
        </Button>
      )}
      <ul className="mt-4 space-y-2">
        {chats.map((chat) => (
          <li key={chat.id}>
            <Button
              onClick={() => {
                setActiveChat(chat.id);
                dialogRef.current?.close();
              }}
              variant="ghost"
              className={`w-full justify-start ${chat.id === activeChatId ? "font-bold" : ""}`}
            >
              {chat.title}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r bg-white/50 p-4 lg:block">
        {renderChatList()}
      </aside>
      <div className="px-4 pt-3 lg:hidden">
        <Button
          variant="outline"
          onClick={() => dialogRef.current?.showModal()}
          aria-label="Open chat history"
        >
          <Menu data-icon="inline-start" />
          Chats
        </Button>
      </div>
      <dialog
        ref={dialogRef}
        aria-labelledby="chat-history-title"
        className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-transparent p-0 backdrop:bg-black/50"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.close();
          }
        }}
      >
        <section className="flex h-full w-72 max-w-[85vw] flex-col border-r bg-white p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 id="chat-history-title" className="text-lg font-semibold">
              Chats
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close chat history"
            >
              <X />
            </Button>
          </div>
          {renderChatList()}
        </section>
      </dialog>
    </>
  );
};

export default SideBar;
