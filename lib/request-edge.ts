import "server-only";

import { cache } from "react";

const client =
  process.env.REDIS_FETCH_URL && process.env.REDIS_FETCH_TOKEN
    ? async (...args: Array<string | number>) => {
        const res = await fetch(process.env.REDIS_FETCH_URL!, {
          headers: {
            Authorization: `Bearer ${process.env.REDIS_FETCH_TOKEN}`,
            ContentType: "application/json",
          },
          body: JSON.stringify(args),
        });
        if (!res.ok) {
          throw new Error(
            `Redis fetch failed: ${res.status} ${res.statusText}`
          );
        }

        return res.json();
      }
    : null;

/**
 * Gets the key for a request.
 *
 * @param method the HTTP method
 * @param url the URL
 * @param body the request body
 * @returns the key for the request
 */
async function getKey(
  method: string,
  url: string,
  body: unknown
): Promise<string> {
  let parts: string[] = ["request-edge", "v1", method, url];

  return parts.join(":");
}

export const request = cache(
  async (
    input: RequestInfo | URL,
    init?: RequestInit | undefined
  ): Promise<Response> => {
    const revalidate = init?.next?.revalidate ?? false;

    // Get the url, method, and body from the request.
    const url =
      typeof input === "string"
        ? input
        : "href" in input
        ? input.href
        : input.url;
    const method =
      typeof input === "string"
        ? init?.method ?? "GET"
        : "method" in input
        ? input.method
        : "GET";
    const body =
      typeof input === "string"
        ? init?.body
        : "body" in input
        ? input.body
        : null;

    // Compute the key for Redis.
    const key = client ? await getKey(method, url, body) : null;

    // Try to fetch the response from Redis.
    if (client && key && revalidate) {
      const start = Date.now();
      const value = await client("GET", key);
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
    if (client && key && res.ok && revalidate) {
      const value = await res.clone().text();

      // Cache the response in Redis.
      await client("SET", key, value, "EX", revalidate);
    }

    return res;
  }
);
