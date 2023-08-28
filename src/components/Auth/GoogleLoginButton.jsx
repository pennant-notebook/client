import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { fetchUser } from '../../services/dynamoFetch';
import { createUser } from '../../services/dynamoPost';

const API_URL = process.env.NODE_ENV === 'production' ? '/auth' : 'http://localhost:3001/auth';

const GoogleLoginButton = () => {
  const onGoogleSuccess = async response => {
    const email = response.profileObj.email;
    const user = await fetchUser(email);
    if (!user) {
      await createUser(email);
    }
  };

  const onGoogleFailure = response => {
    console.log(response);
  };

  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
      redirectUri={import.meta.env.VITE_GOOGLE_REDIRECT_URI}>
      <GoogleLogin onSuccess={onGoogleSuccess} onFailure={onGoogleFailure} />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
