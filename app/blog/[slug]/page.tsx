import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { BlogPost } from "../../../components/blog-post";
import { findBlogPost, getBlogPosts, toPlainText } from "../../../lib/notion";
import { BlogPostHeader } from "../../../components/blog-post-header";
import { base } from "../../../lib/base";
import { BlogPostFooter } from "../../../components/blog-post-footer";

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

  const description = toPlainText(post.summary);

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      type: "article",
      description,
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
      <BlogPost post={post} />
      <BlogPostFooter />
    </div>
  );
}
