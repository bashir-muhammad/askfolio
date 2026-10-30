import InputBox from "@/components/input-box/input-box";
import UserMessage from "@/components/user-message/user-message";
import BotMessage from "@/components/bot-message/bot-message";

export default function Home() {
  return (
    <div className="flex items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <aside className="border-r p-4 bg-white/50">
        <p>AI Chat</p>
        <p> Chat History</p>
      </aside>
      <main className="flex flex-col justify-between px-16 py-4 w-full h-full ">
        <div className="flex flex-col items-center justify-center gap-4">
          <UserMessage message="Hello! How can I assist you today?" />
          <BotMessage message="Hello! sure. lore" />
          <BotMessage message="Hello! sure. lore" />

          <BotMessage message="Hello! sure. lore" />

          <BotMessage message="Hello! sure. lore" />

          <BotMessage message="Hello! sure. lore" />

          <BotMessage message="Hello! sure. lore" />
          <BotMessage message="Hello! sure. lore" />
          <BotMessage message="Hello! sure. lore" />

          <BotMessage message="Hello! sure. lore" />
          <BotMessage message="Hello! sure. lore" />

          <UserMessage message="Hello! How can I assist you today?" />
          <BotMessage message="Hello! sure. lorem ipsum dolor sit amet and lurem absom" />

        </div>
        <div className="sticky bottom-4 border rounded-2xl bg-white">
          <InputBox />
        </div>
      </main>
    </div>
  );
}
