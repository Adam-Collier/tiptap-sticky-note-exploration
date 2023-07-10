import { EditorOptions, useEditor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";

export function useTextEditor(
  options?: Partial<Omit<EditorOptions, "extensions">>
) {
  return useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Strike,
      Link,
      TextAlign.configure({
        types: ["paragraph"],
        alignments: ["left", "right", "center"],
      }),
    ],
    content: "<p>Hello World</p>",
    editorProps: {
      attributes: {
        class:
          "w-full outline-none leading-tight text-[60px] children:m-0 p-8 min-w-0 overflow-y-scroll",
      },
    },
    autofocus: false,
    ...options,
  });
}
