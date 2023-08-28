import { Button, TextField, Grid, Paper, Divider, Typography, useMediaQuery, Stack } from '../../utils/MuiImports';
import PennantLogo from '../../assets/pennant-logo.png';
import Pennant from '../../assets/logo.png';
import styles from './Auth.module.css';
import { useState } from 'react';
import GitHubLogin from './GitHubLogin';
import GoogleLoginButton from './GoogleLoginButton';
import { useNavigate } from 'react-router';

import DashboardButton from '../../assets/dashboard-button.svg';

const Auth = () => {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')) || {});
  const [rerender, setRerender] = useState(false);
  const [showDashboardLoader, setShowDashboardLoader] = useState(false);
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isLoggedIn = !!localStorage.getItem('githubToken');
  const toggleSignUp = () => setIsSignUp(!isSignUp);

  const handleSignup = async () => {
    await axios.post('/signup', { username, password, provider: '' });
  };

  const handleLogin = async () => {
    await axios.post('/signin', { username, password });
  };

  const handleLogout = () => {
    localStorage.removeItem('githubToken');
    setUsername('');
    setRerender(!rerender);
  };

  const goToDashboard = () => {
    setShowDashboardLoader(true);
    setTimeout(() => {
      navigate(`/@${userData.login}`);
    }, 1500);
  };

  return (
    <div className={styles.wrapper}>
      {showDashboardLoader && (
        <div className={`${styles.centerLogo}`}>
          <img src={Pennant} alt='Pennant Logo' className={`${styles.logo} ${styles.rotate}`} />
        </div>
      )}
      <Grid container className={styles.container} direction={{ xs: 'column', sm: 'row' }}>
        <Grid item xs={isSmallScreen ? 4 : 6} className={`${styles.logoContainer} `}>
          {!showDashboardLoader && <img src={PennantLogo} alt='Pennant Logo' className={`${styles.logo}`} />}
        </Grid>
        {!showDashboardLoader && (
          <Grid item xs={isSmallScreen ? 4 : 6} className={`${styles.formContainer}`}>
            <Paper elevation={3} className={styles.paper}>
              {isLoggedIn ? (
                <Stack sx={{ minWidth: '242px' }}>
                  <div className={`${styles.loggedInContainer}`}>
                    <img
                      style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '10px' }}
                      src={userData.avatar_url || './src/assets/github.svg'}
                      alt="User's avatar"
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = './src/assets/github.svg';
                      }}
                    />
                    <Typography className={styles.buttonText}>Logged in as {userData.login}</Typography>
                  </div>
                  <Button onClick={handleLogout} variant='contained' className={`${styles.button} ${styles.secondary}`}>
                    Log out
                  </Button>
                  <div onClick={goToDashboard} className={`${styles.dashboardButton}`} />
                </Stack>
              ) : (
                <>
                  <h2>{isSignUp ? 'Sign up' : 'Log in'}</h2>
                  <GitHubLogin setUserData={setUserData} />
                  {/* <GoogleLoginButton /> */}
                  <Divider variant='middle' style={{ margin: '15px 0' }}>
                    <Typography align='center'>OR</Typography>
                  </Divider>
                  <form>
                    <TextField label='Username' variant='filled' fullWidth sx={{ mb: '15px' }} />
                    <TextField label='Password' variant='filled' fullWidth type='password' sx={{ mb: '10px' }} />
                    {isSignUp && (
                      <TextField
                        label='Confirm Password'
                        variant='outlined'
                        fullWidth
                        type='password'
                        sx={{ mb: '10px' }}
                      />
                    )}
                    <Button
                      onClick={isSignUp ? handleSignup : handleLogin}
                      variant='contained'
                      className={`${styles.button} ${styles.secondary}`}
                      fullWidth
                      sx={{ my: '10px', p: '8px 14px' }}>
                      <span className={styles.buttonText}>{isSignUp ? 'Sign Up' : 'log In'}</span>
                    </Button>
                    <div onClick={toggleSignUp} className={`${styles.button} ${styles.primary}`}>
                      <span className={styles.buttonText}>{isSignUp ? 'Switch to Login' : 'Switch to Signup'}</span>
                    </div>
                  </form>
                </>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default Auth;
