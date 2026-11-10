import { Bot } from "lucide-react";
import ReactMarkdown from 'react-markdown';

const BotMessage = ({ message }: { message: string }) => {
  return (
    <div className="mx-auto flex w-full max-w-5xl items-start gap-3">
      <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#5140bd] text-white shadow-sm shadow-[#5140bd]/20">
        <Bot size={17} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm font-semibold text-[#302b40]">AskFolio AI</span>
          <span className="rounded-full bg-[#eeebff] px-2 py-0.5 text-[10px] font-semibold text-[#5140bd]">
            Assistant
          </span>
        </div>
        <div className="prose prose-sm max-w-full rounded-2xl border border-[#ebe8f2] bg-white px-5 py-4 text-[#464153] shadow-[0_3px_14px_rgba(47,37,96,0.035)] prose-headings:font-semibold prose-headings:text-[#302b40] prose-a:text-[#5140bd] prose-strong:text-[#302b40] sm:px-6 sm:py-5">
          <ReactMarkdown>{message}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default BotMessage;