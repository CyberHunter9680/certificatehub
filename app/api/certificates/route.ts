import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import {
  buildDefaultKeywords,
  buildDefaultMetaDescription,
  buildDefaultTitle,
  slugify,
  type PricingType,
} from "@/lib/certificate-utils";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-coursehub-jwt-key";

function getAdminToken(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  return cookieHeader.split("; ").find((row) => row.startsWith("admin_token="))?.split("=")[1];
}

function requireAdmin(request: Request) {
  const adminToken = getAdminToken(request);
  if (!adminToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    jwt.verify(adminToken, JWT_SECRET);
    return null;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

async function buildCertificatePayload(data: Record<string, unknown>, currentId?: string) {
  const courseName = String(data.courseName || data.title || "").trim();
  const platform = String(data.platform || "").trim();
  const pricingType = String(data.pricingType || "FREE").toUpperCase() === "PAID" ? "PAID" : "FREE";
  const rawSlug = String(data.slug || "").trim() || slugify(courseName || String(data.title || ""));
  const baseSlug = rawSlug || `certificate-${Date.now()}`;

  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const existing = await prisma.certificate.findUnique({ where: { slug } });
    if (!existing || existing.id === currentId) {
      break;
    }
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const title = String(data.title || "").trim() || buildDefaultTitle(courseName, pricingType as PricingType);
  const duration = String(data.duration || "").trim();
  const category = String(data.category || "").trim();
  const certificateUrl = String(data.certificateUrl || "").trim();
  const description = String(data.description || "").trim();
  const imageUrl = String(data.imageUrl || "").trim();
  const link = String(data.link || "").trim();
  const courseContent = String(data.courseContent || "").trim();
  const benefits = String(data.benefits || "").trim();
  const metaTitle = String(data.metaTitle || "").trim() || title;
  const metaDescription =
    String(data.metaDescription || "").trim() ||
    buildDefaultMetaDescription(courseName, platform, duration, pricingType as PricingType);
  const keywords =
    String(data.keywords || "").trim() || buildDefaultKeywords(courseName, platform, category, pricingType as PricingType);

  return {
    title,
    slug,
    courseName,
    platform,
    category: category || null,
    duration: duration || null,
    pricingType,
    courseContent: courseContent || null,
    benefits: benefits || null,
    certificateUrl: certificateUrl || null,
    description: description || null,
    imageUrl: imageUrl || null,
    link: link || null,
    metaTitle,
    metaDescription,
    keywords,
  };
}

export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      include: {
        categoryRecord: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(certificates);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authError = requireAdmin(request);
    if (authError) return authError;

    const data = await request.json();
    const payload = await buildCertificatePayload(data);

    if (!payload.courseName || !payload.platform) {
      return NextResponse.json({ error: "Course name and platform are required" }, { status: 400 });
    }

    const certificate = await prisma.certificate.create({ data: payload });
    return NextResponse.json(certificate, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const authError = requireAdmin(request);
    if (authError) return authError;

    const data = await request.json();
    const id = String(data.id || "").trim();

    if (!id) {
      return NextResponse.json({ error: "Certificate id is required" }, { status: 400 });
    }

    const payload = await buildCertificatePayload(data, id);
    const certificate = await prisma.certificate.update({
      where: { id },
      data: payload,
    });

    return NextResponse.json(certificate);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authError = requireAdmin(request);
    if (authError) return authError;

    const { id } = await request.json();
    await prisma.certificate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
