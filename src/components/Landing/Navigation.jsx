import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '../../utils/MuiImports';
import PennantLogo from './assets/logo.png';
import LoginSvg from './assets/login2.svg';
import LogoutSvg from './assets/logout.svg';
import Github from './assets/github.svg';

import styles from './Navigation.module.css';

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/auth');
    setIsLoggedIn(true);
  };

  const handleSignOut = () => {
    navigate('/');
    setIsLoggedIn(false);
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
          {/* <img src={Github} width='32' className={styles.githubLogo} /> */}
          <span className={styles.githubTitle}>GitHub</span>
        </div>
      </div>
      <div className={styles.authButtons}>
        {isLoggedIn ? (
          <IconButton className={styles.link} onClick={handleSignOut}>
            <img src={LogoutSvg} width='22' />
            <span className={styles.authText}>Sign Out</span>
          </IconButton>
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
