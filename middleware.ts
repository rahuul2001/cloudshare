import { auth, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

export default clerkMiddleware(async (auth, request) => {
  const path = request.nextUrl.pathname 

  if (
    path === '/' ||
    path.startsWith('/sign-in') ||
    path.startsWith('/sign-up') ||
    isSingleSlug(path)
  ) {
    return;
  }

  await auth.protect();
});

function isSingleSlug(path: string) {
  const segments = path.replace(/^\/+/, '').split('/');
  return segments[0].length === 20;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
