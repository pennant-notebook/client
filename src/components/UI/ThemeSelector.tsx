import { FormatPainterOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import { CodeMirrorThemeContextType, useCMThemeContext } from '~/contexts/ThemeManager';

interface ThemeSelectorProps {
  currTheme: string;
}

const ThemeSelector = ({ currTheme }: ThemeSelectorProps) => {
  const contextValue: CodeMirrorThemeContextType | null = useCMThemeContext();

  if (!contextValue) {
    return null;
  }

  const items = contextValue.codeMirrorThemes.map(theme => ({
    key: theme.name,
    label: theme.name,
    className: theme.name === currTheme ? 'active' : '',
    onClick: () => contextValue.toggleCMTheme(theme)
  }));

  return (
    <Dropdown
      className={`button-normal ${currTheme === 'dark' ? 'dark-theme' : ''}`}
      menu={{ items }}
      trigger={['click']}
      onOpenChange={open => {
        if (!open) {
          // Handle dropdown close
        }
      }}>
      <Button type='text' onClick={e => e.stopPropagation()} icon={<FormatPainterOutlined />} block>
        Code Theme
      </Button>
    </Dropdown>
  );
};

export default ThemeSelector;
