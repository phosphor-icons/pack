import { IconStyle } from "@phosphor-icons/core";
import type { SemVer } from "@/utils/types";
import { CACHE } from "@/utils/packer";

type StaticSizeRequest = {
  weights: IconStyle[];
  version?: SemVer;
};

export async function computeStaticSize(
  req: StaticSizeRequest,
): Promise<Partial<Record<IconStyle, { font: number; css: number }>>> {
  const sizes = await Promise.all(
    req.weights.map((weight) => CACHE.getAssetSize(weight)),
  );
  return sizes.reduce((acc, curr, i) => {
    acc[req.weights[i]] = curr;
    return acc;
  }, {} as Partial<Record<IconStyle, { font: number; css: number }>>);
}
