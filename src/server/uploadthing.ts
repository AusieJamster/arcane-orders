import type { NextApiRequest, NextApiResponse } from "next";
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";

const f = createUploadthing();

export const ourFileRouter = {
  products: f({
    image: { maxFileSize: "4MB", maxFileCount: 8 },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("file url", file.url);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
