import { IconButton, styled } from '@mui/material';

const QuantityChangeButton = styled(IconButton)(({ theme }) => ({
  maxHeight: 20,
  borderRadius: 5,
  borderStyle: 'solid',
  borderWidth: 1,
  borderColor: theme.palette.grey[800],
  '&:hover': {
    color: theme.palette.primary.main
  }
}));

export { QuantityChangeButton };
