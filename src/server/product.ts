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
  IStripeProduct,
} from "@src/types/product.types";
import Stripe from "stripe";
import { GenericError } from "../utils/errors";
import prisma from "../utils/prisma";
import { getStripe } from "../utils/stripe";
import { Prisma } from "@prisma/client";

const stripe = getStripe();

const mapToProduct = (card: PrismaCard, pricing: Stripe.Price): TProduct => {
  if (pricing.active === false) throw new Error("Stripe product is not active");

  if (!pricing || !pricing.unit_amount)
    throw new Error("No stripe product found for product");

  if (!pricing?.unit_amount) throw new Error("unit_amount is not defined");

  return {
    ...card,
    imgs: card.imgs.map((img) => ({
      ...img,
      alt: img.alt ?? null,
      isPrimary: img.isPrimary,
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
      (card.linkArrows?.split(",") as ECardLinkArrows[])?.filter(
        (arrow) => arrow
      ) || null,
  };
};

export const getProductsWithPricingByPriceId = async (
  ids: string[]
): Promise<TProduct[]> => {
  const prismaCards = await prisma.cardProduct.findMany({
    where: { priceId: { in: ids }, active: true },
    include: { imgs: true },
  });
  if (prismaCards.length !== ids.length) {
    console.error("Failed to retrieve all products");
  }

  const pricingPromises = await Promise.allSettled(
    prismaCards.map((card) => stripe.prices.retrieve(card.priceId))
  );

  const pricingFulfilledList = pricingPromises.filter((promise) => {
    if (promise.status === "rejected") console.error(promise.reason);
    return promise.status !== "rejected";
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
          cardId: _card.productIdentifier,
        });
        return null;
      }
    });

  return fullValidatedCardDetails.filter((card) => !!card) as TProduct[];
};

export const getProductWithPricing = async (
  id: string
): Promise<TProduct | null> => {
  const prismaCard = await prisma.cardProduct.findUnique({
    where: { productIdentifier: id, active: true },
    include: { imgs: true },
  });
  if (!prismaCard) return null;

  if (!prismaCard.priceId) throw new Error("No price id found for product");

  const stripePricing = await stripe.prices.retrieve(prismaCard.priceId);

  return productSchema.parse(mapToProduct(prismaCard, stripePricing));
};

const getPricingFromIds = async (priceIds: string[]) => {
  const pricingList = await Promise.all(
    priceIds.map((priceId) => stripe.prices.retrieve(priceId))
  );

  if (pricingList.length !== priceIds.length)
    throw new Error("Failed to retrieve pricing list");

  return pricingList;
};

export const getAllActiveProducts = async (take: number, skip?: number) => {
  const prismaCard = await prisma.cardProduct.findMany({
    skip,
    take,
    include: { imgs: true },
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  if (prismaCard.length < 1) return [];

  const pricingList = await getPricingFromIds(
    prismaCard.map((card) => card.priceId)
  );

  return prismaCard.map((card, index) =>
    productSchema.parse(mapToProduct(card, pricingList[index]))
  );
};

const createStripeProduct = async (productValues: TProduct) => {
  const existingProduct = await stripe.products.search({
    query: `metadata['productIdentifier']:'${productValues.productIdentifier}'`,
  });

  if (existingProduct.data.length > 0) {
    throw new GenericError(
      400,
      "Product with that productIdentifier already exists"
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
        currency: "AUD",
        unit_amount: productValues.priceInDollars * 100,
      },
      unit_label: productValues.unit_label.toLowerCase(),
      metadata: {
        productIdentifier: productValues.productIdentifier,
      },
    });

    if (!stripeProduct.default_price)
      throw new Error("Failed to created stripe product");

    const priceId =
      typeof stripeProduct.default_price === "string"
        ? stripeProduct.default_price
        : stripeProduct.default_price.id;

    if (typeof priceId !== "string")
      throw new Error(
        "Successfully created stripe product but without price Id"
      );

    return stripeProduct as Stripe.Response<IStripeProduct>;
  } catch (error) {
    if (error instanceof stripe.errors.StripeError)
      throw new GenericError(500, error.message);
    else if (error instanceof GenericError) throw error;
    else throw new GenericError(500, "Failed to create stripe product");
  }
};

const createPrismaProduct = async (
  userId: string,
  stripeProduct: IStripeProduct,
  productValues: TProduct
) => {
  try {
    const prismaCard = await prisma.cardProduct.create({
      data: {
        active: productValues.active,
        inventory: productValues.inventory,
        unit_label: productValues.unit_label.toLowerCase(),
        productId: stripeProduct.id,
        priceId:
          typeof stripeProduct.default_price === "string"
            ? stripeProduct.default_price
            : stripeProduct.default_price!.id,
        createdBy: userId,
        title: productValues.title,
        productIdentifier: productValues.productIdentifier,
        set: productValues.set,
        rarity: productValues.rarity.toString(),
        imgs: {
          createMany: {
            data: productValues.imgs.map((img) => ({
              isPrimary: img.isPrimary,
              url: img.url,
              alt: img.alt ?? null,
            })),
          },
        },
        description: productValues.description,
        attribute: productValues.attribute.toString(),
        level: productValues.level ?? null,
        attackValue: productValues.attackValue ?? null,
        defenseValue: productValues.defenseValue ?? null,
        monsterType: productValues.monsterType?.toString() ?? null,
        subclass: productValues.subclass?.toString() ?? null,
        hasEffect: productValues.hasEffect ?? null,
        linkRating: productValues.linkRating ?? null,
        linkArrows: productValues.linkArrows?.join(",") ?? null,
      },
      include: { imgs: true },
    });
    return prismaCard;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientUnknownRequestError ||
      error instanceof Prisma.PrismaClientValidationError ||
      error instanceof Prisma.PrismaClientRustPanicError
    ) {
      throw new GenericError(500, error.message);
    } else {
      throw new GenericError(500, "Failed to create product");
    }
  }
};

export const createProduct = async (
  userId: string,
  productValues: TProduct
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
      OR: [{ title: { contains: searchTerm } }],
    },
    include: { imgs: true },
  });

  if (prismaCards.length < 1) return [];

  const priceList = await getPricingFromIds(
    prismaCards.map((card) => card.priceId)
  );

  return prismaCards.map((card, index) =>
    productSchema.parse(mapToProduct(card, priceList[index]))
  );
};

export const getAllCardTitles = async () => {
  const prismaCards = await prisma.cardProduct.findMany({
    select: { title: true },
  });
  return prismaCards.map((card) => card.title);
};
