import { auth } from "@clerk/nextjs/server";
import { staffOrganisationIds } from "@src/middleware";
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";

const f = createUploadthing();

export const ourFileRouter = {
  products: f({
    image: { maxFileSize: "4MB", maxFileCount: 8 },
  })
    .middleware(async ({ req, res }) => {
      const user = await auth();

      if (
        !user.organization?.id ||
        !staffOrganisationIds.includes(user.organization.id)
      )
        throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
