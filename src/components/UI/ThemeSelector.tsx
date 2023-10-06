import { useState, MouseEvent } from 'react';
import { Box, Menu, MenuItem, BrushIcon } from '~/utils/MuiImports';
import IconRow from './IconRow';
import { CodeMirrorThemeContextType, useCMThemeContext } from '~/contexts/ThemeManager';
import { Extension } from '@codemirror/state';

interface CodeMirrorThemeType {
  name: string;
  theme: Extension;
}

const ThemeSelector = () => {
  const contextValue: CodeMirrorThemeContextType | null = useCMThemeContext();

  if (!contextValue) {
    return null;
  }
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleThemeClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleThemeClose = () => {
    setAnchorEl(null);
  };

  const handleThemeSelect = (theme: CodeMirrorThemeType) => {
    contextValue.toggleCMTheme(theme);
    handleThemeClose();
  };

  return (
    <Box>
      <IconRow icon={<BrushIcon />} onClick={handleThemeClick} text='Code Themes' />
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleThemeClose}>
        {contextValue.codeMirrorThemes.map(theme => (
          <MenuItem key={theme.name} onClick={() => handleThemeSelect(theme)}>
            {theme.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
export default ThemeSelector;
