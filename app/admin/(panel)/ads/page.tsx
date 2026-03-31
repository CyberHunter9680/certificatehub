import { AdPlacement } from "@prisma/client";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteAdAction, saveAdAction } from "@/app/admin/actions";
import SubmitButton from "@/app/components/SubmitButton";

type AdminAdsPageProps = {
  searchParams: Promise<{ edit?: string }>;
};

const placementOptions = [
  { value: AdPlacement.HEADER, label: "header" },
  { value: AdPlacement.SIDEBAR, label: "sidebar" },
  { value: AdPlacement.BETWEEN_CERTIFICATES, label: "between certificates" },
  { value: AdPlacement.FOOTER, label: "footer" },
];

export default async function AdminAdsPage({ searchParams }: AdminAdsPageProps) {
  const params = await searchParams;
  const [ads, editingAd] = await Promise.all([
    prisma.ad.findMany({ orderBy: { createdAt: "desc" } }),
    params.edit ? prisma.ad.findUnique({ where: { id: params.edit } }) : Promise.resolve(null),
  ]);

  return (
    <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-pink-300">Ads</p>
            <h1 className="mt-2 text-3xl font-bold">{editingAd ? "Edit advertisement" : "Create advertisement"}</h1>
          </div>
          {editingAd && (
            <Link href="/admin/ads" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200 transition hover:bg-white/10">
              Create new instead
            </Link>
          )}
        </div>

        <form action={saveAdAction} className="mt-8 space-y-5">
          <input type="hidden" name="id" defaultValue={editingAd?.id || ""} />

          <div>
            <label className="mb-2 block text-sm text-gray-300">Ad Title</label>
            <input type="text" name="title" required defaultValue={editingAd?.title || ""} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-pink-400" placeholder="Sidebar sponsor - Cisco" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">Placement</label>
            <select name="placement" defaultValue={editingAd?.placement || AdPlacement.HEADER} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-pink-400">
              {placementOptions.map((placement) => (
                <option key={placement.value} value={placement.value}>
                  {placement.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">Ad Code</label>
            <textarea name="adCode" required defaultValue={editingAd?.adCode || ""} className="h-56 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 font-mono text-sm text-white outline-none transition focus:border-pink-400" placeholder="<script>...</script> or custom HTML" />
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-200">
            <input type="checkbox" name="active" defaultChecked={editingAd?.active ?? true} className="h-4 w-4 rounded border-white/20 bg-transparent text-pink-400" />
            Ad is active
          </label>

          <SubmitButton pendingLabel={editingAd ? "Updating..." : "Saving..."} className="rounded-2xl bg-pink-500 px-5 py-3 font-semibold text-white transition hover:bg-pink-400">
            {editingAd ? "Update Ad" : "Create Ad"}
          </SubmitButton>
        </form>
      </section>

      <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-bold">Ad placements</h2>
        <div className="mt-6 space-y-4">
          {ads.length > 0 ? (
            ads.map((ad) => (
              <article key={ad.id} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{ad.title}</h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-pink-300">
                      {ad.placement.replaceAll("_", " ")}
                    </p>
                    <p className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${ad.active ? "bg-emerald-500/20 text-emerald-200" : "bg-gray-500/20 text-gray-200"}`}>
                      {ad.active ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/ads?edit=${ad.id}`} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">
                      Edit
                    </Link>
                    <form action={deleteAdAction}>
                      <input type="hidden" name="id" value={ad.id} />
                      <SubmitButton pendingLabel="Deleting..." className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20">
                        Delete
                      </SubmitButton>
                    </form>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-5 py-8 text-center text-gray-400">
              No ads configured yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
