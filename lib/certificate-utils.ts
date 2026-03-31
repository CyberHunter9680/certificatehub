export type PricingType = "FREE" | "PAID";

export type CertificateRecord = {
  id: string;
  title: string;
  slug: string;
  courseName: string;
  platform: string;
  category: string | null;
  categoryId?: string | null;
  categoryRecord?: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
  } | null;
  duration: string | null;
  pricingType: PricingType | string;
  courseContent: string | null;
  benefits: string | null;
  certificateUrl: string | null;
  description: string | null;
  imageUrl: string | null;
  link: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type AdRecord = {
  id: string;
  title: string;
  adCode: string;
};

export function formatUrl(url?: string | null) {
  if (!url) return "";
  return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function splitTextarea(value?: string | null) {
  return (value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getPricingLabel(pricingType?: string | null) {
  return pricingType === "PAID" ? "Paid" : "Free";
}

export function buildDefaultTitle(courseName: string, pricingType: PricingType, year = new Date().getFullYear()) {
  const pricingLabel = pricingType === "PAID" ? "Paid" : "Free";
  return `${pricingLabel} ${courseName} Certificate ${year}`;
}

export function buildDefaultMetaDescription(
  courseName: string,
  platform: string,
  duration?: string | null,
  pricingType: PricingType = "FREE",
) {
  const pricingLabel = pricingType === "PAID" ? "paid" : "free";
  const durationText = duration ? ` Duration: ${duration}.` : "";
  return `Get the ${platform} ${courseName} certificate with official link, course details, benefits, duration, and ${pricingLabel} or paid enrollment information.${durationText}`;
}

export function buildDefaultKeywords(courseName: string, platform: string, category?: string | null, pricingType: PricingType = "FREE") {
  const pricingKeyword = pricingType === "PAID" ? "paid" : "free";
  return [
    `${courseName} certificate`,
    `${platform} certificate`,
    `${pricingKeyword} ${courseName} certificate`,
    category ? `${category.toLowerCase()} certificate` : null,
  ]
    .filter(Boolean)
    .join(", ");
}
