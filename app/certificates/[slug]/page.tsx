import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, BookOpen, Clock3, ExternalLink, ShieldCheck, Star } from "lucide-react";
import AdSlot from "@/app/components/AdSlot";
import { prisma } from "@/lib/prisma";
import { formatUrl, getPricingLabel, splitTextarea } from "@/lib/certificate-utils";

export const dynamic = "force-dynamic";

type CertificateDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CertificateDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const certificate = await prisma.certificate.findUnique({
    where: { slug },
    include: { categoryRecord: true },
  });

  if (!certificate) {
    return {
      title: "Certificate Not Found | CertFinder",
      description: "The requested certificate page could not be found.",
    };
  }

  return {
    title: certificate.metaTitle || certificate.title,
    description: certificate.metaDescription || certificate.description || undefined,
    keywords: certificate.keywords?.split(",").map((keyword) => keyword.trim()).filter(Boolean),
    alternates: {
      canonical: `/certificates/${certificate.slug}`,
    },
    openGraph: {
      title: certificate.metaTitle || certificate.title,
      description: certificate.metaDescription || certificate.description || undefined,
      type: "article",
      url: `/certificates/${certificate.slug}`,
      images: certificate.imageUrl ? [{ url: formatUrl(certificate.imageUrl) }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: certificate.metaTitle || certificate.title,
      description: certificate.metaDescription || certificate.description || undefined,
    },
  };
}

export default async function CertificateDetailPage({ params }: CertificateDetailPageProps) {
  const { slug } = await params;
  const certificate = await prisma.certificate.findUnique({
    where: { slug },
    include: { categoryRecord: true },
  });

  if (!certificate) {
    notFound();
  }

  const courseContent = splitTextarea(certificate.courseContent);
  const benefits = splitTextarea(certificate.benefits);
  const relatedFilters = certificate.categoryId
    ? [{ categoryId: certificate.categoryId }, { platform: certificate.platform }]
    : [{ platform: certificate.platform }];
  const relatedCertificates = await prisma.certificate.findMany({
    where: {
      id: { not: certificate.id },
      OR: relatedFilters,
    },
    include: {
      categoryRecord: true,
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const fallbackCertificates =
    relatedCertificates.length < 3
      ? await prisma.certificate.findMany({
          where: {
            id: {
              notIn: [certificate.id, ...relatedCertificates.map((item) => item.id)],
            },
          },
          include: {
            categoryRecord: true,
          },
          orderBy: { createdAt: "desc" },
          take: 3 - relatedCertificates.length,
        })
      : [];

  const suggestedCertificates = [...relatedCertificates, ...fallbackCertificates];

  return (
    <div className="min-h-screen bg-[#0e0e1a] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/certificates" className="mb-8 inline-flex text-sm text-purple-300 transition hover:text-purple-200">
          Back to Certificates
        </Link>

        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-8 md:p-10">
              <div className="mb-5 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-300">
                <span className="rounded-full bg-purple-500/20 px-4 py-2 text-purple-200">{certificate.platform}</span>
                <span className="rounded-full bg-emerald-500/20 px-4 py-2 text-emerald-200">
                  {getPricingLabel(certificate.pricingType)}
                </span>
                {(certificate.categoryRecord?.name || certificate.category) && (
                  <span className="rounded-full bg-blue-500/20 px-4 py-2 text-blue-200">{certificate.categoryRecord?.name || certificate.category}</span>
                )}
              </div>

              <h1 className="mb-4 text-4xl font-extrabold leading-tight md:text-5xl">{certificate.title}</h1>
              <p className="mb-6 text-lg text-gray-300">{certificate.description}</p>

              <div className="grid gap-4 rounded-3xl border border-white/10 bg-black/20 p-6 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-400">Course Name</p>
                  <p className="mt-1 text-lg font-semibold text-white">{certificate.courseName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Platform</p>
                  <p className="mt-1 text-lg font-semibold text-white">{certificate.platform}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Duration</p>
                  <p className="mt-1 text-lg font-semibold text-white">{certificate.duration || "Self-paced"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Pricing</p>
                  <p className="mt-1 text-lg font-semibold text-white">{getPricingLabel(certificate.pricingType)}</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                {certificate.link && (
                  <a
                    href={formatUrl(certificate.link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-medium text-white transition hover:from-purple-500 hover:to-blue-500"
                  >
                    Official Course Page <ExternalLink size={18} />
                  </a>
                )}
                {certificate.certificateUrl && (
                  <a
                    href={formatUrl(certificate.certificateUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10"
                  >
                    View Certificate <ExternalLink size={18} />
                  </a>
                )}
              </div>
            </div>

            <div className="border-l border-white/10 bg-black/20 p-8 md:p-10">
              <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40">
                <img
                  src={
                    formatUrl(certificate.imageUrl) ||
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                  }
                  alt={certificate.courseName}
                  className="h-72 w-full object-cover"
                />
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-3">
                    <Clock3 className="text-blue-300" />
                    <div>
                      <p className="text-sm text-gray-400">Estimated Duration</p>
                      <p className="font-semibold">{certificate.duration || "Self-paced access"}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-emerald-300" />
                    <div>
                      <p className="text-sm text-gray-400">Access Type</p>
                      <p className="font-semibold">{getPricingLabel(certificate.pricingType)} Certificate Program</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-3">
                    <Award className="text-purple-300" />
                    <div>
                      <p className="text-sm text-gray-400">Best For</p>
                      <p className="font-semibold">{certificate.categoryRecord?.name || certificate.category || "Professional learners"}</p>
                    </div>
                  </div>
                </div>
                <AdSlot placement="SIDEBAR" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8">
            <div className="mb-6 flex items-center gap-3">
              <BookOpen className="text-blue-300" />
              <h2 className="text-2xl font-bold">Course Content</h2>
            </div>
            {courseContent.length > 0 ? (
              <ul className="space-y-3 text-gray-300">
                {courseContent.map((item) => (
                  <li key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">Course content details will appear here after the admin updates this certificate.</p>
            )}
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8">
            <div className="mb-6 flex items-center gap-3">
              <Star className="text-amber-300" />
              <h2 className="text-2xl font-bold">Course Benefits</h2>
            </div>
            {benefits.length > 0 ? (
              <ul className="space-y-3 text-gray-300">
                {benefits.map((item) => (
                  <li key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">Benefits will appear here after the admin updates this certificate.</p>
            )}
          </div>
        </section>

        {suggestedCertificates.length > 0 && (
          <section className="mt-12 rounded-[1.75rem] border border-white/10 bg-white/5 p-8">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-purple-300">Related Certificates</p>
                <h2 className="mt-2 text-3xl font-bold">You may also like these certificates</h2>
              </div>
              <Link href="/certificates" className="text-sm text-blue-300 transition hover:text-blue-200">
                View all certificates
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {suggestedCertificates.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20 transition hover:bg-black/30">
                  <Link href={`/certificates/${item.slug}`} className="block">
                    <img
                      src={
                        formatUrl(item.imageUrl) ||
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                      }
                      alt={item.courseName}
                      className="h-48 w-full object-cover"
                    />
                    <div className="p-5">
                      <div className="mb-3 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider">
                        <span className="rounded-full bg-purple-500/20 px-3 py-1 text-purple-200">{item.platform}</span>
                        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-200">{getPricingLabel(item.pricingType)}</span>
                        {(item.categoryRecord?.name || item.category) && (
                          <span className="rounded-full bg-blue-500/20 px-3 py-1 text-blue-200">{item.categoryRecord?.name || item.category}</span>
                        )}
                      </div>
                      <h3 className="line-clamp-2 text-lg font-bold text-white">{item.title}</h3>
                      <p className="mt-3 line-clamp-3 text-sm text-gray-400">{item.description}</p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
