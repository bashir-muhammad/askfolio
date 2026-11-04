import InputBox from "@/components/input-box/input-box";
import MessageList from "@/components/message-list/message-list";
import SideBar from "@/components/side-bar/side-bar";

export default function Home() {
  return (
    <div className="flex justify-center bg-zinc-50">
      <SideBar />
      <main className="flex flex-col justify-between px-16 py-4 w-full h-screen ">
        <MessageList />
        <div className="sticky bottom-4 border rounded-2xl bg-white">
          <InputBox />
        </div>
      </main>
    </div>
  );
}
