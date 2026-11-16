import type { Content } from "@google/generative-ai";
import type { ChatRole } from "@/lib/chat-persistence";

export interface ConversationMessage {
  role: ChatRole;
  content: string;
}

const MAX_HISTORY_CHARACTERS = 20_000;

export function parseGuestHistory(value: unknown): ConversationMessage[] | null {
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value)) {
    return null;
  }

  const messages: ConversationMessage[] = [];
  for (const item of value) {
    if (
      typeof item !== "object" ||
      item === null ||
      !("role" in item) ||
      (item.role !== "user" && item.role !== "assistant") ||
      !("content" in item) ||
      typeof item.content !== "string" ||
      item.content.length > 4000
    ) {
      return null;
    }

    messages.push({ role: item.role, content: item.content });
  }

  return messages;
}

export function toGeminiHistory(messages: ConversationMessage[]): Content[] {
  const turns: Array<{ user: string; assistant: string }> = [];
  let pendingUserMessage: string | null = null;

  for (const message of messages) {
    if (!message.content.trim()) {
      continue;
    }

    if (message.role === "user") {
      pendingUserMessage = message.content;
    } else if (pendingUserMessage !== null) {
      turns.push({ user: pendingUserMessage, assistant: message.content });
      pendingUserMessage = null;
    }
  }

  const selectedTurns: Array<{ user: string; assistant: string }> = [];
  let remainingCharacters = MAX_HISTORY_CHARACTERS;

  for (let index = turns.length - 1; index >= 0; index -= 1) {
    const turn = turns[index];
    const turnLength = turn.user.length + turn.assistant.length;

    if (turnLength <= remainingCharacters) {
      selectedTurns.unshift(turn);
      remainingCharacters -= turnLength;
      continue;
    }

    if (remainingCharacters >= 2) {
      const userLength = Math.min(
        turn.user.length,
        Math.floor(remainingCharacters / 2),
      );
      const assistantLength = Math.min(
        turn.assistant.length,
        remainingCharacters - userLength,
      );
      selectedTurns.unshift({
        user: userLength > 0 ? turn.user.slice(-userLength) : "",
        assistant:
          assistantLength > 0 ? turn.assistant.slice(-assistantLength) : "",
      });
    }
    break;
  }

  const history: Content[] = [];
  for (const turn of selectedTurns) {
    history.push(
      { role: "user", parts: [{ text: turn.user }] },
      { role: "model", parts: [{ text: turn.assistant }] },
    );
  }

  return history;
}
