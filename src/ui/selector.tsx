import { useRef, useState, useEffect } from "react";
import {
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
  useResetRecoilState,
} from "recoil";
import { IconStyle } from "@phosphor-icons/core";
import clsx from "clsx";

import {
  filteredQueryResultsSelector,
  reviewSelector,
  searchQueryAtom,
  selectionAtom,
  weightAtom,
  nonceAtom,
} from "@/state";
import * as styles from "@/styles/selector.css";
import Selecto from "./selecto";
import { Button } from "./button";
import { Search } from "./search";

export const Selector = () => {
  const nonce = useRecoilValue(nonceAtom);
  const [weight, setWeight] = useRecoilState(weightAtom);
  const { glyphCounts } = useRecoilValue(reviewSelector);
  const entries = useRecoilValue(filteredQueryResultsSelector);
  const [selections, setSelection] = useRecoilState(selectionAtom);

  const containerRef = useRef<HTMLDivElement>(null);
  const selectoRef = useRef<Selecto>(null);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    const selectAllHandler = (e: KeyboardEvent) => {
      if ((e.target as Element)?.nodeName === "INPUT") return;
      if (e.ctrlKey && e.key === "a") {
        e.preventDefault();
        setSelection((s) => ({
          ...s,
          [weight]: new Set(entries.map((ent) => ent.name)),
        }));
      }
    };
    window.addEventListener("keydown", selectAllHandler);
    return () => window.removeEventListener("keydown", selectAllHandler);
  }, [entries, weight]);

  if (!isMounted) return null;

  return (
    <div className={styles.container}>
      <div className={styles.weightList}>
        <Button
          text
          active={weight === IconStyle.REGULAR}
          onClick={() => setWeight(IconStyle.REGULAR)}
        >
          Regular
          {glyphCounts.regular ? (
            <span className={styles.weightCount}>{glyphCounts.regular}</span>
          ) : null}
        </Button>
        <Button
          text
          active={weight === IconStyle.THIN}
          onClick={() => setWeight(IconStyle.THIN)}
        >
          Thin{" "}
          {glyphCounts.thin ? (
            <span className={styles.weightCount}>{glyphCounts.thin}</span>
          ) : null}
        </Button>
        <Button
          text
          active={weight === IconStyle.LIGHT}
          onClick={() => setWeight(IconStyle.LIGHT)}
        >
          Light{" "}
          {glyphCounts.light ? (
            <span className={styles.weightCount}>{glyphCounts.light}</span>
          ) : null}
        </Button>
        <Button
          text
          active={weight === IconStyle.BOLD}
          onClick={() => setWeight(IconStyle.BOLD)}
        >
          Bold{" "}
          {glyphCounts.bold ? (
            <span className={styles.weightCount}>{glyphCounts.bold}</span>
          ) : null}
        </Button>
        <Button
          text
          active={weight === IconStyle.FILL}
          onClick={() => setWeight(IconStyle.FILL)}
        >
          Fill{" "}
          {glyphCounts.fill ? (
            <span className={styles.weightCount}>{glyphCounts.fill}</span>
          ) : null}
        </Button>
        <Button
          text
          active={weight === IconStyle.DUOTONE}
          onClick={() => setWeight(IconStyle.DUOTONE)}
        >
          Duotone{" "}
          {glyphCounts.duotone ? (
            <span className={styles.weightCount}>{glyphCounts.duotone}</span>
          ) : null}
        </Button>
      </div>
      <div
        ref={containerRef}
        className={styles.selectionArea}
        style={{ height: 396 }}
        // onMouseDown={(e) => {
        //   const rect = (e.target as Element).getBoundingClientRect?.();
        //   if (rect) {
        //     if (e.nativeEvent.clientX > rect.left + 680) {
        //       e.nativeEvent.stopPropagation();
        //       e.preventDefault();
        //       e.nativeEvent.preventDefault();
        //       console.log("YEAH");
        //     }
        //   }
        // }}
      >
        <Selecto
          key={weight + nonce}
          ref={selectoRef}
          dragContainer={containerRef.current!}
          selectableTargets={["#selecto1 .icon"]}
          onDragStart={(e) => {
            if (e.inputEvent.target.nodeName === "BUTTON") {
              return false;
            }
            return true;
          }}
          onSelect={(e) => {
            const added = e.added.map((el) => el.id);
            const removed = e.removed.map((el) => el.id);
            setSelection((s) => {
              let current = s[weight] ?? new Set();
              for (const id of added) {
                current.add(id);
              }
              for (const id of removed) {
                current.delete(id);
              }
              return { ...s, [weight]: current };
            });
          }}
          onScroll={({ direction }) => {
            containerRef.current!.scrollBy(
              direction[0] * 10,
              direction[1] * 10,
            );
          }}
          onInnerScroll={({ container, direction }) => {
            container.scrollBy(direction[0] * 10, direction[1] * 10);
          }}
          scrollOptions={{
            container: containerRef,
            getScrollPosition: () => {
              return [
                containerRef.current!.scrollLeft,
                containerRef.current!.scrollTop,
              ];
            },
            throttleTime: 30,
            threshold: 0,
          }}
          innerScrollOptions
          selectByClick
          selectFromInside
          toggleContinueSelect="shift"
          toggleContinueSelectWithoutDeselect="ctrl"
          continueSelect
          continueSelectWithoutDeselect
          hitRate={0}
          ratio={0}
        />
        <div
          id="selecto1"
          className={styles.grid}
          onKeyDown={(e) => {
            console.log(e);
            e.preventDefault();
            if (e.ctrlKey && e.key === "a") {
            }
          }}
        >
          {entries.map((entry) => (
            <i
              id={entry.name}
              key={entry.name}
              title={entry.name}
              className={clsx(
                `icon ${styles.icon} ph${
                  weight === "regular" ? "" : `-${weight}`
                } ph-${entry.name}`,
                {
                  [styles.selection]: selections[weight]?.has(entry.name),
                },
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const SelectorActions = () => {
  const [query, setQuery] = useRecoilState(searchQueryAtom);
  const weight = useRecoilValue(weightAtom);
  const setSelection = useSetRecoilState(selectionAtom);
  const clearAll = useResetRecoilState(selectionAtom);
  const setNonce = useSetRecoilState(nonceAtom);

  return (
    <div className={styles.selectionActions}>
      <Search
        placeholder="Search icons and categories"
        adornment={<i className="ph ph-magnifying-glass"></i>}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <Button
        text
        link
        className={styles.weightButton}
        onClick={() => {
          setSelection((s) => ({ ...s, [weight]: new Set() }));
          setNonce((n) => n + 1);
        }}
      >
        Clear
      </Button>

      <Button
        text
        link
        className={styles.weightButton}
        onClick={() => {
          clearAll();
          setNonce((n) => n + 1);
        }}
      >
        Clear all
      </Button>
    </div>
  );
};
