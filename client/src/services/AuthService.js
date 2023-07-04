import axios from 'axios';

const baseUrl = 'http://localhost:3001/api/user';

class AuthService {
  async signUp(username, password) {
    try {
      const response = await axios.post(baseUrl + '/signup', { username, password });
      if (response.status === 201) {
        this.logIn(username, password);
      }
    } catch (error) {
      console.log('error occurred during signup: ', error);
    }
  }

  logOut() {
    // TODO: Remove the user object from localStorage
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  logIn = async (username, password) => {
    try {
      const response = await axios.post(baseUrl + '/login', { username, password });
      const user = { ...response.data, name: username };
      return user;
    } catch (error) {
      console.error(error);
      throw new Error('Login failed!');
    }
  };
}

export default new AuthService();
