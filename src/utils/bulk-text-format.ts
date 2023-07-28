import { Editor } from '@tiptap/react'

type handleBulkFormatting = {
  editor: Editor
  formatOption: FormatOption
}

export enum FormatOption {
  BOLD = 'bold',
  ITALIC = 'italic',
  STRIKETHROUGH = 'strikethrough',
}

export const handleBulkTextFormat = ({
  editor,
  formatOption,
}: handleBulkFormatting) => {
  // exit early if there is no editor or if there is a text selection
  if (!editor || !editor?.state.selection.empty) return

  if (editor) {
    switch (formatOption) {
      case 'bold':
        editor?.chain().focus().selectAll().toggleBold().run()
        break
      case 'italic':
        editor?.chain().focus().selectAll().toggleItalic().run()
        break
      case 'strikethrough':
        editor?.chain().focus().selectAll().toggleStrike().run()
        break
      default:
        break
    }

    // move the cursor to the end of the editor
    editor?.commands.focus('end')
  }
}
