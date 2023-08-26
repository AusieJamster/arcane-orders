import {
  Container,
  Typography,
  Box,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import ProductTile from '@src/components/products/ProductTile/ProductTile';
import store from '@src/redux/store';
import { getAllActiveProducts } from '@src/server/product';
import { ICart, TProduct } from '@src/types/product.types';
import { GetStaticProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from 'src/redux/cart.slice';
import { ToastContainer, toast } from 'react-toastify';

const FEATURED_CARDS_COUNT = 3 as const;

interface HomePageProps {
  products: TProduct[];
}

const HomePage: NextPage<HomePageProps> = ({ products }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const dispatch = useDispatch();
  const [cart, setCart] = useState<ICart>(store.getState().cart);

  const handleAddToCart = (product: TProduct) => {
    toast(`Added to the cart`, { theme: 'dark' });
    dispatch(addToCart({ product }));
  };

  useEffect(() => {
    setCart(store.getState().cart);
    const unsubscribe = store.subscribe(() => setCart(store.getState().cart));
    return unsubscribe;
  }, []);

  const checkStockInCart = (product: TProduct) => {
    const productInCart = cart.products.find(
      (cartItem) =>
        cartItem.product.productIdentifier === product.productIdentifier
    );
    if (!productInCart) return 0;

    return productInCart.quantity;
  };

  return (
    <Container component="main">
      {/* Hero Section */}
      <Box marginY={'30vh'} textAlign="center">
        <Typography variant="h1" fontSize={isMobile ? 70 : 90} marginY={4}>
          RareHunters
        </Typography>
        <Typography variant="h4" component="p">
          We Complete Your Collection.
        </Typography>
      </Box>

      {/* Featured Cards Section */}
      <Box sx={{ my: 4 }}>
        <Stack
          gap={5}
          direction={isMobile ? 'column' : 'row'}
          justifyContent="space-around"
          alignItems="center"
        >
          {products.map((product) => (
            <ProductTile
              product={product}
              handleAddToCart={handleAddToCart}
              stockInCart={checkStockInCart(product)}
            />
          ))}
        </Stack>
      </Box>

      {/* About Us Section */}
      <Stack gap={10} marginY={10}>
        <Box>
          <Typography variant="h3" gutterBottom>
            About Us
          </Typography>
          <Typography>
            Founded in 2018, RareHunters is more than just an online marketplace
            for trading cards; it's a community for collectors. What began as a
            hobby for our founder, Jacob Floyd, quickly transformed into a
            mission to help complete collections worldwide.
          </Typography>
        </Box>
        <Box>
          <Typography variant="h3" gutterBottom>
            Why Choose Us
          </Typography>
          <Typography>
            In a marketplace filled with competition, what sets us apart is our
            dedication to authenticity and quality. Every card that passes
            through our doors is rigorously inspected to ensure it meets our
            high standards. We understand that each card isn't merely a piece of
            paper but a piece of history, a cherished memory, or the missing
            link in your collection.
          </Typography>
        </Box>
        <Box>
          <Typography variant="h3" gutterBottom>
            Partnerships and Collaborations
          </Typography>
          <Typography>
            We are proud partners with some of the leading manufacturers in the
            trading card industry, ensuring that our stock is always of the
            highest quality. Plus, our collaborations with gaming communities
            and forums keep us in tune with what collectors are looking for.
          </Typography>
        </Box>
        <Box>
          <Typography variant="h3" gutterBottom>
            Our Mission
          </Typography>
          <Typography>
            RareHunters lives by the motto, "We Complete Your Collection." Our
            primary mission is to make collecting trading cards easy, safe, and
            enjoyable. We strive to be the go-to source for both new collectors
            and seasoned aficionados alike.
          </Typography>
        </Box>
      </Stack>
      <ToastContainer position="bottom-right" />
    </Container>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const products: TProduct[] = await getAllActiveProducts(FEATURED_CARDS_COUNT);
  return { props: { products: products ?? [] } };
};

export default HomePage;
