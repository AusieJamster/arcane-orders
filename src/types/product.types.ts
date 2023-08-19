import Stripe from "stripe";

export interface ICart {
  name?: string;
  tableNumber?: string;
  clerkId?: string;
  products: IProductWithQuantity[];
}

export interface IProductWithQuantity extends IProduct {
  quantity: number;
}

export interface IProduct extends Omit<Stripe.Product, "metadata"> {
  metadata: {
    inventory: number;
    cardNum: string;
  };
}

export interface IProductCreateRequestBody
  extends ICardProductBase,
    Partial<ICardMonsterProductBase> {
  active: boolean;
  priceInDollars: number;
  unit_label: string;
  inventory: number;
}

interface IImageInfo {
  isPrimary: boolean;
  url: string;
  alt: string;
}

interface ICardProductBase {
  productId: string;
  priceId: string;
  createdBy: string;

  title: string;
  set: string;
  cardNum: string;
  rarity: TCardRarity;
  imgs: IImageInfo[];
  description: string;
  attribute: TCardAttribute; // !== SPELL || TRAP === MONSTER
}

interface ICardMonsterProductBase {
  level: number;
  attackValue: number;
  defenseValue: number;
  monsterType: TMonsterType;
  subclass: TCardType;
  hasEffect: boolean;

  linkRating: number;
  linkArrows: TCardLinkArrows[];
}

export interface ICardMonsterProduct
  extends ICardMonsterProductBase,
    ICardProductBase {}

enum TCardLinkArrows {
  "Bottom-Right",
  "Bottom",
  "Bottom-Left",
}
enum TMonsterType {
  "Link",
  "Xyz",
}
enum TCardType {
  "Cyberse",
  "Pyro",
  "Warrior",

  "Normal",
  "Continuous",
  "Quick Play Spell",
}
enum TCardAttribute {
  "FIRE",
  "SPELL",
  "TRAP",
}
enum TCardRarity {
  "Ghost Rare",
  "Super Rare",
  "Ultra Rare",
  "Rare",
  "Common",
}
