import { useGoogleOneTapLogin, googleLogout } from '@react-oauth/google';

const GoogleSignInButton = ({ loginHandler }: { loginHandler?: () => void }) => {
  // One Tap login hook
  useGoogleOneTapLogin({
    onSuccess: credentialResponse => {
      console.log('Successfully logged in:', credentialResponse);
      loginHandler && loginHandler();
      // You can set a toast or any other UI feedback here
    },
    onError: () => {
      console.log('Login Failed');
      // You can set a toast or any other UI feedback here
    }
  });

  // Logout function
  const logout = () => {
    googleLogout();
    // You can set a toast or any other UI feedback here
  };

  return (
    <div className='flex gap-4 flex-wrap justify-center'>
      {/* The button for One Tap will automatically appear */}
      {/* You can add a logout button here if needed */}
      <button className='btn btn-neutral' onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default GoogleSignInButton;
