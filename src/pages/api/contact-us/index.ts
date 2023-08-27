import { clerkClient } from '@clerk/nextjs/server';
import { contactUsFormSchema } from '@src/pages/contact-us';
import { GenericError } from '@src/utils/errors';
import type { NextApiHandler } from 'next';

const contactUsRoute: NextApiHandler<boolean> = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const {
      name,
      email: emailAddress,
      message
    } = contactUsFormSchema.parse(req.body);

    if (!process.env.RAREHUNTERS_STAFF)
      throw new GenericError(500, 'RAREHUNTERS_STAFF is not set');

    const userId = process.env.RAREHUNTERS_STAFF.split(',').shift();

    if (!userId)
      throw new GenericError(
        500,
        'Unable to get first element from RAREHUNTERS_STAFF'
      );

    const user = await clerkClient.users.getUser(userId);
    const emailAddressId = user.primaryEmailAddressId;

    if (!emailAddressId)
      throw new GenericError(
        500,
        'First element of RAREHUNTERS_STAFF does not have a primary email address'
      );

    await clerkClient.emails.createEmail({
      fromEmailName: 'contact-form',
      subject: 'New Contact Us Form Submission',
      body: `name: ${name} || email: ${emailAddress} || message: ${message}`,
      emailAddressId
    });

    res.status(200).end();
  } catch (error) {
    if (error instanceof GenericError) {
      res.status(error.statusCode).end(error.message);
    } else {
      res.status(500).end();
    }
    throw error;
  }
};

export default contactUsRoute;
