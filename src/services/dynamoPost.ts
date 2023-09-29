import axios, { AxiosResponse } from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development';
const URL = isDevelopment ? 'http://localhost:3001/api' : '/api';

async function createUser(username: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.post(`${URL}/user/${username}`);
    return response.data;
  } catch (error) {
    console.error(`Error creating user ${username} in DynamoDB:`, error);
  }
}

async function createDoc(username: string, language: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.post(`${URL}/doc/${username.slice(1)}`, { language });
    return response.data;
  } catch (error) {
    console.error('Error creating notebook in DynamoDB:', error);
  }
}

interface EditDocTitleParams {
  docID: string;
  title: string;
  username: string;
}

async function editDocTitle({ docID, title, username }: EditDocTitleParams): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.put(`${URL}/doc/${docID}/${username.slice(1)}`, { title });
    return response.data;
  } catch (error) {
    console.error('Error editing notebook title in DynamoDB:', error);
  }
}

interface DeleteDocParams {
  docID: string;
  username: string;
}

async function deleteDoc({ docID, username }: DeleteDocParams): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.delete(`${URL}/doc/${docID}/${username.slice(1)}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting notebook in DynamoDB:', error);
  }
}

export { createUser, createDoc, editDocTitle, deleteDoc };
