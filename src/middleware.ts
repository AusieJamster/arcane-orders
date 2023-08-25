import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";

const staffOnlyPaths = ["/products/create"];
export const staffOrganisationIds = [process.env.ORGANISATION_ID_RAREHUNTERS];

export default authMiddleware({
  afterAuth(auth, req, _evt) {
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    if (
      staffOnlyPaths.some((path) => req.url.includes(path)) &&
      (!auth.organization?.id ||
        !staffOrganisationIds.includes(auth.organization.id))
    ) {
      return redirectToSignIn();
    }
  },
  publicRoutes: [
    "/",
    "/products",
    "/products/:id",
    "/api/checkout/session",
    "/api/checkout/:id",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/api(.*)"],
};
