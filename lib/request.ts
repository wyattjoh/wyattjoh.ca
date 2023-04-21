import { cache } from "react";
import Redis from "ioredis";

// Connect to Redis if it's available.
const client = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null;

export const request = cache(
  async (
    input: RequestInfo | URL,
    init?: RequestInit | undefined
  ): Promise<Response> => {
    const revalidate = init?.next?.revalidate ?? false;

    // Get the url from the input.
    const url =
      typeof input === "string"
        ? input
        : "href" in input
        ? input.href
        : input.url;
    const method =
      typeof input === "string"
        ? init?.method
        : "method" in input
        ? input.method
        : "GET";

    // Compute the key for Redis.
    const key = `request:${url}`;

    // Try to fetch the response from Redis.
    if (client && revalidate) {
      const start = Date.now();
      const value = await client.get(key);
      const took = Date.now() - start;

      console.debug(`${method} ${url} ${took}ms ${value ? "HIT" : "MISS"}`);

      if (value) {
        return new Response(value, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    }

    const start = Date.now();
    const res = await fetch(input, init);
    const took = Date.now() - start;

    console.debug(`${method} ${url} ${res.status} ${took}ms ORIGIN`);

    // Cache the response in Redis if it's successful.
    if (client && res.ok && revalidate) {
      const value = await res.clone().text();

      // Cache the response in Redis.
      await client.set(key, value, "EX", revalidate);
    }

    return res;
  }
);
