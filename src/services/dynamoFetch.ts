import axios, { AxiosResponse } from 'axios';

const URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';

async function fetchNotebooks(username: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.get(`${URL}/user/${username.slice(1)}/notebooks`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching notebooks for ${username} from DynamoDB:`, error);
  }
}

async function fetchUser(username: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.get(`${URL}/user/${username.slice(1)}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${username} from DynamoDB:`, error);
  }
}

async function fetchDoc(docID: string, username: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.get(`${URL}/doc/${docID}/${username.slice(1)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notebook from DynamoDB:', error);
  }
}

export { fetchNotebooks, fetchUser, fetchDoc };
