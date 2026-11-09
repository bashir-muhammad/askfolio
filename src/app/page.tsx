import InputBox from "@/components/input-box/input-box";
import MessageList from "@/components/message-list/message-list";
import SideBar from "@/components/side-bar/side-bar";

export default function Home() {
  return (
    <div className="flex justify-center bg-zinc-50 h-screen">
      <SideBar />
      <main className="flex flex-col justify-between px-16 py-4 w-full">
        <MessageList />
        <div className="sticky bottom-2 border rounded-2xl bg-white shadow-lg">
          <InputBox />
        </div>
      </main>
    </div>
  );
}
