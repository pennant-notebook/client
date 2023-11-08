import { ClientType } from '@/ClientTypes';
import { BulbFilled, BulbOutlined, EditOutlined, HomeOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import { useTheme } from '@mui/material';
import { Button, Drawer, List, Space, Spin, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { authState, selectedDocIdState, sidebarExpandedState } from '~/appState';
import useProviderContext from '~/contexts/ProviderContext';
import { getClientFromLocalStorage } from '~/utils/awarenessHelpers';
import EditNameModal from './EditNameModal';
import UserAvatar from './UserAvatar';

interface ClientDrawerProps {
  handleDisconnect: (destination: string) => void;
  clients?: ClientType[];
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ClientDrawer = ({ handleDisconnect, clients = [], open, setOpen }: ClientDrawerProps) => {
  const [auth, setAuth] = useRecoilState(authState);
  const { docID } = useParams();
  const [avatar, setAvatar] = useState<ClientType | null>(null);
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

  useEffect(() => {
    if (clients && clients.length > 0) {
      setAvatar(clients[0]);
    } else {
      const storedClient = getClientFromLocalStorage();
      setAvatar(storedClient);
    }
  }, [clients]);

  useEffect(() => {
    const checkLoginStatus = () => {
      const pennantAccessToken = localStorage.getItem('pennantAccessToken');
      const username = localStorage.getItem('pennant-username');
      setAuth({
        isLoggedIn: !!pennantAccessToken,
        userData: { login: username || '' },
        provider: null
      });
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const updateName = (newName: string) => {
    if (newName) {
      setAvatar(prevAvatar => ({
        ...prevAvatar,
        name: newName
      }));
      provider?.awareness.setLocalStateField('user', {
        ...avatar,
        name: newName,
        setByUser: true
      });
      localStorage.setItem('userData', JSON.stringify({ name: newName, color: avatar?.color, setByUser: true }));
    }
    closeEditModal();
  };

  const handleSignOut = () => {
    localStorage.removeItem('pennantAccessToken');
    localStorage.removeItem('pennantAuthData');
    localStorage.removeItem('pennant-username');
    setAuth({ isLoggedIn: false, userData: null, provider: null });
    if (!docID) {
      setSelectedDocId(null);
      handleDisconnect('/');
    }
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

  if (!avatar || !avatar.name) {
    return <Spin />;
  }

  const drawerItemStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    color: currTheme === 'dark' ? '#fff' : '#000'
  };

  const drawerItems = [
    {
      key: 'avatar',
      content: (
        <Space direction='vertical' size='large' align='center' style={{ width: '100%' }}>
          <UserAvatar name={avatar.name} src={avatar.url} color={avatar.color} size={60} />
          <Typography.Title level={5} style={{ marginBottom: '12px', marginTop: 0 }}>
            {avatar.name}
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
      key: 'go-back',
      content: (
        <Button
          className={`button-normal ${currTheme === 'dark' ? 'dark-theme' : ''}`}
          type='text'
          icon={!docID && !auth.isLoggedIn ? <HomeOutlined /> : <LogoutOutlined />}
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
        currentName={avatar.name}
        onUpdate={updateName}
        onClose={closeEditModal}
      />
    </>
  );
};
export default ClientDrawer;
