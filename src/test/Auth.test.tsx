import axios from 'axios';
import { ImportMock } from 'ts-mock-imports';
import { test, expect, suite } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';

import Auth from '~/components/Auth/Auth';
import { validateForm } from '~/utils/authHelpers';

const axiosPostMock = ImportMock.mockFunction(axios, 'post');
import { useNavigate } from '../../__mocks__/react-router'; // Adjust the path based on your project structure
import Sinon from 'sinon';

test('Auth Component', () => {
  suite('it renders without crashing', () => {
    const { getByText } = render(<Auth />);
    expect(getByText(/log in/i)).toBeInTheDocument();
  });

  suite('it renders the signup form when signup is clicked', () => {
    const { getByText, queryByText } = render(<Auth />);
    const switchToSignupButton = getByText(/Switch to Signup/i);
    switchToSignupButton.click();
    expect(getByText(/Sign Up/i)).toBeInTheDocument();
    expect(queryByText(/log In/i)).not.toBeInTheDocument();
  });
});

test('Form Validation', () => {
  suite('should return error message for empty username', () => {
    const errorMessage = validateForm({ isSignUp: false, username: '', password: '123456' });
    expect(errorMessage).toBe('Expected error message');
  });

  suite('should return error message for empty password', () => {
    const errorMessage = validateForm({ isSignUp: false, username: 'testUser', password: '' });
    expect(errorMessage).toBe('Expected error message');
  });
});

test('API Calls', () => {
  suite('should call signup API with correct parameters', async () => {
    const { getByText, getByLabelText } = render(<Auth />);

    axiosPostMock.returns(Promise.resolve({ data: { token: '12345' } }));

    fireEvent.change(getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(getByLabelText(/Password/i), { target: { value: '123456' } });

    fireEvent.click(getByText(/Sign Up/i));

    expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/auth/signup', {
      username: 'testuser',
      password: '123456',
      provider: ''
    });
  });
});

test('Navigation', () => {
  suite('should navigate to dashboard on successful login', async () => {
    const { getByText, getByLabelText } = render(<Auth />);

    const navigateMock = Sinon.stub();
    useNavigate.returns(navigateMock);

    fireEvent.change(getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(getByLabelText(/Password/i), { target: { value: '123456' } });

    fireEvent.click(getByText(/Log In/i));

    expect(navigateMock.calledWith('/@testuser')).toBe(true);
  });
});
