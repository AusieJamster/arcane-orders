import {
  ECardAttribute,
  ECardLinkArrows,
  ECardRarity,
  ECardSet,
  ECardType,
  EMonsterType,
  TProduct,
  productSchema,
} from "@src/types/product.types";
import prisma from "./prisma";
import { getStripe } from "./stripe";

export const getProduct = async (
  id: string,
  withPricing: boolean
): Promise<TProduct | null> => {
  const prismaCard = await prisma.cardProduct.findUnique({
    where: { cardNum: id },
    include: {
      imgs: true,
    },
  });
  if (!prismaCard) return null;

  if (withPricing) {
    if (!prismaCard.priceId) throw new Error("No price id found for product");

    const stripe = getStripe();
    const stripeProduct = await stripe.products.retrieve(prismaCard.productId);
    const stripePricing = await stripe.prices.retrieve(prismaCard.priceId);

    if (stripePricing.active === false)
      throw new Error("Stripe product is not active");

    if (!stripePricing || !stripePricing.unit_amount)
      throw new Error("No stripe product found for product");

    const card: TProduct = {
      ...prismaCard,
      imgs: prismaCard.imgs.map((img) => ({
        ...img,
        alt: img.alt ?? null,
        isPrimary: img.isPrimary,
      })),
      active: stripeProduct.active,
      unit_label: stripeProduct.unit_label ?? "card",
      inventory: parseInt(stripeProduct.metadata.inventory),
      priceInDollars: stripePricing.unit_amount / 100,

      set: prismaCard.set as ECardSet,
      rarity: prismaCard.rarity as ECardRarity,
      attribute: prismaCard.attribute as ECardAttribute,
      subclass: prismaCard.subclass as ECardType,

      level: prismaCard.level,
      attackValue: prismaCard.attackValue,
      defenseValue: prismaCard.defenseValue,
      monsterType: prismaCard.monsterType as EMonsterType,
      hasEffect: prismaCard.hasEffect,
      linkRating: prismaCard.linkRating,
      linkArrows:
        (prismaCard.linkArrows?.split(",") as ECardLinkArrows[]) ?? null,
    };

    return productSchema.parse(card);
  }

  return productSchema.parse(prismaCard);
};
