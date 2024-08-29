import type { NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<Response> {
  const url = new URL(request.url);
  if (request.headers.get("Authorization") !== process.env.REVALIDATE_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  const tags = url.searchParams.getAll("tag");
  for (const tag of tags) {
    revalidateTag(tag);
  }

  const paths = url.searchParams.getAll("path");
  for (const path of paths) {
    revalidatePath(path);
  }

  return new Response("OK");
}
