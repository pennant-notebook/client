interface ValidateFormParams {
  identifier: string;
  password: string;
  confirmPassword?: string;
  isSignUp: boolean;
}

export const validateForm = ({ isSignUp, identifier, password, confirmPassword }: ValidateFormParams) => {
  let errorMessage = '';

  const isEmail = identifier.includes('@');

  if (isEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(identifier)) {
      errorMessage = 'Invalid email format.';
    }
  } else {
    if (identifier.length < 5) errorMessage = 'Username must be at least 5 characters long.';
    else if (/[^a-zA-Z0-9]/.test(identifier)) errorMessage = 'Username can only contain letters and numbers.';
  }

  if (!errorMessage) {
    if (password.length < 6) errorMessage = 'Password must be at least 6 characters long.';
    else if (isSignUp && password !== confirmPassword) errorMessage = 'Passwords do not match.';
  }

  return errorMessage;
};