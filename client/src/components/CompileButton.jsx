import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import axios from 'axios';

const currStatus = ['Running', 'Running.', 'Running..', ' Running...'];

function CompileButton({ content, language, input, setOutput, outputType }) {
  const regex =
    /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState('Compile and Execute');

  let intervalId;
  var statusChange = 0;

  function hasNonLatin1Characters(str) {
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      if (charCode > 255) {
        return true;
      }
    }
    return false;
  }

  function statusUpdate() {
    if (statusChange === 0) {
      setStatus(currStatus[0]);
      statusChange++;
    } else if (statusChange === 1) {
      statusChange++;
      setStatus(currStatus[1]);
    } else if (statusChange === 2) {
      statusChange++;
      setStatus(currStatus[2]);
    } else {
      statusChange = 0;
      setStatus(currStatus[3]);
    }
  }

  function startInterval() {
    intervalId = setInterval(statusUpdate, 300);
  }

  function stopInterval() {
    clearInterval(intervalId);
    setStatus('Compile and Execute');
  }

  async function compileCode() {
    setProcessing(true);
    var sourceCode = content.current.getValue().replace(regex, '');

    if (!sourceCode || hasNonLatin1Characters(sourceCode)) {
      alert('Cannot compile. Code editor either contains special characters or is empty.');
      return;
    }

    startInterval();

    const options = {
      method: 'POST',
      url: import.meta.env.VITE_RAPID_API_URL,
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
        'X-RapidAPI-Host': import.meta.env.VITE_RAPID_API_HOST
      },
      data: {
        language_id: 63,
        source_code: sourceCode,
        stdin: input
      }
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        const token = response.data.token;

        // Poll for the results of the submission
        const getResult = () => {
          axios
            .get(`${import.meta.env.VITE_RAPID_API_URL}/${token}`, {
              headers: {
                'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
                'X-RapidAPI-Host': import.meta.env.VITE_RAPID_API_HOST
              }
            })
            .then(function (response) {
              const data = response.data;
              if (data.status.id <= 2) {
                // The code is still being executed, poll again after a delay
                setTimeout(getResult, 1000);
              } else {
                // The code has finished executing, display the output
                console.log(data);
                setOutput(data);

                outputType.set('data', data);
              }
            })
            .catch(err => {
              let error = err.response ? err.response.data : err;
              setOutput(error);
              console.log(error);
            });
        };

        getResult();
      })
      .catch(err => {
        let error = err.response ? err.response.data : err;
        setOutput(error);
        console.log(error);
      })
      .finally(() => {
        setProcessing(false);
        stopInterval();
      });
  }

  return (
    <Button variant='contained' disabled={processing} onClick={compileCode}>
      {processing ? <CircularProgress size={24} /> : status}
    </Button>
  );
}

export default CompileButton;
