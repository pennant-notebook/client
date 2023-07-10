import axios from 'axios';

export const checkStatus = async token => {
  try {
    const options = {
      method: 'GET',
      url: import.meta.env.VITE_RAPID_API_URL + '/' + token,
      params: { base64_encoded: 'true', fields: '*' },
      headers: {
        'X-RapidAPI-Host': import.meta.env.VITE_RAPID_API_HOST,
        'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY
      }
    };

    const response = await axios.request(options);
    const statusId = response.data.status?.id;

    if (statusId === 1 || statusId === 2) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return checkStatus(token);
    } else {
      return response.data;
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

export const parseEngineResponse = response => {
  let statusId = response?.status?.id;

  if (statusId === 6) {
    atob(response?.compile_output);
  } else if (statusId === 3) {
    return atob(response.stdout) !== null ? `${atob(response.stdout)}` : null;
  } else if (statusId === 5) {
    return `Time Limit Exceeded`;
  } else {
    return atob(response?.stderr);
  }
};
