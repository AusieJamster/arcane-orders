import { getAuth } from '@clerk/nextjs/server';
import { staffIds } from '@src/middleware';
import { createUploadthing, type FileRouter } from 'uploadthing/next-legacy';

const f = createUploadthing();

export const ourFileRouter = {
  products: f({
    image: { maxFileSize: '4MB', maxFileCount: 8 }
  })
    .middleware(async ({ req, res }) => {
      const user = await getAuth(req);

      if (!user.userId || !staffIds.includes(user.userId))
        throw new Error('Unauthorized');

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
