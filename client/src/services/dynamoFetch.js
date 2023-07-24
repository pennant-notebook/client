import axios from 'axios';

const URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';

const fetchNotebooks = async username => {
  try {
    const response = await axios.get(`${URL}/user/${username.slice(1)}/notebooks`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching notebooks for ${username} from DynamoDB:`, error);
  }
};

const fetchUser = async username => {
  try {
    const response = await axios.get(`${URL}/user/${username.slice(1)}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${username} from DynamoDB:`, error);
  }
};

const fetchDoc = async (docID, username) => {
  try {
    const response = await axios.get(`${URL}/doc/${docID}/${username.slice(1)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notebook from DynamoDB:', error);
  }
};

export { fetchNotebooks, fetchUser, fetchDoc };
