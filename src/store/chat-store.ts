import { create } from "zustand";

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
  addChatMessageToChat: (chatId: string, content: string, role?: Role) => void;
  updateLastMessage: (chatId: string, message: Message) => void;
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

export const useChatStore = create<ChatStore>((set) => ({
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
        chats: state.chats.map((chat) => {
          return chat.id === activeChat.id
            ? appendMessage(chat, newMessage)
            : chat;
        }),
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

  updateLastMessage: (chatId: string, message: Message) => {
    set((state) => ({
      chats: state.chats.map((chat) => {
        if (chat.id !== chatId) return chat;
        if (chat.messages.length === 0) return chat;

        const updatedMessages = [...chat.messages];
        updatedMessages[updatedMessages.length - 1] = message;

        return {
          ...chat,
          messages: updatedMessages,
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  },
}));
