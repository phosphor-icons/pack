"use client";

import { useState, useEffect, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { IconStyle } from "@phosphor-icons/core";

import { computeStaticSize } from "#/app/api/size";
import { reviewSelector } from "#/state";
import { Summary } from "#/utils/summary";
import { Table } from "./table";

import * as styles from "#/styles/review.css";
import * as dlStyles from "#/styles/dl.css";

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
        (selections.byteEstimates.inline.total ?? 0) > 1_000_000 ? 2 : 0,
      ),
      estimateExternal: Summary.formatBytes(
        selections.byteEstimates.external.total ?? 0,
        (selections.byteEstimates.external.total ?? 0) > 1_000_000 ? 2 : 0,
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
    <div className={styles.container}>
      <dl className={dlStyles.dl}>
        <dt className={dlStyles.dt}>Glyphs</dt>
        {statistics.numRegular > 0 ? (
          <dd className={dlStyles.dd}>Regular: {statistics.numRegular}</dd>
        ) : null}
        {statistics.numThin > 0 ? (
          <dd className={dlStyles.dd}>Thin: {statistics.numThin}</dd>
        ) : null}
        {statistics.numLight > 0 ? (
          <dd className={dlStyles.dd}>Light: {statistics.numLight}</dd>
        ) : null}
        {statistics.numBold > 0 ? (
          <dd className={dlStyles.dd}>Bold: {statistics.numBold}</dd>
        ) : null}
        {statistics.numFill > 0 ? (
          <dd className={dlStyles.dd}>Fill: {statistics.numFill}</dd>
        ) : null}
        {statistics.numDuotone > 0 ? (
          <dd className={dlStyles.dd}>Duotone: {statistics.numDuotone}</dd>
        ) : null}
      </dl>

      <Table
        fixed
        headings={[
          { data: "Output" },
          { data: "Est. bundle size" },
          { data: "Est. savings" },
        ]}
      >
        <Table.Row
          cells={[
            { data: "For embedded fonts" },
            {
              data: statistics.staticTotalBytes
                ? statistics.estimateInline
                : "N/A",
            },
            {
              data: statistics.staticTotalBytes
                ? `${statistics.savingsInline} (
              ${(
                (statistics.savingsInlineBytes / statistics.staticTotalBytes) *
                100
              ).toFixed(0)}
              %)`
                : "N/A",
            },
          ]}
        />
        <Table.Row
          cells={[
            { data: "For external fonts" },
            {
              data: statistics.staticTotalBytes
                ? statistics.estimateExternal
                : "N/A",
            },
            {
              data: statistics.staticTotalBytes
                ? `${statistics.savingsExternal} (
              ${(
                (statistics.savingsExternalBytes /
                  statistics.staticTotalBytes) *
                100
              ).toFixed(0)}
              %)`
                : "N/A",
            },
          ]}
        />
        <Table.Row
          cells={[
            { data: "CSS", align: "center" },
            {
              data: statistics.staticTotalBytes
                ? statistics.estimateExternal
                : "N/A",
            },
            {
              data: statistics.staticTotalBytes
                ? `${statistics.savingsExternal} (
              ${(
                (statistics.savingsExternalBytes /
                  statistics.staticTotalBytes) *
                100
              ).toFixed(0)}
              %)`
                : "N/A",
            },
          ]}
        />
        <Table.Row
          cells={[
            { data: "TTF", align: "center" },
            { data: "TODO" },
            { data: "TODO" },
          ]}
        />
      </Table>
    </div>
  );
}
