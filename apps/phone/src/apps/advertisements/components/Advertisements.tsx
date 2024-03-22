import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AdvertisementsThemeProvider } from '../providers/AdvertisementsThemeProvider';
import { useRecoilValue } from 'recoil';
import fetchNui from '@utils/fetchNui';
import usePlayerData from '@os/phone/hooks/usePlayerData';
import styled from '@emotion/styled';
import { ServiceAction, ServiceConfig, ServicePrecheckResp } from '@typings/services';
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
  TextField,
  Divider,
  SelectChangeEvent,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';

import {
  Phone as PhoneIcon,
  Chat as ChatIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { useAdvertisementsValue } from '../hooks/state';

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
  service: { name: 'Default', subtitle: 'Default', message: '', range: '', urgency: '' },
  message: '',
  serviceAvailable: false,
  serviceMessage: '',
  messageError: '',
  factionAlert: false,
  factionRange: 'around',
  factionUrgency: 'emergency',
}

export const Advertisements: React.FC = () => {
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [selectedService, setService] = useState(defaults.service);
  const [serviceAvailable, setServiceAvailable] = useState(defaults.serviceAvailable);
  const [serviceMessage, setServiceMessage] = useState(defaults.serviceMessage);
  const [message, setMessage] = useState(defaults.message);
  const [messageError, setMessageError] = useState(defaults.messageError);
  const [factionAlert, setFactionAlert] = useState(defaults.factionAlert);
  const [factionRange, setFactionRange] = useState(defaults.factionRange);
  const [factionUrgency, setFactionUrgency] = useState(defaults.factionUrgency);
  const playerData = usePlayerData();
  const config = useRecoilValue(phoneState.resourceConfig);
  const advertisements = useAdvertisementsValue();

  console.log('advertisements are', advertisements);

  const openModal = (service: any, available: boolean, message: string, isFactionAlert = false) => {
    fetchNui('npwd:services:focus', { keepGameFocus: false });
    setService(service);
    setServiceAvailable(available);
    setServiceMessage(message);
    setFactionAlert(isFactionAlert);
    setOpen(true);
  }

  const closeModal = () => {
    setOpen(false);
    setService(defaults.service);
    setServiceAvailable(defaults.serviceAvailable);
    setServiceMessage(defaults.serviceMessage);
    setFactionAlert(defaults.factionAlert);
    setFactionRange(defaults.factionRange);
    setFactionUrgency(defaults.factionUrgency);
    setMessage(defaults.message);
    setMessageError(defaults.messageError);
  }

  const onChange = (event: any) => {
    setMessage(event.target.value);
    setMessageError(defaults.messageError);
  }

  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFactionRange((event.target as HTMLInputElement).value);
  }

  const handleUrgencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFactionUrgency((event.target as HTMLInputElement).value);
  }

  const submitModal = () => {
    if(message === "") {
      setMessageError("You must enter a message to send");
      return
    }

    let service = selectedService;
    service.message = message;

    let event = 'npwd:services:selectService'

    if(factionAlert) {
      event = 'npwd:services:sendAlert'
      service.range = factionRange;
      service.urgency = factionUrgency;
    }

    closeModal();

    history.push('/');

    fetchNui(event, { service });
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

  const handleSelectAction = (action: ServiceAction) => {
    if(action.message) {
      setMessage(action.message);
    }

    if(action.range) {
      setFactionRange(action.range);
    }

    if(action.urgency) {
      setFactionUrgency(action.urgency);
    }

    openModal(action, true, '', true);
  }

  const factionActions = [];

  config.services.factionActions.forEach((action: ServiceAction) => {
    if(action.groups.some(g => playerData.groups.includes(g))) {
      factionActions.push((
        <ListItem
          secondaryAction={
            <IconButton
              onClick={() => handleSelectAction(action) }
            >
              <SendIcon />
            </IconButton>
          }
        >
          <ListItemText
            primaryTypographyProps={{
              color: '#fff',
              fontWeight: 'bold',
            }}
            primary={`${action.icon} ${action.name}`}
            secondary={action.subtitle}
          />
        </ListItem>
      ));
    }
  });

  return (
      <AdvertisementsThemeProvider>
        <Container square elevation={0}>
          <Content>
            <List>
              {factionActions}
              {factionActions.length > 0 && <Divider></Divider>}
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
                value={message}
              />
              }

              { factionAlert &&
              <FormControl>
                <FormLabel id="urgency-label">Urgency</FormLabel>
                <RadioGroup
                  aria-labelledby="urgency-label"
                  defaultValue="around"
                  name="radio-buttons-group"
                  onChange={handleUrgencyChange}
                  value={factionUrgency}
                >
                  <FormControlLabel value="notice" control={<Radio />} label="Notice (non urgent)" />
                  <FormControlLabel value="emergency" control={<Radio />} label="Emergency (urgent)" />
                </RadioGroup>
              </FormControl>
              }

              { factionAlert &&
              <FormControl>
                <FormLabel id="range-label">Range</FormLabel>
                <RadioGroup
                  aria-labelledby="range-label"
                  defaultValue="around"
                  name="radio-buttons-group"
                  onChange={handleRangeChange}
                  value={factionRange}
                >
                  <FormControlLabel value="around" control={<Radio />} label="Around Me" />
                  <FormControlLabel value="anywhere" control={<Radio />} label="Anywhere" />
                </RadioGroup>
              </FormControl>
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
                  onClick={() => submitModal() }
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
      </AdvertisementsThemeProvider>
  );
};
