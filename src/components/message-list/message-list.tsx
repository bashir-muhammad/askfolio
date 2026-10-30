import type { ReactNode } from "react";

const MessageList = ({ children }: { children: ReactNode }) => {
  return (
    <div className="">
      {children}
    </div>
  );
};

export default MessageList;
