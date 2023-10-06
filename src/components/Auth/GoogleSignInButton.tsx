import { useRecoilState } from 'recoil';
import { authState } from '~/appState';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import GoogleLogo from '~/assets/auth/google.svg';
import styles from './Auth.module.css';

const API_URL = process.env.NODE_ENV === 'production' ? '/auth' : 'http://localhost:3001/auth';

const GoogleSignInButton = ({ loginHandler }: { loginHandler?: () => void }) => {
  const [auth, setAuth] = useRecoilState(authState);

  const googleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      const { access_token } = tokenResponse;

      try {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${access_token}` }
        });

        const formattedName = userInfo.data.name.replace(' ', '.');

        const checkUserResponse = await axios.post(`${API_URL}/checkUser`, {
          username: formattedName,
          provider: 'google'
        });

        if (!checkUserResponse.data.exists) {
          await axios.post(`${API_URL}/signup`, {
            username: formattedName,
            provider: 'google'
          });
        }

        localStorage.setItem('pennantAccessToken', access_token);
        localStorage.setItem(
          'pennantAuthData',
          JSON.stringify({ login: formattedName, avatar: userInfo.data.picture, name: userInfo.data.name })
        );
        localStorage.setItem('pennant-username', formattedName);

        setAuth({
          isLoggedIn: true,
          userData: { login: formattedName, avatar: userInfo.data.picture, name: userInfo.data.name },
          provider: 'google'
        });

        toast.success('Successfully logged in with Google');
        loginHandler && loginHandler();
      } catch (error) {
        toast.error('Failed to fetch user info');
      }
    },
    onError: () => {
      toast.error('Login Failed');
    }
  });

  const handleGoogleLogin = () => {
    googleLogin();
  };

  return (
    <div className={styles.googleButton} onClick={!auth.isLoggedIn ? handleGoogleLogin : undefined}>
      {!auth.isLoggedIn || !localStorage.getItem('pennantAccessToken') ? (
        <>
          <img src={GoogleLogo} alt='Google Logo' className={styles.googleLogo} />
          <span className={styles.buttonText}>Sign in with Google</span>
        </>
      ) : (
        <>
          <img src={auth.userData?.avatar || GoogleLogo} alt='User Avatar' className={styles.userAvatar} />
          <span className={styles.userName}>Logged in as: {auth.userData?.name}</span>
        </>
      )}
    </div>
  );
};

export default GoogleSignInButton;
