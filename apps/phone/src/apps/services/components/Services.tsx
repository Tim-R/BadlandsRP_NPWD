import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ServicesThemeProvider } from '../providers/ServicesThemeProvider';
import { useRecoilValue } from 'recoil';
import fetchNui from '@utils/fetchNui';
import usePlayerData from '@os/phone/hooks/usePlayerData';
import styled from '@emotion/styled';
import { ServiceConfig, ServicePrecheckResp } from '@typings/services';
import { phoneState } from '@os/phone/hooks/state';
import { Modal2 } from '@ui/components';

import {
  List,
  ListItem,
  Button,
  Paper,
  IconButton,
  ListItemText,
  Typography,
  Grid,
  TextField
} from '@mui/material';

import {
  Phone as PhoneIcon,
  Chat as ChatIcon
} from '@mui/icons-material';

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

const defaults = {
  service: { name: 'Default', subtitle: 'Default', message: '' },
  message: '',
  serviceAvailable: false,
  serviceMessage: '',
  messageError: '',
}

export const Services: React.FC = () => {
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [selectedService, setService] = useState(defaults.service);
  const [serviceAvailable, setServiceAvailable] = useState(defaults.serviceAvailable);
  const [serviceMessage, setServiceMessage] = useState(defaults.serviceMessage);
  const [message, setMessage] = useState(defaults.message);
  const [messageError, setMessageError] = useState(defaults.messageError);
  const playerData = usePlayerData();
  const config = useRecoilValue(phoneState.resourceConfig);

  const openModal = (service: any, available: boolean, message: string) => {
    fetchNui('npwd:services:focus', { keepGameFocus: false });
    setService(service);
    setServiceAvailable(available);
    setServiceMessage(message);
    setOpen(true);

    console.log('playerData in npwd_services is', playerData)
  }

  const closeModal = () => {
    setOpen(false);
    setService(defaults.service);
    setServiceAvailable(defaults.serviceAvailable);
    setServiceMessage(defaults.serviceMessage);
    setMessage(defaults.message);
    setMessageError(defaults.messageError);
  }

  const onChange = (event: any) => {
    setMessage(event.target.value);
    setMessageError(defaults.messageError);
  }

  const sendMessage = () => {
    if(message === "") {
      setMessageError("You must enter a message to send");
      return
    }

    let service = selectedService;
    service.message = message;

    closeModal();

    history.push('/');

    fetchNui('npwd:services:selectService', { service });
  };

  const handleSelectService = (service: any) => {
    fetchNui<ServicePrecheckResp>('npwd:services:messagePrecheck', { service }).then(resp => {
      if(service.action === 'message' || !resp.available) {
        openModal(service, resp.available, resp.message);
      } else {
        fetchNui('npwd:services:selectService', { service });
      }
    });
  };

  const serviceElements = [];

  config.services.items.forEach((service: ServiceConfig) => {
    serviceElements.push((
      <ListItem
        secondaryAction={
          <IconButton
          onClick={() => handleSelectService(service) }
          >
            { service.action == 'call' && <PhoneIcon /> }
            { service.action == 'message' && <ChatIcon /> }
          </IconButton>
        }
      >
        <ListItemText
          primaryTypographyProps={{
            color: '#fff',
            fontWeight: 'bold',
          }}
          primary={`${service.icon} ${service.name}`}
          secondary={service.subtitle}
        />
      </ListItem>
    ));
  });

  return (
      <ServicesThemeProvider>
        <Container square elevation={0}>
          <Content>
            <List>
              {serviceElements}
            </List>

            <Modal2 visible={open} handleClose={() => {}}>
              { serviceAvailable &&
              <TextField
                label={`${selectedService.name} - ${selectedService.subtitle}`}
                multiline
                rows={4}
                fullWidth
                sx={{ mb: 1 }}
                onChange={onChange}
              />
              }

              { !serviceAvailable &&
              <Typography id="modal-modal-description" sx={{ mb: 2 }}>
                {serviceMessage}
              </Typography>
              }

              { messageError !== "" &&
              <Typography id="modal-modal-description" sx={{ mb: 1, color: 'error.main' }}>
                {messageError}
              </Typography>
              }

              <Grid container justifyContent="flex-end">
                { serviceAvailable &&
                <Button
                  onClick={() => sendMessage() }
                  variant="outlined"
                  color="success"
                  sx={{ mr: 2 }}
                >
                  Send
                </Button>
                }

                <Button
                  onClick={() => closeModal() }
                >
                  Close
                </Button>
              </Grid>
            </Modal2>
          </Content>
        </Container>
      </ServicesThemeProvider>
  );
};
