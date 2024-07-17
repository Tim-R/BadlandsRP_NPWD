import {
  Button,
  Dialog,
  DialogTitle,
  TextField,
  DialogActions,
  DialogContent,
  DialogContentText,
  Alert,
} from '@mui/material';
import React from 'react';

export const CreateBleetForm: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');
  const [imgUrl, setImgUrl] = React.useState('');
  const [imgUrlError, setImgUrlError] = React.useState('');
  const [showAlert, setShowAlert] = React.useState(false);
  const [buttonText, setButtonText] = React.useState('');

  const handleClickOpen = () => {
    if (!text && !imgUrl) {
      setButtonText('Please enter text or an image URL');
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return;
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    if (imgUrl && validateImgUrl(imgUrl)) {
      console.log('Bleet content:', text);
      console.log('Image URL:', imgUrl);
      // add logic to send bleet to server
      handleClose();
    }
  };

  const handleImgUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImgUrl(e.target.value);
    if (!validateImgUrl(e.target.value)) {
      setImgUrlError('Please enter a valid image URL');
    } else {
      setImgUrlError('');
    }
  };

  const validateImgUrl = (url: string) => {
    const regex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))/i;
    return regex.test(url);
  };

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
        <TextField
          id="outlined-basic"
          label="Img URL"
          variant="outlined"
          fullWidth
          style={{ marginBottom: '2rem' }}
          value={imgUrl}
          onChange={handleImgUrlChange}
          error={!!imgUrlError}
          helperText={imgUrlError}
        />
      </div>
      <React.Fragment>
        <Button variant="outlined" onClick={handleClickOpen}>
          Post bleet
        </Button>
        {showAlert && <Alert severity="info">{buttonText}</Alert>}
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
              {text}
              <br />
              {imgUrl && <img src={imgUrl} alt="Preview" style={{ maxWidth: '100%', marginTop: '1rem' }} />}
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
