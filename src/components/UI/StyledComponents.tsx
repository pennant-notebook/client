import { styled, Button, Avatar } from '~/utils/MuiImports';
import { Badge } from 'antd';

export const StyledButton = styled(Button)({
  position: 'relative',
  marginLeft: '2rem',
  maxWidth: '160px',
  cursor: 'pointer',
  border: 'none',

  textTransform: 'capitalize',
  textAlign: 'left',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '-10px',
    top: 0,
    bottom: 0,
    width: '2px',
    backgroundColor: '#e0e0e0'
  }
});

interface CellPosAvatarProps {
  index: number;
}

export const CellPosAvatar = ({ index }: CellPosAvatarProps) => {
  return (
    <Avatar
      sx={{
        width: 18,
        height: 18,
        fontSize: '11px',
        fontFamily: 'Fira Code',
        color: '#b9b7b7',
        backgroundColor: 'transparent',
        opacity: 0.8,
        border: '1px solid transparent',
        p: index > 99 ? 1.2 : 1.1,
        zIndex: 1
      }}>
      {index}
    </Avatar>
  );
};

interface StyledBadgeProps {
  badgeContent: React.ReactNode;
  status: 'error' | 'critical' | 'default';
}

const StyledBadge: React.FC<StyledBadgeProps> = ({ badgeContent, status }) => {
  let backgroundColor: string;

  switch (status) {
    case 'error':
      backgroundColor = 'crimson';
      break;
    case 'critical':
      backgroundColor = 'yellow';
      break;
    default:
      backgroundColor = '#eff1f3'; // Default or dark theme
  }

  return (
    <Badge
      count={badgeContent}
      style={{
        borderRadius: '5px',
        marginRight: '12px',
        padding: '0px',
        backgroundColor,
        color: '#3d414d',
        boxShadow: '0 0 0 1px #d9d9d9 inset' // Adjusted for antd
      }}
      overflowCount={99}
    />
  );
};

export default StyledBadge;
