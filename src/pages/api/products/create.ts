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
import type { TProductCreateRequestBody } from "@src/types/product.types";

const stripe = getStripe();

const createHandler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") res.status(405).end();

  [
    "active",
    "priceInDollars",
    "unit_label",
    "inventory",
    "title",
    "set",
    "cardNum",
    "rarity",
    "imgs",
    "description",
    "attribute",
  ].forEach((key) => {
    if (!Object.keys(req.body).includes(key)) {
      const msg = `Missing key ${key} in request body`;
      res.status(400).send(msg);
      throw new Error(msg);
    }
  });

  const userId = getAuth(req).userId;
  if (!userId) {
    res.status(401).end();
    throw new Error("no userId");
  }

  const productValues: TProductCreateRequestBody = req.body;

  try {
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

    const priceId =
      typeof product.default_price === "string"
        ? product.default_price
        : product.default_price!.id;

    if (typeof priceId !== "string")
      throw new Error(
        `Successfully created stripe product but without price Id: `,
        {
          cause: product,
        }
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
            data: productValues.imgs,
          },
        },
        description: productValues.description,
        attribute: productValues.attribute.toString(),

        level: productValues.level,
        attackValue: productValues.attackValue,
        defenseValue: productValues.defenseValue,
        monsterType: productValues.monsterType?.toString(),
        subclass: productValues.subclass?.toString(),
        hasEffect: productValues.hasEffect,
        linkRating: productValues.linkRating,
        linkArrows: productValues.linkArrows?.join(","),
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
