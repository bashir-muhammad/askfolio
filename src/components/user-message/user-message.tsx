import { User } from "lucide-react";
import Image from "next/image";

interface UserMessageProps {
  message: string;
  userName?: string | null;
  userImage?: string | null;
}

const UserMessage = ({ message, userName, userImage }: UserMessageProps) => {
  return (
    <div className="mx-auto flex w-full max-w-5xl justify-end">
      <div className="flex max-w-[88%] flex-col items-end sm:max-w-[78%]">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-[#777184]">
          <span>{userName || "Guest user"}</span>
          <span className="flex size-6 items-center justify-center overflow-hidden rounded-full bg-[#e8e4f5] text-[#6555c7]">
            {userImage ? (
              <Image
                src={userImage}
                alt={userName ? `${userName}'s avatar` : "User avatar"}
                className="size-full object-cover"
                width={24}
                height={24}
              />
            ) : (
              <User size={13} />
            )}
          </span>
        </div>
        <p className="rounded-2xl rounded-tr-md bg-[#4932c4] px-5 py-3 text-sm leading-6 text-white shadow-[0_5px_16px_rgba(73,50,196,0.16)]">
          {message}
        </p>
      </div>
    </div>
  );
};

export default UserMessage;