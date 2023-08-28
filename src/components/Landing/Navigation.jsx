import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '../../utils/MuiImports';
import PennantLogo from './assets/logo.png';
import LoginSvg from './assets/login2.svg';
import LogoutSvg from './assets/logout.svg';
import styles from './Navigation.module.css';

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/auth');
    setIsLoggedIn(true);
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const pennantAccessToken = localStorage.getItem('pennantAccessToken');
      setIsLoggedIn(!!pennantAccessToken);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('pennantAccessToken');
    localStorage.removeItem('userData');
    navigate('/');
    setIsLoggedIn(false);
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
          className={styles.githubContainer}
          onClick={() => window.open('https://github.com/pennant-notebook', '_blank')}>
          <span className={styles.githubTitle}>GitHub</span>
        </div>
      </div>
      <div className={styles.authButtons}>
        {isLoggedIn ? (
          <>
            <IconButton className={styles.link} onClick={toggleSideMenu}>
              ☰
            </IconButton>
            {showSideMenu && (
              <div className={styles.sideMenu}>
                <button onClick={() => navigate(`/@${localStorage.getItem('username')}`)}>Dashboard</button>
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
