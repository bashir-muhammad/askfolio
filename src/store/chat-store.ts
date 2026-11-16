import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Role = "user" | "assistant";
export interface Message {
  id: string;
  role: Role;
  content: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  updatedAt?: string;
}

export const GUEST_CHAT_LIMIT = 3;

export type ChatStore = {
  chats: Chat[];
  activeChatId: string | null;
  guestChatsUsed: number;
  guestChatInProgress: boolean;
  createNewChat: () => void;
  setActiveChat: (chatId: string) => void;
  hydrateServerChats: (serverChats: Chat[]) => void;
  beginGuestChat: () => boolean;
  endGuestChat: (completed: boolean) => void;
  addChatMessage: (
    content: string,
    role?: Role,
  ) => { chatId: string; messageId: string };
  addChatMessageToChat: (
    chatId: string,
    content: string,
    role?: Role,
  ) => string | null;
  removeChatMessages: (
    chatId: string,
    messageIds: string[],
    originalTitle: string,
  ) => void;
  updateChatMessage: (
    chatId: string,
    messageId: string,
    content: string,
  ) => void;
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
      guestChatsUsed: 0,
      guestChatInProgress: false,

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
      hydrateServerChats: (serverChats: Chat[]) => {
        set({
          chats: serverChats,
          activeChatId: serverChats[0]?.id ?? null,
        });
      },
      beginGuestChat: () => {
        let started = false;
        set((state) => {
          if (
            state.guestChatsUsed >= GUEST_CHAT_LIMIT ||
            state.guestChatInProgress
          ) {
            return state;
          }

          started = true;
          return {
            guestChatsUsed: state.guestChatsUsed + 1,
            guestChatInProgress: true,
          };
        });
        return started;
      },
      endGuestChat: (completed: boolean) =>
        set((state) => {
          if (!state.guestChatInProgress) return state;
          return {
            guestChatInProgress: false,
            guestChatsUsed: completed
              ? state.guestChatsUsed
              : Math.max(state.guestChatsUsed - 1, 0),
          };
        }),
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
        return { chatId: targetChatId, messageId: newMessage.id };
      },

      addChatMessageToChat: (
        chatId: string,
        content: string,
        role: Role = "user",
      ) => {
        const newMessage = createMessage(content, role);
        let added = false;

        set((state) => {
          if (!state.chats.some((chat) => chat.id === chatId)) return state;

          added = true;
          return {
            chats: state.chats.map((chat) =>
              chat.id === chatId ? appendMessage(chat, newMessage) : chat,
            ),
          };
        });
        return added ? newMessage.id : null;
      },

      removeChatMessages: (
        chatId: string,
        messageIds: string[],
        originalTitle: string,
      ) => {
        set((state) => ({
          chats: state.chats.map((chat) => {
            if (chat.id !== chatId) return chat;
            const messages = chat.messages.filter(
              (message) => !messageIds.includes(message.id),
            );
            return {
              ...chat,
              messages,
              title: messages.length === 0 ? originalTitle : chat.title,
            };
          }),
        }));
      },

      updateChatMessage: (chatId: string, messageId: string, content: string) => {
        set((state) => {
          const chats = state.chats.map((chat) => {
            if (chat.id !== chatId) return chat;
            const messages = chat.messages.map((message) =>
              message.id === messageId ? { ...message, content } : message,
            );
            return { ...chat, messages };
          });
          return { chats };
        });
      },
    }),
    {
      name: "askfolio-chat-store",
      skipHydration: true,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        chats: state.chats,
        activeChatId: state.activeChatId,
        guestChatsUsed: state.guestChatsUsed,
      }),
    },
  ),
);
