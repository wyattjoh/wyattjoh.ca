import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";

type Props = {
  url: string;
};

type OpenGraphData = {
  title: string | undefined;
  description: string | undefined;
  image: string | undefined;
  favicon: string | undefined;
};

async function fetchOpenGraphData(url: string): Promise<OpenGraphData> {
  "use cache";

  cacheTag("notion");
  cacheLife("days");

  const parsed = new URL(url);

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    },
  });

  if (!res.ok) {
    return {
      title: undefined,
      description: undefined,
      image: undefined,
      favicon: undefined,
    };
  }

  const html = await res.text();

  const getMetaContent = (property: string): string | undefined => {
    // Match og: properties
    const ogMatch = html.match(
      new RegExp(
        `<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`,
        "i"
      )
    );
    if (ogMatch) return ogMatch[1];

    // Also try name attribute for description fallback
    const nameMatch = html.match(
      new RegExp(
        `<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']*)["']`,
        "i"
      )
    );
    if (nameMatch) return nameMatch[1];

    // Try reverse order (content before property/name)
    const reverseOgMatch = html.match(
      new RegExp(
        `<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["']`,
        "i"
      )
    );
    if (reverseOgMatch) return reverseOgMatch[1];

    const reverseNameMatch = html.match(
      new RegExp(
        `<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${property}["']`,
        "i"
      )
    );
    if (reverseNameMatch) return reverseNameMatch[1];

    return undefined;
  };

  const getTitle = (): string | undefined => {
    const ogTitle = getMetaContent("og:title");
    if (ogTitle) return ogTitle;

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (titleMatch) return titleMatch[1];

    return undefined;
  };

  const getFavicon = (): string | undefined => {
    // Try to find link rel="icon" or rel="shortcut icon"
    const iconMatch = html.match(
      /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']*)["']/i
    );
    if (iconMatch) {
      const href = iconMatch[1];
      if (href.startsWith("http")) return href;
      if (href.startsWith("//")) return `https:${href}`;
      if (href.startsWith("/")) return `${parsed.origin}${href}`;
      return `${parsed.origin}/${href}`;
    }

    // Also try reverse order
    const reverseIconMatch = html.match(
      /<link[^>]*href=["']([^"']*)["'][^>]*rel=["'](?:shortcut )?icon["']/i
    );
    if (reverseIconMatch) {
      const href = reverseIconMatch[1];
      if (href.startsWith("http")) return href;
      if (href.startsWith("//")) return `https:${href}`;
      if (href.startsWith("/")) return `${parsed.origin}${href}`;
      return `${parsed.origin}/${href}`;
    }

    // Fallback to /favicon.ico
    return `${parsed.origin}/favicon.ico`;
  };

  const resolveImageUrl = (
    imageUrl: string | undefined
  ): string | undefined => {
    if (!imageUrl) return undefined;
    if (imageUrl.startsWith("http")) return imageUrl;
    if (imageUrl.startsWith("//")) return `https:${imageUrl}`;
    if (imageUrl.startsWith("/")) return `${parsed.origin}${imageUrl}`;
    return `${parsed.origin}/${imageUrl}`;
  };

  return {
    title: getTitle(),
    description:
      getMetaContent("og:description") || getMetaContent("description"),
    image: resolveImageUrl(getMetaContent("og:image")),
    favicon: getFavicon(),
  };
}

export async function BookmarkEmbed({ url }: Props) {
  const parsed = new URL(url);
  const og = await fetchOpenGraphData(url);

  const displayUrl = `${parsed.hostname}${
    parsed.pathname !== "/" ? parsed.pathname : ""
  }`;
  const truncatedUrl =
    displayUrl.length > 50 ? `${displayUrl.slice(0, 50)}...` : displayUrl;

  return (
    <a
      href={url}
      target="_blank"
      rel="nofollow noreferrer"
      className="not-prose flex overflow-hidden rounded-lg border border-gray-200 bg-white transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-1 p-4">
        {og.title && (
          <p className="truncate font-medium text-gray-900 dark:text-gray-100">
            {og.title}
          </p>
        )}
        {og.description && (
          <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
            {og.description}
          </p>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          {og.favicon && (
            <Image
              src={og.favicon}
              alt=""
              width={16}
              height={16}
              className="size-4"
              unoptimized
            />
          )}
          <span className="truncate">{truncatedUrl}</span>
        </div>
      </div>
      {og.image && (
        <div className="relative hidden w-[200px] shrink-0 sm:block">
          <Image
            src={og.image}
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
    </a>
  );
}
