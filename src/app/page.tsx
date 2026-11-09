import InputBox from "@/components/input-box/input-box";
import MessageList from "@/components/message-list/message-list";
import SideBar from "@/components/side-bar/side-bar";

export default function Home() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#faf9ff] lg:flex-row">
      <SideBar />
      <main className="flex min-h-0 min-w-0 w-full flex-1 flex-col">
        <MessageList />
        <div className="shrink-0 px-4 pb-4 pt-3 sm:px-8 lg:px-12">
          <InputBox />
          <p className="mt-2 text-center text-xs text-muted-foreground">
            AskFolio can make mistakes. Check important information.
          </p>
        </div>
      </main>
    </div>
  );
}
