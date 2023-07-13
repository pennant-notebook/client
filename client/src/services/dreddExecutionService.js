import axios from 'axios';

const BASE_URL = import.meta.env.VITE_ENGINE_SERVER;

export const sendToDredd = async (notebookId, cellId, code) => {
  try {
    const result = await axios.post(`${BASE_URL}/api/submit`, {
      notebookId,
      cells: [
        {
          cellId,
          code
        }
      ]
    });
    return result.data.submissionId;
  } catch (error) {
    throw new Error(error.message);
  }
};


// TODO
// HTTP Status 400, 500 handling
// Timeout , critical error handling
export const checkDreddStatus = async token => {
  try {
    const response = await axios.get(`${BASE_URL}/api/status/${token}`);
    // ! for error testing
    // const response = await axios.get(`${BASE_URL}/api/status/INVALID_TOKEN_32542352`);
    const statusId = response.data.status;
    if (statusId === 'critical error') {
      throw new Error('critical error');
    }

    if (statusId === 'pending') {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return checkDreddStatus(token);
    } else {
      console.log('🐐 request order: ', response.data.requestOrder);
      console.log('🐑 response order: ', response.data.cellsExecuted);

      return response.data.results;
    }
  } catch (error) {
    // TODO logic for changing ui to error state, or rethrow and catch in calling ui component
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
//       notebookId: HARD_CODED_NOTE_BOOK_ID,
//       cells,
//     });
//     return result.data.submissionId;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }

export const sendManyToDredd = async (notebookId, cells) => {
  try {
    const result = await axios.post(`${BASE_URL}/submit`, {
      notebookId,
      cells
    });
    return result.data.submissionId;
  } catch (error) {
    throw new Error(error.message);
  }
};
