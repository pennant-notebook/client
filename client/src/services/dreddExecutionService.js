import axios from "axios";

const BASE_URL = import.meta.env.VITE_ENGINE_SERVER;


export const sendToDredd = async (notebookId, cellId, code) => {
  try {
    ;
    const result = await axios.post(`${BASE_URL}/api/submit`, {
      notebookId,
      cells: [
        {
          cellId: cellId,
          code,
        }
      ]
    });
    return result.data.submissionId;
  } catch (error) {
    throw new Error(error.message);
  }
}

export const checkDreddStatus = async token => {
  try {
    const response = await axios.get(`${BASE_URL}/api/status/${token}`);
    const statusId = response.data.status;
  
    if (statusId === 'pending') {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return checkDreddStatus(token);
    } else {
      console.log("🐐 request order: ", response.data.requestOrder);
      console.log("🐑 response order: ", response.data.cellsExecuted);
    
      return response.data.results;
    }
  
  } catch (error) {
      throw new Error(error.message);
  }
}

export const resetContext = async (notebookId) => {
  try {
    notebookId = HARD_CODED_NOTE_BOOK_ID;
    return await axios.post(`${BASE_URL}/reset/${notebookId}`);
  } catch (error) {
    throw new Error(error.message);
  }
}

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
      notebookId: HARD_CODED_NOTE_BOOK_ID,
      cells,
    });
    return result.data.submissionId;
  } catch (error) {
    throw new Error(error.message);
  }
}