import { CodeCellType, MarkdownCellType } from '@/CellTypes';
import { CodeCellContent, MarkdownCellContent } from '@/ContentTypes';
import React from 'react';
import { Box, Divider, Stack } from '../../utils/MuiImports';
import CodeCell from '../Code/CodeCell';
import MarkdownCell from '../Markdown/MarkdownCell';
import { CellPosAvatar } from '../UI/StyledComponents';

interface CellRowProps {
  cell: MarkdownCellType | CodeCellType;
  index: number;
}

const CellRow: React.FC<CellRowProps> = ({ cell, index }) => {
  const id = cell.id;
  const type = cell.type;
  const content = cell.content;

  return (
    <Box width='100%'>
      <Box>
        <Stack
          direction='row'
          alignItems='center'
          sx={{
            width: '75%',
            mx: 'auto'
          }}>
          <Box display='flex' alignItems='center' width='100%' sx={{ ml: -2 }}>
            <Divider flexItem orientation='vertical' sx={{ mr: 3, zIndex: 3 }}>
              <CellPosAvatar index={index + 1} />
            </Divider>
            <Box alignItems='center' sx={{ flexGrow: 1, position: 'relative' }}>
              {type === 'markdown' && (
                <MarkdownCell id={id} cell={cell as MarkdownCellType} content={content as MarkdownCellContent} />
              )}
              {type === 'code' && (
                <CodeCell key={id} cellId={id} cell={cell as CodeCellType} content={content as CodeCellContent} />
              )}
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default CellRow;
