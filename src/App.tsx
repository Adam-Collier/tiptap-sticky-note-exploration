import { useRef, useEffect } from "react";
import "./App.css";
import { useTextEditor } from "./hooks/useTextEditor";
import { EditorContent } from "@tiptap/react";
import { containerFontSize } from "./utils/container-font-size";
import { FormatBar } from "./components/FormatBar";

function App() {
  const containerRef = useRef<any>();
  const requestRef = useRef<number>();

  const editor = useTextEditor({
    onCreate({ editor }) {
      const editorContent = localStorage.getItem("editor-content");

      if (editorContent?.includes("text")) {
        editor.commands.setContent(JSON.parse(editorContent));
      } else {
        // use the default content and move the cursor to the editorContent
        editor.commands.focus("end");
      }

      setTimeout(() => {
        containerFontSize({
          innerEl: containerRef.current.editorContentRef.current.firstChild,
          containerEl: containerRef.current.editorContentRef.current,
        });
      }, 0);
    },

    onUpdate({ editor }) {
      // save the new content to local storage.
      localStorage.setItem("editor-content", JSON.stringify(editor.getJSON()));

      containerFontSize({
        innerEl: containerRef.current.editorContentRef.current.firstChild,
        containerEl: containerRef.current.editorContentRef.current,
      });
    },
  });

  const handleParentClick = () => {
    editor?.commands.focus();
  };

  // Start observing the element when the component is mounted
  useEffect(() => {
    const element = containerRef.current.editorContentRef.current;

    if (!element) return;

    const observer = new ResizeObserver(() => {
      requestRef.current = requestAnimationFrame(() =>
        containerFontSize({
          innerEl: containerRef.current.editorContentRef.current.firstChild,
          containerEl: containerRef.current.editorContentRef.current,
        })
      );
    });

    observer.observe(element);

    return () => {
      // Cleanup the observer by unobserving all elements
      observer.disconnect();
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative flex flex-col justify-center relative gap-4 items-center">
        <FormatBar editor={editor} />

        <div onClick={handleParentClick}>
          <EditorContent
            editor={editor}
            ref={containerRef}
            className="@container resize overflow-auto bg-yellow-100 w-100 h-100 flex items-center justify-center outline-none shadow-2xl rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
