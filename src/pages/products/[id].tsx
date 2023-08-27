import React, { useEffect, useMemo, useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { getProductWithPricingByProductIdentifier } from '@src/server/product';
import type { TProduct } from '@src/types/product.types';
import { EMonsterType } from '@src/types/product.types';
import {
  Container,
  Stack,
  Button,
  Chip,
  Grid,
  Pagination,
  TextField,
  Typography
} from '@mui/material';
import ImageFade from '@src/components/ImageFade/ImageFade';
import { convertDollarValueToCurrency } from '@src/utils';
import store from '@src/redux/store';
import { useDispatch } from 'react-redux';
import { addToCart } from '@src/redux/cart.slice';
import { ToastContainer, toast } from 'react-toastify';
import type Stripe from 'stripe';
import axios from 'axios';
import { useRouter } from 'next/router';
import { QuantityChangeButton } from '@src/components/cart/QuantityChangeButton';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface ProductPageProps {
  product: TProduct;
}

const Product: NextPage<ProductPageProps> = ({ product }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState<number>(1);
  const [stockInCart, setStockInCart] = useState<number>(
    store
      .getState()
      .cart.products.find(
        (prod) => prod.product.productIdentifier === product.productIdentifier
      )?.quantity ?? 0
  );
  const [currImage, setCurrImage] = useState(
    product.imgs.find((img) => img.isPrimary) ?? product.imgs[0]
  );

  const handleImageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrImage(product.imgs[page - 1]);
  };

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setStockInCart(
        store
          .getState()
          .cart.products.find(
            (prod) =>
              prod.product.productIdentifier === product.productIdentifier
          )?.quantity ?? 0
      );
    });

    return unsubscribe;
  }, []);

  const displayText = useMemo(() => {
    if (stockInCart > 0) {
      if (stockInCart >= product.inventory) {
        return 'Remaining Stock In Cart';
      } else {
        return `${stockInCart} in Cart`;
      }
    } else {
      if (product.inventory < 1) {
        return 'Out of Stock';
      } else {
        return 'Add to Cart';
      }
    }
  }, [stockInCart, product.inventory]);

  const handleAddToCart = () => {
    toast(`Added ${product.title} to the cart`, { theme: 'dark' });
    dispatch(addToCart({ product, quantity }));
  };

  const handleBuyNow = () => {
    const price_item: Stripe.Checkout.SessionCreateParams.LineItem = {
      price: product.priceId,
      quantity
    };

    axios
      .post('/api/checkout/session', {
        cart: [price_item],
        cancelUrl: location.href
      })
      .then((res) => {
        router.push(res.data);
      })
      .catch(console.error);
  };

  const handleQuantityButtonClick = (up: boolean) => () => {
    setQuantity(
      Math.min(product.inventory, Math.max(1, quantity + (up ? 1 : -1)))
    );
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value);
    setQuantity(
      Number.isNaN(newQuantity)
        ? 1
        : Math.min(product.inventory, Math.max(1, newQuantity))
    );
  };

  return (
    <Container component="main">
      <Grid container marginY={12} rowGap={4}>
        <Grid
          item
          xs={12}
          md={4}
          gap={2}
          justifyContent="center"
          alignItems="center"
          display="flex"
        >
          <ImageFade
            primaryImage={currImage}
            title={product?.title}
            height={300}
            width={300}
          />
          {product.imgs.length > 1 && (
            <Pagination
              count={product.imgs.length}
              shape="rounded"
              onChange={handleImageChange}
            />
          )}
        </Grid>
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            <Typography variant="h1" gutterBottom>
              {product?.title}
            </Typography>
            <Typography color="GrayText">{product.set}</Typography>
            <Typography variant="body1">{product.description}</Typography>
            <Stack direction="row" gap={1} flexWrap="wrap">
              <Chip label={product.productIdentifier} />
              <Chip label={product.attribute} />
              {product.hasEffect && <Chip label="Monster Effect" />}
              <Chip label={`Level ${product.level}`} />
              {product.linkArrows &&
                product.linkArrows.map((arrow) => (
                  <Chip label={`Arrow: ${arrow}`} />
                ))}
              {product.linkRating && (
                <Chip label={`Link Rating: ${product.linkRating}`} />
              )}
              {product.monsterType !== EMonsterType.NORMAL && (
                <Chip label={product.monsterType} />
              )}
              <Chip label={product.rarity} />
              <Chip label={product.subclass} />
            </Stack>
            <Stack direction="row" alignItems="end" gap={3}>
              {quantity > 1 && (
                <Typography>{`${convertDollarValueToCurrency(
                  product.priceInDollars
                )} per ${product.unit_label} x ${quantity} =`}</Typography>
              )}
              <Typography
                component="p"
                variant="h2"
                color="secondary"
                marginY={-1}
              >
                {convertDollarValueToCurrency(
                  product.priceInDollars * quantity
                )}
              </Typography>
            </Stack>
            <Stack direction="row">
              <TextField
                onChange={handleQuantityChange}
                value={quantity}
                size="small"
                sx={{ maxWidth: '25%' }}
              />
              <QuantityChangeButton
                fullHeight
                onClick={handleQuantityButtonClick(false)}
              >
                <ArrowDropDownIcon />
              </QuantityChangeButton>
              <QuantityChangeButton
                fullHeight
                onClick={handleQuantityButtonClick(true)}
              >
                <ArrowDropUpIcon />
              </QuantityChangeButton>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleBuyNow}
                disabled={product.inventory < 1 || quantity > product.inventory}
              >
                Buy Now
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleAddToCart}
                disabled={
                  product.inventory < 1 ||
                  quantity + stockInCart > product.inventory
                }
              >
                {displayText}
              </Button>
            </Stack>
            <Typography variant="body2" color="GrayText">
              {`${product.inventory} in stock`}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
      <ToastContainer position="bottom-right" />
    </Container>
  );
};

export default Product;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id;

  if (id === undefined || Array.isArray(id)) {
    return { props: { error: 'Invalid id' } };
  }

  const product: TProduct | null =
    await getProductWithPricingByProductIdentifier(id);

  if (!product) return { notFound: true };

  return { props: { product } };
};
