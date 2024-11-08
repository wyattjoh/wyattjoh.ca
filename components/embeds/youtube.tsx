type Props = {
  url: string;
};

function getYouTubeID(url: URL) {
  return url.pathname.split("/").pop();
}

function getYouTubeEmbedURL(id: string) {
  const url = new URL("https://www.youtube.com");
  url.pathname = `/embed/${id}`;
  url.searchParams.append("feature", "oembed");
  url.searchParams.append("rel", "0");
  url.searchParams.append("modestbranding", "1");

  return url.toString();
}

export async function YouTubeEmbed(props: Props) {
  // Grab the video ID from the URL in the pathname.
  const id = getYouTubeID(new URL(props.url));
  if (!id) return null;

  // Construct the embed URL.
  const embedURL = getYouTubeEmbedURL(id);

  return (
    <iframe
      className="mx-auto w-full aspect-video"
      src={embedURL}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  );
}
