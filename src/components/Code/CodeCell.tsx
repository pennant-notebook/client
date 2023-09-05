import { Box, Stack, Typography, useTheme } from '../../utils/MuiImports';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import useProviderContext from '../../contexts/ProviderContext';
import CodeToolbar from './CodeToolbar';
import createCodeEditor from './createCodeEditor';
import { handleDredd, updateMetadata } from '../../services/dreddExecutionService';
import StyledBadge from '../UI/StyledComponents';
import { useCMThemeContext } from '../../contexts/ThemeManager';
import { YMapEvent } from '~/utils/notebookHelpers';
import { EditorView } from 'codemirror';
import styles from './CodeCell.module.css';
import { CodeCellProps } from '@/CellPropsTypes';

const CodeCell: React.FC<CodeCellProps> = ({ cellId, cell }) => {
  const content = cell.get('content');
  const notebookTheme = useTheme().palette.mode;
  const { editorTheme } = useCMThemeContext()!;
  const { awareness, notebookMetadata, docID } = useProviderContext()!;

  const cellMetadata = cell.get('metaData');
  const outputMap = cell.get('outputMap');
  const cellRunning = cellMetadata.get('isRunning');

  const [cellExeCount, setCellExeCount] = useState(cellMetadata.get('exeCount'));
  const [output, setOutput] = useState(outputMap.get('stdout'));
  const [status, setStatus] = useState(outputMap.get('status'));
  const [processing, setProcessing] = useState(cellRunning);
  const editorRef = useRef<EditorView | null>(null);
  const cellRef = useRef(null);

  const handleRunCode = useCallback(async () => {
    try {
      cellMetadata.set('isRunning', true);
      const response = await handleDredd(docID, cellId, cell.get('content').toString());
      const outputMap = cell.get('outputMap');
      outputMap.set('stdout', response.output);
      outputMap.set('status', response.type);
      return true;
    } catch (error: any) {
      console.error(error.message);
      if (error.message === 'critical error') {
        outputMap.set('status', 'critical');
        outputMap.set(
          'stdout',
          '⚠️ Critical Error: Notebook has been reset. Remove or debug the code in this cell, and re-run all cells again.'
        );
      }
    } finally {
      cellMetadata.set('isRunning', false);
    }

    updateMetadata(cellMetadata, notebookMetadata);
  }, [docID, cellId, cell, cellMetadata]);

  useEffect(() => {
    const editorContainer = document.querySelector(`#editor-${cellId}`);
    if (!editorRef.current) {
      const hasOutput = cell.get('outputMap').get('stdout');
      editorRef.current = createCodeEditor({ content, id: cellId, awareness, handleRunCode, editorTheme, hasOutput });
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
  }, [content, editorTheme]);

  useEffect(() => {
    cell.get('outputMap').observe(() => {
      setOutput(outputMap.get('stdout'));
      setStatus(outputMap.get('status') || 'output');
    });

    cellMetadata.observe((e: YMapEvent<any>) => {
      e.changes.keys.forEach((change, key: string) => {
        if (key === 'exeCount') {
          setCellExeCount(cellMetadata.get('exeCount') || '');
        } else if (key === 'isRunning') {
          setProcessing(cellMetadata.get('isRunning') || false);
        }
      });
    });
  }, [outputMap, cellMetadata, processing]);

  return (
    <Box
      ref={cellRef}
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%'
      }}>
      <Stack direction='row' sx={{ width: '100%', alignItems: 'center' }}>
        <StyledBadge badgeContent={processing ? '*' : cellExeCount || ' '} status={status} />
        <Box className={`${styles.codecellContainer} ${notebookTheme}`}>
          <CodeToolbar onClickRun={handleRunCode} id={cellId} processing={processing} />
          <Box id={`editor-${cellId}`}></Box>
          <Box className={`${styles.codecellOutput} ${styles[status]}`} sx={{ py: output ? '4px' : 0 }}>
            {processing ? (
              <Typography sx={{ ml: '5px', color: '#cfd1d8' }}>Processing...</Typography>
            ) : (
              output &&
              output?.split('\n').map((stdout: string, idx: number) => (
                <Typography key={idx} sx={{ ml: '5px', color: '#cfd1d8' }}>
                  {stdout}
                </Typography>
              ))
            )}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default CodeCell;
