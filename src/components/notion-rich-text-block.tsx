import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

import Link from "next/link";

type Props = {
  block: RichTextItemResponse;
};

export function NotionRichTextBlock({ block }: Props) {
  // TODO: support other rich text types
  if (block.type !== "text") {
    if (process.env.NODE_ENV === "development") {
      console.log(`Unsupported rich text type: "${block.type}"`);
    }

    return null;
  }

  let element = <span>{block.text.content}</span>;

  if (block.annotations.bold) {
    element = <strong>{element}</strong>;
  }

  if (block.annotations.italic) {
    element = <em>{element}</em>;
  }

  if (block.annotations.code) {
    element = <code className="not-prose">{block.text.content}</code>;
  }

  if (block.text.link) {
    element = (
      <Link href={block.text.link.url} rel="nofollow noreferrer">
        {element}
      </Link>
    );
  }

  return element;
}
