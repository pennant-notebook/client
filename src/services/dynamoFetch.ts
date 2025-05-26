import axios, { AxiosResponse } from 'axios';
import { Notebook, UserProfile, DocumentDetails } from '@/ApiTypes';

const URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';

async function fetchNotebooks(username: string): Promise<Notebook[]> {
  try {
    const response: AxiosResponse<{ notebooks: Notebook[] }> = await axios.get(`${URL}/user/${username.slice(1)}/notebooks`);
    return response.data.notebooks;
  } catch (error) {
    console.error(`Error fetching notebooks for ${username} from DynamoDB:`, error);
    return [];
  }
}

async function fetchUser(identifier: string): Promise<UserProfile | null> {
  try {
    const modifiedIdentifier = identifier.startsWith('@') ? identifier.slice(1) : identifier;

    const isEmail = modifiedIdentifier.includes('@');
    const queryParams = isEmail ? { email: modifiedIdentifier } : { username: modifiedIdentifier };

    const response: AxiosResponse<UserProfile> = await axios.get(`${URL}/user`, { params: queryParams });
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with identifier ${identifier} from DynamoDB:`, error);
    return null;
  }
}


async function fetchDoc(docID: string, username: string): Promise<DocumentDetails | null> {
  try {
    const response: AxiosResponse<DocumentDetails> = await axios.get(`${URL}/doc/${docID}/${username.slice(1)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notebook from DynamoDB:', error);
    return null;
  }
}

export { fetchNotebooks, fetchUser, fetchDoc };
