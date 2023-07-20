import axios from 'axios';

const BASE_URL = import.meta.env.VITE_ENGINE_SERVER;

export const sendToDredd = async (notebookId, cellId, code) => {
  console.log(code);
  try {
    const result = await axios.post(`${BASE_URL}/api/submit`, {
      notebookId,
      cells: [
        {
          cellId: cellId,
          code
        }
      ]
    });
    return result.data.submissionId;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const checkDreddStatus = async token => {
  try {
    const response = await axios.get(`${BASE_URL}/api/status/${token}`);
    const statusId = response.data.status;
    if (statusId === 'critical error') {
      throw new Error('critical error');
    }

    if (statusId === 'pending') {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return checkDreddStatus(token);
    } else {
      return response.data.results;
    }
  } catch (error) {
    if (error.hasOwnProperty('response')) {
      if (error.response.status === 500) {
        console.log('server error');
      } else if (error.response.status === 400) {
        console.log('bad request');
      }
    }
    throw new Error(error.message);
  }
};

export const resetContext = async notebookId => {
  try {
    return await axios.post(`${BASE_URL}/api/reset/${notebookId}`);
  } catch (error) {
    throw new Error(error.message);
  }
};

// export const sendManyToDredd = async (notebookId, cells) => {
//   try {
//     const result = await axios.post(`${BASE_URL}/submit`, {
//       notebookId,
//       cells
//     });
//     return result.data.submissionId;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };
