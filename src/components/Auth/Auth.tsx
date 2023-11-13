import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Divider, Form, Input, Spin, Typography } from 'antd';
import axios from 'axios';
import classNames from 'classnames';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import { authState } from '~/appState';
import LoggedInIcon from '~/assets/auth/loggedIn.svg';
import Pennant from '~/assets/auth/logo.png';
import PennantLogoDark from '~/assets/logo/pennant-logo-dark.png';
import PennantLogo from '~/assets/logo/pennant-logo.png';
import { useTheme } from '~/utils/MuiImports';
import { validateForm } from '~/utils/authHelpers';
import styles from './Auth.module.css';
import GitHubLogin from './GitHubLogin';
import GoogleSignInButton from './GoogleSignInButton';

const { Text } = Typography;

const API_URL = process.env.NODE_ENV === 'production' ? '/auth' : 'http://localhost:3001/auth';

const Auth = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const [username, setUsername] = useState(localStorage.getItem('pennant-username') || '');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [rerender, setRerender] = useState(false);
  const [showDashboardLoader, setShowDashboardLoader] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const [form] = Form.useForm();
  const theme = useTheme().palette.mode;
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('pennantAccessToken');

  const toggleSignUp = () => setIsSignUp(!isSignUp);

  const goToDashboard = () => {
    setShowDashboardLoader(true);
    const user = localStorage.getItem('pennant-username');
    setTimeout(() => navigate(`/@${user}`), 1500);
  };

  const handleSignup = async () => {
    const errorMessage = validateForm({ isSignUp: true, identifier: email, password, confirmPassword });

    if (errorMessage) {
      toast.error(errorMessage, { autoClose: 1500, pauseOnFocusLoss: false });
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/signup`, { email, password, provider: '' });
      localStorage.setItem('pennantAccessToken', response.data.token);
      localStorage.setItem('pennantAuthData', JSON.stringify({ login: email.split('@')[0] }));
      localStorage.setItem('pennant-username', email.split('@')[0]);

      setAuth({
        isLoggedIn: true,
        userData: { login: email.split('@')[0], name: email.split('@')[0], color: '', avatar_url: '', avatar: '' },
        provider: null
      });

      setShowDashboardLoader(true);
      setTimeout(() => navigate(`/@${email.split('@')[0]}`), 1500);
    } catch (error) {
      console.error('Could not sign up:', error);
      toast.error('Could not sign up. Please try again.', { autoClose: 1500, pauseOnFocusLoss: false });
    }
  };

  const handleLogin = async () => {
    const identifier = username; // username or email
    const errorMessage = validateForm({ isSignUp: false, identifier, password });

    if (errorMessage) {
      toast.error(errorMessage, { autoClose: 1500, pauseOnFocusLoss: false });
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/signin`, { identifier, password });
      const userLogin = identifier.includes('@') ? identifier.split('@')[0] : identifier;

      setShowDashboardLoader(true);
      localStorage.setItem('pennantAccessToken', response.data.token);
      localStorage.setItem('pennantAuthData', JSON.stringify({ login: userLogin, name: userLogin }));
      localStorage.setItem('pennant-username', userLogin);
      setAuth({
        isLoggedIn: true,
        userData: { login: userLogin, name: userLogin },
        provider: null
      });
      setShowDashboardLoader(true);
      setTimeout(() => navigate(`/@${userLogin}`), 1500);
    } catch (error) {
      console.error(error);
      toast.error('Invalid username or password.', { autoClose: 1500, pauseOnFocusLoss: false });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pennantAccessToken');
    localStorage.removeItem('pennantAuthData');
    localStorage.removeItem('pennant-username');
    localStorage.removeItem('pennant-avatar-url');
    setAuth({
      isLoggedIn: false,
      userData: null,
      provider: null
    });
    setUsername('');
    setRerender(!rerender);
  };

  const handleForgotPassword = async () => {
    const emailToReset = email;
    if (!emailToReset) {
      toast.error('Please enter your email address.', { autoClose: 1500, pauseOnFocusLoss: false });
      return;
    }
    setIsSendingEmail(true);
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email: emailToReset });
      console.log(response.data);
      setIsSendingEmail(false);
      toast.success('Password reset email sent. Please check your inbox.', {
        autoClose: 1500,
        pauseOnFocusLoss: false
      });
    } catch (error) {
      console.error('Error sending forgot password email:', error);
      setIsSendingEmail(false);
      toast.error('Error sending forgot password email. Please try again later.', {
        autoClose: 1500,
        pauseOnFocusLoss: false
      });
    }
  };

  return (
    <div className={styles.AuthWrapper}>
      <div className={styles.AuthHeader}>
        {showDashboardLoader && (
          <div className={`${styles.centerLogo}`}>
            <img src={Pennant} alt='Pennant Logo' className={`${styles.logo} ${styles.rotate}`} />
          </div>
        )}
      </div>
      <div className={styles.AuthHeader}>
        {!showDashboardLoader && (
          <div className={styles.AuthHeaderLogo}>
            <img
              src={theme === 'dark' ? PennantLogoDark : PennantLogo}
              alt='Pennant Logo'
              className={`${styles.logo}`}
            />
          </div>
        )}
      </div>
      <div>
        {!showDashboardLoader && (
          <>
            {isForgotPassword ? (
              <div className={styles.AuthForm}>
                <Form form={form} layout='vertical' className={styles.AuthForm}>
                  <Form.Item className={styles.formItem}>
                    <p className={styles.formLabel}>Email</p>
                    <Input
                      prefix={<MailOutlined style={{ color: 'rgb(128,128,128)' }} />}
                      placeholder='Email'
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </Form.Item>

                  <div className={styles.AuthFooter}>
                    {isSendingEmail ? (
                      <div className={classNames(styles.switchDiv, styles.footerItem)}>
                        <Spin />
                      </div>
                    ) : (
                      <>
                        <button onClick={handleForgotPassword} className={classNames(styles.authButton)}>
                          Send Password Reset Email
                        </button>
                        <div
                          className={classNames(styles.switchDiv, styles.footerItem)}
                          onClick={() => setIsForgotPassword(false)}>
                          <div className={classNames(styles.switchButton)}>
                            <Text>Back to Login</Text>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Form>
              </div>
            ) : isLoggedIn ? (
              <div className={styles.loggedInWrapper}>
                <div className={`${styles.loggedInContainer}`}>
                  <div className={styles.avatarLoggedIn}>
                    <img
                      src={auth.userData?.avatar_url || auth.userData?.avatar || LoggedInIcon}
                      alt="User's avatar"
                      onError={e => {
                        const imgElement = e.target as HTMLImageElement;
                        imgElement.onerror = null;
                        imgElement.src = LoggedInIcon;
                      }}
                    />
                    <p className={classNames(styles.buttonText, styles.loggedInAsText)}>
                      Logged in as {auth.userData?.login || localStorage.getItem('pennant-username')}
                    </p>
                  </div>
                  <Divider />
                  <button onClick={handleLogout} className={classNames(styles.avatarLoggedIn, styles.logoutButton)}>
                    Log out
                  </button>
                  <button onClick={goToDashboard} className={classNames(styles.avatarLoggedIn, styles.dashboardButton)}>
                    Go to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.AuthForm}>
                <GitHubLogin />
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                  <GoogleSignInButton />
                </GoogleOAuthProvider>
                <Divider className={styles.separator}>OR</Divider>

                <Form form={form} layout='vertical' className={styles.AuthForm}>
                  {isSignUp ? (
                    <Form.Item className={styles.formItem}>
                      <p className={styles.formLabel}>Email</p>
                      <Input
                        prefix={<MailOutlined style={{ color: 'rgb(128,128,128)' }} />}
                        placeholder='Email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </Form.Item>
                  ) : (
                    <Form.Item className={styles.formItem}>
                      <p className={styles.formLabel}>Username or Email</p>
                      <Input
                        prefix={<UserOutlined style={{ color: 'rgb(128,128,128)' }} />}
                        placeholder='Username or Email'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                      />
                    </Form.Item>
                  )}
                  <Form.Item className={styles.formItem}>
                    <p className={styles.formLabel}>Password</p>
                    <Input.Password
                      prefix={<LockOutlined style={{ color: 'rgb(128,128,128)' }} />}
                      placeholder='Password'
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </Form.Item>
                  {isSignUp && (
                    <Form.Item className={styles.formItem}>
                      <p className={styles.formLabel}>Confirm Password</p>
                      <Input.Password
                        prefix={<LockOutlined style={{ color: 'rgb(128,128,128)' }} />}
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                      />
                    </Form.Item>
                  )}
                  <button onClick={isSignUp ? handleSignup : handleLogin} className={classNames(styles.authButton)}>
                    {isSignUp ? 'Sign Up' : 'Log In'}
                  </button>
                  <div className={styles.AuthFooter}>
                    <div
                      className={classNames(styles.switchDiv, styles.footerItem)}
                      onClick={() => setIsForgotPassword(true)}>
                      {!isSignUp && (
                        <div className={classNames(styles.switchButton)}>
                          <Text> Forgot Password?</Text>
                        </div>
                      )}
                    </div>
                    <div className={classNames(styles.switchDiv, styles.footerItem)} onClick={toggleSignUp}>
                      {isSignUp ? (
                        <div className={classNames(styles.switchButton)}>
                          <Text> Already have an account? Log In</Text>
                        </div>
                      ) : (
                        <div className={classNames(styles.switchButton)}>
                          <Text> New to Pennant? Sign Up</Text>
                        </div>
                      )}
                    </div>
                  </div>
                </Form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
