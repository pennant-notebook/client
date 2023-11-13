import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authState, notebookLanguageState, selectedDocIdState } from '~/appState';
import logo from '~/assets/logo/pennant-color.png';
import ClientDrawer from '~/components/Client/ClientDrawer';
import Clients from '~/components/Client/Clients';
import { useNavbarContext } from '~/contexts/NavbarContext';
import DocTitle from './DocTitle';
import DreddButtons from './actions/DreddButtons';

import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Dropdown, Layout } from 'antd';

const { Header } = Layout;

import UserAvatar from '~/components/Client/UserAvatar';
import styles from './Navbar.module.css';

interface NavbarProps {
  selectedDoc?: string;
}

const Navbar = ({ selectedDoc }: NavbarProps) => {
  const navigate = useNavigate();
  const { docID: paramsDoc } = useParams();
  const { codeCells, clients, handleDisconnect } = useNavbarContext();
  const setSelectedDocId = useSetRecoilState(selectedDocIdState);
  const notebookLanguage = useRecoilValue(notebookLanguageState);
  const docID = selectedDoc || paramsDoc;

  const loggedInUsername = localStorage.getItem('pennant-username');

  const [openDrawer, setOpenDrawer] = useState(false);
  const setAuth = useSetRecoilState(authState);

  useEffect(() => {
    const checkLoginStatus = () => {
      const pennantAccessToken = localStorage.getItem('pennantAccessToken');
      const username = loggedInUsername;
      const localUserData = localStorage.getItem('pennantAuthData');

      if (localUserData) {
        const userData = JSON.parse(localUserData);
        setAuth({
          isLoggedIn: !!pennantAccessToken,
          userData: {
            id: userData.id,
            login: username || userData.login,
            avatar_url: userData.avatar_url,
            name: userData.name,
            color: userData.color,
            setByUser: userData.setByUser
          },
          provider: null
        });
      }
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('pennantAccessToken');
    localStorage.removeItem('pennantAuthData');
    localStorage.removeItem('pennant-username');
    localStorage.removeItem('pennant-avatar-url');
    localStorage.removeItem('userData');
    setAuth({
      isLoggedIn: false,
      userData: null,
      provider: null
    });
    navigate('/');
  };

  const items = [
    {
      key: '1',
      icon: '',
      label: `${loggedInUsername}`,
      disabled: true,
      style: { color: '#808080', cursor: 'default', fontWeight: 'bold' }
    },
    {
      key: '2',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => setOpenDrawer(true),
      disabled: !docID
    },
    {
      key: '3',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

  return (
    <Header className={styles.header}>
      <div
        className={styles.logo}
        onClick={() => {
          if (handleDisconnect) {
            handleDisconnect(`/`);
            setSelectedDocId(null);
          }
        }}>
        <img src={logo} alt='Logo' width='48px' style={{ marginRight: '32px' }} />
        {docID && <Clients clients={clients} />}
      </div>

      <div className={styles.docTitle}>{docID && <DocTitle selectedDoc={docID} language={notebookLanguage!} />}</div>

      <div className={styles.actions}>
        <div className={docID ? styles.dredd : ''}>{docID && <DreddButtons codeCells={codeCells} />}</div>
        <Dropdown menu={{ items }} className={styles.navbarAvatar} overlayStyle={{ top: '54px' }}>
          <a onClick={e => e.preventDefault()}>
            <UserAvatar />
          </a>
        </Dropdown>

        {docID && handleDisconnect && (
          <ClientDrawer
            open={openDrawer}
            setOpen={setOpenDrawer}
            handleDisconnect={handleDisconnect}
            clients={clients}
          />
        )}
      </div>
    </Header>
  );
};
export default Navbar;
