import "./twitter.css";

type Props = {
  url: string;
};

export async function TwitterEmbed(props: Props) {
  const url = new URL("https://publish.twitter.com/oembed");
  url.searchParams.append("url", props.url);

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  const data = await res.json();

  console.log(data);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: data.html,
      }}
    />
  );

  // return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
