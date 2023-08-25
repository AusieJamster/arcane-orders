import {
  PrismaCard,
  TProduct,
  ECardSet,
  ECardRarity,
  ECardAttribute,
  ECardType,
  EMonsterType,
  ECardLinkArrows,
  productSchema,
  TPreProduct
} from '@src/types/product.types';
import Stripe from 'stripe';
import prisma from '../utils/prisma';
import { getStripe } from '../utils/stripe';
import { createPrismaProduct, updatePrismaProduct } from './prisma';
import {
  createStripeProduct,
  getPricingFromIds,
  updateStripeProduct
} from './stripe';

const stripe = getStripe();

const mapToProduct = (card: PrismaCard, pricing: Stripe.Price): TProduct => {
  if (pricing.active === false) throw new Error('Stripe product is not active');

  if (!pricing || !pricing.unit_amount)
    throw new Error('No stripe product found for product');

  if (!pricing?.unit_amount) throw new Error('unit_amount is not defined');

  return {
    ...card,
    imgs: card.imgs.map((img) => ({
      ...img,
      alt: img.alt ?? null,
      isPrimary: img.isPrimary
    })),
    active: card.active,
    unit_label: card.unit_label,
    inventory: card.inventory,
    priceInDollars: pricing.unit_amount / 100,

    set: card.set as ECardSet,
    rarity: card.rarity as ECardRarity,
    attribute: card.attribute as ECardAttribute,
    subclass: card.subclass as ECardType,

    level: card.level,
    attackValue: card.attackValue,
    defenseValue: card.defenseValue,
    monsterType: card.monsterType as EMonsterType,
    hasEffect: card.hasEffect,
    linkRating: card.linkRating,
    linkArrows:
      (card.linkArrows?.split(',') as ECardLinkArrows[])?.filter(
        (arrow) => arrow
      ) || null
  };
};

export const getProductsWithPricingByPriceId = async (
  ids: string[]
): Promise<TProduct[]> => {
  const prismaCards = await prisma.cardProduct.findMany({
    where: { priceId: { in: ids }, active: true },
    include: { imgs: true }
  });
  if (prismaCards.length !== ids.length) {
    console.error('Failed to retrieve all products');
  }

  const pricingPromises = await Promise.allSettled(
    prismaCards.map((card) => stripe.prices.retrieve(card.priceId))
  );

  const pricingFulfilledList = pricingPromises.filter((promise) => {
    if (promise.status === 'rejected') console.error(promise.reason);
    return promise.status !== 'rejected';
  }) as PromiseFulfilledResult<Stripe.Price>[];

  const fullValidatedCardDetails: (TProduct | null)[] =
    pricingFulfilledList.map((price, index) => {
      const _card = prismaCards.find((card) => card.priceId === price.value.id);
      if (!_card) {
        console.error("can't find card linked to pricing");
        return null;
      }

      const parsedProduct = productSchema.safeParse(
        mapToProduct(_card, price.value)
      );
      if (parsedProduct.success) return parsedProduct.data;
      else {
        console.error({
          error: parsedProduct.error,
          cardId: _card.productIdentifier
        });
        return null;
      }
    });

  return fullValidatedCardDetails.filter((card) => !!card) as TProduct[];
};

export const getProductWithPricingByProductIdentifier = async (
  id: string
): Promise<TProduct | null> => {
  const prismaCard = await prisma.cardProduct.findUnique({
    where: { productIdentifier: id, active: true },
    include: { imgs: true }
  });
  if (!prismaCard) return null;

  if (!prismaCard.priceId) throw new Error('No price id found for product');

  const stripePricing = await stripe.prices.retrieve(prismaCard.priceId);

  return productSchema.parse(mapToProduct(prismaCard, stripePricing));
};

export const getAllActiveProducts = async (take: number, skip?: number) => {
  const prismaCard = await prisma.cardProduct.findMany({
    skip,
    take,
    include: { imgs: true },
    where: { active: true },
    orderBy: { createdAt: 'desc' }
  });

  if (prismaCard.length < 1) return [];

  const pricingList = await getPricingFromIds(
    prismaCard.map((card) => card.priceId)
  );

  return prismaCard.map((card, index) =>
    productSchema.parse(mapToProduct(card, pricingList[index]))
  );
};

export const createProduct = async (
  userId: string,
  productValues: TPreProduct
) => {
  const stripeProduct = await createStripeProduct(productValues);

  const prismaCard = await createPrismaProduct(
    userId,
    stripeProduct,
    productValues
  );
  return { stripeProduct, prismaCard };
};

export const searchProduct = async (
  searchTerm: string,
  take?: number,
  skip?: number
) => {
  const prismaCards = await prisma.cardProduct.findMany({
    take,
    skip,
    where: {
      active: true,
      OR: [{ title: { contains: searchTerm } }]
    },
    include: { imgs: true }
  });

  if (prismaCards.length < 1) return [];

  const priceList = await getPricingFromIds(
    prismaCards.map((card) => card.priceId)
  );

  return prismaCards.map((card, index) =>
    productSchema.parse(mapToProduct(card, priceList[index]))
  );
};

export const updateProduct = async (
  userId: string,
  productValues: TProduct
) => {
  const stripeProduct = await updateStripeProduct(productValues);
  const prismaCard = await updatePrismaProduct(
    userId,
    stripeProduct,
    productValues
  );

  return { stripeProduct, prismaCard };
};
