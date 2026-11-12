import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "user" | "assistant";
export interface Message {
  id: string;
  role?: Role;
  content: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  updatedAt?: string;
}

export type ChatStore = {
  chats: Chat[];
  activeChatId: string | null;
  createNewChat: () => void;
  setActiveChat: (chatId: string) => void;
  addChatMessage: (content: string, role?: Role) => string;
  addChatMessageToChat: (
    chatId: string,
    content: string,
    role?: Role,
  ) => void;
  updateLastBotMessage: (chatId: string, partial: string) => void;
};

const id = () => Math.random().toString(36).slice(2, 10);

const createMessage = (content: string, role: Role = "user"): Message => ({
  id: id(),
  role,
  content,
});

const appendMessage = (chat: Chat, message: Message): Chat => ({
  ...chat,
  messages: [...chat.messages, message],
  title:
    chat.title === "New Chat"
      ? message.content.substring(0, 20) || "New Chat"
      : chat.title,
  updatedAt: new Date().toISOString(),
});

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      chats: [],
      activeChatId: null,

      createNewChat: () => {
        const newChat: Chat = {
          id: id(),
          title: "New Chat",
          messages: [],
        };
        set((state) => ({
          chats: [newChat, ...state.chats],
          activeChatId: newChat.id,
        }));
      },
      setActiveChat: (chatId: string) => {
        set((state) =>
          state.chats.some((chat) => chat.id === chatId)
            ? { activeChatId: chatId }
            : state,
        );
      },
      addChatMessage: (content: string, role: Role = "user") => {
        const newMessage = createMessage(content, role);
        let targetChatId = "";

        set((state) => {
          const activeChat = state.chats.find(
            (chat) => chat.id === state.activeChatId,
          );
          if (!activeChat) {
            const newChat: Chat = {
              id: id(),
              title: content.substring(0, 20) || "New Chat",
              messages: [newMessage],
              updatedAt: new Date().toISOString(),
            };
            targetChatId = newChat.id;

            return {
              chats: [newChat, ...state.chats],
              activeChatId: newChat.id,
            };
          }

          targetChatId = activeChat.id;
          return {
            chats: state.chats.map((chat) =>
              chat.id === activeChat.id ? appendMessage(chat, newMessage) : chat,
            ),
          };
        });
        return targetChatId;
      },

      addChatMessageToChat: (
        chatId: string,
        content: string,
        role: Role = "user",
      ) => {
        const newMessage = createMessage(content, role);

        set((state) => {
          if (!state.chats.some((chat) => chat.id === chatId)) return state;

          return {
            chats: state.chats.map((chat) =>
              chat.id === chatId ? appendMessage(chat, newMessage) : chat,
            ),
          };
        });
      },

      updateLastBotMessage: (chatId: string, partial: string) => {
        set((state) => {
          const chats = state.chats.map((chat) => {
            if (chat.id !== chatId) return chat;
            const messages = [...chat.messages];
            const last = messages[messages.length - 1];
            if (last && last.role === "assistant") {
              messages[messages.length - 1] = { ...last, content: partial };
            }
            return { ...chat, messages };
          });
          return { chats };
        });
      },
    }),
    {
      name: "askfolio-chat-store",
      skipHydration: true,
    },
  ),
);
