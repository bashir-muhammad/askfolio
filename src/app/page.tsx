import InputBox from "@/components/input-box/input-box";
import MessageList from "@/components/message-list/message-list";
import SideBar from "@/components/side-bar/side-bar";

export default function Home() {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50">
      <SideBar />
      <main className="flex w-full flex-1 flex-col px-16 py-4">
        <MessageList />
        <div className="sticky bottom-2 shrink-0 border rounded-2xl bg-white shadow-lg">
          <InputBox />
        </div>
      </main>
    </div>
  );
}
