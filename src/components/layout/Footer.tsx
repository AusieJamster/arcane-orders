import {
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import React from 'react';
import type { PageLinks } from '@src/types/layout.types';
import { ArcaneLink } from '../ArcaneLink';
import FooterList from './FooterList';

interface FooterProps {
  brands: PageLinks[];
}

const Footer: React.FC<FooterProps> = ({ brands }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper sx={{ paddingY: 5 }}>
      <Container>
        <FooterList links={brands} />
        <Divider sx={{ marginY: 5 }} />

        <Typography textAlign="center" variant="body2" gutterBottom>
          <ArcaneLink
            href="http://www.yugioh-card.com/en/"
            sx={{ color: 'white' }}
          >
            Yu-Gi-Oh!{' '}
          </ArcaneLink>
          <Typography component="span" variant="body2">
            and its respective properties are © 2023 Studio Dice/SHUEISHA, TV
            TOKYO, KONAMI.
          </Typography>
        </Typography>
        <Stack
          direction={isMobile ? 'column' : 'row'}
          justifyContent="center"
          alignItems="center"
        >
          {[
            'Privacy Policy',
            'Terms of Service',
            'Website Data Collection',
            'We Do Not Sell or Share Personal Information'
          ].map((text, idx) => (
            <React.Fragment key={`footer-${idx}`}>
              {idx !== 0 && !isMobile && (
                <Typography component="span" paddingX={2}>
                  •
                </Typography>
              )}
              <ArcaneLink href="/policy" sx={{ color: 'white' }}>
                <Typography textAlign="center" variant="body2">
                  {text}
                </Typography>
              </ArcaneLink>
            </React.Fragment>
          ))}
        </Stack>
      </Container>
    </Paper>
  );
};

export default Footer;
