import type {
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

import Link from "next/link";

type Props = {
  block: BlockObjectResponse | RichTextItemResponse;
};

export function NotionBlock({ block }: Props) {
  switch (block.type) {
    case "paragraph":
      if (block.paragraph.rich_text.length === 0) return null;

      return (
        <p>
          {block.paragraph.rich_text.map((text, index) => (
            <NotionBlock key={index} block={text} />
          ))}
        </p>
      );
    case "text":
      let element = <span>{block.text.content}</span>;

      if (block.annotations.bold) {
        element = <strong>{element}</strong>;
      }

      if (block.annotations.italic) {
        element = <em>{element}</em>;
      }

      if (block.text.link) {
        element = (
          <Link href={block.text.link.url} rel="nofollow noreferrer">
            {element}
          </Link>
        );
      }

      return element;
    default:
      // TODO: support other block types
      return null;
  }
}
