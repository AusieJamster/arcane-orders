import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { NextApiHandler } from "next";
import Stripe from "stripe";
import prisma from "@src/utils/prisma";
import { getStripe } from "@src/utils/stripe";
import { getAuth } from "@clerk/nextjs/server";
import { productSchema } from "@src/types/product.types";

const stripe = getStripe();

const createHandler: NextApiHandler = async (req, res) => {
  if (req.method !== "PUT") res.status(405).end();

  const userId = getAuth(req).userId;
  if (!userId) {
    res.status(401).end();
    throw new Error("no userId");
  }

  const reqBody = productSchema.safeParse(req.body);

  if (reqBody.success === false) {
    res.status(400).json({ message: reqBody.error.message });
    return;
  }

  const productValues = reqBody.data;

  try {
    const existingProduct = await stripe.products.search({
      query: `metadata['cardNum']:'${productValues.cardNum}'`,
    });
    if (existingProduct.data.length > 0) {
      res.status(400).end("product with that cardNum already exists");
      return;
    }
    const product = await stripe.products.create({
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
        cardNum: productValues.cardNum,
        inventory: productValues.inventory,
      },
    });

    if (!product.default_price)
      throw new Error("Failed to created stripe product");

    const priceId =
      typeof product.default_price === "string"
        ? product.default_price
        : product.default_price.id;

    if (typeof priceId !== "string")
      throw new Error(
        "Successfully created stripe product but without price Id"
      );

    const prismaCard = await prisma.cardProduct.create({
      data: {
        productId: product.id,
        priceId:
          typeof product.default_price === "string"
            ? product.default_price
            : product.default_price!.id,
        createdBy: userId,

        title: productValues.title,
        cardNum: productValues.cardNum,
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

    res.status(200).json({ product, prisma: prismaCard });
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      res.status(500).json(error.code);
    } else if (
      error instanceof PrismaClientInitializationError ||
      error instanceof PrismaClientKnownRequestError ||
      error instanceof PrismaClientUnknownRequestError ||
      error instanceof PrismaClientValidationError ||
      error instanceof PrismaClientRustPanicError
    ) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).end();
    }
  }
};

export default createHandler;
