import { create } from 'zustand';


export type Role = 'user' | 'assistant';
export interface Message {
  id: string;
  role?: Role;
  content: string;
};

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  updatedAt?: string;
};

export type ChatStore = {
  chats: Chat[];
  activeChatId: string | null;
  createNewChat: () => void;
  setActiveChat: (chatId: string) => void;
  addChatMessage: (content: string, role?: Role) => void;
  updateLastMessage: (chatId: string, message: Message) => void;
};

const id = () => Math.random().toString(36).slice(2, 10);

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
      chats: [ newChat, ...state.chats],
      activeChatId: newChat.id,
    }));
  },
  setActiveChat: (chatId: string) => {
    set({ activeChatId: chatId });
  },
  addChatMessage: (content: string, role?: Role) => {
    const newMessage: Message = {
      id: id(),
      role: role || 'user',
      content,
    };

    set((state) => {
      if (!state.activeChatId) {
        const newChat: Chat = {
          id: id(),
          title: content.substring(0, 20) || "New Chat",
          messages: [newMessage],
          updatedAt: new Date().toISOString(),
        };

        return {
          chats: [newChat, ...state.chats],
          activeChatId: newChat.id,
        };
      }

      return {
        chats: state.chats.map((chat) => {
          if (chat.id !== state.activeChatId) return chat;

          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            title: chat.title === "New Chat" ? content.substring(0, 20) || "New Chat" : chat.title,
            updatedAt: new Date().toISOString(),
          };
        }),
      };
    });
  },

  updateLastMessage: (chatId: string, message: Message) => {
    set((state) => ({
      chats: state.chats.map((chat) => {
        if (chat.id !== chatId) return chat;

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