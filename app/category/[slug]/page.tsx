import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdPlacement } from "@prisma/client";
import CertificatesClient from "@/app/certificates/CertificatesClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type CategoryDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CategoryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });

  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested category page could not be found.",
    };
  }

  return {
    title: `${category.name} Certificates`,
    description: category.description || `Explore ${category.name} certificate opportunities and course details.`,
    alternates: {
      canonical: `/category/${category.slug}`,
    },
  };
}

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    notFound();
  }

  const [certificates, betweenAds] = await Promise.all([
    prisma.certificate.findMany({
      where: { categoryId: category.id },
      include: {
        categoryRecord: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.ad.findMany({
      where: {
        placement: AdPlacement.BETWEEN_CERTIFICATES,
        active: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <CertificatesClient
      certificates={certificates}
      betweenAds={betweenAds}
      enableCategoryFilter={false}
      title={`${category.name} Certificates`}
      description={category.description || `Explore certificates under ${category.name} with complete course details and SEO-friendly pages.`}
    />
  );
}
