import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { BlogPost } from "../../../components/blog-post";
import { BlogPostFooter } from "../../../components/blog-post-footer";
import { BlogPostHeader } from "../../../components/blog-post-header";
import { MobileTableOfContents } from "../../../components/mobile-table-of-contents";
import { TableOfContents } from "../../../components/table-of-contents";
import { base } from "../../../lib/base";
import {
  extractHeadings,
  findBlogPost,
  getBlogPosts,
  toPlainText,
} from "../../../lib/notion";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
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

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = await findBlogPost(slug);
  if (!post) {
    notFound();
  }

  const headings = await extractHeadings(post.id);

  return (
    <div className="p-4">
      <div className="lg:grid lg:grid-cols-[1fr_250px] lg:gap-12">
        <div className="lg:col-span-2">
          <BlogPostHeader post={post} />
        </div>
        <div className="lg:col-span-1">
          <BlogPost post={post} />
          <BlogPostFooter />
        </div>
        <TableOfContents headings={headings} />
      </div>
      <MobileTableOfContents headings={headings} />
    </div>
  );
}
