"use client";

import { Steps } from "./step";
import { Selector, SelectorActions } from "./selector";
import { Configurator } from "./configurator";
import { Review } from "./review";
import { Generator, GeneratorActions } from "./generator";
import * as styles from "#/styles/global.css";
import pkg from "package.json";

const PHOSPHOR_VERSION = pkg.dependencies["@phosphor-icons/web"].replaceAll(
  /[<>~*=^]/g,
  "",
);

export const Main = () => {
  return (
    <Steps
      steps={[
        {
          title: "Select icons",
          actions: <SelectorActions />,
          chilren: <Selector />,
        },
        {
          title: "Configure font",
          actions: (
            <span>
              based on{" "}
              <a
                className={styles.link}
                href="https://github.com/phosphor-icons/web"
              >
                @phosphor-icons/web
              </a>{" "}
              <span className={styles.version}>v{PHOSPHOR_VERSION}</span>
            </span>
          ),
          chilren: <Configurator />,
        },
        {
          title: "Review font",
          chilren: <Review />,
        },

        {
          title: "Generate",
          actions: <GeneratorActions />,
          chilren: <Generator />,
        },
      ]}
    />
  );

  // return (
  //   <ol className="flex flex-col gap-4">

  //     <li className="bg-white shadow-lg shadow-black/20">
  //       <h2 className="p-4">Review font</h2>
  //       <Review />
  //     </li>
  //     <li className="bg-white shadow-lg shadow-black/20">
  //       <h2 className="p-4">Configure font</h2>
  //       <Configurator />
  //     </li>
  //   </ol>
  // );
};
