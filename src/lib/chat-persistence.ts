import { promises as fs } from "fs";
import path from "path";

export type ChatRole = "user" | "assistant";

export interface StoredMessage {
  id: string;
  role: ChatRole;
  content: string;
}

export interface StoredChat {
  id: string;
  title: string;
  messages: StoredMessage[];
  updatedAt: string;
}

export type StoredChatMap = Record<string, StoredChat[]>;

const DATA_DIRECTORY = path.join(process.cwd(), ".data");
const STORE_PATH = path.join(DATA_DIRECTORY, "chats.json");

function normalizeTitle(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "New Chat";
  }

  return trimmed.slice(0, 60).replace(/\s+/g, " ");
}

async function readStore(): Promise<StoredChatMap> {
  try {
    await fs.mkdir(DATA_DIRECTORY, { recursive: true });
    const content = await fs.readFile(STORE_PATH, "utf8");
    if (!content.trim()) {
      return {};
    }

    const parsed = JSON.parse(content) as Partial<StoredChatMap>;
    return parsed && typeof parsed === "object" ? (parsed as StoredChatMap) : {};
  } catch {
    return {};
  }
}

async function writeStore(store: StoredChatMap) {
  await fs.mkdir(DATA_DIRECTORY, { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function getChatsForUser(email: string): Promise<StoredChat[]> {
  const store = await readStore();
  const chats = store[email] ?? [];
  return [...chats].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

export async function getChatForUser(
  email: string,
  chatId: string,
): Promise<StoredChat | null> {
  const store = await readStore();
  return store[email]?.find((chat) => chat.id === chatId) ?? null;
}

export async function createChatForUser(
  email: string,
  input: { id?: string; title?: string; message?: StoredMessage },
): Promise<StoredChat> {
  const store = await readStore();
  const timestamp = new Date().toISOString();
  const chatId = input.id ?? `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const newChat: StoredChat = {
    id: chatId,
    title: normalizeTitle(input.title ?? "New Chat"),
    messages: input.message ? [input.message] : [],
    updatedAt: timestamp,
  };

  const userChats = store[email] ?? [];
  const nextChats = [newChat, ...userChats.filter((chat) => chat.id !== chatId)];
  store[email] = nextChats;
  await writeStore(store);

  return newChat;
}

export async function appendMessageToChat(
  email: string,
  chatId: string,
  message: StoredMessage,
  title?: string,
): Promise<StoredChat | null> {
  const store = await readStore();
  const userChats = store[email] ?? [];
  const chatIndex = userChats.findIndex((chat) => chat.id === chatId);

  if (chatIndex === -1) {
    return createChatForUser(email, {
      id: chatId,
      title: title ?? normalizeTitle(message.content),
      message,
    });
  }

  const existingChat = userChats[chatIndex];
  const nextChat: StoredChat = {
    ...existingChat,
    title:
      existingChat.title === "New Chat" && title
        ? normalizeTitle(title)
        : existingChat.title,
    messages: [...existingChat.messages, message],
    updatedAt: new Date().toISOString(),
  };

  const nextChats = [...userChats];
  nextChats[chatIndex] = nextChat;
  store[email] = nextChats;
  await writeStore(store);

  return nextChat;
}

export async function upsertChatMessage(
  email: string,
  input: {
    chatId?: string;
    title?: string;
    content: string;
    role: ChatRole;
  },
): Promise<StoredChat> {
  const store = await readStore();
  const userChats = store[email] ?? [];
  const chatId = input.chatId ?? `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date().toISOString();
  const message: StoredMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role: input.role,
    content: input.content,
  };

  const existingChat = userChats.find((chat) => chat.id === chatId);

  if (!existingChat) {
    const createdChat = {
      id: chatId,
      title: normalizeTitle(input.title ?? input.content),
      messages: [message],
      updatedAt: now,
    };

    store[email] = [createdChat, ...userChats];
    await writeStore(store);
    return createdChat;
  }

  const nextChat: StoredChat = {
    ...existingChat,
    title:
      existingChat.title === "New Chat" && input.title
        ? normalizeTitle(input.title)
        : existingChat.title,
    messages: [...existingChat.messages, message],
    updatedAt: now,
  };

  store[email] = userChats.map((chat) => (chat.id === chatId ? nextChat : chat));
  await writeStore(store);

  return nextChat;
}
