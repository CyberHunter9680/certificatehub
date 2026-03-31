import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [certificateCount, categoryCount, blogCount, publishedBlogCount, adCount, activeAdCount] = await Promise.all([
    prisma.certificate.count(),
    prisma.category.count(),
    prisma.blog.count(),
    prisma.blog.count({ where: { published: true } }),
    prisma.ad.count(),
    prisma.ad.count({ where: { active: true } }),
  ]);

  const recentBlogs = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const statCards = [
    { label: "Certificates", value: certificateCount, accent: "from-blue-500 to-cyan-400" },
    { label: "Categories", value: categoryCount, accent: "from-emerald-500 to-lime-400" },
    { label: "Blog Posts", value: blogCount, accent: "from-violet-500 to-fuchsia-400" },
    { label: "Published Blogs", value: publishedBlogCount, accent: "from-amber-500 to-orange-400" },
    { label: "Ads", value: adCount, accent: "from-pink-500 to-rose-400" },
    { label: "Active Ads", value: activeAdCount, accent: "from-sky-500 to-indigo-400" },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1120] p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Dashboard</p>
        <h1 className="mt-3 text-4xl font-bold">Everything in one control center</h1>
        <p className="mt-4 max-w-2xl text-gray-300">
          Manage certificates, categories, blog posts, and ad placements without touching production data manually.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => (
          <article key={card.label} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <div className={`h-1 rounded-full bg-gradient-to-r ${card.accent}`} />
            <p className="mt-5 text-sm uppercase tracking-[0.25em] text-gray-400">{card.label}</p>
            <p className="mt-3 text-4xl font-bold">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-bold">Recent blog activity</h2>
        <div className="mt-6 space-y-4">
          {recentBlogs.length > 0 ? (
            recentBlogs.map((blog) => (
              <div key={blog.id} className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-white">{blog.title}</h3>
                    <p className="text-sm text-gray-400">{blog.slug}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${blog.published ? "bg-emerald-500/20 text-emerald-200" : "bg-amber-500/20 text-amber-100"}`}>
                    {blog.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-5 py-8 text-center text-gray-400">
              No blog posts yet. Create your first article from the Blog section.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
