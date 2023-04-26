import type {
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

import { Code } from "bright";
import { NotionRichTextBlock } from "./notion-rich-text-block";

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
      return <NotionRichTextBlock block={block} />;
    case "heading_1":
      // We're using h2 instead of h1 because the page title is an h1.
      return <h2>{block.heading_1.rich_text[0].plain_text}</h2>;
    case "heading_2":
      return <h3>{block.heading_2.rich_text[0].plain_text}</h3>;
    case "heading_3":
      return <h4>{block.heading_3.rich_text[0].plain_text}</h4>;
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
