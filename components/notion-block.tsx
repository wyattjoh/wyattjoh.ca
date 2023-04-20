import type {
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

import { Link } from "./link";

type Props = {
  block: BlockObjectResponse | RichTextItemResponse;
};

export function NotionBlock(props: Props) {
  switch (props.block.type) {
    case "paragraph":
      if (props.block.paragraph.rich_text.length === 0) return null;

      return (
        <p>
          {props.block.paragraph.rich_text.map((text, index) => (
            <NotionBlock key={index} block={text} />
          ))}
        </p>
      );
    case "text":
      if (props.block.text.link) {
        return (
          <Link href={props.block.text.link.url}>
            {props.block.text.content}
          </Link>
        );
      }

      return <>{props.block.text.content}</>;
    default:
      // TODO: support other block types
      return null;
  }
}
