import type {
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

import Link from "next/link";
import { Code } from "bright";

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
    case "code":
      return (
        <div>
          {/* @ts-expect-error - code blocks aren't yet supported in TS */}
          <Code lang={block.code.language} theme="nord" lineNumbers>
            {block.code.rich_text[0].plain_text}
          </Code>
          {block.code.caption.length > 0 && (
            <p className="text-xs text-gray-500 -mt-2">
              {block.code.caption[0].plain_text}
            </p>
          )}
        </div>
      );
    default:
      // TODO: support other block types

      // In development, log unsupported block types to the console.
      if (process.env.NODE_ENV === "development") {
        console.log('Unsupported block type: "' + block.type + '"');
      }
      return null;
  }
}
