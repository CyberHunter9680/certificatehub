import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/app/components/AdSlot";
import { prisma } from "@/lib/prisma";
import { formatUrl } from "@/lib/certificate-utils";

export const dynamic = "force-dynamic";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await prisma.blog.findUnique({
    where: { slug },
  });

  if (!blog || !blog.published) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || undefined,
    alternates: {
      canonical: `/blog/${blog.slug}`,
    },
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || undefined,
      type: "article",
      url: `/blog/${blog.slug}`,
      images: blog.featuredImage ? [{ url: formatUrl(blog.featuredImage) }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const blog = await prisma.blog.findUnique({
    where: { slug },
  });

  if (!blog || !blog.published) {
    notFound();
  }

  const relatedBlogs = await prisma.blog.findMany({
    where: {
      published: true,
      id: { not: blog.id },
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div className="min-h-screen bg-[#0e0e1a] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/blog" className="mb-8 inline-flex text-sm text-violet-300 transition hover:text-violet-200">
          Back to Blog
        </Link>

        <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
            {blog.featuredImage && (
              <img src={formatUrl(blog.featuredImage)} alt={blog.title} className="h-72 w-full object-cover" />
            )}
            <div className="p-8 md:p-10">
              <p className="text-xs uppercase tracking-[0.25em] text-violet-300">
                {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <h1 className="mt-4 text-4xl font-bold md:text-5xl">{blog.title}</h1>
              {blog.metaDescription && <p className="mt-5 text-lg text-gray-300">{blog.metaDescription}</p>}
              <div
                className="prose prose-invert mt-8 max-w-none prose-headings:text-white prose-a:text-cyan-300"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </article>

          <aside className="space-y-6">
            <AdSlot placement="SIDEBAR" />

            {relatedBlogs.length > 0 && (
              <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                <h2 className="text-2xl font-bold">Related articles</h2>
                <div className="mt-6 space-y-4">
                  {relatedBlogs.map((relatedBlog) => (
                    <Link key={relatedBlog.id} href={`/blog/${relatedBlog.slug}`} className="block rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:bg-black/30">
                      <h3 className="font-semibold text-white">{relatedBlog.title}</h3>
                      <p className="mt-2 text-sm text-gray-400">{relatedBlog.metaDescription}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
