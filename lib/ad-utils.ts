import { AdPlacement, prisma } from "@/lib/prisma-client-shim";

export async function getActiveAds(placement: AdPlacement) {
  return prisma.ad.findMany({
    where: {
      placement,
      active: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
