import "server-only";

import crypto from "node:crypto";
import { cache } from "react";
import Redis from "ioredis";

// Connect to Redis if it's available.
const client = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null;

/**
 * Calculates the MD5 hash of a stream.
 *
 * @param stream the stream to calculate the MD5 hash of
 * @returns the MD5 hash of the stream
 */
async function calculateMD5Hash(
  stream: ReadableStream<Uint8Array>
): Promise<string> {
  const hash = crypto.createHash("md5");
  const decoder = new TextDecoder();

  const reader = stream.getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      return hash.digest("hex");
    }

    hash.update(decoder.decode(value));
  }
}

/**
 * Gets the key for a request.
 *
 * @param req the request to get the key for
 * @returns the key for the request
 */
async function getKey(req: Request): Promise<string> {
  let parts: string[] = ["request", "v1", req.method, req.url];

  const body = req.clone().body;
  if (body) {
    const hash = await calculateMD5Hash(body);
    parts.push(hash);
  } else {
    parts.push("null");
  }

  return parts.join(":");
}

export const request = cache(
  async (
    input: RequestInfo | URL,
    init?: RequestInit | undefined
  ): Promise<Response> => {
    const revalidate = init?.next?.revalidate ?? false;

    // Create a new request.
    const req = new Request(input, init);

    // Get the url from the input.
    const url = req.url;
    const method = req.method;

    // Compute the key for Redis.
    const key = client ? await getKey(req) : null;

    // Try to fetch the response from Redis.
    if (client && key && revalidate) {
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
    const res = await fetch(req);
    const took = Date.now() - start;

    console.debug(`${method} ${url} ${res.status} ${took}ms ORIGIN`);

    // Cache the response in Redis if it's successful.
    if (client && key && res.ok && revalidate) {
      const value = await res.clone().text();

      // Cache the response in Redis.
      await client.set(key, value, "EX", revalidate);
    }

    return res;
  }
);
