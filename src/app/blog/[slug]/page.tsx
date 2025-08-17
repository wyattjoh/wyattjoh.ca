import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPost } from "@/components/blog-post";
import { BlogPostFooter } from "@/components/blog-post-footer";
import { BlogPostHeader } from "@/components/blog-post-header";
import { MobileTableOfContents } from "@/components/mobile-table-of-contents";
import { StructuredData } from "@/components/structured-data";
import { TableOfContents } from "@/components/table-of-contents";
import { base } from "@/lib/base";
import {
  extractHeadings,
  findBlogPost,
  getBlogPosts,
  toPlainText,
} from "@/lib/notion";

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
    keywords: post.tags,
    authors: [{ name: "Wyatt Johnson", url: base }],
    creator: "Wyatt Johnson",
    publisher: "Wyatt Johnson",
    openGraph: {
      title: post.title,
      type: "article",
      description,
      publishedTime: new Date(post.date).toISOString(),
      modifiedTime: new Date(post.date).toISOString(),
      url: `${base}/blog/${slug}`,
      siteName: "Wyatt Johnson",
      authors: ["Wyatt Johnson"],
      tags: post.tags,
      images: [
        {
          url: `${base}/avatar.jpeg`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    alternates: {
      canonical: `${base}/blog/${slug}`,
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

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: toPlainText(post.summary),
    author: {
      "@type": "Person",
      name: "Wyatt Johnson",
      url: base,
    },
    publisher: {
      "@type": "Person",
      name: "Wyatt Johnson",
      url: base,
    },
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    url: `${base}/blog/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${base}/blog/${slug}`,
    },
    keywords: post.tags,
  };

  return (
    <>
      <StructuredData data={articleStructuredData} />
      <div className="p-4">
        {headings.length > 0 ? (
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_250px] gap-x-12 gap-y-16">
            <div className="lg:col-span-2">
              <BlogPostHeader post={post} />
            </div>
            <div className="lg:col-span-1 space-y-16">
              <BlogPost post={post} />
              <BlogPostFooter />
            </div>
            <TableOfContents headings={headings} />
          </div>
        ) : (
          <div className="max-w-prose text-lg space-y-16">
            <BlogPostHeader post={post} />
            <BlogPost post={post} />
            <BlogPostFooter />
          </div>
        )}
        {headings.length > 0 && <MobileTableOfContents headings={headings} />}
      </div>
    </>
  );
}
