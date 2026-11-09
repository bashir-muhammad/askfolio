import InputBox from "@/components/input-box/input-box";
import MessageList from "@/components/message-list/message-list";
import SideBar from "@/components/side-bar/side-bar";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 lg:flex-row">
      <SideBar />
      <main className="flex min-w-0 w-full flex-1 flex-col px-4 py-4 sm:px-8 md:px-8 lg:px-16">
        <MessageList />
        <div className="sticky bottom-2 shrink-0 border rounded-2xl bg-white shadow-lg">
          <InputBox />
        </div>
      </main>
    </div>
  );
}
