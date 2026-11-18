export const CHAT_MODEL_PROVIDERS = [
  {
    name: "Google",
    models: [
      { id: "gemini-3.5-flash-lite", name: "Gemini 3.5 Flash Lite" },
      { id: "gemini-3.5-flash", name: "Gemini 3.5 Flash" },
    ],
  },
] as const;

export type ChatModelId =
  (typeof CHAT_MODEL_PROVIDERS)[number]["models"][number]["id"];

export const DEFAULT_CHAT_MODEL: ChatModelId = "gemini-3.5-flash-lite";

const chatModelIds = new Set<ChatModelId>(
  CHAT_MODEL_PROVIDERS.flatMap((provider) =>
    provider.models.map((model) => model.id),
  ),
);

export function isChatModelId(value: unknown): value is ChatModelId {
  return typeof value === "string" && chatModelIds.has(value as ChatModelId);
}
