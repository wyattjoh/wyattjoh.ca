import type { BlogPost } from "../lib/notion";

import Image from "next/image";
import Link from "next/link";

import avatar from "../public/avatar.jpeg";
import { NotionRichTextBlock } from "./notion-rich-text-block";

type Props = {
  post: BlogPost;
};

export function BlogPostHeader({ post }: Props) {
  return (
    <header className="mb-20 space-y-8">
      <Link
        href="/"
        className="text-xs text-gray-400 hover:text-gray-500 inline-block"
      >
        ← Back
      </Link>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{post.title}</h1>
        {post.summary.length > 0 && (
          <p className="text-gray-400 prose">
            {post.summary.map((block, index) => (
              <NotionRichTextBlock key={index} block={block} />
            ))}
          </p>
        )}
      </div>
      <div className="flex text-xs items-center justify-between">
        <div className="flex items-center">
          <Image
            alt="Picture of Wyatt Johnson"
            src={avatar}
            width={30}
            className="rounded-full"
          />
          <div className="ml-2">
            <Link
              className="font-bold text-gray-600 hover:text-black transition-colors block"
              href="/"
            >
              Wyatt Johnson
            </Link>
            <time className="text-gray-400">{post.date}</time>
          </div>
        </div>
        <hr className="ml-6 flex-grow" />
      </div>
    </header>
  );
}
