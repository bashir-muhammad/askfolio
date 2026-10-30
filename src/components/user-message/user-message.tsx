import { User } from 'lucide-react';

const UserMessage = ({ message }: { message: string }) => {
  return (
    <div className="flex items-end flex-col w-full gap-4 p-4 ">
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center border rounded-full bg-secondary p-2 text-zinc-500 dark:text-zinc-900">
          <User size={16} />
          <span className="hidden">Guest User</span>
        </div>
        <p className="mr-8 p-2 border rounded-lg rounded-tr-none bg-primary text-white dark:text-zinc-900">{message}</p>
      </div>
    </div>
  );
};

export default UserMessage;