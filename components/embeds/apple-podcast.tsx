type Props = {
  url: string;
};

export function ApplePodcastEmbed(props: Props) {
  // Grab the last part of the URL, which is the episode ID.
  const url = new URL(props.url);
  url.host = "embed.podcasts.apple.com";

  return (
    <iframe
      src={url.toString()}
      title="Apple Podcast Player"
      height="175px"
      sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
      allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
      style={{ width: "100%" }}
    />
  );
}
