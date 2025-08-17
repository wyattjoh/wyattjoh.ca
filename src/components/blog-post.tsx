import { NotionBlocks } from "@/components/notion-blocks";
import type { BlogPost as BlogPostData } from "@/lib/notion";

type Props = {
  post: BlogPostData;
};

export async function BlogPost({ post }: Props) {
  return <NotionBlocks id={post.id} className="space-y-8" />;
}
