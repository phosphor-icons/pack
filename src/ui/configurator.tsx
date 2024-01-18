import { useRecoilState } from "recoil";

import { configurationAtom } from "@/state";
import * as styles from "@/styles/configurator.css";
import * as fsStyles from "@/styles/fieldset.css";

export function Configurator() {
  const [{ woff, ttf, otf, woff2, eot, svg, output }, setConfiguration] =
    useRecoilState(configurationAtom);

  return (
    <form className={styles.container}>
      <fieldset name="formats" className={fsStyles.fieldset}>
        <legend className={fsStyles.legend}>Formats</legend>
        <div className={fsStyles.items}>
          <label className="">
            <input
              type="checkbox"
              name="woff"
              checked={woff}
              onChange={() => setConfiguration((c) => ({ ...c, woff: !woff }))}
            />
            <span>woff</span>
          </label>

          <label className="">
            <input
              type="checkbox"
              name="ttf"
              checked={ttf}
              onChange={() => setConfiguration((c) => ({ ...c, ttf: !ttf }))}
            />
            <span>ttf</span>
          </label>

          <s>
            <label className="">
              <input
                disabled
                type="checkbox"
                name="woff2"
                checked={woff2}
                onChange={() =>
                  setConfiguration((c) => ({ ...c, woff2: !woff2 }))
                }
              />
              <span>woff2</span>
            </label>
          </s>

          {false && (
            <>
              <s>
                <label className="">
                  <input
                    disabled
                    type="checkbox"
                    name="otf"
                    checked={otf}
                    onChange={() =>
                      setConfiguration((c) => ({ ...c, otf: !otf }))
                    }
                  />
                  <span>otf</span>
                </label>
              </s>
              <s>
                <label className="">
                  <input
                    disabled
                    type="checkbox"
                    name="eot"
                    checked={eot}
                    onChange={() =>
                      setConfiguration((c) => ({ ...c, eot: !eot }))
                    }
                  />
                  <span>eot</span>
                </label>
              </s>
              <s>
                <label className="">
                  <input
                    disabled
                    type="checkbox"
                    name="svg"
                    checked={svg}
                    onChange={() =>
                      setConfiguration((c) => ({ ...c, svg: !svg }))
                    }
                  />
                  <span>svg</span>
                </label>
              </s>
            </>
          )}
        </div>
      </fieldset>

      <fieldset
        name="output"
        className={fsStyles.fieldset}
        onChange={(e) =>
          setConfiguration((c) => ({
            ...c,
            output: (e.target as HTMLInputElement).value as
              | "inline"
              | "preferred"
              | "external",
          }))
        }
      >
        <legend className={fsStyles.legend}>Output</legend>
        <div className={fsStyles.items}>
          <label className="">
            <input
              type="radio"
              name="output"
              value="inline"
              defaultChecked={output === "inline"}
            />
            <span>CSS with inlined font(s)</span>
          </label>

          <label className="">
            <input
              type="radio"
              name="output"
              value="external"
              defaultChecked={output === "external"}
            />
            <span>CSS and external font(s)</span>
          </label>

          <label className="">
            <input
              type="radio"
              name="output"
              value="preferred"
              defaultChecked={output === "preferred"}
            />
            <span>Font(s) only</span>
          </label>
        </div>
      </fieldset>

      {false && (
        <fieldset name="version" className={fsStyles.fieldset}>
          <legend className={fsStyles.legend}>Version</legend>
          <div className={fsStyles.items}>
            <select disabled defaultValue="2.0.3" className="self-start">
              <option value="2.0.3">2.0.3</option>
            </select>
          </div>
        </fieldset>
      )}
    </form>
  );
}
