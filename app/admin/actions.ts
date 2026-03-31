"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AdPlacement, prisma } from "@/lib/prisma-client-shim";
import { requireAdminSession } from "@/lib/admin-auth";
import {
  buildDefaultKeywords,
  buildDefaultMetaDescription,
  buildDefaultTitle,
  slugify,
  type PricingType,
} from "@/lib/certificate-utils";
import { buildBlogMetaDescription, buildBlogMetaTitle, buildBlogSlug } from "@/lib/blog-utils";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-coursehub-jwt-key";

export type AdminActionState = {
  success: boolean;
  message?: string;
};

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function asBoolean(value: FormDataEntryValue | null) {
  return value === "on" || value === "true";
}

async function ensureUniqueSlug(
  model: "category" | "blog" | "certificate",
  baseValue: string,
  currentId?: string,
) {
  const baseSlug = slugify(baseValue) || `${model}-${Date.now()}`;
  let slug = baseSlug;
  let suffix = 2;

  while (true) {
    const existing =
      model === "category"
        ? await prisma.category.findUnique({ where: { slug } })
        : model === "blog"
          ? await prisma.blog.findUnique({ where: { slug } })
          : await prisma.certificate.findUnique({ where: { slug } });

    if (!existing || existing.id === currentId) {
      return slug;
    }

    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export async function loginAdminAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const email = asString(formData.get("email"));
  const password = asString(formData.get("password"));

  if (!email || !password) {
    return { success: false, message: "Email and password are required." };
  }

  const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
  if (adminCount === 0) {
    const hashedPassword = await bcrypt.hash("Admin@2026", 10);
    await prisma.user.create({
      data: {
        email: "admin@coursehub.in",
        password: hashedPassword,
        role: "ADMIN",
      },
    });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.role !== "ADMIN" || !(await bcrypt.compare(password, user.password))) {
    return { success: false, message: "Invalid admin credentials." };
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
  const cookieStore = await cookies();
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  redirect("/admin/dashboard");
}

export async function logoutAdminAction() {
  const cookieStore = await cookies();
  cookieStore.set("admin_token", "", { maxAge: 0, path: "/" });
  redirect("/admin/login");
}

export async function saveCategoryAction(formData: FormData) {
  await requireAdminSession();

  const id = asString(formData.get("id"));
  const name = asString(formData.get("name"));
  const description = asString(formData.get("description"));
  const slugInput = asString(formData.get("slug"));

  if (!name) {
    throw new Error("Category name is required.");
  }

  const slug = await ensureUniqueSlug("category", slugInput || name, id || undefined);

  if (id) {
    await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null,
      },
    });

    await prisma.certificate.updateMany({
      where: { categoryId: id },
      data: { category: name },
    });
  } else {
    await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
      },
    });
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/certificates");
  revalidatePath("/certificates");
  revalidatePath("/category", "layout");
  redirect("/admin/categories");
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdminSession();

  const id = asString(formData.get("id"));
  if (!id) {
    throw new Error("Category id is required.");
  }

  await prisma.$transaction([
    prisma.certificate.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    }),
    prisma.category.delete({
      where: { id },
    }),
  ]);

  revalidatePath("/admin/categories");
  revalidatePath("/admin/certificates");
  revalidatePath("/certificates");
  redirect("/admin/categories");
}

export async function saveCertificateAction(formData: FormData) {
  await requireAdminSession();

  const id = asString(formData.get("id"));
  const courseName = asString(formData.get("courseName"));
  const platform = asString(formData.get("platform"));
  const duration = asString(formData.get("duration"));
  const pricingType = (asString(formData.get("pricingType")).toUpperCase() === "PAID" ? "PAID" : "FREE") as PricingType;
  const description = asString(formData.get("description"));
  const imageUrl = asString(formData.get("imageUrl"));
  const certificateUrl = asString(formData.get("certificateUrl"));
  const link = asString(formData.get("link"));
  const courseContent = asString(formData.get("courseContent"));
  const benefits = asString(formData.get("benefits"));
  const metaTitleInput = asString(formData.get("metaTitle"));
  const metaDescriptionInput = asString(formData.get("metaDescription"));
  const keywordsInput = asString(formData.get("keywords"));
  const slugInput = asString(formData.get("slug"));
  const titleInput = asString(formData.get("title"));
  const categoryId = asString(formData.get("categoryId"));

  if (!courseName || !platform) {
    throw new Error("Course name and platform are required.");
  }

  const categoryRecord = categoryId ? await prisma.category.findUnique({ where: { id: categoryId } }) : null;
  const slug = await ensureUniqueSlug("certificate", slugInput || courseName, id || undefined);
  const title = titleInput || buildDefaultTitle(courseName, pricingType);
  const metaTitle = metaTitleInput || title;
  const metaDescription =
    metaDescriptionInput || buildDefaultMetaDescription(courseName, platform, duration, pricingType);
  const keywords = keywordsInput || buildDefaultKeywords(courseName, platform, categoryRecord?.name, pricingType);

  const payload = {
    title,
    slug,
    courseName,
    platform,
    category: categoryRecord?.name || null,
    categoryId: categoryRecord?.id || null,
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

  if (id) {
    await prisma.certificate.update({
      where: { id },
      data: payload,
    });
  } else {
    await prisma.certificate.create({
      data: payload,
    });
  }

  revalidatePath("/admin/certificates");
  revalidatePath("/certificates");
  revalidatePath("/sitemap.xml");
  redirect("/admin/certificates");
}

export async function deleteCertificateAction(formData: FormData) {
  await requireAdminSession();

  const id = asString(formData.get("id"));
  if (!id) {
    throw new Error("Certificate id is required.");
  }

  await prisma.certificate.delete({ where: { id } });

  revalidatePath("/admin/certificates");
  revalidatePath("/certificates");
  revalidatePath("/sitemap.xml");
  redirect("/admin/certificates");
}

export async function saveBlogAction(formData: FormData) {
  await requireAdminSession();

  const id = asString(formData.get("id"));
  const title = asString(formData.get("title"));
  const content = asString(formData.get("content"));
  const featuredImage = asString(formData.get("featuredImage"));
  const metaTitleInput = asString(formData.get("metaTitle"));
  const metaDescriptionInput = asString(formData.get("metaDescription"));
  const slugInput = asString(formData.get("slug"));
  const published = asBoolean(formData.get("published"));

  if (!title || !content) {
    throw new Error("Blog title and content are required.");
  }

  const slug = await ensureUniqueSlug("blog", slugInput || buildBlogSlug(title), id || undefined);

  const payload = {
    title,
    slug,
    content,
    featuredImage: featuredImage || null,
    metaTitle: metaTitleInput || buildBlogMetaTitle(title),
    metaDescription: metaDescriptionInput || buildBlogMetaDescription(content),
    published,
  };

  if (id) {
    await prisma.blog.update({
      where: { id },
      data: payload,
    });
  } else {
    await prisma.blog.create({
      data: payload,
    });
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  redirect("/admin/blog");
}

export async function deleteBlogAction(formData: FormData) {
  await requireAdminSession();

  const id = asString(formData.get("id"));
  if (!id) {
    throw new Error("Blog id is required.");
  }

  await prisma.blog.delete({ where: { id } });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  redirect("/admin/blog");
}

export async function toggleBlogPublishAction(formData: FormData) {
  await requireAdminSession();

  const id = asString(formData.get("id"));
  const nextValue = asBoolean(formData.get("published"));

  await prisma.blog.update({
    where: { id },
    data: { published: nextValue },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function saveAdAction(formData: FormData) {
  await requireAdminSession();

  const id = asString(formData.get("id"));
  const title = asString(formData.get("title"));
  const adCode = asString(formData.get("adCode"));
  const placementValue = asString(formData.get("placement")) as keyof typeof AdPlacement;
  const active = asBoolean(formData.get("active"));

  if (!title || !adCode || !placementValue) {
    throw new Error("Ad title, code, and placement are required.");
  }

  const placement = AdPlacement[placementValue];

  if (id) {
    await prisma.ad.update({
      where: { id },
      data: {
        title,
        adCode,
        placement,
        active,
      },
    });
  } else {
    await prisma.ad.create({
      data: {
        title,
        adCode,
        placement,
        active,
      },
    });
  }

  revalidatePath("/admin/ads");
  revalidatePath("/", "layout");
  revalidatePath("/certificates");
  revalidatePath("/blog");
  redirect("/admin/ads");
}

export async function deleteAdAction(formData: FormData) {
  await requireAdminSession();

  const id = asString(formData.get("id"));
  if (!id) {
    throw new Error("Ad id is required.");
  }

  await prisma.ad.delete({ where: { id } });

  revalidatePath("/admin/ads");
  revalidatePath("/", "layout");
  redirect("/admin/ads");
}
