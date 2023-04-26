import Link from "next/link";

import { getBlogPosts } from "../lib/notion";

type Props = {
  className?: string;
};

export async function BlogPosts({ className }: Props) {
  const posts = await getBlogPosts();
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className={className}>
      <h2 className="font-bold">Recent Posts:</h2>
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/blog/${post.slug}`}
              className="text-xl block underline decoration-2 decoration-gray-500 hover:decoration-black transition-colors"
            >
              {post.title}
            </Link>
            <time className="text-xs text-gray-400">{post.date}</time>
          </li>
        ))}
      </ul>
    </section>
  );
}
