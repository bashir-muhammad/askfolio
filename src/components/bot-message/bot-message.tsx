import { Bot } from 'lucide-react';

const BotMessage = ({ message }: { message: string }) => {
  return (
    <div className="flex items-start flex-col w-full gap-4 p-4">
      <div className="flex flex-col items-start gap-1">
        <div className="flex items-center border rounded-full bg-secondary p-2 text-zinc-500 dark:text-zinc-900">
          <Bot size={16} />
          <span className="hidden">AI Bot</span>
        </div>
        <p className="ml-8 p-2 border rounded-lg rounded-tl-none bg-secondary  dark:text-zinc-900">{message}</p>
      </div>
    </div>
  );
};

export default BotMessage;