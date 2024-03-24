import React, { ChangeEvent, useEffect, useState } from 'react';
import { AdvertisementsThemeProvider } from '../providers/AdvertisementsThemeProvider';
import { useRecoilValue } from 'recoil';
import fetchNui from '@utils/fetchNui';
import styled from '@emotion/styled';
import { phoneState } from '@os/phone/hooks/state';
import { Modal2 } from '@ui/components';
import { useAdvertisementsValue, useModalAcceptTextValue, useModalAction, useModalOpenValue, useModalTextValue, useSetModalAcceptText, useSetModalAction, useSetModalOpen, useSetModalText } from '../hooks/state';
import { AdvertisementItem } from './AdvertisementItem';
import { Advertisement } from '@typings/advertisements';
import { CommonEvents, ServerPromiseResp, Vector } from '@typings/common';
import { AdvertisementsEvents } from '@typings/advertisements';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import usePlayerData from '@os/phone/hooks/usePlayerData';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import {
  Button,
  Paper,
  Typography,
  Grid,
  FormGroup,
  FormControlLabel,
  Switch,
  TextField,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';

const Container = styled(Paper)`
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  max-height: 100%;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 1.5rem;
  max-height: calc(100% - 3.5rem - 4rem);
  overflow: auto;
`;

export const Advertisements: React.FC = () => {
  const config = useRecoilValue(phoneState.resourceConfig);
  const playerData = usePlayerData();
  const advertisements = useAdvertisementsValue();
  const { addAlert } = useSnackbar();

  /* Utils */
  const getLocation = async () => {
    let r = await fetchNui<Location>(CommonEvents.GET_LOCATION);

    return r;
  }

  const myPhoneNumber = useMyPhoneNumber();

  /* Modal stuff */
  const modalOpen = useModalOpenValue();
  const setModalOpen = useSetModalOpen();

  const modalText = useModalTextValue();
  const setModalText = useSetModalText();

  const modalAcceptText = useModalAcceptTextValue();
  const setModalAcceptText = useSetModalAcceptText();

  const modalAction = useModalAction();
  const setModalAction = useSetModalAction();

  const [modalAdvertisement, setModalAdvertisement] = useState<Advertisement>();

  const [modalBodyText, setModalBodyText] = useState('');
  const onChangeModalBodyText = (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;

    if(text.length > config.advertisements.maxLength) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    setModalBodyText(text);
  };

  const [modalPhoneChecked, setModalPhoneChecked] = useState(false);
  const onChangeModalPhoneChecked = (e: ChangeEvent<HTMLInputElement>) => setModalPhoneChecked(e.target.checked);

  const [modalLocationChecked, setModalLocationChecked] = useState(false);
  const onChangeModalLocationChecked = (e: ChangeEvent<HTMLInputElement>) => setModalLocationChecked(e.target.checked);

  const [modalBusiness, setModalBusiness] = useState('');
  const onChangeModalBusiness = (e: SelectChangeEvent<string>) => setModalBusiness(e.target.value);

  const closeModal = () => {
    setModalOpen(false);
  }

  const [bodyCharsRemaining, setBodyCharsRemaining] = useState(0);

  useEffect(() => {
    setBodyCharsRemaining(config.advertisements.maxLength - modalBodyText.length);
  }, [modalBodyText]);

  useEffect(() => {
    if(!modalOpen) return;

    fetchNui('npwd:services:focus', { keepGameFocus: false });
  }, [modalOpen]);

  const handleAdvertisementAction = (advertisement: Advertisement, action: string) => {
    switch(action) {
      case 'bump': {
        setModalText(`Pay $${config.advertisements.priceBump} to bump advertisement?`);
        setModalAcceptText(`Pay $${config.advertisements.priceBump}`);
        setModalAction(action);
        setModalAdvertisement(advertisement);
        setModalOpen(true);

        break;
      }

      case 'delete': {
        setModalText(`Delete advertisement?`);
        setModalAcceptText(`Delete advertisement`)
        setModalAction(action);
        setModalAdvertisement(advertisement);
        setModalOpen(true);

        break;
      }

      case 'edit': {
        setModalText(`Edit advertisement`);
        setModalAcceptText(`Edit`)
        setModalAction(action);
        setModalAdvertisement(advertisement);

        setModalBodyText(advertisement.body);
        setModalBusiness(advertisement.business);
        setModalPhoneChecked(advertisement.phone !== null);
        setModalLocationChecked(advertisement.location !== null);

        setModalOpen(true);

        break;
      }
    }
  }

  const finalizeAction = async () => {
    switch(modalAction) {
      case 'bump': {
        if(!modalAdvertisement) {
          return;
        }

        fetchNui<ServerPromiseResp<void>>(AdvertisementsEvents.BUMP_AD, { adId: modalAdvertisement.id }).then((resp) => {
          if(resp.status !== 'ok') {
            return addAlert({
              message: resp.errorMsg,
              type: 'error',
            });
          }

          return addAlert({
            message: 'Advertisement bumped',
            type: 'success',
          });
        });

        break;
      }

      case 'delete': {
        fetchNui<ServerPromiseResp<void>>(AdvertisementsEvents.DELETE_AD, { adId: modalAdvertisement.id }).then((resp) => {
          if(resp.status !== 'ok') {
            return addAlert({
              message: resp.errorMsg,
              type: 'error',
            });
          }

          return addAlert({
            message: 'Advertisement deleted',
            type: 'success',
          });
        });

        break;
      }

      case 'edit': {
        fetchNui<ServerPromiseResp<void>>(AdvertisementsEvents.EDIT_AD, {
          adId: modalAdvertisement.id,
          business: modalBusiness !== '' ? modalBusiness : null,
          body: modalBodyText,
          phone: modalPhoneChecked ? myPhoneNumber : null,
          location: modalLocationChecked ? (await getLocation()) : null,
        }).then((resp) => {
          if(resp.status !== 'ok') {
            return addAlert({
              message: resp.errorMsg,
              type: 'error',
            });
          }

          return addAlert({
            message: 'Advertisement edited',
            type: 'success',
          });
        });

        break;
      }

      case 'create': {
        fetchNui<ServerPromiseResp<void>>(AdvertisementsEvents.CREATE_AD, {
          business: modalBusiness !== '' ? modalBusiness : null,
          body: modalBodyText,
          phone: modalPhoneChecked ? myPhoneNumber : null,
          location: modalLocationChecked ? (await getLocation()) : null,
        }).then((resp) => {
          if(resp.status !== 'ok') {
            return addAlert({
              message: resp.errorMsg,
              type: 'error',
            });
          }

          return addAlert({
            message: 'Advertisement edited',
            type: 'success',
          });
        });

        break;
      }
    }

    closeModal();
  }

  return (
      <AdvertisementsThemeProvider>
        <Container square elevation={0}>
          <Content className="h-full">
            {advertisements.length == 0 &&
              <div className="flex flex-col grow items-center justify-center">
                <Typography variant="h6">No recent advertisements</Typography>
              </div>
            }

            {advertisements.length > 0 &&
              <div className="flex flex-col">
                {[...advertisements]
                  .sort((a, b) => {
                    return b.bumpedAt - a.bumpedAt;
                  })
                  .map((advertisement) => {
                    return <AdvertisementItem advertisement={advertisement} actionHandler={handleAdvertisementAction} />
                  })
                }
              </div>
            }

            <Modal2 visible={modalOpen} handleClose={() => {}}>
              <Typography sx={{ mb: 2 }}>{modalText}</Typography>

              {(modalAction == 'create' || modalAction == 'edit') &&
                <FormControl fullWidth sx={{ mb: 1 }}>
                  <TextField
                    label={`Advertisement`}
                    multiline
                    rows={4}
                    fullWidth
                    onChange={onChangeModalBodyText}
                    value={modalBodyText}
                  />
                  <FormHelperText >Characters remaining: {bodyCharsRemaining}</FormHelperText>
                </FormControl>

              }

              {((modalAction == 'create' || modalAction == 'edit') && playerData.businesses.length > 0) &&
                <FormControl sx={{ mb: 1 }}>
                  <InputLabel htmlFor="business-select">Business</InputLabel>
                  <Select
                    native
                    value={modalBusiness}
                    onChange={onChangeModalBusiness}
                    input={<OutlinedInput label="Business" id="business-select" />}
                  >
                    <option value=""></option>
                    {[...playerData.businesses]
                      .sort((a, b) => {
                        return a.name.localeCompare(b.name);
                      })
                      .map((business) => (
                      <option value={business.name}>{business.name}</option>
                    ))}
                  </Select>
                  <FormHelperText>If you set a business, anyone in this business will be able to bump / edit / delete this ad</FormHelperText>
                </FormControl>
              }

              {(modalAction == 'create' || modalAction == 'edit') &&
                <FormGroup>
                  <FormControlLabel control={<Switch checked={modalPhoneChecked} onChange={onChangeModalPhoneChecked} />} label="Include my phone number" />
                  <FormControlLabel control={<Switch checked={modalLocationChecked} onChange={onChangeModalLocationChecked} />} label="Include my location" />
                </FormGroup>
              }

              <Grid container justifyContent="flex-end">
                <Button onClick={closeModal}>Close</Button>

                {modalAcceptText != '' &&
                  <Button
                    onClick={finalizeAction}
                    variant="outlined"
                    color="success"
                    sx={{ ml: 2 }}
                  >
                    {modalAcceptText}
                  </Button>
                }
              </Grid>
            </Modal2>
          </Content>
        </Container>
      </AdvertisementsThemeProvider>
  );
};
