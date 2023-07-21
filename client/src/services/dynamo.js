import axios from 'axios';

const URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';

export const createUserInDynamo = async username => {
  try {
    const response = await axios.post(`${URL}/user/${username}`);
    return response.data;
  } catch (error) {
    console.error(`Error creating user ${user} in DynamoDB:`, error);
  }
};

export const fetchUserFromDynamo = async username => {
  try {
    const response = await axios.get(`${URL}/user/${username.slice(1)}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${username} from DynamoDB:`, error);
  }
};

export const fetchNotebooksFromDynamo = async username => {
  try {
    const response = await axios.get(`${URL}/user/${username.slice(1)}/notebooks`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching notebooks for ${username} from DynamoDB:`, error);
  }
};

export const fetchDocFromDynamo = async (docID, username) => {
  try {
    const response = await axios.get(`${URL}/doc/${docID}/${username.slice(1)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notebook from DynamoDB:', error);
  }
};

export const createDocInDynamo = async username => {
  try {
    const response = await axios.post(`${URL}/doc/${username.slice(1)}`);
    return response.data;
  } catch (error) {
    console.error('Error creating notebook in DynamoDB:', error);
  }
};

export const editDocTitleInDynamo = async (docID, title, username) => {
  try {
    const response = await axios.put(`${URL}/doc/${docID}/${username.slice(1)}`, { title });
    return response.data;
  } catch (error) {
    console.error('Error editing notebook title in DynamoDB:', error);
  }
};
