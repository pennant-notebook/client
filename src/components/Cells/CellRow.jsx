import { Box, Stack, Divider } from '../../utils/MuiImports';
import MarkdownCell from '../Markdown/MarkdownCell';
import CodeCell from '../Code/CodeCell';
import { CellPosAvatar } from '../UI/StyledComponents';
import { memo } from 'react';

const CellRow = memo(({ cell, index }) => {
  const id = cell.get('id');
  const type = cell.get('type');
  const content = cell.get('content');

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
              {type === 'markdown' && <MarkdownCell id={id} content={content} cell={cell} />}
              {type === 'code' && <CodeCell key={`${id}`} cellId={id} cell={cell} content={content} />}
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
});

export default CellRow;
