import type { BlogPost } from "../lib/notion";
import { NotionBlocks } from "./notion-blocks";

type Props = {
  post: BlogPost;
};

export async function BlogPost({ post }: Props) {
  // @ts-expect-error - async components aren't yet supported in TS
  return <NotionBlocks id={post.id} className="space-y-8 mb-16" />;
}
