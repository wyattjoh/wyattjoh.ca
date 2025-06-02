import Image from "next/image";
import avatar from "../public/avatar.jpeg";
import { NotionBlocks } from "./notion-blocks";

export function BlogPostFooter() {
  return (
    <aside className="flex gap-4 py-12 border-t border-gray-200 items-center">
      <Image
        alt="Picture of Wyatt Johnson"
        src={avatar}
        width={100}
        className="rounded-full"
      />
      <NotionBlocks
        id="7d96f57f99494c6abcf136cac30e7e7a"
        className="grow p-4"
      />
    </aside>
  );
}
