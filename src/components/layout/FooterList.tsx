import { Box, Button, Stack } from '@mui/material';
import type { PageLinks } from '@src/types/layout.types';
import { ArcaneLink } from '../ArcaneLink';
import React from 'react';

interface IFooterListProps {
  links: PageLinks[];
}

const FooterList: React.FC<IFooterListProps> = ({ links }) => {
  return (
    <Stack direction="row" justifyContent="space-around">
      {links.map((p, i) => (
        <Box key={`footerlist-${i}`}>
          <ArcaneLink href={p.link}>
            <Button sx={{ color: 'white' }}>{p.name.toUpperCase()}</Button>
          </ArcaneLink>
        </Box>
      ))}
    </Stack>
  );
};

export default FooterList;
