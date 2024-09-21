import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef } from "react";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

// innerRef 는 Editor를 컴포넌트 외부에서 조작하기 위해 사용한다.
export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);

  return (
    <>
      <div className="w-full px-5">
        <Editor
          variant="create"
          placeholder={placeholder}
          onSubmit={() => {}}
          disabled={false}
          innerRef={editorRef}
        />
      </div>
    </>
  );
};
