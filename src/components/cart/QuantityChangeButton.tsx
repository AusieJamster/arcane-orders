import { IconButton, styled } from '@mui/material';

const QuantityChangeButton = styled(IconButton)<{ fullHeight?: boolean }>(
  ({ theme, fullHeight }) => ({
    maxHeight: fullHeight ? '100%' : 20,
    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.palette.grey[800],
    '&:hover': {
      color: theme.palette.primary.main
    }
  })
);

export { QuantityChangeButton };
