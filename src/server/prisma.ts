import { Prisma } from '@prisma/client';
import {
  IStripeProduct,
  TPreProduct,
  TProduct
} from '@src/types/product.types';
import { GenericError } from '@src/utils/errors';
import { prisma } from './db';

export const updatePrismaProduct = async (
  userId: string,
  stripeProduct: IStripeProduct,
  productValues: TProduct
) => {
  try {
    console.log(
      '\u001b[1;31m productValues.productIdentifier \u001b[0m',
      productValues.productIdentifier
    );
    return await prisma.cardProduct.update({
      where: { productId: productValues.productId },
      data: {
        active: productValues.active,
        inventory: productValues.inventory,
        unit_label: productValues.unit_label.toLowerCase(),
        // productId: stripeProduct.id,
        // priceId:
        //   typeof stripeProduct.default_price === 'string'
        //     ? stripeProduct.default_price
        //     : stripeProduct.default_price!.id,
        createdBy: userId,
        title: productValues.title,
        // productIdentifier: productValues.productIdentifier,
        set: productValues.set,
        rarity: productValues.rarity.toString(),
        imgs: {
          deleteMany: {
            cardProductCardNum: productValues.productIdentifier
          },
          createMany: {
            data: productValues.imgs.map((img) => ({
              key: img.key,
              isPrimary: img.isPrimary,
              url: img.url,
              alt: img.alt ?? null
            }))
          }
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
        linkArrows: productValues.linkArrows?.join(',') ?? null
      }
    });
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
      throw new GenericError(500, 'Failed to update product');
    }
  }
};

export const createPrismaProduct = async (
  userId: string,
  stripeProduct: IStripeProduct,
  productValues: TPreProduct
) => {
  try {
    const prismaCard = await prisma.cardProduct.create({
      data: {
        active: productValues.active,
        inventory: productValues.inventory,
        unit_label: productValues.unit_label.toLowerCase(),
        productId: stripeProduct.id,
        priceId:
          typeof stripeProduct.default_price === 'string'
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
              key: img.key,
              isPrimary: img.isPrimary,
              url: img.url,
              alt: img.alt ?? null
            }))
          }
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
        linkArrows: productValues.linkArrows?.join(',') ?? null
      },
      include: { imgs: true }
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
      throw new GenericError(500, 'Failed to create product');
    }
  }
};

export const getAllCardTitles = async () => {
  const prismaCards = await prisma.cardProduct.findMany({
    select: { title: true }
  });
  return prismaCards.map((card) => card.title);
};
