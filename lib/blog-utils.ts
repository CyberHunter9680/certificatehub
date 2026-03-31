import { slugify } from "@/lib/certificate-utils";

export function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function buildBlogMetaTitle(title: string) {
  return `${title} | CertFinder Blog`;
}

export function buildBlogMetaDescription(content: string) {
  const plainText = stripHtml(content);
  return plainText.slice(0, 155) || "Read the latest certification insights on the CertFinder blog.";
}

export function buildBlogSlug(title: string) {
  return slugify(title);
}
