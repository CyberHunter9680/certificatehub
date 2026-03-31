import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteCategoryAction, saveCategoryAction } from "@/app/admin/actions";
import SubmitButton from "@/app/components/SubmitButton";
import { slugify } from "@/lib/certificate-utils";

type CategoryAdminPageProps = {
  searchParams: Promise<{ edit?: string }>;
};

export default async function AdminCategoriesPage({ searchParams }: CategoryAdminPageProps) {
  const params = await searchParams;
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { certificates: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const editingCategory = params.edit
    ? await prisma.category.findUnique({ where: { id: params.edit } })
    : null;

  return (
    <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Categories</p>
            <h1 className="mt-2 text-3xl font-bold">{editingCategory ? "Edit category" : "Create category"}</h1>
          </div>
          {editingCategory && (
            <Link href="/admin/categories" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200 transition hover:bg-white/10">
              Add new instead
            </Link>
          )}
        </div>

        <form action={saveCategoryAction} className="mt-8 space-y-5">
          <input type="hidden" name="id" defaultValue={editingCategory?.id || ""} />

          <div>
            <label className="mb-2 block text-sm text-gray-300">Category Name</label>
            <input
              type="text"
              name="name"
              required
              defaultValue={editingCategory?.name || ""}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              placeholder="e.g. Cybersecurity"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">Slug</label>
            <input
              type="text"
              name="slug"
              defaultValue={editingCategory?.slug || ""}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              placeholder={editingCategory?.name ? slugify(editingCategory.name) : "cybersecurity"}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">Description</label>
            <textarea
              name="description"
              defaultValue={editingCategory?.description || ""}
              className="h-32 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              placeholder="Short summary for the category landing page"
            />
          </div>

          <SubmitButton pendingLabel={editingCategory ? "Updating..." : "Creating..."} className="rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
            {editingCategory ? "Update Category" : "Create Category"}
          </SubmitButton>
        </form>
      </section>

      <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-bold">Existing categories</h2>
        <div className="mt-6 space-y-4">
          {categories.length > 0 ? (
            categories.map((category) => (
              <article key={category.id} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <p className="text-sm text-gray-400">/{category.slug}</p>
                    <p className="mt-3 text-sm text-gray-300">{category.description || "No description added yet."}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-cyan-300">
                      {category._count.certificates} certificates linked
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/admin/categories?edit=${category.id}`} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">
                      Edit
                    </Link>
                    <form action={deleteCategoryAction}>
                      <input type="hidden" name="id" value={category.id} />
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
              No categories found. Create one to organize certificate pages properly.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
