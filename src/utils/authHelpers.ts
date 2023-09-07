interface ValidateFormParams {
  username: string;
  password: string;
  confirmPassword?: string;
  isSignUp: boolean;
}

export const validateForm = ({ isSignUp, username, password, confirmPassword }: ValidateFormParams) => {
  let errorMessage = '';

  if (username.length < 5) errorMessage = 'Username must be at least 5 characters long.';
  else if (/[^a-zA-Z0-9]/.test(username)) errorMessage = 'Username can only contain letters and numbers.';
  else if (password.length < 6) errorMessage = 'Password must be at least 6 characters long.';
  else if (isSignUp && password !== confirmPassword) errorMessage = 'Passwords do not match.';

  return errorMessage;
};
