import { useSetRecoilState } from 'recoil';
import { authState } from './authState';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';

const API_URL = process.env.NODE_ENV === 'production' ? '/auth' : 'http://localhost:3001/auth';

const GoogleSignInButton = ({ loginHandler }: { loginHandler?: () => void }) => {
  const setAuth = useSetRecoilState(authState);

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
        } else {
          console.log('user exists');
        }

        localStorage.setItem('pennantAccessToken', access_token);
        localStorage.setItem('pennantAuthData', JSON.stringify({ login: formattedName }));
        localStorage.setItem('pennant-username', formattedName);

        setAuth({
          isLoggedIn: true,
          userData: { login: formattedName },
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

  return <button onClick={() => googleLogin()}>Login with Google</button>;
};

export default GoogleSignInButton;
