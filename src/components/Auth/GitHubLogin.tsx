import axios from 'axios';
import { useEffect } from 'react';
import GithubLogo from '~/assets/auth/github.svg';
import styles from './Auth.module.css';
import { useSetRecoilState } from 'recoil';
import { authState } from '~/appState';

const API_URL = process.env.NODE_ENV === 'production' ? '/auth' : 'http://localhost:3001/auth';

const GitHubLogin = () => {
  const setAuth = useSetRecoilState(authState);
  const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      axios
        .get(`${API_URL}/getAccessToken?code=${code}`)
        .then(response => {
          const { access_token } = response.data;
          if (access_token) {
            localStorage.setItem('pennantAccessToken', access_token);
            getUserData();
          }
        })
        .catch(error => {
          console.error('Error fetching access token:', error);
        });
    }
  }, []);

  const getUserData = async () => {
    try {
      const response = await axios.get(`${API_URL}/getUserData`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pennantAccessToken')}`
        }
      });
      const data = response.data;
      localStorage.setItem('pennantAuthData', JSON.stringify(data));
      localStorage.setItem('pennant-username', data.login);

      setAuth({
        isLoggedIn: true,
        userData: data,
        provider: 'github'
      });

      const checkUserResponse = await axios.post(`${API_URL}/checkUser`, {
        username: data.login,
        provider: 'github'
      });

      if (checkUserResponse.data.exists) {
        console.log('user exists');
      } else {
        console.log('user does not exist');
        const createUserResponse = await axios.post(`${API_URL}/signup`, {
          username: data.login,
          provider: 'github'
        });
        console.log(createUserResponse.data);
      }
      // navigate(`/@${data.login}`);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleGithubLogin = () => {
    const githubOAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}`;
    window.location.assign(githubOAuthUrl);
  };

  return (
    <div className={styles.githubButton} onClick={handleGithubLogin}>
      <img src={GithubLogo} alt='GitHub Logo' className={styles.githubLogo} />
      <span className={styles.buttonText}>Sign in with GitHub</span>
    </div>
  );
};

export default GitHubLogin;
