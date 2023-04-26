import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { BlogPost } from "../../../components/blog-post";
import { findBlogPost, getBlogPosts, toPlainText } from "../../../lib/notion";
import { BlogPostHeader } from "../../../components/blog-post-header";
import { base } from "../../../lib/base";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({
  params: { slug },
}: Props): Promise<Metadata> {
  const post = await findBlogPost(slug);
  if (!post) {
    notFound();
  }

  return {
    title: post.title,
    openGraph: {
      title: post.title,
      type: "article",
      description: toPlainText(post.summary),
      publishedTime: post.date,
      url: `${base}/blog/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Page({ params: { slug } }: Props) {
  const post = await findBlogPost(slug);
  if (!post) {
    notFound();
  }

  return (
    <div className="p-4">
      <BlogPostHeader post={post} />
      {/* @ts-expect-error - async components aren't yet supported in TS */}
      <BlogPost post={post} />
    </div>
  );
}
