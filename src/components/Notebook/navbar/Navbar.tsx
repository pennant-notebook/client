import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { authState, notebookLanguageState, selectedDocIdState } from '~/appState';
import LoggedInIcon from '~/assets/auth/loggedIn.svg';
import logo from '~/assets/logo/pennant-color.png';
import ClientDrawer from '~/components/Client/ClientDrawer';
import Clients from '~/components/Client/Clients';
import { useNavbarContext } from '~/contexts/NavbarContext';
import DocTitle from './DocTitle';
import DreddButtons from './actions/DreddButtons';

import { LogoutOutlined, SettingOutlined, MenuFoldOutlined, MenuOutlined } from '@ant-design/icons';
import { Layout, Avatar, Dropdown, Button } from 'antd';

const { Header } = Layout;

import styles from './Navbar.module.css';

interface NavbarProps {
  selectedDoc?: string;
}

const Navbar = ({ selectedDoc }: NavbarProps) => {
  const navigate = useNavigate();
  const { username, docID: paramsDoc } = useParams();
  const { codeCells, clients, handleDisconnect } = useNavbarContext();
  const setSelectedDocId = useSetRecoilState(selectedDocIdState);
  const notebookLanguage = useRecoilValue(notebookLanguageState);
  const docID = selectedDoc || paramsDoc;

  const [openDrawer, setOpenDrawer] = useState(false);

  const [auth, setAuth] = useRecoilState(authState);
  const [avatarUrl, setAvatarUrl] = useState<string>(LoggedInIcon);

  useEffect(() => {
    if (auth.isLoggedIn) {
      const newAvatarUrl = auth?.userData?.avatar_url || auth?.userData?.avatar || LoggedInIcon;
      setAvatarUrl(newAvatarUrl);
    }
  }, [auth]);

  const handleLogout = () => {
    localStorage.removeItem('pennantAccessToken');
    localStorage.removeItem('pennantAuthData');
    localStorage.removeItem('pennant-username');
    setAuth({
      isLoggedIn: false,
      userData: null,
      provider: null
    });

    navigate('/');
  };

  const items = [
    {
      key: '0',
      icon: '',
      label: `${username}`,
      disabled: true,
      style: { color: '#808080', cursor: 'default', fontWeight: 'bold' }
    },
    {
      key: '1',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => setOpenDrawer(true),
      disabled: !docID
    },
    {
      key: '2',
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
        <div className={docID ? styles.dredd : ''}>
          {docID && <DreddButtons codeCells={codeCells} />}

          <Dropdown menu={{ items }} className={styles.navbarAvatar}>
            <Avatar src={avatarUrl} style={{ cursor: 'pointer' }} />
          </Dropdown>
        </div>

        {docID && (
          <Button
            className={styles.clientDrawerTrigger}
            icon={openDrawer ? <MenuFoldOutlined /> : <MenuOutlined />}
            onClick={() => setOpenDrawer(true)}
          />
        )}
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
