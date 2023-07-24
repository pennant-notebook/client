import axios from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development';
const URL = isDevelopment ? 'http://localhost:3001/api' : '/api';

async function createUser(username) {
  try {
    const response = await axios.post(`${URL}/user/${username}`);
    return response.data;
  } catch (error) {
    console.error(`Error creating user ${user} in DynamoDB:`, error);
  }
}

async function createDoc(username) {
  try {
    const response = await axios.post(`${URL}/doc/${username.slice(1)}`);
    return response.data;
  } catch (error) {
    console.error('Error creating notebook in DynamoDB:', error);
  }
}

async function editDocTitle(docID, title, username) {
  try {
    const response = await axios.put(`${URL}/doc/${docID}/${username.slice(1)}`, { title });
    return response.data;
  } catch (error) {
    console.error('Error editing notebook title in DynamoDB:', error);
  }
}

export { createUser, createDoc, editDocTitle };
