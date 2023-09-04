import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const API_URL = process.env.NODE_ENV === 'production' ? '/auth' : 'http://localhost:3001/auth';

const GoogleLoginButton = () => {
  const onGoogleSuccess = async response => {
    const email = response.profileObj.email;
    const username = email.substring(0, email.indexOf('@'));
    const provider = 'google';

    // Check if user exists
    const userExists = await fetch(`${API_URL}/checkUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, provider })
    }).then(res => res.json());

    if (!userExists.exists) {
      await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, provider })
      });
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
