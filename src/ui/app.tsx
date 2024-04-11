import { Suspense } from "react";
import { Steps } from "./step";
import { Selector, SelectorActions } from "./selector";
import { Configurator } from "./configurator";
import { Review } from "./review";
import { Generator, GeneratorActions } from "./generator";
// import { Demo } from "./demo";
import * as styles from "../styles/app.css";
import * as globalStyles from "../styles/global.css";
import pkg from "../../package.json";

const PHOSPHOR_VERSION = pkg.dependencies["@phosphor-icons/web"];

export const App = () => {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <h1 className={styles.name}>Phosphor Backpack</h1>
          <i className={`${styles.icon} ph-light ph-backpack`} />
        </div>
        <p className={styles.slug}>
          Take only the glyphs you need and save majorly on file size
        </p>
      </div>

      <Steps
        steps={[
          {
            title: "Select icons",
            actions: <SelectorActions />,
            chilren: <Suspense fallback={null}><Selector /></Suspense>,
          },

          {
            title: "Configure font",
            actions: (
              <span>
                based on{" "}
                <a
                  className={globalStyles.link}
                  href="https://github.com/phosphor-icons/web"
                >
                  @phosphor-icons/web
                </a>{" "}
                <span className={globalStyles.version}>
                  v{PHOSPHOR_VERSION}
                </span>
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

          // {
          //   title: "Demo",
          //   chilren: <Demo />,
          // },
        ]}
      />
    </main>
  );
};
