import type { BlogPost as BlogPostData } from "../lib/notion";
import { NotionBlocks } from "./notion-blocks";

type Props = {
  post: BlogPostData;
};

export async function BlogPost({ post }: Props) {
  return <NotionBlocks id={post.id} className="space-y-8 mb-16" />;
}
