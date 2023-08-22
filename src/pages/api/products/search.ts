import { NextApiHandler } from "next";
import { searchProduct } from "@src/server/product";
import { GenericError } from "@src/utils/errors";

const searchHandler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") res.status(405).end();

  const { query } = req.query;

  if (typeof query !== "string")
    return res.status(400).json({ message: "Invalid search query" });

  try {
    const results = await searchProduct(query);

    res.status(200).json(results);
  } catch (error) {
    if (error instanceof GenericError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).end();
    }
  }
};

export default searchHandler;
