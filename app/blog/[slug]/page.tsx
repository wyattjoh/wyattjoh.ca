import type { Metadata } from "next";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BlogPost } from "../../../components/blog-post";
import { findBlogPost, getBlogPosts } from "../../../lib/notion";

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
      publishedTime: post.date,
      url: `https://wyattjoh.ca/blog/${slug}`,
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
      <header className="mb-8">
        <div className="mb-6">
          <Link
            href="/blog"
            className="text-xs text-gray-400 hover:text-gray-500"
          >
            ← Back to Blog
          </Link>
        </div>
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <time className="text-sm">{post.date}</time>
      </header>
      <Suspense>
        {/* @ts-expect-error - async components aren't yet supported in TS */}
        <BlogPost post={post} />
      </Suspense>
    </div>
  );
}
