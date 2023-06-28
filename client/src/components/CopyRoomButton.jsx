import { useState } from 'react';
import { Button } from '@mui/material';

function CopyRoomButton() {
  const [buttonText, setButtonText] = useState('Copy Invite Link');

  const copyUrlToClipboard = () => {
    const appUrl = window.location.href;

    navigator.clipboard
      .writeText(appUrl)
      .then(() => {
        setButtonText('Copied');
        setTimeout(() => {
          setButtonText('Copy Invite Link');
        }, 1000);
      })
      .catch(error => {
        console.error('Failed to copy URL to clipboard:', error);
      });
  };

  return (
    <Button variant='contained' onClick={copyUrlToClipboard}>
      {buttonText}
    </Button>
  );
}

export default CopyRoomButton;
