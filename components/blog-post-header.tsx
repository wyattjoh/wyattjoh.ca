import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "../lib/notion";

import avatar from "../public/avatar.jpeg";
import { NotionRichTextBlock } from "./notion-rich-text-block";

type Props = {
  post: BlogPost | undefined;
};

export function BlogPostHeader({ post }: Props) {
  return (
    <header className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-3 transition-all duration-200 focus-ring group"
        >
          <Image
            alt="Picture of Wyatt Johnson"
            src={avatar}
            width={48}
            height={48}
            className="rounded-full border-2 border-gray-200 dark:border-gray-700 group-hover:border-gray-300 dark:group-hover:border-gray-600 transition-colors"
          />
          <div>
            <h2 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Wyatt Johnson
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Full-stack developer
            </p>
          </div>
        </Link>
      </div>
      <div className="space-y-2">
        {post ? (
          <>
            <h1 className="text-4xl font-bold dark:text-white">{post.title}</h1>
            {post.summary.length > 0 && (
              <p className="text-gray-400 prose">
                {post.summary.map((block, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: Index is stable for static content
                  <NotionRichTextBlock key={index} block={block} />
                ))}
              </p>
            )}
          </>
        ) : (
          <div className="animate-pulse space-y-2">
            <div className="h-10 bg-slate-200 rounded-sm dark:bg-gray-700" />
            <div className="h-7 bg-slate-200 rounded-sm dark:bg-gray-700" />
          </div>
        )}
      </div>
      <div className="flex text-xs items-center justify-between">
        <div className="flex items-center">
          {post ? (
            <time className="text-gray-400">{post.date}</time>
          ) : (
            <div className="animate-pulse h-4 bg-slate-200 rounded-sm w-24" />
          )}
        </div>
        <hr className="ml-6 grow text-gray-200" />
      </div>
    </header>
  );
}
