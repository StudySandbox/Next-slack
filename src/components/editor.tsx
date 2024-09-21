import { Delta, Op } from "quill/core";
import Quill, { type QuillOptions } from "quill";
import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { MdSend } from "react-icons/md";
import { PiTextAa } from "react-icons/pi";
import { ImageIcon, Smile } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";

import "quill/dist/quill.snow.css";
import { cn } from "@/lib/utils";

type EditorValueType = {
  image: File | null;
  body: string;
};

interface EditorProps {
  onSubmit: ({ image, body }: EditorValueType) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  variant?: "create" | "update";
}

const Editor = ({
  onSubmit,
  onCancel,
  placeholder = "Write something...",
  defaultValue = [],
  innerRef,
  disabled = false,
  variant = "create",
}: EditorProps) => {
  // 에디터의 상태관리를 위해 필요
  const [text, setText] = useState("");
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  // useEffect 에 넣어서 render 이슈가 발생할 경우를 제외하기 위해 ref 로 선언
  // 아래 값들은 렌더링을 유발하지 않는다.
  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);
  const disabledRef = useRef(disabled);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div"),
    );

    // 만약 current가 아닌 placeholder 를 그냥 넣었다면 dependency array에
    // placeholder 를 추가해야 한다고 표시가 되었을 것이다.
    // module key bindings를 통해 원래 enter가 했던 줄바꿈 동작을
    // 메세지 보내기 기능으로 커스텀한다. 그리고 shift + enter를
    // 줄바꿈 기능으로 전환한다.
    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                // TODO Submit form
                return;
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;

    //페이지 접근 시 자동으로 포커스
    quillRef.current.focus();

    // innerRef 가 있는경우
    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = "";
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };

    // innerRef는 ref이기때문에 렌더링 이슈가 발생하지 않을 것이다.
  }, [innerRef]);

  const toggleToolbar = () => {
    setIsToolbarVisible((current) => !current);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };

  // 에디터에 입력된 값이 있는지 체크
  // quillRef.current.getText()를 사용할 수도 있지만
  // 해당 함수는 상태를 업데이트 하지 않는다.
  // quill editor의 빈값은 <br/><p></p>의 형태로 빈값이지만 빈값이 아니다.
  // 따라서 replace를 이용해 값을 변경해준다.
  const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white transition focus-within:border-slate-300 focus-within:shadow-md">
          <div ref={containerRef} className="ql-custom h-full" />
          <div className="z-[5] flex px-2 pb-2">
            <Hint
              label={isToolbarVisible ? "Hide formatting" : "Show formatting"}
            >
              <Button
                disabled={disabled}
                size="iconSm"
                variant="ghost"
                onClick={toggleToolbar}
              >
                <PiTextAa className="size-4" />
              </Button>
            </Hint>
            <Hint label="Emoji">
              <Button
                disabled={disabled}
                size="iconSm"
                variant="ghost"
                onClick={() => {}}
              >
                <Smile className="size-4" />
              </Button>
            </Hint>
            {variant === "create" && (
              <Hint label="Image">
                <Button
                  disabled={disabled}
                  size="iconSm"
                  variant="ghost"
                  onClick={() => {}}
                >
                  <ImageIcon className="size-4" />
                </Button>
              </Hint>
            )}
            {variant === "update" && (
              <div className="ml-auto flex items-center gap-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  disabled={disabled}
                >
                  Cancel
                </Button>
                <Button
                  disabled={disabled || isEmpty}
                  onClick={() => {}}
                  size="sm"
                  className="bg-[#007a5a] text-white hover:bg-[#007a5a]/80"
                >
                  Save
                </Button>
              </div>
            )}
            {variant === "create" && (
              <Button
                disabled={disabled || isEmpty}
                onClick={() => {}}
                size="iconSm"
                className={cn(
                  "ml-auto",
                  isEmpty
                    ? "bg-white text-muted-foreground hover:bg-white"
                    : "bg-[#007a5a] text-white hover:bg-[#007a5a]/80",
                )}
              >
                <MdSend className="size-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="flex justify-end p-2 text-[10px] text-muted-foreground">
          <p>
            <strong>Shift + Return</strong>
            to add a new line
          </p>
        </div>
      </div>
    </>
  );
};

export default Editor;
