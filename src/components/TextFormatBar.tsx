import { useRef } from "react";
import type { FC, PropsWithChildren } from "react";
import { Editor } from "@tiptap/react";
import {
  TextBolder,
  TextStrikethrough,
  TextItalic,
  LinkSimpleHorizontal,
  TextAlignCenter,
  TextAlignLeft,
  TextAlignRight,
} from "phosphor-react";

type Props = {
  editor: Editor | null;
};

type IconButtonProps = {
  onClick?: (event: any) => void;
  isActive?: boolean;
};

const IconButton: FC<PropsWithChildren<IconButtonProps>> = ({
  children,
  onClick,
  isActive,
}) => (
  <button
    onClick={onClick}
    className={[
      isActive && "text-blue-500",
      "bg-transparent hover:bg-gray-50 p-3",
    ]
      .filter(Boolean)
      .join(" ")}
  >
    {children}
  </button>
);

export const TextFormatBar: FC<Props> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const linkInputRef = useRef<HTMLInputElement>(null);

  // const handleSaveLinkClick = () => {
  //   if (!linkInputRef.current) {
  //     return;
  //   }

  //   if (linkInputRef.current.value.length === 0) {
  //     editor?.chain().focus().extendMarkRange("link").unsetLink().run();
  //     return;
  //   }

  //   editor
  //     ?.chain()
  //     .focus()
  //     .extendMarkRange("link")
  //     .setLink({ href: linkInputRef.current.value })
  //     .run();
  // };

  return (
    <>
      <div className="flex gap-2 p-2 bg-white shadow-sm rounded-md">
        <IconButton
          onClick={() => {
            editor?.chain().focus().toggleBold().run();
          }}
          isActive={editor.isActive("bold")}
        >
          <TextBolder />
        </IconButton>
        <IconButton
          onClick={() => {
            editor?.chain().focus().toggleStrike().run();
          }}
          isActive={editor.isActive("strike")}
        >
          <TextStrikethrough />
        </IconButton>
        <IconButton
          onClick={() => {
            editor?.chain().focus().toggleItalic().run();
          }}
          isActive={editor.isActive("italic")}
        >
          <TextItalic />
        </IconButton>
        <IconButton>
          <LinkSimpleHorizontal />
        </IconButton>

        <div className="h-full w-px bg-gray-200" />

        <IconButton
          onClick={() => editor.commands.setTextAlign("left")}
          isActive={editor.isActive({ textAlign: "left" })}
        >
          <TextAlignLeft />
        </IconButton>

        <IconButton
          onClick={() => editor.commands.setTextAlign("center")}
          isActive={editor.isActive({ textAlign: "center" })}
        >
          <TextAlignCenter />
        </IconButton>

        <IconButton
          onClick={() => editor.commands.setTextAlign("right")}
          isActive={editor.isActive({ textAlign: "right" })}
        >
          <TextAlignRight />
        </IconButton>
      </div>
    </>
  );
};
