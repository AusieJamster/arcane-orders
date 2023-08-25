import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';

const staffOnlyPaths = ['/products/create'];
export const staffIds = process.env.RAREHUNTERS_STAFF?.split(',') ?? [];

export default authMiddleware({
  afterAuth(auth, req, _evt) {
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    if (
      staffOnlyPaths.some((path) => req.url.includes(path)) &&
      (!auth.userId || !staffIds.includes(auth.userId))
    ) {
      return redirectToSignIn();
    }
  },
  publicRoutes: [
    '/',
    '/products',
    '/products/:id',
    '/api/checkout/session',
    '/api/checkout/:id'
  ]
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/api(.*)']
};
