"use client";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { FontEditor } from "fonteditor-core";
import { IconStyle } from "@phosphor-icons/core";

import { generateFont } from "#/app/api/packer";
import { configurationAtom, cssAtom, selectionAtom } from "#/state";
import { Button } from "./button";

export const Generator = () => {
  const css = useRecoilValue(cssAtom);

  return (
    <div>
      <textarea
        readOnly
        value={css}
        className="w-full leading-snug"
        style={{ fontFamily: "monospace", fontSize: 12 }}
      />
    </div>
  );
};

export const GeneratorActions = () => {
  const selections = useRecoilValue(selectionAtom);
  const { ttf, otf, woff2, woff, eot, svg, output } =
    useRecoilValue(configurationAtom);
  const setCss = useSetRecoilState(cssAtom);

  async function requestSubfont() {
    const icons = Object.entries(selections).reduce<
      Partial<Record<IconStyle, string[]>>
    >((acc, [weight, names]) => {
      acc[weight as IconStyle] = Array.from(names);
      return acc;
    }, {});
    const res = await generateFont({
      icons,
      formats: Object.entries({ ttf, otf, woff2, woff, eot, svg })
        .filter(([_, v]) => v)
        .map(([k]) => k as FontEditor.FontType),
      inline: output === "inline",
    });
    setCss(res);
  }

  return <Button onClick={requestSubfont}>Generate</Button>;
};
