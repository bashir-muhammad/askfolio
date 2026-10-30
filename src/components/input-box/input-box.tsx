import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";

const InputBox = () => {
  return (
    <div className="flex items-center justify-between w-full gap-4 p-4 ">
      <Field>
        <FieldLabel htmlFor="message" className="hidden">Message input</FieldLabel>
        <Textarea id="message" placeholder="Type your message here..." />
      </Field>
      <Button variant="default" size="icon-lg" >
        <Send />
        <span className="sr-only">Send</span>
      </Button>
    </div>
  );
};

export default InputBox;
