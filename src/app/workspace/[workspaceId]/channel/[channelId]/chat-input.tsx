import Quill from "quill";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";

import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { toast } from "sonner";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

interface SubmitProps {
  body: string;
  image: File | null;
}

// innerRef 는 Editor를 컴포넌트 외부에서 조작하기 위해 사용한다.
export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const editorRef = useRef<Quill | null>(null);

  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const { mutate: createMessage } = useCreateMessage();

  const handleSubmit = async ({ body }: SubmitProps) => {
    try {
      setIsPending(true);
      createMessage(
        {
          workspaceId,
          channelId,
          body,
        },
        { throwError: true },
      );

      // 아래 주석과 같이 초기화를 처리하면 이미지의 경우는 별도로
      // 초기화 해줘야 하므로 트릭을 사용합니다.
      // editorRef?.current?.setContents([]);
      setEditorKey((prevKey) => prevKey + 1);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <div className="w-full px-5">
        <Editor
          key={editorKey}
          variant="create"
          placeholder={placeholder}
          onSubmit={handleSubmit}
          disabled={isPending}
          innerRef={editorRef}
        />
      </div>
    </>
  );
};
