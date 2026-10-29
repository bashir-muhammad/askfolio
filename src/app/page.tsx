import {Button} from "@/components/ui/button";
export default function Home() {
  return (
    <div className="flex items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <aside className="border-r p-4 bg-white/50">
        <p>AI Chat</p>
        <p> Chat History</p>
      </aside>
      <main className="flex flex-1 w-full flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        Main content
        <Button>Start chatting</Button>
      </main>
    </div>
  );
}
