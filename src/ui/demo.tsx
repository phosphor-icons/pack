import { CSSProperties } from "react";
import { Random } from "kdim";
import { selector, useRecoilValue } from "recoil";

import { selectionAtom, requestStateAtom } from "@/state";
import * as styles from "@/styles/demo.css";
import { vars } from "@/styles/global.css";

const randomAssortment = selector<string[]>({
  key: "randomAssortment",
  get: ({ get, getCallback }) => {
    const selection = get(selectionAtom);
    const classes = Object.entries(selection)
      .map(([weight, nameset]) => {
        const wt = weight === "regular" ? "" : `-${weight}`;
        const names = [...nameset];
        return names.map((name) => `ph${wt} ph-${name}`);
      })
      .flat();
    Random.permute(classes);
    return classes;
  },
});

function randomStyle(): CSSProperties {
  return {
    fontSize: Random.integer({ min: 16, max: 48 }),
    color: Random.sample(Object.values(vars.colors)),
    // color: `rgb(${Random.u8()}, ${Random.u8()}, ${Random.u8()})`,
  };
}

export const Demo = () => {
  const assortment = useRecoilValue(randomAssortment);
  return (
    <div className={styles.container}>
      {assortment.map((clazz) => (
        <div key={clazz} className={styles.example}>
          <i className={clazz} style={randomStyle()} />
        </div>
      ))}
    </div>
  );
};
