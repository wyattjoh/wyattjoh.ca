import { BlogPostHeader } from "../../../components/blog-post-header";

export default function Loading() {
  return (
    <div className="p-4">
      <BlogPostHeader post={undefined} />
      <div className="space-y-2 animate-pulse">
        <div className="h-10 bg-slate-200 rounded"></div>
        <div className="h-32 bg-slate-200 rounded"></div>
        <div className="h-10 max-w-[50%] bg-slate-200 rounded"></div>
      </div>
    </div>
  );
}
