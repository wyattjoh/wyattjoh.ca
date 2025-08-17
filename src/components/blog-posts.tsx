import Link from "next/link";

import { getBlogPosts } from "@/lib/notion";

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
      <h2 className="font-bold text-2xl dark:text-white mb-6">Recent Posts</h2>
      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.id} className="group">
            <Link
              href={`/blog/${post.slug}`}
              className="block hover-lift p-4 -mx-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
            >
              <div className="flex items-start gap-4">
                <time className="text-sm text-gray-500 dark:text-gray-400 mt-1 w-30 flex-shrink-0">
                  {post.date}
                </time>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors dark:text-white">
                    {post.title}
                  </h3>
                  {post.summary && (
                    <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                      {post.summary.map((text) => text.plain_text).join("")}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
