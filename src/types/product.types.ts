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
  alt: z.string().optional(),
});

export const cardProductBaseSchema = z.object({
  title: z.string().min(1),
  set: z.nativeEnum(ECardSet),
  cardNum: z.string().min(1),
  rarity: z.nativeEnum(ECardRarity),
  imgs: imageInfoSchema.array(),
  description: z.string(),
  attribute: z.nativeEnum(ECardAttribute),
  subclass: z.nativeEnum(ECardType),
});

export const cardMonsterProductBaseSchema = z.object({
  level: z.number().positive(),
  attackValue: z.number(),
  defenseValue: z.number(),
  monsterType: z.nativeEnum(EMonsterType),
  hasEffect: z.boolean(),

  linkRating: z.number().positive().optional(),
  linkArrows: z.nativeEnum(ECardLinkArrows).array().optional(),
});

export interface IStripeProduct extends Omit<Stripe.Product, "metadata"> {
  metadata: {
    inventory: number;
    cardNum: string;
  };
}

export const productFormSchema = z.object({
  active: z.boolean(),
  priceInDollars: z.number().positive(),
  unit_label: z.string().min(1),
  inventory: z.number().positive(),
});

const productSchema = productFormSchema.merge(
  z.object({
    productId: z.string(),
    priceId: z.string(),
  })
);

export const productCreateCardFormSchema =
  cardProductBaseSchema.merge(productFormSchema);

export const productCreateMonsterFormSchema = cardProductBaseSchema
  .merge(cardMonsterProductBaseSchema)
  .merge(productFormSchema);

export const productCreateRequestBodySchema = cardProductBaseSchema
  .merge(cardMonsterProductBaseSchema.deepPartial())
  .merge(productFormSchema)
  .merge(
    z.object({
      isMonster: z.boolean(),
    })
  );
