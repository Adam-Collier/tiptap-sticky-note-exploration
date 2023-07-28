import { useRef, useEffect, useState, MouseEventHandler } from 'react'
import './App.css'
import { useTextEditor } from './hooks/useTextEditor'
import { EditorContent } from '@tiptap/react'
import { containerFontSize } from './utils/container-font-size'
import { FormatBar } from './components/FormatBar'
import { FloatingLinkBar } from './components/FloatingLinkBar'
import { IconButton, TextFormatBar } from './components/TextFormatBar'
import { EditorState, TextSelection } from '@tiptap/pm/state'
import { Popover } from './components/ui/Popover'
import { TextAa } from 'phosphor-react'

function App() {
  const containerRef = useRef<any>()
  const requestRef = useRef<number>()
  const linkInputRef = useRef<HTMLInputElement>(null)
  const [isTextSelected, setIsTextSelected] = useState(false)

  const [isLinkBarVisible, setIsLinkBarVisible] = useState(false)
  const [linkBarPosition, setLinkBarPosition] = useState({
    left: 0,
    top: 0,
  })
  const [linkBarHref, setLinkBarHref] = useState('')
  const hoverNodePosition = useRef<{ pos: number; nodeSize: number } | null>(
    null,
  )

  const editor = useTextEditor({
    onCreate({ editor }) {
      const editorContent = localStorage.getItem('editor-content')

      if (editorContent?.includes('text')) {
        editor.commands.setContent(JSON.parse(editorContent))
      } else {
        // use the default content and move the cursor to the editorContent
        editor.commands.focus('end')
      }

      setTimeout(() => {
        containerFontSize({
          innerEl: containerRef.current.editorContentRef.current.firstChild,
          containerEl: containerRef.current.editorContentRef.current,
        })
      }, 0)
    },

    onUpdate({ editor }) {
      // save the new content to local storage.
      localStorage.setItem('editor-content', JSON.stringify(editor.getJSON()))

      containerFontSize({
        innerEl: containerRef.current.editorContentRef.current.firstChild,
        containerEl: containerRef.current.editorContentRef.current,
      })
    },

    onSelectionUpdate({ editor }) {
      const { empty } = editor.state.selection

      if (empty) {
        setIsTextSelected(false)
      } else {
        if (!isTextSelected) {
          setIsTextSelected(true)
        }

        const position = getFloatingLinkBarPosition()

        if (position) {
          setLinkBarPosition(position)
        }
      }
    },
  })

  const handleParentClick = (event) => {
    console.log(event.target, event.currentTarget)
    if (event.target === event.currentTarget) {
      editor?.commands.focus()
    }
  }

  // Start observing the element when the component is mounted
  useEffect(() => {
    const element = containerRef.current.editorContentRef.current

    if (!element) return

    const observer = new ResizeObserver(() => {
      requestRef.current = requestAnimationFrame(() =>
        containerFontSize({
          innerEl: containerRef.current.editorContentRef.current.firstChild,
          containerEl: containerRef.current.editorContentRef.current,
        }),
      )
    })

    observer.observe(element)

    return () => {
      // Cleanup the observer by unobserving all elements
      observer.disconnect()
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])

  const handleLinkAction = () => {
    if (editor?.state.selection.empty) return
    // wrap the selection in a span to look like highlighted text
    setIsLinkBarVisible((isLinkBarVisible) => !isLinkBarVisible)

    setTimeout(() => {
      linkInputRef.current?.querySelector('input')?.focus()
    }, 0)
  }

  useEffect(() => {
    // Handle clicks outside the floating menu to close it.
    const handleClickOutsideMenu = (event) => {
      if (
        linkInputRef.current &&
        !linkInputRef.current.contains(event.target)
      ) {
        setIsLinkBarVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutsideMenu)

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMenu)
    }
  }, [])

  const handleSetLink = () => {
    if (!linkInputRef.current) return

    const value = linkInputRef.current?.querySelector('input')?.value

    if (!editor) return

    if (hoverNodePosition.current) {
      editor?.commands.setTextSelection({
        from: hoverNodePosition.current.pos,
        to: hoverNodePosition.current.pos + hoverNodePosition.current.nodeSize,
      })

      if (value === '') {
        editor.commands.unsetLink()
      } else {
        editor
          ?.chain()
          .focus()
          .extendMarkRange('link')
          .updateAttributes('link', {
            href: value,
          })
          .run()
      }

      editor?.commands.focus()
      hoverNodePosition.current = null
    } else {
      if (value === '') {
        editor?.chain().focus().unsetLink().run()
      } else {
        editor
          ?.chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: value })
          .run()
      }
    }
    setIsLinkBarVisible(false)
  }

  const getFloatingLinkBarPosition = (element?: HTMLElement) => {
    if (!editor) return

    if (editor.state.selection.empty) {
      // if the selection is empty and an element is passed, use the element's position
      if (element) {
        const pos = element.getBoundingClientRect()

        const editorPosition =
          containerRef.current.editorContentRef.current.getBoundingClientRect()

        const left = pos.left - editorPosition.left
        const top = pos.top - editorPosition.top

        return { left, top }
      }
    } else {
      const { view } = editor
      const { ranges } = editor.state.selection
      // const from = Math.min(...ranges.map((range) => range.$from.pos))
      // const to = Math.max(...ranges.map((range) => range.$to.pos))

      // const editorPosition = view.dom.getBoundingClientRect()
      const editorPosition =
        containerRef.current.editorContentRef.current.getBoundingClientRect()
      const selection = editor.state.selection

      // Get the starting position of the selection (the anchor)
      const anchorPos = selection.anchor
      // Get the coordinates of the anchor position relative to the editor
      const pos = view.coordsAtPos(anchorPos)

      // Get the left and top coordinates of the anchor position
      const left = pos.left - editorPosition.left
      const top = pos.top - editorPosition.top

      console.log({ top, left })

      return { left, top }
    }
  }

  const handleLinkHover = (event) => {
    if (!editor) return
    const { target } = event
    const { view } = editor

    // if the target is not a link, return
    if (!editor?.state.selection.empty) return

    const pos = view.posAtDOM(target, 0)
    if (pos <= 0) return

    const node = view.state.doc.nodeAt(pos)

    if (!node || node.type.name !== 'text') return
    if (target.tagName !== 'A' && node.marks.length === 1) return

    const link = node.marks.find((mark) => mark.type.name === 'link')
    if (!link) return

    const href = link?.attrs.href

    hoverNodePosition.current = { pos, nodeSize: node.nodeSize }

    setLinkBarHref(href || '')
    // set the position of the link bar to the position of the link
    setIsLinkBarVisible(true)
    const { left, top } = getFloatingLinkBarPosition(target)
    setLinkBarPosition({ left, top })
  }

  const handleLinkHoverLeave = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    const { currentTarget, relatedTarget } = event
    if (!editor?.state.selection.empty) return

    // if we are hovering over the link bar or the link itself so nothing
    // but if we are hovering over something else, hide the link bar
    if (currentTarget.tagName === 'A') {
      return
    }

    if (
      linkInputRef.current?.parentElement?.contains(
        relatedTarget as HTMLElement,
      )
    ) {
      return
    }

    hoverNodePosition.current = null
    setIsLinkBarVisible(false)
  }

  const handleRemoveLink = () => {
    if (!editor) return

    if (hoverNodePosition.current) {
      editor?.commands.setTextSelection({
        from: hoverNodePosition.current.pos,
        to: hoverNodePosition.current.pos + hoverNodePosition.current.nodeSize,
      })

      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
    }

    editor?.commands.focus()
    hoverNodePosition.current = null

    editor?.chain().focus().unsetLink().run()
    setIsLinkBarVisible(false)
  }

  return (
    <>
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative flex flex-col justify-center relative gap-4 items-center">
          {isTextSelected ? (
            <TextFormatBar
              editor={editor}
              handleLinkAction={handleLinkAction}
            />
          ) : (
            <FormatBar editor={editor} handleLinkAction={handleLinkAction}>
              <Popover
                align="center"
                side="top"
                sideOffset={12}
                trigger={
                  <IconButton>
                    <TextAa />
                  </IconButton>
                }
              >
                <TextFormatBar
                  editor={editor}
                  handleLinkAction={handleLinkAction}
                />
              </Popover>
            </FormatBar>
          )}
          <div
            className="relative"
            onMouseOver={handleLinkHover}
            onMouseOut={handleLinkHoverLeave}
          >
            <EditorContent
              onClick={handleParentClick}
              editor={editor}
              ref={containerRef}
              className="@container resize overflow-auto bg-yellow-100 w-100 h-100 flex items-center justify-center outline-none shadow-2xl rounded-lg"
            />
            {isLinkBarVisible && (
              <FloatingLinkBar
                editor={editor}
                isVisible={isLinkBarVisible}
                ref={linkInputRef}
                handleSetLink={handleSetLink}
                handleRemoveLink={handleRemoveLink}
                link={linkBarHref}
                left={linkBarPosition.left}
                top={linkBarPosition.top}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
