import { prisma } from "@/lib/prisma";

export default async function AdminSettingsPage() {
  const [adminCount, userCount, latestAd, latestBlog] = await Promise.all([
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.user.count(),
    prisma.ad.findFirst({ orderBy: { createdAt: "desc" } }),
    prisma.blog.findFirst({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="space-y-8">
      <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8">
        <p className="text-sm uppercase tracking-[0.25em] text-amber-300">Settings</p>
        <h1 className="mt-3 text-4xl font-bold">Platform settings overview</h1>
        <p className="mt-4 max-w-2xl text-gray-300">
          This area is ready for future site-wide settings. For now it gives a production snapshot of admin access and content status.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold">Access</h2>
          <p className="mt-4 text-gray-300">Admin accounts: {adminCount}</p>
          <p className="mt-2 text-gray-300">Total users: {userCount}</p>
          <p className="mt-4 text-sm text-gray-400">Default admin bootstrap still works if there is no admin in the database.</p>
        </article>
        <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold">Latest content</h2>
          <p className="mt-4 text-gray-300">Latest blog: {latestBlog?.title || "No blog posts yet"}</p>
          <p className="mt-2 text-gray-300">Latest ad: {latestAd?.title || "No ads yet"}</p>
          <p className="mt-4 text-sm text-gray-400">Use Blog and Ads sections to keep content fresh and monetization flexible.</p>
        </article>
      </section>
    </div>
  );
}
