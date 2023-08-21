import { NextApiHandler } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { productSchema } from "@src/types/product.types";
import { createProduct } from "@src/server/product";
import { GenericError } from "@src/utils/errors";

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
    const { stripeProduct, prismaCard } = await createProduct(
      userId,
      productValues
    );

    res.status(200).json({ stripeProduct, prismaCard });
  } catch (error) {
    if (error instanceof GenericError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).end();
    }
  }
};

export default createHandler;
