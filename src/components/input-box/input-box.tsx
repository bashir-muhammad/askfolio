import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Field, FieldLabel } from "../ui/field";
const InputBox = () => {
  return (
    <div className="flex items-center justify-between w-full gap-4 p-4 border-t border-zinc-200 dark:border-zinc-800">
      <Field>
        <FieldLabel htmlFor="message" className="hidden">Message input</FieldLabel>
        <Input type="text" id="message" placeholder="Type your message here..." />
      </Field>
      <Button variant="default">
        <Send className="w-4 h-4" />
        Send
      </Button>
    </div>
  );
};

export default InputBox;
