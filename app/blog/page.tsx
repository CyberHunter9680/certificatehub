import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/app/components/AdSlot";
import { prisma } from "@/lib/prisma";
import { formatUrl } from "@/lib/certificate-utils";

export const dynamic = "force-dynamic";

const pageTitle = "Certification Blog | Tips, Guides, and Updates";
const pageDescription = "Read certification guides, career tips, and training insights from the CertFinder blog.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    type: "website",
    url: "/blog",
  },
};

export default async function BlogPage() {
  const blogs = await prisma.blog.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#0e0e1a] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Blog</p>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">Guides, updates, and certificate insights</h1>
          <p className="mt-4 max-w-3xl text-gray-300">
            Explore practical articles about certifications, career growth, learning platforms, and how to choose the right course path.
          </p>
        </section>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <article key={blog.id} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
                  {blog.featuredImage && (
                    <img src={formatUrl(blog.featuredImage)} alt={blog.title} className="h-64 w-full object-cover" />
                  )}
                  <div className="p-7">
                    <p className="text-xs uppercase tracking-[0.25em] text-violet-300">
                      {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <h2 className="mt-3 text-3xl font-bold">{blog.title}</h2>
                    <p className="mt-4 text-gray-300">{blog.metaDescription}</p>
                    <Link href={`/blog/${blog.slug}`} className="mt-6 inline-flex rounded-full bg-violet-500 px-5 py-3 font-medium text-white transition hover:bg-violet-400">
                      Read article
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-white/5 px-6 py-12 text-center text-gray-400">
                No published blog posts yet.
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <AdSlot placement="SIDEBAR" />
          </aside>
        </div>
      </div>
    </div>
  );
}
