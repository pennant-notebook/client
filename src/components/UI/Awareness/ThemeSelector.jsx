import { useState } from 'react';
import { Box, Menu, MenuItem, BrushIcon } from '../../../utils/MuiImports';
import IconRow from '../IconRow';
import { useCMThemeContext } from '../../../contexts/ThemeManager';

const ThemeSelector = () => {
  const { toggleCMTheme, codeMirrorThemes } = useCMThemeContext();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleThemeClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleThemeClose = () => {
    setAnchorEl(null);
  };

  const handleThemeSelect = theme => {
    toggleCMTheme(theme);
    handleThemeClose();
  };

  return (
    <Box>
      <IconRow icon={<BrushIcon />} onClick={handleThemeClick} text='Code Themes' />
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleThemeClose}>
        {codeMirrorThemes.map(theme => (
          <MenuItem key={theme.name} onClick={() => handleThemeSelect(theme)}>
            {theme.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
export default ThemeSelector;
