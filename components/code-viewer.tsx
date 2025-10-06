"use client";

import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-typescript";
import "prismjs/themes/prism.css";
import Editor from "react-simple-code-editor";

interface CodeViewerProps {
  code: string;
  language?: string | null;
}

export function CodeViewer({ code, language }: CodeViewerProps) {
  const highlight = (value: string) => {
    const lang = (language || "").toLowerCase();
    if (lang === "javascript") {
      return Prism.highlight(value, Prism.languages.javascript, "javascript");
    }
    if (lang === "typescript") {
      return Prism.highlight(value, Prism.languages.typescript, "typescript");
    }
    if (lang === "python") {
      return Prism.highlight(value, Prism.languages.python, "python");
    }
    return value;
  };

  return (
    <Editor
      value={code}
      onValueChange={() => {}}
      highlight={highlight}
      padding={16}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 12,
        borderRadius: "6px",
        border: "1px solid var(--border)",
        background: "var(--color-muted, #f5f5f5)",
      }}
    />
  );
}
