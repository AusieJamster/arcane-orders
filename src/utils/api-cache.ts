import { IProduct } from "~/types/product.types";
import path from "path";
import { promises as fs } from "fs";

const FILE_NAME = "products.db";

const cache = {
  get: async (id: string): Promise<IProduct | null | undefined> => {
    try {
      const data = await fs.readFile(
        path.join(process.cwd(), FILE_NAME),
        "utf-8"
      );
      const products: IProduct[] = JSON.parse(data);
      return products.find((product) => product.id === id);
    } catch (err) {
      console.error(
        `Cache Get Error: ${err instanceof Error ? err.message : err}`
      );
    }
  },
  set: async (products: IProduct[]) => {
    try {
      await fs.writeFile(
        path.join(process.cwd(), FILE_NAME),
        JSON.stringify(products)
      );
    } catch (err) {
      console.error(
        `Cache Set Error: ${err instanceof Error ? err.message : err}`
      );
    }
  },
};

export default cache;