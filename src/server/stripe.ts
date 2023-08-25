import {
  IStripeProduct,
  TPreProduct,
  TProduct
} from '@src/types/product.types';
import { GenericError } from '@src/utils/errors';
import { getStripe } from '@src/utils/stripe';

const stripe = getStripe();

export const updateStripeProduct = async (
  productValues: TProduct
): Promise<IStripeProduct> => {
  try {
    const existingProduct = await stripe.products.retrieve(
      productValues.productId
    );

    if (!existingProduct) {
      throw new GenericError(
        404,
        'Product with that productIdentifier does not exist'
      );
    }

    const existingProductId = existingProduct.id;
    const existingPriceId = existingProduct.default_price;

    if (typeof existingPriceId !== 'string')
      throw new GenericError(500, 'Unexpected existing product price id type');

    const [stripeProduct, stripePrice] = await Promise.all([
      stripe.products.update(existingProductId, {
        name: productValues.title,
        active: productValues.active,
        description: productValues.description,
        images: productValues.imgs.map((img) => img.url),
        shippable: true,
        unit_label: productValues.unit_label.toLowerCase(),
        metadata: {
          productIdentifier: productValues.productIdentifier
        }
      }),
      stripe.prices.update(existingPriceId, {
        metadata: {
          unit_amount: productValues.priceInDollars * 100
        }
      })
    ]);

    return {
      ...stripeProduct,
      default_price: stripePrice
    } as unknown as IStripeProduct;
  } catch (error) {
    if (error instanceof stripe.errors.StripeError)
      throw new GenericError(500, error.message);
    else if (error instanceof GenericError) throw error;
    else throw new GenericError(500, 'Failed to update stripe product');
  }
};

export const createStripeProduct = async (
  productValues: TPreProduct
): Promise<IStripeProduct> => {
  const existingProduct = await stripe.products.search({
    query: `metadata['productIdentifier']:'${productValues.productIdentifier}'`
  });

  if (existingProduct.data.length > 0) {
    throw new GenericError(
      400,
      'Product with that productIdentifier already exists'
    );
  }

  try {
    const stripeProduct = await stripe.products.create({
      name: productValues.title,
      active: productValues.active,
      description: productValues.description,
      images: productValues.imgs.map((img) => img.url),
      shippable: true,
      default_price_data: {
        currency: 'AUD',
        unit_amount: productValues.priceInDollars * 100
      },
      unit_label: productValues.unit_label.toLowerCase(),
      metadata: {
        productIdentifier: productValues.productIdentifier
      }
    });

    return stripeProduct as unknown as IStripeProduct;
  } catch (error) {
    if (error instanceof stripe.errors.StripeError)
      throw new GenericError(500, error.message);
    else if (error instanceof GenericError) throw error;
    else throw new GenericError(500, 'Failed to create stripe product');
  }
};

export const getPricingFromIds = async (priceIds: string[]) => {
  const pricingList = await Promise.all(
    priceIds.map((priceId) => stripe.prices.retrieve(priceId))
  );

  if (pricingList.length !== priceIds.length)
    throw new Error('Failed to retrieve pricing list');

  return pricingList;
};
