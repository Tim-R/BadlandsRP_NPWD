import { common, grey } from '@mui/material/colors';
import { ThemeOptions } from '@mui/material';

export const APP_PRIMARY_COLOR = grey[500];
export const LIGHT_APP_TEXT_COLOR = common.white;
export const DARK_APP_TEXT_COLOR = common.black;

const theme: ThemeOptions = {
  palette: {
    primary: {
      main: APP_PRIMARY_COLOR,
      dark: '#cccccc',
      light: '#e5e5e5',
      contrastText: LIGHT_APP_TEXT_COLOR,
    },
    secondary: {
      main: '#d32f2f',
      light: '#eb4242',
      dark: '#941212',
      contrastText: LIGHT_APP_TEXT_COLOR,
    },
    success: {
      main: '#2196f3',
      contrastText: LIGHT_APP_TEXT_COLOR,
    },
  },
};

export default theme;
