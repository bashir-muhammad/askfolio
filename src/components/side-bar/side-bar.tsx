"use client";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Clock3, Menu, MessageSquare, Plus, X } from "lucide-react";
import { useChatStore } from "@/store/chat-store";

const SideBar = () => {
  const { chats, activeChatId, createNewChat, setActiveChat } = useChatStore();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const startNewChat = () => {
    createNewChat();
    dialogRef.current?.close();
  };

  const renderChatList = () => (
    <div className="flex min-h-0 flex-1 flex-col pt-5">
      <Button
        onClick={startNewChat}
        className="h-11 w-full justify-start rounded-xl bg-primary px-4 font-semibold text-primary-foreground shadow-sm shadow-primary/15 hover:bg-primary/90"
      >
        <Plus data-icon="inline-start" />
        New conversation
      </Button>
      <div className="mb-2 mt-7 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        <Clock3 size={14} />
        Recent chats
      </div>
      <ul className="min-h-0 space-y-1 overflow-y-auto">
        {chats.map((chat) => (
          <li key={chat.id}>
            <Button
              onClick={() => {
                setActiveChat(chat.id);
                dialogRef.current?.close();
              }}
              variant="ghost"
              className={`h-10 w-full justify-start truncate rounded-xl px-3 text-left text-sm ${
                chat.id === activeChatId
                  ? "bg-white font-semibold text-[#4633b3] shadow-sm hover:bg-white"
                  : "text-[#625d70] hover:bg-white/70 hover:text-foreground"
              }`}
            >
              <MessageSquare className="mr-1" size={16} />
              <span className="truncate">{chat.title}</span>
            </Button>
          </li>
        ))}
      </ul>
      {chats.length === 0 && (
        <p className="px-3 py-3 text-sm leading-6 text-muted-foreground">
          Your conversations will show up here.
        </p>
      )}
    </div>
  );

  return (
    <>
      <aside className="hidden w-[280px] shrink-0 flex-col border-r border-[#ebe8f4] bg-[#f4f2fb] px-4 py-5 lg:flex">
        {renderChatList()}
      </aside>
      <div className="border-b border-[#ebe8f4] px-4 py-3 lg:hidden">
        <Button
          variant="outline"
          onClick={() => dialogRef.current?.showModal()}
          aria-label="Open chat history"
          className="rounded-xl border-[#e7e3f0] bg-white text-[#4c4561]"
        >
          <Menu data-icon="inline-start" />
          Chat history
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
        <section className="flex h-full w-72 max-w-[85vw] flex-col border-r border-[#ebe8f4] bg-[#f8f7fd] p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 id="chat-history-title" className="text-lg font-semibold">
              Recent chats
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
