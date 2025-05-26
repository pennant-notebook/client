export const mockUser = {
  username: 'testuser',
  password: 'password123',
  token: 'mock-jwt-token'
};

export const mockAuthResponse = {
  data: {
    token: mockUser.token,
    user: {
      username: mockUser.username
    }
  }
};