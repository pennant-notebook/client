import axios, { AxiosResponse } from 'axios';
import { CreateUserResponse, CreateDocResponse, EditDocTitleResponse, DeleteDocResponse } from '@/ApiTypes';

const isDevelopment = process.env.NODE_ENV === 'development';
const URL = isDevelopment ? 'http://localhost:3001/api' : '/api';

async function createUser(email: string): Promise<CreateUserResponse | null> {
  try {
    const response: AxiosResponse<CreateUserResponse> = await axios.post(`${URL}/user`, { email });
    return response.data;
  } catch (error) {
    console.error(`Error creating user with email ${email} in DynamoDB:`, error);
    return null;
  }
}

async function createDoc(username: string, language: string): Promise<CreateDocResponse | null> {
  try {
    const response: AxiosResponse<CreateDocResponse> = await axios.post(`${URL}/doc/${username.slice(1)}`, { language });
    return response.data;
  } catch (error) {
    console.error('Error creating notebook in DynamoDB:', error);
    return null;
  }
}

interface EditDocTitleParams {
  docID: string;
  title: string;
  username: string;
}

async function editDocTitle({ docID, title, username }: EditDocTitleParams): Promise<EditDocTitleResponse | null> {
  try {
    const response: AxiosResponse<EditDocTitleResponse> = await axios.put(`${URL}/doc/${docID}/${username.slice(1)}`, { title });
    return response.data;
  } catch (error) {
    console.error('Error editing notebook title in DynamoDB:', error);
    return null;
  }
}

interface DeleteDocParams {
  docID: string;
  username: string;
}

async function deleteDoc({ docID, username }: DeleteDocParams): Promise<DeleteDocResponse | null> {
  try {
    const response: AxiosResponse<DeleteDocResponse> = await axios.delete(`${URL}/doc/${docID}/${username.slice(1)}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting notebook in DynamoDB:', error);
    return null;
  }
}


export { createUser, createDoc, editDocTitle, deleteDoc };
