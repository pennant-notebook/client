import { useState, useRef, useEffect } from 'react';
import { Box, Divider, IconButton, useTheme } from '~/utils/MuiImports';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import NotebookTreeView from './NotebookTreeView';
import { NotebookType } from '@/NotebookTypes';

interface LeftSidebarProps {
  username: string;
  notebooks?: NotebookType[];
  refetch: () => void;
  setSelectedDocId: (docId: string) => void;
  isNotebookRendered?: boolean;
}

export default function LeftSidebar({
  username,
  notebooks,
  refetch,
  setSelectedDocId,
  isNotebookRendered
}: LeftSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [floatingMode, setFloatingMode] = useState(false);
  const [showChevron, setShowChevron] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const theme = useTheme().palette.mode;

  const handleExpandCollapse = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (floatingMode) {
      setIsExpanded(true);
      setFloatingMode(false);
    } else {
      setIsExpanded(false);
      setFloatingMode(true);
    }
  };

  const handleMouseEnter = () => {
    setShowChevron(true);
    if (floatingMode) {
      timerRef.current = setTimeout(() => {
        setIsExpanded(true);
      }, 1000);
    }
  };

  const handleMouseLeave = () => {
    setShowChevron(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (floatingMode) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    setFloatingMode(false);
    setIsExpanded(true);
    return () => {
      clearTimeout(timerRef.current!);
    };
  }, []);

  const sidebarWidth = 250;
  return (
    <div style={{ position: 'relative', zIndex: 5 }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div
        style={{
          height: '100vh',
          overflow: 'hidden',
          width: sidebarWidth,
          transform: isExpanded ? 'translateX(0)' : `translateX(-${sidebarWidth - 30}px)`,
          transition: 'transform 0.35s cubic-bezier(0.2, 0, 0, 1)',
          position: 'fixed',
          backgroundColor: theme === 'dark' ? '#1e202d' : '#fff'
        }}>
        <Divider
          orientation='vertical'
          sx={{
            position: 'fixed',
            height: '100vh',
            left: sidebarWidth
          }}
        />
        <Box
          style={{
            height: '100vh',
            width: sidebarWidth
          }}>
          <Box
            sx={{
              width: sidebarWidth,
              position: 'relative',
              pt: 2
            }}>
            {isExpanded && (
              <NotebookTreeView
                username={username}
                notebooks={notebooks}
                refetch={refetch}
                setSelectedDocId={setSelectedDocId}
              />
            )}
          </Box>
        </Box>
      </div>
      <Box
        sx={{
          position: 'fixed',
          top: 10,
          left: isExpanded ? sidebarWidth - 15 : 15,
          opacity: showChevron ? 1 : 0,
          transition: 'all 0.1s ease-in-out',
          pt: 2,
          marginTop: '70px'
        }}>
        <Box
          sx={{
            position: 'absolute',
            top: 18,
            left: 2,
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: 'rgb(255, 255, 255)',
            boxShadow: 'rgb(220, 223, 228) 0px 0px 0px 1.2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': {
              backgroundColor: 'rgb(12, 102, 228)'
            }
          }}>
          <IconButton
            sx={{ width: 24, height: 24, color: '#000', '&:hover': { color: '#fff' } }}
            onClick={handleExpandCollapse}>
            {floatingMode ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>
      </Box>
    </div>
  );
}
