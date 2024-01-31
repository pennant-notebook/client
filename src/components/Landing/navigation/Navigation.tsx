import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '~/utils/MuiImports';
import PennantLogo from '../assets/logo.png';
import LoginSvg from '../assets/login.svg';
import styles from './Navigation.module.css';
import { authState } from '~/appState';

const Navigation = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const [showSideMenu, setShowSideMenu] = useState(false);

  const navigate = useNavigate();

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

  const handleSignOut = () => {
    localStorage.removeItem('pennantAccessToken');
    localStorage.removeItem('pennantAuthData');
    localStorage.removeItem('pennant-username');
    setAuth({ isLoggedIn: false, userData: null, provider: null });
    navigate('/');
  };

  const handleSignIn = () => {
    navigate('/auth');
    setAuth({ isLoggedIn: true, userData: auth.userData, provider: auth.provider });
  };

  const toggleSideMenu = () => {
    setShowSideMenu(!showSideMenu);
  };

  return (
    <div className={styles.navContainer}>
      <div className={styles.logoContainer}>
        <img src={PennantLogo} alt='Pennant Logo' className={styles.logo} />
        <span className={styles.title}>pennant</span>
        <div className={styles.separator}></div>
        <a
          href='https://pennant-notebook.github.io/'
          target='_blank'
          rel='noopener noreferrer'
          className={styles.githubContainer}>
          <span className={styles.githubTitle}>Case Study</span>
        </a>
        <a
          href='https://github.com/pennant-notebook'
          target='_blank'
          rel='noopener noreferrer'
          className={styles.githubContainer}>
          <span className={styles.githubTitle}>GitHub</span>
        </a>
        <a
          href='https://docs.trypennant.com'
          target='_blank'
          rel='noopener noreferrer'
          className={styles.githubContainer}>
          <span className={styles.githubTitle}>Docs</span>
        </a>
      </div>
      <div className={styles.authButtons}>
        {auth.isLoggedIn ? (
          <>
            <IconButton className={styles.link} onClick={toggleSideMenu}>
              ☰
            </IconButton>
            {showSideMenu && (
              <div className={styles.sideMenu}>
                <button onClick={() => navigate(`/@${localStorage.getItem('pennant-username')}`)}>Dashboard</button>
                <button onClick={handleSignOut}>Logout</button>
              </div>
            )}
          </>
        ) : (
          <IconButton className={styles.link} onClick={handleSignIn}>
            <img src={LoginSvg} width='22' />
            <span className={styles.authText}>Sign In</span>
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default Navigation;
