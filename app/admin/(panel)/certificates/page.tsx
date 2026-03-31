import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteCertificateAction, saveCertificateAction } from "@/app/admin/actions";
import SubmitButton from "@/app/components/SubmitButton";
import { buildDefaultTitle, formatUrl } from "@/lib/certificate-utils";

type AdminCertificatesPageProps = {
  searchParams: Promise<{ edit?: string }>;
};

export default async function AdminCertificatesPage({ searchParams }: AdminCertificatesPageProps) {
  const params = await searchParams;
  const [categories, certificates] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.certificate.findMany({
      include: {
        categoryRecord: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const editingCertificate = params.edit
    ? await prisma.certificate.findUnique({ where: { id: params.edit } })
    : null;

  return (
    <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-blue-300">Certificates</p>
            <h1 className="mt-2 text-3xl font-bold">{editingCertificate ? "Edit certificate" : "Add certificate"}</h1>
          </div>
          {editingCertificate && (
            <Link href="/admin/certificates" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200 transition hover:bg-white/10">
              Add new instead
            </Link>
          )}
        </div>

        <form action={saveCertificateAction} className="mt-8 grid gap-5 md:grid-cols-2">
          <input type="hidden" name="id" defaultValue={editingCertificate?.id || ""} />

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-gray-300">Course Name</label>
            <input type="text" name="courseName" required defaultValue={editingCertificate?.courseName || ""} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-blue-400" placeholder="Google Data Analytics" />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-gray-300">Certificate Title</label>
            <input type="text" name="title" defaultValue={editingCertificate?.title || ""} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-blue-400" placeholder={buildDefaultTitle("Google Data Analytics", "FREE")} />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">Slug</label>
            <input type="text" name="slug" defaultValue={editingCertificate?.slug || ""} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-blue-400" placeholder="google-data-analytics" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">Platform</label>
            <input type="text" name="platform" required defaultValue={editingCertificate?.platform || ""} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-blue-400" placeholder="Coursera" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">Category</label>
            <select name="categoryId" defaultValue={editingCertificate?.categoryId || ""} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-blue-400">
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">Duration</label>
            <input type="text" name="duration" defaultValue={editingCertificate?.duration || ""} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-blue-400" placeholder="6 weeks" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">Pricing Type</label>
            <select name="pricingType" defaultValue={editingCertificate?.pricingType || "FREE"} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-blue-400">
              <option value="FREE">Free</option>
              <option value="PAID">Paid</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">Image URL</label>
            <input type="url" name="imageUrl" defaultValue={editingCertificate?.imageUrl || ""} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-blue-400" placeholder="https://" />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-gray-300">Short Description</label>
            <textarea name="description" defaultValue={editingCertificate?.description || ""} className="h-28 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-blue-400" placeholder="Short summary for listing and detail hero" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">Certificate URL</label>
            <input type="url" name="certificateUrl" defaultValue={editingCertificate?.certificateUrl || ""} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-blue-400" placeholder="https://" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">Official Course Link</label>
            <input type="url" name="link" defaultValue={editingCertificate?.link || ""} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-blue-400" placeholder="https://" />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-gray-300">Course Content</label>
            <textarea name="courseContent" defaultValue={editingCertificate?.courseContent || ""} className="h-32 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-blue-400" placeholder={"Write one point per line\nCurriculum overview\nHands-on labs"} />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-gray-300">Benefits</label>
            <textarea name="benefits" defaultValue={editingCertificate?.benefits || ""} className="h-32 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-blue-400" placeholder={"Write one point per line\nBeginner-friendly\nResume-ready certificate"} />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-gray-300">Meta Title (Optional)</label>
            <input type="text" name="metaTitle" defaultValue={editingCertificate?.metaTitle || ""} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-blue-400" placeholder="Auto-generated if blank" />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-gray-300">Meta Description (Optional)</label>
            <textarea name="metaDescription" defaultValue={editingCertificate?.metaDescription || ""} className="h-28 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-blue-400" placeholder="Auto-generated if blank" />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-gray-300">Keywords (Optional)</label>
            <input type="text" name="keywords" defaultValue={editingCertificate?.keywords || ""} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-blue-400" placeholder="Auto-generated if blank" />
          </div>

          <div className="md:col-span-2">
            <SubmitButton pendingLabel={editingCertificate ? "Updating..." : "Saving..."} className="rounded-2xl bg-blue-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-blue-400">
              {editingCertificate ? "Update Certificate" : "Create Certificate"}
            </SubmitButton>
          </div>
        </form>
      </section>

      <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-bold">Certificate registry</h2>
        <div className="mt-6 space-y-4">
          {certificates.length > 0 ? (
            certificates.map((certificate) => (
              <article key={certificate.id} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                    {certificate.imageUrl ? (
                      <img src={formatUrl(certificate.imageUrl)} alt={certificate.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-blue-500/20 to-cyan-400/20" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="line-clamp-2 text-lg font-semibold">{certificate.title}</h3>
                        <p className="text-sm text-gray-400">{certificate.platform}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-blue-300">
                          {certificate.categoryRecord?.name || certificate.category || "No category"} • {certificate.pricingType}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/admin/certificates?edit=${certificate.id}`} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">
                          Edit
                        </Link>
                        <form action={deleteCertificateAction}>
                          <input type="hidden" name="id" value={certificate.id} />
                          <SubmitButton pendingLabel="Deleting..." className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20">
                            Delete
                          </SubmitButton>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-5 py-8 text-center text-gray-400">
              No certificates added yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
