// Configuration for tell-landingpage
// This is safe to commit - no secrets here
// Secrets are in environment variables (set in Vercel dashboard)

export const config = {
  // tell-platform API URL
  apiUrl: process.env.PLATFORM_API_URL || "http://localhost:3001",

  // Polar.sh configuration (public values - not secrets)
  polar: {
    // Product IDs from Polar dashboard
    starterProductId: "8b9ca437-d79a-412b-a6e6-db3f54c78329",
    proProductId: "12309e54-3194-4aad-826f-bb1dd64361cb",
    // Where to redirect after successful checkout
    successUrl: "https://tell.rs/thanks",
    // Use sandbox for testing, production for live
    server: (process.env.NODE_ENV === "production" ? "production" : "sandbox") as "sandbox" | "production",
  },
};
