"use client";

import { useEffect, useRef, useState } from "react";
import { Bold, Italic, List, ListOrdered, Link2, Heading2 } from "lucide-react";

type RichTextEditorProps = {
  name: string;
  defaultValue?: string;
};

function ToolbarButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="rounded-xl border border-white/10 bg-white/5 p-2 text-gray-200 transition hover:bg-white/10"
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ name, defaultValue = "" }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState(defaultValue);

  useEffect(() => {
    setContent(defaultValue);
  }, [defaultValue]);

  const exec = (command: string, value?: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    setContent(editorRef.current.innerHTML);
  };

  const addLink = () => {
    const value = window.prompt("Enter URL");
    if (!value) return;
    exec("createLink", value);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-black/20">
      <div className="flex flex-wrap gap-2 border-b border-white/10 p-3">
        <ToolbarButton title="Bold" onClick={() => exec("bold")}>
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton title="Italic" onClick={() => exec("italic")}>
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton title="Heading" onClick={() => exec("formatBlock", "<h2>")}>
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton title="Bulleted List" onClick={() => exec("insertUnorderedList")}>
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton title="Numbered List" onClick={() => exec("insertOrderedList")}>
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton title="Link" onClick={addLink}>
          <Link2 size={16} />
        </ToolbarButton>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(event) => setContent(event.currentTarget.innerHTML)}
        className="min-h-[280px] w-full px-4 py-4 text-base text-white outline-none [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:mb-4"
        dangerouslySetInnerHTML={{ __html: defaultValue }}
      />

      <input type="hidden" name={name} value={content} />
    </div>
  );
}
