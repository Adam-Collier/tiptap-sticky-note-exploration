import { BubbleMenu, Editor } from '@tiptap/react'
import { FC, forwardRef, useRef, useState } from 'react'
import { ControlledBubbleMenu } from './ui/ControlledBubbleMenu'
import { ArrowUDownLeft, Pencil, Tabs, Trash } from 'phosphor-react'

type FloatingLinkBarProps = {
  editor: Editor | null
  isVisible: boolean
  left: number
  top: number
  link?: string
  handleSetLink: () => void
  handleRemoveLink: () => void
}

export const FloatingLinkBar = forwardRef<
  HTMLInputElement,
  FloatingLinkBarProps
>(
  (
    { editor, isVisible, handleSetLink, handleRemoveLink, left, top, link },
    ref,
  ) => {
    const [isEditMode, setIsEditMode] = useState(false)

    if (!editor) {
      return null
    }

    const linkInputRef = useRef<HTMLInputElement>(null)

    const tippyOptions = {
      maxWidth: 'none',
      zIndex: 100,
    }

    const removeLink = () => {
      editor.chain().focus().unsetLink().run()
    }

    // render a bubble menu with a link input which only appears when a state variable is set
    return (
      <ControlledBubbleMenu
        editor={editor}
        open={isVisible}
        left={left}
        top={top}
      >
        {(!editor.state.selection.empty || isEditMode) && (
          <div className="bg-white p-1 rounded-lg flex gap-2 w-50" ref={ref}>
            <input
              ref={linkInputRef}
              type="text"
              placeholder="Enter link..."
              autoFocus
              onKeyDown={(event) => {
                if (event.key === 'Enter' && linkInputRef.current) {
                  handleSetLink()
                }
              }}
              defaultValue={
                editor?.getAttributes('link').href ||
                editor.state.selection.empty
                  ? link
                  : ''
              }
              className="w-full p-2 border-none outline-none"
            />
            <button onClick={handleSetLink} className="bg-[#acfd28] p-2">
              <ArrowUDownLeft size={16} />
            </button>
          </div>
        )}

        {editor.state.selection.empty && !isEditMode && (
          <div
            className="bg-white p-1 rounded-lg flex gap-2 items-center"
            ref={ref}
          >
            <p className="w-40 text-sm p-2 leading-1 m-0">{link}</p>
            <button onClick={() => setIsEditMode(true)} className="p-2">
              <Pencil size={16} />
            </button>
            <button onClick={handleSetLink} className="p-2">
              <Tabs size={16} />
            </button>
            <button onClick={handleRemoveLink} className="p-2">
              <Trash size={16} />
            </button>
          </div>
        )}
      </ControlledBubbleMenu>
    )
  },
)
