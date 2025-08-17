import { BlogPostHeader } from "../../../components/blog-post-header";

function BlogPostSkeleton() {
  return (
    <div className="space-y-8 animate-pulse text-lg max-w-prose">
      <div className="space-y-4">
        <div className="h-6 bg-slate-200 dark:bg-gray-700 rounded-sm" />
        <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded-sm max-w-[90%]" />
        <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded-sm max-w-[80%]" />
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded-sm" />
        <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded-sm max-w-[90%]" />
        <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded-sm max-w-[75%]" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded-sm max-w-[50%]" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="p-4">
      <div className="lg:grid lg:grid-cols-[1fr_250px] lg:gap-x-12 lg:gap-y-16">
        <div className="lg:col-span-2">
          <BlogPostHeader post={undefined} />
        </div>
        <div className="lg:col-span-2 space-y-16">
          <BlogPostSkeleton />
        </div>
      </div>
    </div>
  );
}
