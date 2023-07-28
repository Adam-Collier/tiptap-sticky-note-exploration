import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
} from '@floating-ui/react-dom'
import { Editor, isNodeSelection } from '@tiptap/core'
import { posToDOMRect } from '@tiptap/react'
import { ReactNode, useLayoutEffect } from 'react'

type Props = {
  editor: Editor
  open: boolean
  children: ReactNode
  left: number
  top: number
}

// Adapted from https://github.com/ueberdosis/tiptap/issues/2305#issuecomment-1020665146
export const ControlledBubbleMenu = ({
  editor,
  open,
  children,
  left,
  top,
}: Props) => {
  const { refs } = useFloating()

  if (!open) {
    return null
  }

  return (
    <div
      className="floating-bar-menu"
      ref={refs.setFloating}
      style={{
        left,
        top: top - 40,
        width: 'auto',
        position: 'absolute',
        paddingBottom: '25px',
      }}
    >
      {children}
    </div>
  )
}
