import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteBlogAction, saveBlogAction, toggleBlogPublishAction } from "@/app/admin/actions";
import RichTextEditor from "@/app/admin/components/RichTextEditor";
import SubmitButton from "@/app/components/SubmitButton";

type AdminBlogPageProps = {
  searchParams: Promise<{ edit?: string }>;
};

export default async function AdminBlogPage({ searchParams }: AdminBlogPageProps) {
  const params = await searchParams;
  const [blogs, editingBlog] = await Promise.all([
    prisma.blog.findMany({ orderBy: { createdAt: "desc" } }),
    params.edit ? prisma.blog.findUnique({ where: { id: params.edit } }) : Promise.resolve(null),
  ]);

  return (
    <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-violet-300">Blog</p>
            <h1 className="mt-2 text-3xl font-bold">{editingBlog ? "Edit post" : "Create post"}</h1>
          </div>
          {editingBlog && (
            <Link href="/admin/blog" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200 transition hover:bg-white/10">
              Create new instead
            </Link>
          )}
        </div>

        <form action={saveBlogAction} className="mt-8 space-y-5">
          <input type="hidden" name="id" defaultValue={editingBlog?.id || ""} />

          <div>
            <label className="mb-2 block text-sm text-gray-300">Title</label>
            <input type="text" name="title" required defaultValue={editingBlog?.title || ""} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-violet-400" placeholder="How to choose the best cybersecurity certificate" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">Slug</label>
            <input type="text" name="slug" defaultValue={editingBlog?.slug || ""} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-violet-400" placeholder="how-to-choose-the-best-cybersecurity-certificate" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">Featured Image</label>
            <input type="url" name="featuredImage" defaultValue={editingBlog?.featuredImage || ""} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-violet-400" placeholder="https://" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">Meta Title (Optional)</label>
            <input type="text" name="metaTitle" defaultValue={editingBlog?.metaTitle || ""} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-violet-400" placeholder="Auto-generated if blank" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">Meta Description (Optional)</label>
            <textarea name="metaDescription" defaultValue={editingBlog?.metaDescription || ""} className="h-28 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-violet-400" placeholder="Auto-generated if blank" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">Content</label>
            <RichTextEditor name="content" defaultValue={editingBlog?.content || "<p>Start writing here...</p>"} />
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-200">
            <input type="checkbox" name="published" defaultChecked={editingBlog?.published || false} className="h-4 w-4 rounded border-white/20 bg-transparent text-violet-400" />
            Publish immediately
          </label>

          <SubmitButton pendingLabel={editingBlog ? "Updating..." : "Saving..."} className="rounded-2xl bg-violet-500 px-5 py-3 font-semibold text-white transition hover:bg-violet-400">
            {editingBlog ? "Update Post" : "Create Post"}
          </SubmitButton>
        </form>
      </section>

      <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-bold">Blog library</h2>
        <div className="mt-6 space-y-4">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <article key={blog.id} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{blog.title}</h3>
                    <p className="text-sm text-gray-400">/{blog.slug}</p>
                    <p className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${blog.published ? "bg-emerald-500/20 text-emerald-200" : "bg-amber-500/20 text-amber-100"}`}>
                      {blog.published ? "Published" : "Draft"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/blog?edit=${blog.id}`} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">
                      Edit
                    </Link>
                    <form action={toggleBlogPublishAction}>
                      <input type="hidden" name="id" value={blog.id} />
                      <input type="hidden" name="published" value={blog.published ? "false" : "true"} />
                      <SubmitButton pendingLabel="Updating..." className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
                        {blog.published ? "Unpublish" : "Publish"}
                      </SubmitButton>
                    </form>
                    <form action={deleteBlogAction}>
                      <input type="hidden" name="id" value={blog.id} />
                      <SubmitButton pendingLabel="Deleting..." className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20">
                        Delete
                      </SubmitButton>
                    </form>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-5 py-8 text-center text-gray-400">
              No blog posts created yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
