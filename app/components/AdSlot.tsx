import { AdPlacement } from "@prisma/client";
import { getActiveAds } from "@/lib/ad-utils";
import AdMarkup from "./AdMarkup";

type AdSlotProps = {
  placement: AdPlacement;
  className?: string;
  limit?: number;
};

export default async function AdSlot({ placement, className, limit }: AdSlotProps) {
  const ads = await getActiveAds(placement);
  const visibleAds = typeof limit === "number" ? ads.slice(0, limit) : ads;

  if (visibleAds.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {visibleAds.map((ad) => (
          <section key={ad.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/10">
            <div className="border-b border-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-gray-400">
              Sponsored
            </div>
            <div className="px-4 py-4">
              <div className="mb-3 text-sm font-semibold text-white">{ad.title}</div>
              <AdMarkup markup={ad.adCode} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
