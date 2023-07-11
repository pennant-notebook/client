import { useState } from 'react';
import logo from '../../assets/pennant-logo.png';
import { checkDreddStatus, sendManyToDredd, resetContext } from '../../services/dreddExecutionService';
import useProviderContext from '../../contexts/ProviderContext';
import { Box, Button, IconButton, Menu, MenuItem, PlayCircleOutlineTwoTone, Refresh, MenuIcon } from '../MuiImports';

const Header = ({ roomID, codeCells }) => {
  const { doc, notebookMetadata } = useProviderContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const notebookList = ['Notebook 1', 'Notebook 2', 'Notebook 3'];
  const codeCellsForDredd = codeCells.map(c => ({
    id: c.get('id'),
    code: c.get('content').toString()
  }));

  const handleRunAllCode = async () => {
    const token = await sendManyToDredd(roomID, codeCellsForDredd);
    const response = await checkDreddStatus(token);

    response.forEach(codeCell => {
      const cell = doc
        .getArray('cells')
        .toArray()
        .find(c => c.get('id') === codeCell['id']);
      if (cell && codeCell.output) {
        const outputMap = cell.get('outputMap');
        outputMap.set('stdout', codeCell.output);
      }
    });
  };

  const handleResetContext = async () => {
    await resetContext(roomID);
    notebookMetadata.set('executionCount', 0);
    codeCells.forEach(cell => {
      cell.get('outputMap').set('stdout', '');
      cell.get('metaData').set('exeCount', 0);
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        minHeight: '60px',
        maxHeight: '10vh',
        borderBottom: '3px solid #e0e0e0',
        backgroundColor: '#f5f5f5',
        padding: '0 20px'
      }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <img src={logo} width='120px' />
        <Button
          aria-controls='simple-menu'
          aria-haspopup='true'
          onClick={e => setAnchorEl(e.currentTarget)}
          sx={{
            fontFamily: 'Lato',
            borderColor: '#36454F',
            color: '#36454F',
            fontWeight: '500',
            marginLeft: '20px'
          }}>
          <MenuIcon />
          Notebooks
        </Button>
        <Menu
          id='simple-menu'
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}>
          {notebookList.map((notebook, index) => (
            <MenuItem key={index} onClick={() => setAnchorEl(null)}>
              {notebook}
            </MenuItem>
          ))}
        </Menu>
      </Box>
      <Box>
        <IconButton
          onClick={handleResetContext}
          sx={{
            color: '#36454F',
            '&:hover': {
              color: '#36454F',
              backgroundColor: '#D3D3D3'
            },
            borderRadius: '8px',
            padding: '10px'
          }}>
          <Refresh sx={{ fontSize: '48px' }} />
        </IconButton>
        <IconButton
          onClick={handleRunAllCode}
          sx={{
            color: '#36454F',
            '&:hover': {
              color: '#36454F',
              backgroundColor: '#D3D3D3'
            },
            borderRadius: '8px',
            padding: '10px'
          }}>
          <PlayCircleOutlineTwoTone sx={{ fontSize: '48px' }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Header;
