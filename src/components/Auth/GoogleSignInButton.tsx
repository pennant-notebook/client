import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import { authState } from './authState';
import jwtDecode from 'jwt-decode';

const GoogleSignInButton = ({ loginHandler }: { loginHandler?: () => void }) => {
  const [auth, setAuth] = useRecoilState(authState);

  const login = useGoogleLogin({
    onSuccess: codeResponse => {
      const idToken = codeResponse.access_token;
      const decodedToken = jwtDecode(idToken) as { [key: string]: any };
      console.log('Successfully logged in:', codeResponse);

      localStorage.setItem('pennantAccessToken', idToken);
      localStorage.setItem('pennantAuthData', JSON.stringify({ login: decodedToken.name }));
      localStorage.setItem('pennant-username', decodedToken.name);

      setAuth({
        isLoggedIn: true,
        userData: auth.userData,
        provider: 'google'
      });
      loginHandler && loginHandler();
      toast.success('Successfully logged in with Google');
    },
    onError: () => {
      toast.error('Login Failed');
    }
  });

  const logout = () => {
    googleLogout();
    setAuth({
      isLoggedIn: false,
      userData: null,
      provider: null
    });
    toast.success('Successfully logged out');
  };

  return (
    <div className='flex gap-4 flex-wrap justify-center'>
      <button className='btn btn-primary' onClick={() => login()}>
        Login
      </button>
      {auth.isLoggedIn && (
        <button className='btn btn-neutral' onClick={logout}>
          Logout
        </button>
      )}
    </div>
  );
};

export default GoogleSignInButton;
