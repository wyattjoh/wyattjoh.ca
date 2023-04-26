export const base =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://wyattjoh.ca";
