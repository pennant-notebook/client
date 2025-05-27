import { CodeCellProps } from "@/CellPropsTypes";
import { YMapEvent } from "@/YjsTypes";
import { Typography } from "antd";
import { EditorView } from "codemirror";
import { useCallback, useEffect, useRef, useState } from "react";
import useProviderContext from "~/contexts/ProviderContext";
import { useCMThemeContext } from "~/contexts/ThemeManager";
import { handleDredd, updateMetadata } from "~/services/codeExecution/dredd";
import { useTheme } from "~/utils/MuiImports";
import StyledBadge from "../../UI/StyledComponents";
import CodeToolbar from "../toolbar/CodeToolbar";
import styles from "./CodeCell.module.css";
import createCodeEditor from "./createCodeEditor";

const CodeCell = ({ cellId, cell }: CodeCellProps) => {
  const content = cell.get("content");
  const notebookTheme = useTheme().palette.mode;
  const { editorTheme } = useCMThemeContext()!;
  const { awareness, notebookMetadata, docID } = useProviderContext()!;

  const cellMetadata = cell.get("metaData");
  const outputMap = cell.get("outputMap");
  const cellRunning = cellMetadata.get("isRunning");

  const [cellExeCount, setCellExeCount] = useState(cellMetadata.get("exeCount"));
  const [output, setOutput] = useState(outputMap.get("stdout"));
  const [status, setStatus] = useState(outputMap.get("status"));
  const [processing, setProcessing] = useState(cellRunning);

  const editorRef = useRef<EditorView | null>(null);
  const cellRef = useRef(null);
  const language = notebookMetadata.get("language") || cell.get("language");

  const handleRunCode = useCallback(async () => {
    try {
      cellMetadata.set("isRunning", true);
      const response = await handleDredd(language, docID, cellId, cell.get("content").toString());
      const outputMap = cell.get("outputMap");
      outputMap.set("stdout", response.output);
      outputMap.set("status", response.type);
      return true;
    } catch (error: Error | unknown) {
      if (error instanceof Error && error.message === "critical error") {
        outputMap.set("status", "critical");
        outputMap.set(
          "stdout",
          "⚠️ Critical Error: Notebook has been reset. Remove or debug the code in this cell, and re-run all cells again."
        );
      }
    } finally {
      cellMetadata.set("isRunning", false);
      updateMetadata(cellMetadata, notebookMetadata);
    }
  }, [docID, cellId, cell, cellMetadata, notebookMetadata, language, outputMap]);

  useEffect(() => {
    const editorContainer = document.querySelector(`#editor-${cellId}`);
    if (!editorRef.current) {
      const hasOutput = cell.get("outputMap").get("stdout");
      editorRef.current = createCodeEditor({
        content,
        id: cellId,
        awareness,
        handleRunCode,
        editorTheme,
        hasOutput,
        language,
        notebookTheme,
      });
      if (editorContainer) {
        editorContainer.appendChild(editorRef.current.dom);
      }
    }

    return () => {
      if (editorContainer && editorContainer.firstChild) {
        editorContainer.removeChild(editorContainer.firstChild);
      }
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [
    content,
    editorTheme,
    notebookTheme,
    output,
    awareness,
    cell,
    cellId,
    handleRunCode,
    language,
  ]);

  useEffect(() => {
    cell.get("outputMap").observe(() => {
      setOutput(outputMap.get("stdout"));
      setStatus(outputMap.get("status") || "output");
    });

    cellMetadata.observe((e: YMapEvent<any>) => {
      e.changes.keys.forEach((change, key: string) => {
        if (key === "exeCount") {
          setCellExeCount(cellMetadata.get("exeCount") || "");
        } else if (key === "isRunning") {
          setProcessing(cellMetadata.get("isRunning") || false);
        }
      });
    });
  }, [outputMap, cellMetadata, processing, cell]);

  return (
    <div
      data-test="codeCell"
      ref={cellRef}
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}>
      <div
        data-test="codeCell-stack"
        style={{ width: "100%", display: "flex", alignItems: "center" }}>
        <StyledBadge
          badgeContent={processing ? "*" : cellExeCount || " "}
          status={status}
          data-test="codeCell-badge"
        />
        <div
          data-test="codeToolbar"
          className={`${styles.codecellContainer} ${notebookTheme}`}>
          <CodeToolbar
            onClickRun={handleRunCode}
            id={cellId}
            processing={processing}
            language={language}
            data-test="codeToolbar-component"
          />
          <div
            id={`editor-${cellId}`}
            data-test="codeEditor"
            data-testid={`editor-${cellId}`}></div>
          <div
            className={`${styles.codecellOutput} ${styles[notebookTheme]} ${styles[status]} `}
            style={{ paddingTop: output ? "4px" : 0, paddingBottom: output ? "4px" : 0 }}
            data-test="codeCell-outputBox">
            {processing ? (
              <Typography.Text
                data-test="processing"
                style={{ marginLeft: "5px", color: "#cfd1d8" }}>
                Processing...
              </Typography.Text>
            ) : (
              output &&
              output
                .split("\n")
                .filter(Boolean)
                .map((stdout: string, idx: number) => (
                  <div key={idx}>
                    <Typography.Text
                      style={{ marginLeft: "5px", color: "#cfd1d8" }}
                      data-test={`output`}>
                      {stdout}
                    </Typography.Text>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeCell;
