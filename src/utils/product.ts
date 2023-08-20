import {
  ECardAttribute,
  ECardLinkArrows,
  ECardRarity,
  ECardSet,
  ECardType,
  EMonsterType,
  PrismaCard,
  TProduct,
  productSchema,
} from "@src/types/product.types";
import prisma from "./prisma";
import { getStripe } from "./stripe";
import Stripe from "stripe";

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
    linkArrows: (card.linkArrows?.split(",") as ECardLinkArrows[]) ?? null,
  };
};

export const getProduct = async (
  id: string,
  withPricing: boolean
): Promise<TProduct | null> => {
  const prismaCard = await prisma.cardProduct.findUnique({
    where: { productIdentifier: id, active: true },
    include: {
      imgs: true,
    },
  });
  if (!prismaCard) return null;

  if (withPricing) {
    if (!prismaCard.priceId) throw new Error("No price id found for product");

    const stripe = getStripe();
    const stripePricing = await stripe.prices.retrieve(prismaCard.priceId);

    return productSchema.parse(mapToProduct(prismaCard, stripePricing));
  }

  return productSchema.parse(prismaCard);
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

  const stripe = getStripe();

  const pricingList = await Promise.all(
    prismaCard.map((card) => stripe.prices.retrieve(card.priceId))
  );

  if (pricingList.length !== prismaCard.length)
    throw new Error("Failed to retrieve pricing list");

  return prismaCard.map((card, index) =>
    productSchema.parse(mapToProduct(card, pricingList[index]))
  );
};
