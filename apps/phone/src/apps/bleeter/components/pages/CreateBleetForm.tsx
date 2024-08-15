import {
  Button,
  Dialog,
  DialogTitle,
  TextField,
  DialogActions,
  DialogContent,
  DialogContentText,
  Alert,
  Stack,
  CircularProgress,
} from '@mui/material';
import React from 'react';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { BleeterEvents, BleetsFetchResponse } from '@typings/bleeter';
import { useCurrentAccount } from '@apps/bleeter/hooks/state';

export const CreateBleetForm: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');
  const [imgUrl, setImgUrl] = React.useState('');
  const [imgUrlError, setImgUrlError] = React.useState('');
  const [showAlert, setShowAlert] = React.useState(false);
  const [buttonText, setButtonText] = React.useState('');
  const [severity, setSeverity] = React.useState('success');
  const [loading, setLoading] = React.useState(false);
  const currentAccount = useCurrentAccount();


  type Severity = 'success' | 'info' | 'warning' | 'error';

  function alertButton(severity: Severity, text: string) {
    setButtonText(text);
    setSeverity(severity);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  }

  const handleClickOpen = () => {
    if (!text) {
      alertButton('info', 'Please enter some text to post a bleet');
      return;
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (data) => {
    console.log(data);
    // id: number,
    // accountId: number,
    // characterId: number,
    // repliedId?: number,
    // rebleetedId?: number,
    // baseAccountId?: number,
    // body: string,
    // likes: number,
    // images?: string,
    // rebleets: number,
    // createdAt: number,

    if (text) {
      setLoading(true);
      setOpen(false);
      console.log('Bleet content:', text);
      // add logic to send bleet to server
      try {
        console.log('Sending bleet to server');
        console.log('Current account id/charId:', currentAccount.id, currentAccount.characterId);
        const resp = await fetchNui<ServerPromiseResp<void>>(BleeterEvents.ADD_BLEET, {
          body: text,
          accountId: currentAccount.id,
          characterId: currentAccount.characterId,
          likes: 0,
        }).then((resp) => {
          console.log('Bleet posted:', resp);
          alertButton('success', 'Bleet posted!');
          setLoading(false);
        });
      } catch (e) {
        console.error(e);
        alertButton('error', 'Error - Bleet was not posted');
        setLoading(false);
        return;
      }
    }
  };

  function formatBleet(text) {
    // Regular expression to detect image links
    const imageRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/gi;

    // Replace image links with HTML <img> tags
    return text.replace(imageRegex, '<br><img src="$1" alt="Image" style="max-width: 100%; height: auto;"><br>');
  }

  return (
    <div>
      Create Bleet
      <div>
        <TextField
          id="outlined-multiline-static"
          label="Text"
          multiline
          rows={4}
          placeholder="Default Value"
          fullWidth
          style={{ marginBottom: '2rem', marginTop: '3rem' }}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <React.Fragment>
      {loading ? (<Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          paddingTop={2}
        >
          <CircularProgress />
        </Stack>) : (
        <Button variant="outlined" onClick={handleClickOpen}>
          Post bleet
        </Button>)}
        {showAlert && <Alert severity={severity}>{buttonText}</Alert>}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            style: {
              top: '0%',
              left: '40%',
              transform: 'translate(-30%, -20%)',
              width: '22%',
            },
          }}
        >
          <DialogTitle id="alert-dialog-title">
            {'Are you sure you want to post this bleet?'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
            <div style={{whiteSpace: 'pre-wrap'}} dangerouslySetInnerHTML={{ __html: formatBleet(text) }} />
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="error">
              Cancel
            </Button>
            <Button onClick={handleSubmit} autoFocus>
              Post
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  );
};
