import { Box, Container, Stack, Typography } from '@mui/material';

interface PolicyPageProps {}

const PolicyPage: React.FC<PolicyPageProps> = () => {
  return (
    <Container sx={{ marginY: 5 }}>
      <Stack gap={10} marginBottom={10}>
        <Typography variant="h1">Our Policy</Typography>
        <Box>
          <Typography variant="h4" gutterBottom>
            Return and Refund Policy
          </Typography>
          <Typography>
            If you have any issues with your order, please contact us via our
            "Contact Us" form. Please note that the customer is responsible for
            the cost of return postage. Returns are not accepted for pre-orders.
          </Typography>
        </Box>
        <Box>
          <Typography variant="h4" gutterBottom>
            Warranty and Product Guarantees
          </Typography>
          <Typography>
            All trading cards sold on our platform are brand-new and have never
            been used, unless otherwise stated on the product. We take
            authenticity and quality seriously to ensure you get the best value
            for your money.
          </Typography>
        </Box>
        <Box>
          <Typography variant="h4" gutterBottom>
            Cancellation Policy
          </Typography>
          <Typography>
            You can cancel any order without incurring a fee by reaching out to
            us through our "Contact Us" form, provided the cancellation is made
            before the order is shipped. Please note that cancellations are not
            processed on Sundays.
          </Typography>
        </Box>
        <Box>
          <Typography variant="h4" gutterBottom>
            Shipping Policy
          </Typography>
          <Typography>
            We offer shipping only within Australia. All orders are processed
            and shipped out every Sunday.
          </Typography>
        </Box>
        <Box>
          <Typography variant="h4" gutterBottom>
            Data Handling and Privacy
          </Typography>
          <Typography>
            We respect your privacy and are committed to safeguarding your
            information. We collect customer data solely for the purposes of
            communication, payment processing, and order fulfillment. Payments
            are processed through Stripe, and authentication is handled through
            Clerk. Your account information is securely stored in our SQL
            database.
          </Typography>
        </Box>
        <Box>
          <Typography variant="h4" gutterBottom>
            Payment Options
          </Typography>
          <Typography>
            We accept a variety of payment methods for your convenience:
          </Typography>
          <ul>
            <li>Credit and Debit Cards</li>
            <li>Apple Pay</li>
            <li>Google Pay</li>
            <li>Link</li>
            <li>Buy Now, Pay Later options through Afterpay and Zip</li>
          </ul>
          <Typography>
            All payments are securely processed through Stripe. No additional
            fees are applied to these payment options.
          </Typography>
        </Box>
        <Box>
          <Typography variant="h4" gutterBottom>
            Dispute Resolution
          </Typography>
          <Typography>
            If you have any disputes or complaints, please reach out to us
            through our "Contact Us" form. We aim to respond to all inquiries
            within 24-48 hours.
          </Typography>
        </Box>
        <Box>
          <Typography variant="h4" gutterBottom>
            Age Restrictions
          </Typography>
          <Typography>
            There are no age restrictions for using our website or purchasing
            our products.
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
};

export default PolicyPage;
