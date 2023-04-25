import type { Metadata } from "next";
import Link from "next/link";

import { getBlogPosts } from "../../lib/notion";

export const metadata: Metadata = {
  title: "Blog",
};

export default async function Page() {
  const posts = await getBlogPosts();

  return (
    <div className="p-4">
      <header className="mb-8">
        <div className="mb-6">
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-500">
            ← Back Home
          </Link>
        </div>
        <h1 className="text-3xl font-bold">Blog</h1>
      </header>
      <ul className="">
        {posts.map((post) => (
          <li key={post.id}>
            <h2 className="text-xl">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <time className="text-xs">{post.date}</time>
          </li>
        ))}
      </ul>
    </div>
  );
}
