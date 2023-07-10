import { BubbleMenu, Editor } from "@tiptap/react";
import { FC } from "react";

type FloatingLinkBarProps = {
  editor: Editor | null;
  isVisible?: boolean;
};

const tippyOptions = {
  maxWidth: "none",
  zIndex: 100,
};

export const FloatingLinkBar: FC<FloatingLinkBarProps> = ({
  editor,
  isVisible = true,
}) => {
  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu tippyOptions={tippyOptions} editor={editor}>
      <input className="bg-white p-2 shadow-lg" type="text" />
    </BubbleMenu>
  );
};
