import { useState, useRef, useEffect } from 'react';
import { Box, Divider, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import NotebookTreeView from './NotebookTreeView';
import { NotebookType } from '@/NotebookTypes';

interface LeftSidebarProps {
  username: string;
  notebooks?: NotebookType[];
  refetch: () => void;
}

export default function LeftSidebar({ username, notebooks, refetch }: LeftSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [floatingMode, setFloatingMode] = useState(false);
  const [showChevron, setShowChevron] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  return (
    <div style={{ position: 'relative' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div
        style={{
          height: '100vh',
          width: 250,
          transform: isExpanded ? 'translateX(0)' : 'translateX(-200px)',
          transition: 'transform 0.35s cubic-bezier(0.2, 0, 0, 1)',
          position: 'absolute'
        }}>
        <Divider
          orientation='vertical'
          sx={{
            position: 'absolute',
            height: '100vh',
            left: 250
          }}
        />
        <Box
          style={{
            height: '100vh',
            width: 250
          }}>
          <Box
            sx={{
              width: 250,
              position: 'relative',
              pt: 2
            }}>
            {isExpanded && <NotebookTreeView username={username} notebooks={notebooks} refetch={refetch} />}
          </Box>
        </Box>
      </div>
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          left: isExpanded ? 235 : 35,
          opacity: showChevron ? 1 : 0,
          transition: 'all 0.1s ease-in-out'
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
