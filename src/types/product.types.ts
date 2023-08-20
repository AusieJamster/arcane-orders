import { CardProduct, ImageInfo } from "@prisma/client";
import Stripe from "stripe";
import { z } from "zod";

export enum ECardLinkArrows {
  BOTTOM_Right = "Bottom-Right",
  BOTTOM = "Bottom",
  BOTTOM_Left = "Bottom-Left",
}

export enum EMonsterType {
  NORMAL = "Normal",
  LINK = "Link",
  XYZ = "Xyz",
}

export enum ECardSet {
  SOULBURNING_VOLCANO = "Legendary Duelists: Soulburning Volcano",
}

export enum ECardType {
  CYBERSE = "Cyberse",
  PYRO = "Pyro",
  WARRIOR = "Warrior",

  NORMAL = "Normal",
  CONTINUOUS = "Continuous",
  QUICK_PLAY_SPELL = "Quick Play Spell",
}

export enum ECardAttribute {
  FIRE = "FIRE",
  SPELL = "SPELL",
  TRAP = "TRAP",
}

export enum ECardRarity {
  GHOST_RARE = "Ghost Rare",
  SUPER_RARE = "Super Rare",
  ULTRA_RARE = "Ultra Rare",
  RARE = "Rare",
  COMMON = "Common",
}
export interface ICart {
  name?: string;
  tableNumber?: string;
  clerkId?: string;
  products: IProductWithQuantity[];
}

export interface IProductWithQuantity extends IStripeProduct {
  quantity: number;
}

export interface TPostUploadImageFile {
  key: string;
  url: string;
}

const imageInfoSchema = z.object({
  isPrimary: z.boolean(),
  url: z.string().url(),
  alt: z.string().optional().nullable(),
});

export const cardProductBaseSchema = z.object({
  set: z.nativeEnum(ECardSet),
  rarity: z.nativeEnum(ECardRarity),
  imgs: imageInfoSchema.array(),
  description: z.string(),
  attribute: z.nativeEnum(ECardAttribute),
  subclass: z.nativeEnum(ECardType),
});

export const cardMonsterProductBaseSchema = z.object({
  level: z.number().positive().nullable(),
  attackValue: z.number().nullable(),
  defenseValue: z.number().nullable(),
  monsterType: z.nativeEnum(EMonsterType).nullable(),
  hasEffect: z.boolean().nullable(),

  linkRating: z.number().positive().optional().nullable(),
  linkArrows: z.nativeEnum(ECardLinkArrows).array().optional().nullable(),
});

export interface IStripeProduct extends Omit<Stripe.Product, "metadata"> {
  metadata: {
    productIdentifier: string;
  };
}

export interface IStripeProductWithPricing
  extends Omit<Stripe.Product, "metadata"> {
  metadata: {
    productIdentifier: string;
  };
}

export interface PrismaCard extends CardProduct {
  imgs: ImageInfo[];
}

export const productFormSchema = z.object({
  active: z.boolean(),
  priceInDollars: z.number().positive(),
  unit_label: z.string().min(1),
  inventory: z.number().positive(),
  title: z.string().min(1),
  productIdentifier: z.string().min(1),
});

export const productCreateCardFormSchema =
  cardProductBaseSchema.merge(productFormSchema);

export const productCreateMonsterFormSchema = cardProductBaseSchema
  .merge(cardMonsterProductBaseSchema)
  .merge(productFormSchema);

export const productSchema = cardProductBaseSchema
  .merge(cardMonsterProductBaseSchema.deepPartial())
  .merge(productFormSchema);

export type TProduct = z.infer<typeof productSchema>;
