import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdPlacement } from "@prisma/client";
import CertificatesClient from "./CertificatesClient";

export const dynamic = "force-dynamic";

const pageTitle = "Free Cyber Security Certification 2026 | Certificate Directory";
const pageDescription =
  "Browse certificate opportunities with full details including platform, duration, course content, benefits, and free or paid status.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "free cyber security certification 2026",
    "cisco free networking certificate",
    "google data analytics certificate free",
    "online certificates",
  ],
  alternates: {
    canonical: "/certificates",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    type: "website",
    url: "/certificates",
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
  },
};

export default async function CertificatesPage() {
  const [certificates, betweenAds] = await Promise.all([
    prisma.certificate.findMany({
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

  return <CertificatesClient certificates={certificates} betweenAds={betweenAds} />;
}
