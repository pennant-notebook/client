import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import { validateForm } from '~/utils/authHelpers';
import LoggedInIcon from '../../assets/loggedIn.svg';
import Pennant from '../../assets/logo.png';
import PennantLogoDark from '../../assets/pennant-logo-dark.png';
import PennantLogo from '../../assets/pennant-logo.png';
import {
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '../../utils/MuiImports';
import styles from './Auth.module.css';
import GitHubLogin from './GitHubLogin';
import GoogleSignInButton from './GoogleSignInButton';
import { authState } from './authState';
import { GoogleOAuthProvider } from '@react-oauth/google';

const API_URL = process.env.NODE_ENV === 'production' ? '/auth' : 'http://localhost:3001/auth';

const Auth = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const [username, setUsername] = useState(localStorage.getItem('pennant-username') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const theme = useTheme().palette.mode;

  // const storedData = localStorage.getItem('pennantAuthData');
  // const [userData, setUserData] = useState(storedData ? JSON.parse(storedData) : {});

  const [rerender, setRerender] = useState(false);
  const [showDashboardLoader, setShowDashboardLoader] = useState(false);
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isLoggedIn = !!localStorage.getItem('pennantAccessToken');
  const toggleSignUp = () => setIsSignUp(!isSignUp);

  const goToDashboard = () => {
    if (!localStorage.getItem('pennantAccessToken')) {
      toast.error('Invalid username or password.');
      return;
    }
    setShowDashboardLoader(true);

    setTimeout(() => {
      navigate(`/@${username}`);
    }, 1500);
  };

  const handleSignup = async () => {
    const errorMessage = validateForm({ isSignUp: true, username, password, confirmPassword });

    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    try {
      const {
        data: { exists }
      } = await axios.post(`${API_URL}/checkUser`, { username });

      if (exists) {
        toast.error('Username already exists.');
        return;
      }

      const response = await axios.post(`${API_URL}/signup`, { username, password, provider: '' });
      localStorage.setItem('pennantAccessToken', response.data.token);
      localStorage.setItem('pennantAuthData', JSON.stringify({ login: username }));
      localStorage.setItem('pennant-username', username);

      setAuth({
        isLoggedIn: true,
        userData: { login: username },
        provider: 'username'
      });

      goToDashboard();
    } catch (error) {
      console.error('Could not sign up:', error);
      toast.error('Could not sign up. Please try again.');
    }
  };

  const handleLogin = async () => {
    const errorMessage = validateForm({ isSignUp: false, username, password });

    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/signin`, { username, password });
      setShowDashboardLoader(true);
      localStorage.setItem('pennantAccessToken', response.data.token);
      localStorage.setItem('pennantAuthData', JSON.stringify({ login: username }));
      localStorage.setItem('pennant-username', username);
      setAuth({
        isLoggedIn: true,
        userData: { login: username },
        provider: 'username'
      });
      goToDashboard();
    } catch (error) {
      console.error(error);
      toast.error('Invalid username or password.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pennantAccessToken');
    localStorage.removeItem('pennantAuthData');
    localStorage.removeItem('pennant-username');
    setAuth({
      isLoggedIn: false,
      userData: null,
      provider: null
    });
    setUsername('');
    setRerender(!rerender);
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
                  <div className={`${styles.loggedInContainer}`}>
                    <img
                      style={{ borderRadius: '50%', width: '32px', height: '32px', marginRight: '10px' }}
                      src={auth.userData?.avatar_url || LoggedInIcon}
                      alt="User's avatar"
                      onError={e => {
                        const imgElement = e.target as HTMLImageElement;
                        imgElement.onerror = null;
                        imgElement.src = LoggedInIcon;
                      }}
                    />
                    <Typography className={styles.buttonText} sx={{ fontSize: '0.9em' }}>
                      Logged in as {auth.userData?.login || username}
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
                  <GitHubLogin />
                  <GoogleOAuthProvider clientId={import.meta.env.GOOGLE_CLIENT_ID}>
                    <GoogleSignInButton />
                  </GoogleOAuthProvider>
                  <Divider variant='middle' style={{ margin: '15px 0' }}>
                    <Typography align='center'>OR</Typography>
                  </Divider>
                  <form>
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
