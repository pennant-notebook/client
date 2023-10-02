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
}

export default function LeftSidebar({ username, notebooks, refetch, setSelectedDocId }: LeftSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showChevron, setShowChevron] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const theme = useTheme().palette.mode;

  const handleExpandCollapse = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsExpanded(!isExpanded);
  };

  const handleMouseEnter = () => {
    setShowChevron(true);
    if (!isExpanded) {
      timerRef.current = setTimeout(() => {
        setIsExpanded(true);
      }, 1500);
    }
  };

  const handleMouseLeave = () => {
    setShowChevron(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  useEffect(() => {
    setIsExpanded(true);
    return () => {
      clearTimeout(timerRef.current!);
    };
  }, []);

  const handleOverlayClick = () => {
    if (isExpanded) {
      setIsExpanded(false);
    }
  };

  const sidebarWidth = 250;
  return (
    <div style={{ position: 'relative', zIndex: 5 }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Box
        onClick={handleOverlayClick}
        sx={{
          position: 'fixed',
          top: 0,
          left: sidebarWidth,
          width: `calc(100% - ${sidebarWidth}px)`,
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 4,
          transition: 'opacity 0.35s cubic-bezier(0.2, 0, 0, 1)',
          opacity: isExpanded ? 1 : 0,
          pointerEvents: isExpanded ? 'auto' : 'none'
        }}></Box>
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
          top: 0,
          left: isExpanded ? sidebarWidth - 35 : 15,
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
            {!isExpanded ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>
      </Box>
    </div>
  );
}
