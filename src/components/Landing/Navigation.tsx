import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '~/utils/MuiImports';
import PennantLogo from './assets/logo.png';
import LoginSvg from './assets/login2.svg';
import styles from './Navigation.module.css';
import { authState } from '../Auth/authState';

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
        <div
          className={`${styles.githubContainer}`}
          onClick={() => window.open('https://pennant-notebook.github.io/', '_blank')}>
          <span className={styles.githubTitle}>Case Study</span>
        </div>
        <div
          className={`${styles.githubContainer}`}
          onClick={() => window.open('https://github.com/pennant-notebook', '_blank')}>
          <span className={styles.githubTitle}>GitHub</span>
        </div>
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
