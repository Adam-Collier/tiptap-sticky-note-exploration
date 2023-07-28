import { forwardRef, useRef } from 'react'
import type { FC, PropsWithChildren } from 'react'
import { Editor } from '@tiptap/react'
import {
  TextBolder,
  TextStrikethrough,
  TextItalic,
  LinkSimpleHorizontal,
  TextAlignCenter,
  TextAlignLeft,
  TextAlignRight,
} from 'phosphor-react'
import { FormatOption, handleBulkTextFormat } from '../utils/bulk-text-format'

type Props = {
  editor: Editor | null
  handleLinkAction?: () => void
}

type IconButtonProps = {
  onClick?: (event: any) => void
  isActive?: boolean
}

export const IconButton = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<IconButtonProps>
>(({ children, onClick, isActive }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    className={[
      isActive && 'text-blue-500',
      'bg-transparent hover:bg-gray-50 p-3',
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {children}
  </button>
))

export const TextFormatBar: FC<Props> = ({ editor, handleLinkAction }) => {
  if (!editor) {
    return null
  }

  const linkInputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <div
        className={[
          'flex gap-2 p-2 bg-white shadow-sm rounded-md',
          // !editor.state.selection.empty &&
          'animate-[fade-in-up_150ms_ease-in_forwards]',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <IconButton
          onClick={() => {
            if (editor.state.selection.empty) {
              handleBulkTextFormat({
                editor,
                formatOption: FormatOption.BOLD,
              })
            } else {
              editor?.chain().focus().toggleBold().run()
            }
          }}
          isActive={editor.isActive('bold')}
        >
          <TextBolder />
        </IconButton>
        <IconButton
          onClick={() => {
            if (editor.state.selection.empty) {
              handleBulkTextFormat({
                editor,
                formatOption: FormatOption.STRIKETHROUGH,
              })
            } else {
              editor?.chain().focus().toggleStrike().run()
            }
          }}
          isActive={editor.isActive('strike')}
        >
          <TextStrikethrough />
        </IconButton>
        <IconButton
          onClick={() => {
            if (editor.state.selection.empty) {
              handleBulkTextFormat({
                editor,
                formatOption: FormatOption.ITALIC,
              })
            } else {
              editor?.chain().focus().toggleItalic().run()
            }
          }}
          isActive={editor.isActive('italic')}
        >
          <TextItalic />
        </IconButton>

        {!editor.state.selection.empty && (
          <IconButton onClick={handleLinkAction}>
            <LinkSimpleHorizontal />
          </IconButton>
        )}

        <div className="h-full w-px bg-gray-200" />

        <IconButton
          onClick={() => editor.commands.setTextAlign('left')}
          isActive={editor.isActive({ textAlign: 'left' })}
        >
          <TextAlignLeft />
        </IconButton>

        <IconButton
          onClick={() => editor.commands.setTextAlign('center')}
          isActive={editor.isActive({ textAlign: 'center' })}
        >
          <TextAlignCenter />
        </IconButton>

        <IconButton
          onClick={() => editor.commands.setTextAlign('right')}
          isActive={editor.isActive({ textAlign: 'right' })}
        >
          <TextAlignRight />
        </IconButton>
      </div>
    </>
  )
}
