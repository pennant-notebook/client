import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { notebooksState, selectedDocIdState, sidebarExpandedState } from '~/appState';
import { useTheme } from '~/utils/MuiImports';
import NotebookTreeView from './NotebookTreeView';
import Sider from 'antd/es/layout/Sider';

interface LeftSidebarProps {
  username: string;
  refetch: () => void;
  handleSelectedDocId: (docId: string) => void;
}

export default function LeftSidebar({ username, refetch, handleSelectedDocId }: LeftSidebarProps) {
  const notebooks = useRecoilValue(notebooksState);
  const selectedDocId = useRecoilValue(selectedDocIdState);
  const [isExpanded, setIsExpanded] = useRecoilState(sidebarExpandedState);
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

  const handleOverlayClick = () => {
    if (isExpanded) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    setIsExpanded(true);
    return () => {
      clearTimeout(timerRef.current!);
    };
  }, []);

  useEffect(() => {
    if (selectedDocId) {
      setIsExpanded(false);
    }
  }, [selectedDocId]);

  const sidebarWidth = 240;
  const collapsedWidth = 30;

  return (
    <Layout
      style={{
        position: 'relative',
        zIndex: 5
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {isExpanded && (
        <div
          style={{
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
          }}
          onClick={handleOverlayClick}
        />
      )}
      <Sider
        width={sidebarWidth}
        collapsible
        collapsed={!isExpanded}
        collapsedWidth={collapsedWidth}
        trigger={null}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          backgroundColor: theme === 'dark' ? '#121212' : '#fafafa',

          zIndex: 5
        }}>
        {isExpanded && (
          <div style={{ marginTop: '32px' }}>
            <NotebookTreeView
              username={username}
              notebooks={notebooks}
              refetch={refetch}
              handleSelectedDocId={handleSelectedDocId}
            />
          </div>
        )}
      </Sider>
      <Button
        ghost
        icon={!isExpanded ? <RightCircleOutlined /> : <LeftCircleOutlined />}
        onClick={handleExpandCollapse}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          top: '80px',
          left: isExpanded ? sidebarWidth - 15 : 15,
          opacity: showChevron ? 1 : 0,
          transition: 'all 0.1s ease-in-out',
          zIndex: 6,
          border: 'none',
          background: 'rgb(255, 255, 255)',
          boxShadow: 'rgb(220, 223, 228) 0px 0px 0px 1.2px',
          padding: 0,
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          color: '#000'
        }}
        className={'custom-chevron-button' + ` ${theme}`}
      />
    </Layout>
  );
}
