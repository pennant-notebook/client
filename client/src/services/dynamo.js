import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const fetchUserFromDynamo = async username => {
  const user = username.substring(1);
  try {
    const response = await axios.get(`${API_URL}/${user}`);
    return response.data;
  } catch (error) {
    console.error('Error retrieving notebook from DynamoDB:', error);
  }
};

export const createUserInDynamo = async username => {
  try {
    const response = await axios.post(`${API_URL}/user/${username}`);
    return response.data;
  } catch (error) {
    console.error('Error creating notebook in DynamoDB:', error);
  }
};

export const fetchDocFromDynamo = async (username, docID) => {
  const user = username.substring(1);
  try {
    const response = await axios.get(`${API_URL}/${user}/${docID}`);
    return response.data;
  } catch (error) {
    console.error('Error retrieving notebook from DynamoDB:', error);
  }
};

export const createDocInDynamo = async username => {
  const user = username.substring(1);
  try {
    const response = await axios.post(`${API_URL}/doc/${user}`);
    return response.data;
  } catch (error) {
    console.error('Error creating notebook in DynamoDB:', error);
  }
};

export const editDocTitleInDynamo = async (username, docID, title, slug) => {
  const user = username.substring(1);
  try {
    const response = await axios.put(`${API_URL}/${user}/${docID}`, { title, slug });
    return response.data;
  } catch (error) {
    console.error('Error editing notebook title in DynamoDB:', error);
  }
};
