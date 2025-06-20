import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Optional: Add custom middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Only allow access if user has a valid token
        return !!token
      },
    },
  }
)

// Protect all routes under /dashboard and /campaigns
export const config = {
  matcher: ["/dashboard/:path*", "/campaigns/:path*"]
} 