/* eslint-disable jsx-a11y/alt-text, @next/next/no-img-element */
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

import { findBlogPost, toPlainText } from "../../../lib/notion";

export const size = {
  width: 1920,
  height: 1080,
};
export const contentType = "image/png";

type Props = {
  params: {
    slug: string;
  };
};

const styles = {
  text: {
    primary: {
      color: "#ECEFF4",
      size: 128,
    },
    secondary: {
      color: "#A8ACB5",
      size: 60,
    },
  },
};

export default async function OpenGraphImage({ params: { slug } }: Props) {
  const post = await findBlogPost(slug);
  if (!post) {
    notFound();
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontFamily: "sans-serif",
          background:
            "linear-gradient(45deg, rgba(31,35,43,1) 0%, rgba(46,52,64,1) 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 75,
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexGrow: 1,
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              alignItems: "center",
              margin: 0,
              fontSize: styles.text.primary.size,
              color: styles.text.primary.color,
            }}
          >
            {post.title}
          </h1>
          {post.summary.length > 0 && (
            <p
              style={{
                fontSize: styles.text.secondary.size,
                color: styles.text.secondary.color,
              }}
            >
              {toPlainText(post.summary)}
            </p>
          )}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 50,
            alignItems: "center",
          }}
        >
          <img
            src="https://wyattjoh.ca/avatar.jpeg"
            style={{
              height: 120,
              width: 120,
              borderRadius: "50%",
              marginRight: 30,
            }}
            alt="Wyatt Johnson"
          />
          <div
            style={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                fontSize: styles.text.secondary.size,
                color: styles.text.secondary.color,
              }}
            >
              Wyatt Johnson
            </h2>
            <h2
              style={{
                display: "flex",
                fontSize: styles.text.secondary.size,
                color: styles.text.secondary.color,
                marginTop: 30,
                whiteSpace: "nowrap",
              }}
            >
              {post.date}
            </h2>
          </div>
        </div>
      </div>
    ),
    size
  );
}
