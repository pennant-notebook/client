import {
  Button,
  TextField,
  Grid,
  Paper,
  Divider,
  Typography,
  useMediaQuery,
  Stack,
  useTheme
} from '../../utils/MuiImports';
import PennantLogo from '../../assets/pennant-logo.png';
import PennantLogoDark from '../../assets/pennant-logo-dark.png';
import Pennant from '../../assets/logo.png';
import LoggedInIcon from '../../assets/loggedIn.svg';
import styles from './Auth.module.css';
import { useEffect, useState } from 'react';
import GitHubLogin from './GitHubLogin';
import { useLocation, useNavigate } from 'react-router';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' ? '/auth' : 'http://localhost:3001/auth';

const Auth = () => {
  const [username, setUsername] = useState(localStorage.getItem('pennant-username') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const theme = useTheme().palette.mode;

  const location = useLocation();
  const passedState = location.state || {};
  const [errorMessage, setErrorMessage] = useState(passedState.errorMessage || '');

  const storedData = localStorage.getItem('pennantAuthData');
  const [userData, setUserData] = useState(storedData ? JSON.parse(storedData) : {});

  const [rerender, setRerender] = useState(false);
  const [showDashboardLoader, setShowDashboardLoader] = useState(false);
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isLoggedIn = !!localStorage.getItem('pennantAccessToken');
  const toggleSignUp = () => setIsSignUp(!isSignUp);

  useEffect(() => {
    if (!!passedState.errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
        navigate('.', { state: {} });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleSignup = async () => {
    if (username.length < 5) {
      setErrorMessage('Username must be at least 5 characters long.');
      return;
    }
    if (password.length < 6 || confirmPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (!password || !confirmPassword) {
      setErrorMessage('Password fields cannot be empty.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (/[^a-zA-Z0-9]/.test(username)) {
      setErrorMessage('Username can only contain letters and numbers.');
      return;
    }

    try {
      const existingUser = await axios.post(API_URL + '/checkUser', { username });
      if (existingUser.data.exists) {
        setErrorMessage('Username already exists.');
        return;
      }

      const response = await axios.post(API_URL + '/signup', { username, password, provider: '' });
      setShowDashboardLoader(true);
      localStorage.setItem('pennantAccessToken', response.data.token);
      localStorage.setItem('pennantAuthData', JSON.stringify({ login: username }));
      localStorage.setItem('pennant-username', username);
      setTimeout(() => {
        navigate(`/@${username}`);
      }, 1500);
    } catch (error) {
      console.error('Could not sign up:', error);
      setErrorMessage('Could not sign up. Please try again.');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(API_URL + '/signin', { username, password });
      localStorage.setItem('pennantAccessToken', response.data.token);
      localStorage.setItem('pennantAuthData', JSON.stringify({ login: username }));
      localStorage.setItem('pennant-username', username);
      setShowDashboardLoader(true);
      setTimeout(() => {
        navigate(`/@${username}`);
      }, 1500);
    } catch (error) {
      console.error(error);
      setErrorMessage('Invalid username or password.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pennantAccessToken');
    localStorage.removeItem('pennantAuthData');
    localStorage.removeItem('pennant-username');
    setUsername('');
    setRerender(!rerender);
  };

  const goToDashboard = () => {
    if (!localStorage.getItem('pennantAccessToken')) {
      setErrorMessage('You are not authorized to view this page.');
      return;
    }
    console.log(userData.login);
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
          {!showDashboardLoader && (
            <img
              src={theme === 'dark' ? PennantLogoDark : PennantLogo}
              alt='Pennant Logo'
              className={`${styles.logo}`}
            />
          )}
        </Grid>
        {!showDashboardLoader && (
          <Grid item xs={isSmallScreen ? 4 : 6} className={`${styles.formContainer}`}>
            <Paper elevation={3} className={styles.paper}>
              {isLoggedIn ? (
                <Stack sx={{ minWidth: '242px' }}>
                  {errorMessage && (
                    <Typography color='error' sx={{ fontSize: '14px', mb: '10px' }}>
                      {errorMessage}
                    </Typography>
                  )}
                  <div className={`${styles.loggedInContainer}`}>
                    <img
                      style={{ borderRadius: '50%', width: '32px', height: '32px', marginRight: '10px' }}
                      src={userData.avatar_url || LoggedInIcon}
                      alt="User's avatar"
                      onError={e => {
                        const imgElement = e.target as HTMLImageElement;
                        imgElement.onerror = null;
                        imgElement.src = LoggedInIcon;
                      }}
                    />
                    <Typography className={styles.buttonText} sx={{ fontSize: '0.9em' }}>
                      Logged in as {userData.login || username}
                    </Typography>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant='contained'
                    className={`${styles.button} ${styles.secondary}`}
                    sx={{ textTransform: 'none', mb: '10px' }}>
                    Log out
                  </Button>
                  <Button
                    onClick={goToDashboard}
                    variant='contained'
                    className={`${styles.dashboardButton} ${styles.secondary}`}
                    sx={{ textTransform: 'none', my: '10px' }}>
                    Go to Dashboard
                  </Button>
                </Stack>
              ) : (
                <>
                  <h2>{isSignUp ? 'Sign up' : 'Log in'}</h2>
                  <GitHubLogin setUserData={setUserData} />
                  <Divider variant='middle' style={{ margin: '15px 0' }}>
                    <Typography align='center'>OR</Typography>
                  </Divider>
                  <form>
                    {errorMessage && <Typography color='error'>{errorMessage}</Typography>}
                    <TextField
                      label='Username'
                      variant='filled'
                      fullWidth
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      sx={{ mb: '15px' }}
                    />
                    <TextField
                      label='Password'
                      variant='filled'
                      fullWidth
                      type='password'
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      sx={{ mb: '10px' }}
                    />
                    {isSignUp && (
                      <TextField
                        label='Confirm Password'
                        variant='outlined'
                        fullWidth
                        type='password'
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
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
