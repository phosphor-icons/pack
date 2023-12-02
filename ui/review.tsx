'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { IconStyle } from '@phosphor-icons/core';
import { computeStaticSize } from '#/app/api/packer';
import { reviewSelector } from '#/state';
import { Summary } from '#/utils/summary';

export function Review() {
  const selections = useRecoilValue(reviewSelector);
  const [staticSizes, setStaticSizes] = useState<Partial<
    Record<IconStyle, { font: number; css: number }>
  > | null>(null);

  useEffect(() => {
    (async function compute() {
      const res = await computeStaticSize({
        weights: selections.includedWeights,
      });
      setStaticSizes(res);
    })();
  }, [
    selections.includedWeights[0],
    selections.includedWeights[1],
    selections.includedWeights[2],
    selections.includedWeights[3],
    selections.includedWeights[4],
    selections.includedWeights[5],
  ]);

  const statistics = useMemo(() => {
    const staticTotalBytes = !staticSizes
      ? 0
      : Object.values(staticSizes).reduce(
          (acc, curr) => acc + curr.css + curr.font,
          0,
        );

    const savingsInlineBytes = selections.byteEstimates.inline.total
      ? staticTotalBytes - selections.byteEstimates.inline.total
      : 0;
    const savingsExternalBytes = selections.byteEstimates.external.total
      ? staticTotalBytes - selections.byteEstimates.external.total
      : 0;

    return {
      numRegular: selections.glyphCounts.regular ?? 0,
      numThin: selections.glyphCounts.thin ?? 0,
      numLight: selections.glyphCounts.light ?? 0,
      numBold: selections.glyphCounts.bold ?? 0,
      numFill: selections.glyphCounts.fill ?? 0,
      numDuotone: selections.glyphCounts.duotone ?? 0,
      estimateInline: Summary.formatBytes(
        selections.byteEstimates.inline.total ?? 0,
        selections.byteEstimates.inline.total ?? 0 > 1_000_000 ? 2 : 0,
      ),
      estimateExternal: Summary.formatBytes(
        selections.byteEstimates.external.total ?? 0,
        selections.byteEstimates.external.total ?? 0 > 1_000_000 ? 2 : 0,
      ),
      staticTotal: Summary.formatBytes(
        staticTotalBytes,
        staticTotalBytes > 1_000_000 ? 2 : 0,
      ),
      staticTotalBytes,
      savingsInline: Summary.formatBytes(
        savingsInlineBytes,
        Math.abs(savingsInlineBytes) > 1_000_000 ? 2 : 0,
      ),
      savingsInlineBytes,
      savingsExternal: Summary.formatBytes(
        savingsExternalBytes,
        Math.abs(savingsExternalBytes) > 1_000_000 ? 2 : 0,
      ),
      savingsExternalBytes,
    };
  }, [selections, staticSizes]);

  return (
    <div className="px-4 pb-4">
      <h6 className="mb-2 font-bold">Summary</h6>
      <div className="flex flex-wrap gap-8">
        <dl>
          <dt className="text-sm font-bold">Glyphs</dt>
          {statistics.numRegular > 0 ? (
            <dd className="ml-2 text-sm">Regular: {statistics.numRegular}</dd>
          ) : null}
          {statistics.numThin > 0 ? (
            <dd className="ml-2 text-sm">Thin: {statistics.numThin}</dd>
          ) : null}
          {statistics.numLight > 0 ? (
            <dd className="ml-2 text-sm">Light: {statistics.numLight}</dd>
          ) : null}
          {statistics.numBold > 0 ? (
            <dd className="ml-2 text-sm">Bold: {statistics.numBold}</dd>
          ) : null}
          {statistics.numFill > 0 ? (
            <dd className="ml-2 text-sm">Fill: {statistics.numFill}</dd>
          ) : null}
          {statistics.numDuotone > 0 ? (
            <dd className="ml-2 text-sm">Duotone: {statistics.numDuotone}</dd>
          ) : null}
        </dl>

        <dl>
          <dt className="text-sm font-bold">Estimated bundle size</dt>
          <dl className="ml-2">
            <dt className="mt-1.5 text-sm">Inlined fonts</dt>
            <dd className="ml-2 text-sm">Total: {statistics.estimateInline}</dd>
          </dl>
          <dl className="ml-2">
            <dt className="mt-1.5 text-sm">External fonts</dt>
            <dd className="ml-2 text-sm">CSS: {statistics.estimateExternal}</dd>
            <dd className="ml-2 text-sm">TTF: TODO</dd>
          </dl>
        </dl>

        <dl>
          <dt className="text-sm font-bold">Complete font size</dt>
          {staticSizes === null ? null : (
            <dl className="ml-2">
              <dt className="mt-1.5 text-sm">@phosphor-icons/web</dt>
              {Object.entries(staticSizes).map(([weight, sizes]) => (
                <dd key={weight} className="ml-2 text-sm">
                  {[weight.replace(/^\w/, (c) => c.toUpperCase())]}:{' '}
                  {Summary.formatBytes(sizes.font + sizes.css, 0)}
                </dd>
              ))}
              <dd className="ml-2 text-sm">Total: {statistics.staticTotal}</dd>
            </dl>
          )}
        </dl>

        {statistics.staticTotalBytes ? (
          <dl>
            <dt className="text-sm font-bold">Estimated savings</dt>
            <dl className="ml-2">
              <dt className="mt-1.5 text-sm">Inlined fonts</dt>
              <dd className="ml-2 text-sm">
                Total: {statistics.savingsInline} (
                {(
                  (statistics.savingsInlineBytes /
                    statistics.staticTotalBytes) *
                  100
                ).toFixed(0)}
                %)
              </dd>
            </dl>
            <dl className="ml-2">
              <dt className="mt-1.5 text-sm">External fonts</dt>
              <dd className="ml-2 text-sm">
                CSS: {statistics.savingsExternal} (
                {(
                  (statistics.savingsExternalBytes /
                    statistics.staticTotalBytes) *
                  100
                ).toFixed(0)}
                %)
              </dd>
              <dd className="ml-2 text-sm">TTF: TODO</dd>
            </dl>
          </dl>
        ) : null}
      </div>
    </div>
  );
}
