import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Container,
  TextField,
  Typography,
  Stack,
  Paper,
  Box
} from '@mui/material';
import axios from 'axios';
import type { NextPage } from 'next';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface ContactUsPageProps {}

export const contactUsFormSchema = z.object({
  name: z.string().min(2, 'Too Short!').max(50, 'Too Long!'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Too Short!').max(500, 'Too Long!')
});

const ContactUsPage: NextPage<ContactUsPageProps> = () => {
  const [success, setSuccess] = React.useState<'success' | 'error' | null>(
    null
  );

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitSuccessful }
  } = useForm({
    resolver: zodResolver(contactUsFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: ''
    }
  });

  const onSubmit = (formValues: z.infer<typeof contactUsFormSchema>) => {
    axios
      .post('/api/contact-us', formValues)
      .then(() => setSuccess('success'))
      .catch(() => setSuccess('error'));
  };

  return (
    <Container sx={{ marginY: 5 }}>
      <Stack gap={10} marginBottom={10}>
        <Typography variant="h1">Contact Us</Typography>
        <Box>
          <Typography variant="h4" gutterBottom>
            Get In Touch
          </Typography>
          <Typography>
            We're always excited to hear from our community, whether you're a
            long-time collector or new to the world of trading cards. If you
            have questions, concerns, or just want to share some feedback, don't
            hesitate to reach out.
          </Typography>
        </Box>
      </Stack>
      <Paper elevation={4} sx={{ padding: 10, marginY: 5 }}>
        {success === 'success' ? (
          <Typography
            component="p"
            variant="h4"
            textAlign="center"
            color={(theme) => theme.palette.success.main}
          >
            Thank you for reaching out! We will be in touch soon.
          </Typography>
        ) : success === 'error' ? (
          <Typography
            component="p"
            variant="h4"
            textAlign="center"
            color={(theme) => theme.palette.error.main}
          >
            Something went wrong. Please try again.
          </Typography>
        ) : success === null && isSubmitSuccessful ? (
          <Typography
            component="p"
            variant="h4"
            textAlign="center"
            color={(theme) => theme.palette.success.main}
          >
            Sending Email...
          </Typography>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={2} justifyContent="center">
              <TextField
                label="Name"
                variant="outlined"
                {...register('name')}
                error={!!errors.name?.message}
                helperText={errors.name?.message}
              />
              <TextField
                label="Email"
                variant="outlined"
                {...register('email')}
                error={!!errors.email?.message}
                helperText={errors.email?.message}
              />
              <TextField
                label="Message"
                variant="outlined"
                multiline
                minRows={3}
                {...register('message')}
                error={!!errors.message?.message}
                helperText={errors.message?.message}
              />
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </Stack>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default ContactUsPage;
