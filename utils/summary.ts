import { IconWeight } from '@phosphor-icons/react';

type EstimateProperty = `${IconWeight}ByteEstimate`;

export class Summary {
  constructor(_: never) {}

  static fontFaceCss = 130;

  static formatBytes(
    bytes: number,
    decimals: number = 2,
    format: 'binary' | 'decimal' = 'decimal',
  ) {
    if (!+bytes) return '0 Bytes';

    const k = format === 'decimal' ? 1000 : 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes =
      format === 'decimal'
        ? ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  static estimateSize(
    icons: Partial<Record<IconWeight, number>>,
    inline?: boolean,
    formats?: number,
  ): {
    byteEstimates: Partial<Record<IconWeight | 'total', number>>;
  } {
    const byteEstimates = Object.entries(icons).reduce<
      Partial<Record<IconWeight, number>>
    >((acc, [weight, count]) => {
      switch (weight) {
        case 'fill':
          acc[weight] = Summary.estimateCSSSizeFill(count, inline, formats);
          break;
        case 'duotone':
          acc[weight] = Summary.estimateCSSSizeDuotone(count, inline, formats);
          break;
        default:
          acc[weight as IconWeight] = Summary.estimateCSSSizeStandard(
            count,
            inline,
            formats,
          );
          break;
      }
      return acc;
    }, {});

    return {
      byteEstimates: {
        ...byteEstimates,
        total: Object.values(byteEstimates).reduce(
          (acc, curr) => acc + curr,
          Summary.fontFaceCss,
        ),
      },
    };
  }

  static estimateCSSSizeStandard(
    count: number,
    inline?: boolean,
    formats: number = 1,
  ) {
    const cssOther = 504 - 130;
    const cssPerIcon = 55;
    const cssPerFormat = 55;
    const ttfBase = 2380 + 50;
    const ttfPerIcon = 420;

    if (count === 0) return 0;

    return (
      cssPerIcon * count +
      (inline ? ttfBase + ttfPerIcon * count : cssPerFormat * formats) +
      cssOther
    );
  }

  static estimateCSSSizeFill(
    count: number,
    inline?: boolean,
    formats: number = 1,
  ) {
    const cssOther = 524 - 130;
    const cssPerIcon = 60;
    const cssPerFormat = 55;
    const ttfBase = 2370 + 50;
    const ttfPerIcon = 340;

    if (count === 0) return 0;

    return (
      cssPerIcon * count +
      (inline ? ttfBase + ttfPerIcon * count : cssPerFormat * formats) +
      cssOther
    );
  }

  static estimateCSSSizeDuotone(
    count: number,
    inline?: boolean,
    formats: number = 1,
  ) {
    const cssOther = 530 - 130;
    const cssPerIcon = 170;
    const cssPerFormat = 60;
    const ttfBase = 1960 + 50;
    const ttfPerIcon = 517;

    if (count === 0) return 0;

    return (
      cssPerIcon * count +
      (inline ? ttfBase + ttfPerIcon * count : cssPerFormat * formats) +
      cssOther
    );
  }
}
