import type { NotebookType } from "../../src/types/NotebookTypes";

export const mockNotebook: NotebookType = {
  docID: "test-notebook-id",
  title: "Test Notebook",
  cells: [
    {
      id: "cell-1",
      type: "code",
      content: 'console.log("Hello World");',
      language: "javascript",
    },
    {
      id: "cell-2",
      type: "markdown",
      content: "# Test Markdown Cell",
    },
  ],
};

export const mockCodeCell = {
  id: "test-code-cell",
  type: "code" as const,
  content: 'console.log("test");',
  language: "javascript",
  output: "test",
};

export const mockMarkdownCell = {
  id: "test-markdown-cell",
  type: "markdown" as const,
  content: "# Test Heading",
};
