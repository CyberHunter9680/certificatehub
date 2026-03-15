import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://certfinder.vercel.app";
  const certificates = await prisma.certificate.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/certificates`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
    },
    ...certificates.map((certificate) => ({
      url: `${baseUrl}/certificates/${certificate.slug}`,
      lastModified: certificate.updatedAt,
    })),
  ];
}
