import { ProviderContextType } from "@/ProviderTypes";
import { YMap } from "@/YjsTypes";
import { PlayCircleOutlined, RedoOutlined } from "@ant-design/icons";
import { Button, Spin, Tooltip } from "antd";
import { useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import { selectedDocIdState } from "~/appState";
import useProviderContext from "~/contexts/ProviderContext";
import { handleResetContext, handleRunAllCode } from "~/services/codeExecution/dredd";
import styles from "./DreddButtons.module.css";

interface DreddButtonsProps {
  codeCells: YMap[] | undefined;
}

const DreddButtons = ({ codeCells = [] }: DreddButtonsProps) => {
  const { notebookMetadata } = useProviderContext() as ProviderContextType;
  const { docID: paramsDoc } = useParams();
  const selectedDocId = useRecoilValue(selectedDocIdState);
  const docID = paramsDoc || selectedDocId;
  const [resetting, setResetting] = useState(false);
  const [running, setRunning] = useState(false);

  const handleRunAll = async () => {
    const orderedCells = codeCells.sort((a, b) => a.get("pos") - b.get("pos"));

    try {
      setRunning(true);
      orderedCells.forEach((cell) => cell.get("metaData").set("isRunning", true));
      if (!docID) return;
      await handleRunAllCode(docID, orderedCells, notebookMetadata);
    } catch (error) {
      console.error(error);
    } finally {
      orderedCells.forEach((cell) => cell.get("metaData").set("isRunning", false));
      setRunning(false);
    }
  };

  const handleReset = async () => {
    try {
      setResetting(true);
      codeCells.forEach((c) => {
        c.get("metaData").set("isRunning", true);
        c.get("outputMap").set("status", "");
      });
      if (!docID) return;

      await handleResetContext(docID, notebookMetadata, codeCells);

      toast.success("Context successfully reset");
    } catch (error) {
      console.error(error);
    } finally {
      codeCells.forEach((c) => c.get("metaData").set("isRunning", false));
      setResetting(false);
    }
  };

  const isDisabledRun = () => {
    return running || resetting || codeCells.length < 1;
  };

  const isDisabledReset = () => {
    return running || resetting || codeCells.length < 1;
  };

  return (
    <div className={styles.buttonGroup}>
      <Tooltip title="Reset Code Execution Context" mouseEnterDelay={1} mouseLeaveDelay={0}>
        <Button
          className={styles.navbarActions}
          disabled={isDisabledReset()}
          onClick={handleReset}
          icon={resetting ? <Spin /> : <RedoOutlined />}
        />
      </Tooltip>

      <Tooltip title="Run All Code Cells" mouseEnterDelay={1} mouseLeaveDelay={0}>
        <Button
          className={styles.navbarActions}
          disabled={isDisabledRun()}
          onClick={handleRunAll}
          icon={running ? <Spin /> : <PlayCircleOutlined />}
        />
      </Tooltip>
    </div>
  );
};

export default DreddButtons;
