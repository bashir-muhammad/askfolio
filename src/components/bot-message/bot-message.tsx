import { Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const BotMessage = ({ message }: { message: string }) => {
  return (
    <div className="flex items-start flex-col w-full gap-4 p-4">
      <div className="flex flex-col items-start gap-1">
        <div className="flex items-center border rounded-full bg-secondary p-2 text-zinc-500 dark:text-zinc-900">
          <Bot size={16} />
          <span className="hidden">AI Assistant</span>
        </div>
        <div className="prose dark:prose-invert max-w-full mx-4 md:mx-8 p-4 border rounded-lg rounded-tl-none bg-secondary  dark:text-zinc-900">
          <ReactMarkdown>{message}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default BotMessage;