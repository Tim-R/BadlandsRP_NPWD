import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  absolute: {
    position: 'absolute',
    right: theme.spacing(3),
    bottom: theme.spacing(8),
  },

  absoluteNav: {
    position: 'absolute',
    left: theme.spacing(0),
    bottom: theme.spacing(0),
  },
}));

export default useStyles;
