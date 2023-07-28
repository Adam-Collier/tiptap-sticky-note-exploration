import type { FC, PropsWithChildren } from 'react'
import { Editor } from '@tiptap/react'
import { Circle, TextAa } from 'phosphor-react'
import { TextFormatBar } from './TextFormatBar'
import { Popover } from './ui/Popover'

type Props = {
  editor: Editor | null
  handleLinkAction?: () => void
}

export const FormatBar: FC<PropsWithChildren<Props>> = ({
  editor,
  handleLinkAction,
  children,
}) => {
  return (
    <div className="flex gap-2 items-center p-2 bg-white shadow-md rounded-lg">
      {children}
    </div>
  )
}
