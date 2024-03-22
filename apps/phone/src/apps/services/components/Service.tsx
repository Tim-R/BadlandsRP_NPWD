import { ServiceConfig } from "@typings/services";
import { ListItem, ListItemText, IconButton } from "@mui/material";

import {
  Phone as PhoneIcon,
  Chat as ChatIcon
} from '@mui/icons-material';

const Service : React.FC<ListItem> = ({ service, handleSelectService }) => {
  return (
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
  )
}

export default Service;
