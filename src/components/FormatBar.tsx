import type { FC } from "react";
import { Editor } from "@tiptap/react";
import { Circle, TextAa } from "phosphor-react";
import { TextFormatBar } from "./TextFormatBar";
import { Popover } from "./ui/Popover";

type Props = {
  editor: Editor | null;
};

export const FormatBar: FC<Props> = ({ editor }) => {
  return (
    <div className="flex gap-2 items-center p-2 bg-white shadow-md rounded-lg">
      <Popover
        align="center"
        side="top"
        sideOffset={12}
        trigger={
          <button>
            <TextAa />
          </button>
        }
      >
        <TextFormatBar editor={editor} />
      </Popover>

      {/* <button>
        <Circle />
      </button> */}
    </div>
  );
};
