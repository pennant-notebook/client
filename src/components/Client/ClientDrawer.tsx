import {
  ArrowLeftOutlined,
  BulbFilled,
  BulbOutlined,
  EditOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useTheme } from '@mui/material';
import { Button, Drawer, List, Space, Typography } from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { AwarenessUserState, UserState } from '@/ClientTypes';
import { authState, selectedDocIdState, sidebarExpandedState } from '~/appState';
import useProviderContext from '~/contexts/ProviderContext';
import EditNameModal from './EditNameModal';
import UserAvatar from './UserAvatar';
import ThemeSelector from '../UI/ThemeSelector';

interface ClientDrawerProps {
  handleDisconnect: (destination: string) => void;
  clients?: AwarenessUserState[];
  open: boolean;
  setOpen: (open: boolean) => void;
  avatarUrl?: string | null;
}

const ClientDrawer = ({ handleDisconnect, clients = [], open, setOpen }: ClientDrawerProps) => {
  const [auth, setAuth] = useRecoilState(authState);
  const { docID } = useParams();
  const setIsExpanded = useSetRecoilState(sidebarExpandedState);

  const providerContext = useProviderContext();
  const provider = providerContext ? providerContext.provider : null;
  const setSelectedDocId = useSetRecoilState(selectedDocIdState);
  const navigate = useNavigate();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const showEditModal = () => setIsEditModalVisible(true);
  const closeEditModal = () => setIsEditModalVisible(false);

  const {
    custom: { toggleTheme }
  } = useTheme();

  const theme = useTheme();

  const currTheme = theme.palette.mode;

  const updateName = (newName: string) => {
    if (newName) {
      setAuth(prevAuth => {
        if (!prevAuth.userData) return prevAuth;

        const updatedUserData: UserState = {
          ...prevAuth.userData,
          name: newName,
          setByUser: true
        };

        localStorage.setItem('pennantAuthData', JSON.stringify(updatedUserData));

        return {
          ...prevAuth,
          userData: updatedUserData
        };
      });

      provider?.awareness.setLocalStateField('user', {
        name: newName,
        color: auth.userData?.color,
        avatar_url: auth.userData?.avatar_url,
        setByUser: true
      });
    }
    closeEditModal();
  };

  const handleSignOut = () => {
    localStorage.removeItem('pennantAccessToken');
    localStorage.removeItem('pennantAuthData');
    localStorage.removeItem('pennant-username');
    localStorage.removeItem('pennant-avatar-url');
    localStorage.removeItem('userData');
    setAuth({ isLoggedIn: false, userData: null, provider: null });
    handleDisconnect('/');
  };

  const handleSignIn = () => {
    navigate('/auth');
    setAuth({ isLoggedIn: true, userData: auth.userData, provider: auth.provider });
  };

  const handleClickToGoBack = () => {
    if (auth.isLoggedIn) {
      setSelectedDocId(null);
      handleDisconnect(`/@${auth.userData?.login}`);
    } else {
      setSelectedDocId(null);
      handleDisconnect('/');
    }
    setOpen(false);
    setIsExpanded(true);
  };

  const drawerItemStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    color: currTheme === 'dark' ? '#fff' : '#000'
  };

  const getDisplayedName = () => {
    if (auth.isLoggedIn) {
      return auth.userData?.setByUser ? auth.userData?.name : `@${auth.userData?.login}`;
    } else {
      return clients[0]?.user?.name;
    }
  };

  const displayedName = getDisplayedName();

  const drawerItems = [
    {
      key: 'avatar',
      content: (
        <Space direction='vertical' size='large' align='center' style={{ width: '100%' }}>
          <UserAvatar size={'60px'} isDrawer={true} />
          <Typography.Title level={5} style={{ marginBottom: '12px', marginTop: 0 }}>
            {displayedName}
          </Typography.Title>
        </Space>
      )
    },
    {
      key: 'edit-name',
      content: (
        <Button
          className={`button-normal ${currTheme === 'dark' ? 'dark-theme' : ''}`}
          type='text'
          icon={<EditOutlined />}
          onClick={showEditModal}
          block>
          Edit Display Name
        </Button>
      )
    },
    {
      key: 'toggle-theme',
      content: (
        <Button
          className={`button-normal ${currTheme === 'dark' ? 'dark-theme' : ''}`}
          type='text'
          icon={currTheme === 'dark' ? <BulbFilled /> : <BulbOutlined />}
          onClick={toggleTheme}
          block>
          Toggle {currTheme === 'dark' ? 'Light' : 'Dark'} Mode
        </Button>
      )
    },
    {
      key: 'code-theme',
      content: <ThemeSelector currTheme={currTheme} />
    },
    {
      key: 'go-back',
      content: (
        <Button
          className={`button-normal ${currTheme === 'dark' ? 'dark-theme' : ''}`}
          type='text'
          icon={!docID && !auth.isLoggedIn ? <HomeOutlined /> : <ArrowLeftOutlined />}
          onClick={handleClickToGoBack}
          block>
          {auth.isLoggedIn ? 'Dashboard' : 'Home'}
        </Button>
      )
    },
    {
      key: 'sign-in-out',
      content: (
        <Button
          className={`button-normal ${currTheme === 'dark' ? 'dark-theme' : ''}`}
          type='text'
          icon={auth.isLoggedIn ? <LogoutOutlined /> : <LoginOutlined />}
          onClick={auth.isLoggedIn ? handleSignOut : handleSignIn}
          block>
          {auth.isLoggedIn ? 'Logout' : 'Login'}
        </Button>
      )
    }
  ];

  return (
    <>
      <Drawer
        title='Settings'
        placement='right'
        closable={true}
        onClose={() => setOpen(false)}
        open={open}
        width={200}
        rootClassName={currTheme}>
        <List
          itemLayout='horizontal'
          dataSource={drawerItems}
          renderItem={item => <List.Item style={{ padding: '12px 0', ...drawerItemStyle }}>{item.content}</List.Item>}
        />
      </Drawer>
      <EditNameModal
        theme={currTheme}
        isVisible={isEditModalVisible}
        currentName={getDisplayedName() || ''}
        onUpdate={updateName}
        onClose={closeEditModal}
      />
    </>
  );
};
export default ClientDrawer;
