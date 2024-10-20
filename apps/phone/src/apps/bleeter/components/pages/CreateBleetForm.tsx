import { styled, Box } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { Bleet, BleeterEvents, BleetsFetchResponse } from '@typings/bleeter';
import { useBleetsValue, useCurrentAccount, useSetBleets } from '@apps/bleeter/hooks/state';
import { NewTweet } from '@typings/twitter';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { promiseTimeout } from '@utils/promiseTimeout';
import { useWordFilter } from '@os/wordfilter/hooks/useWordFilter';
import { usePhone } from '@os/phone/hooks';
import { getNewLineCount } from '@apps/twitter/utils/message';
import { IMAGE_DELIMITER } from '@apps/twitter/utils/images';
import { Modal2, toggleKeys } from '@ui/components';
import TweetMessage from '@apps/twitter/components/tweet/TweetMessage';
import ImagePrompt from '@apps/twitter/components/images/ImagePrompt';
import EmojiSelect from '@apps/twitter/components/EmojiSelect';
import ImageDisplay from '@apps/twitter/components/images/ImageDisplay';
import { isImageValid } from '@common/utils/isImageValid';
import IconButtons from '@apps/twitter/components/buttons/IconButtons';
import ControlButtons from '@apps/twitter/components/buttons/ControlButtons';
import { useModal } from '@apps/bleeter/hooks/useModal';

const ButtonsContainer = styled(Box)({
  paddingBottom: '8px',
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'space-between',
  flex: '1 0 45px',
});

interface Image {
  id: string;
  link: string;
}

export const CreateBleetForm: React.FC = () => {
  const { message, setMessage, modalVisible, setModalVisible } = useModal()
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');
  const [imgUrl, setImgUrl] = React.useState('');
  const [imgUrlError, setImgUrlError] = React.useState('');
  const [showAlert, setShowAlert] = React.useState(false);
  const [buttonText, setButtonText] = React.useState('');
  const [severity, setSeverity] = React.useState('success');
  const [loading, setLoading] = React.useState(false);
  const bleets = useBleetsValue();
  const setBleets = useSetBleets();
  const currentAccount = useCurrentAccount();
  const { addAlert } = useSnackbar();
  const { clean } = useWordFilter();
  const { ResourceConfig } = usePhone();
  const [images, setImages] = useState<Image[]>([]);

  const [showImagePrompt, setShowImagePrompt] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [link, setLink] = useState('');

  const reset = () => {
    setShowImagePrompt(false);
    setShowEmoji(false);

    setLink('');
    setImages([]);
    setMessage('');
  };

  const _handleClose = () => {
    reset();
    setModalVisible(false);
  };

  const handleImageChange = useCallback((link, shouldSubmit) => {
    setLink(link);
    if (shouldSubmit) return setShowImagePrompt(true);
  }, []);

  const handleMessageChange = useCallback((message) => setMessage(message), [setMessage]);

  if (!ResourceConfig) return null;
  const { characterLimit, newLineLimit } = ResourceConfig.bleeter;

  const isValidMessage = (message) => {
    if (message.length > characterLimit) return false;
    if (getNewLineCount(message) < newLineLimit) return true;
  };

  const isEmptyMessage = () => {
    const cleanedMessage = clean(message.trim());
    if (
      (cleanedMessage && cleanedMessage.length > 0 && isValidMessage(cleanedMessage)) ||
      (images && images.length > 0)
    ) {
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    await promiseTimeout(200);
    const cleanedMessage = clean(message.trim());
    if (isEmptyMessage()) return;

    const data: NewTweet = {
      message: cleanedMessage,
      retweet: null,
      images:
        images && images.length > 0 ? images.map((image) => image.link).join(IMAGE_DELIMITER) : '',
    };

    fetchNui<ServerPromiseResp<void>>(BleeterEvents.ADD_BLEET, {
      body: data.message,
      accountId: currentAccount.id,
      characterId: currentAccount.characterId,
      likes: 0,
      images: data.images,
    }).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          type: 'error',
          message: 'Bleet error',
        });
      }
    });

    _handleClose();
  };

  const addImage = () => {
    // strip any whitespace from the link in case the user
    // added some spaces/returns accidentally
    const cleanedLink = link.replace('/ /g', '');
    // because we're only storing strings in the database we need
    // to give this an arbirtrary (but unique) id so that we can
    // correctly filter an array of images when the user wants to
    // delete them. This handles an edge case where the user adds
    // two of the same image.
    const image = { id: uuidv4(), link: cleanedLink };
    // it's worth noting that we only perform this validation on
    // the client of the user who is submitting the image. When
    // other users see this image on their TweetList it will be
    // from the database and should already have passed through
    // this logic
    isImageValid(cleanedLink)
      .then(() => setImages([...images, image]))
      .catch((e) => console.error(e));

    setShowImagePrompt(false);
    setLink('');
  };
  const removeImage = (id: string) => setImages(images.filter((image) => id !== image.id));

  const toggleShowImagePrompt = () => {
    setShowEmoji(false); // clear the emoji so we can switch between emoji/images
    setShowImagePrompt(!showImagePrompt);
  };
  const toggleShowEmoji = async () => {
    // clear the images so we can seemlessly toggle between emoji/images
    setShowImagePrompt(false);
    setShowEmoji(!showEmoji);

    await toggleKeys(showEmoji);
  };

  const handleSelectEmoji = (emojiObject) => {
    setMessage(message.concat(emojiObject.native));
  };

  return (
    <Modal2 visible={modalVisible} handleClose={_handleClose}>
      <TweetMessage
        modalVisible={modalVisible}
        onEnter={handleSubmit}
        message={message}
        handleChange={handleMessageChange}
      />
      <ImagePrompt visible={showImagePrompt} value={link} handleChange={handleImageChange} />
      <EmojiSelect visible={showEmoji} onEmojiClick={handleSelectEmoji} />
      <ImageDisplay
        visible={!showEmoji && images.length > 0}
        images={images}
        removeImage={removeImage}
      />
      <ButtonsContainer>
        <IconButtons
          onImageClick={
            images.length < ResourceConfig.twitter.maxImages ? toggleShowImagePrompt : null
          }
          onEmojiClick={toggleShowEmoji}
        />
        <ControlButtons
          showImagePrompt={showImagePrompt}
          showEmoji={showEmoji}
          onPrimaryClick={showImagePrompt ? addImage : handleSubmit}
          onCloseClick={showEmoji ? toggleShowEmoji : toggleShowImagePrompt}
        />
      </ButtonsContainer>
    </Modal2>
  );
};
