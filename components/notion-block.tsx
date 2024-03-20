import type {
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

import { Code } from "bright";
import { NotionRichTextBlock } from "./notion-rich-text-block";
import { ApplePodcastEmbed } from "./embeds/apple-podcast";
import { TwitterEmbed } from "./embeds/twitter";

type Props = {
  block: BlockObjectResponse | RichTextItemResponse;
};

export async function NotionBlock({ block }: Props) {
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
    case "embed":
      // URL matches https://podcasts.apple.com/ca/podcast/partial-pre-rendering-in-next-js-with-delba-de/id1539945251?i=1000649186593
      if (/^https:\/\/podcasts.apple.com/.test(block.embed.url)) {
        return <ApplePodcastEmbed url={block.embed.url} />;
      }

      // URL matches https://twitter.com/...
      if (/^https:\/\/twitter.com/.test(block.embed.url)) {
        return <TwitterEmbed url={block.embed.url} />;
      }

    default:
      // TODO: support other block types

      // In development, log unsupported block types to the console.
      if (process.env.NODE_ENV === "development") {
        console.log('Unsupported block type: "' + block.type + '"');
        console.log(JSON.stringify(block, null, 2));
      }

      return null;
  }
}
