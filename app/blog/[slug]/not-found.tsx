import Link from "next/link";

export default function NotFound() {
  return (
    <div className="p-4 prose">
      <h1>Not Found</h1>
      <p>The blog post you are looking for does not exist.</p>
      <p>
        <Link href="/">Go back to the homepage</Link>
      </p>
    </div>
  );
}
