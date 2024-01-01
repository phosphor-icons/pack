"use server";

import { IconStyle } from "@phosphor-icons/core";
import { CACHE, SemVer } from "#/utils/packer";

type StaticSizeRequest = {
  weights: IconStyle[];
  version?: SemVer;
};

export async function computeStaticSize(
  req: StaticSizeRequest,
): Promise<Partial<Record<IconStyle, { font: number; css: number }>>> {
  "use server";

  const sizes = await Promise.all(
    req.weights.map((weight) => CACHE.getAssetSize(weight)),
  );
  return sizes.reduce((acc, curr, i) => {
    acc[req.weights[i]] = curr;
    return acc;
  }, {} as Partial<Record<IconStyle, { font: number; css: number }>>);
}
