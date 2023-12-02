'use client';

import { useRef, useState, useEffect } from 'react';
import { SetterOrUpdater } from 'recoil';
import { IconEntry, IconStyle } from '@phosphor-icons/core';
import clsx from 'clsx';
import Selecto from './selecto';

type SelectorProps = {
  weight: IconStyle;
  entries: ReadonlyArray<IconEntry>;
  selections: Partial<Record<IconStyle, Set<string>>>;
  onSelect: SetterOrUpdater<Partial<Record<IconStyle, Set<string>>>>;
};

export const Selector = (props: SelectorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectoRef = useRef<Selecto>(null);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div
      ref={containerRef}
      className="cursor-crosshair overflow-y-auto p-3"
      style={{ height: 396 }}
    >
      <Selecto
        ref={selectoRef}
        dragContainer={containerRef.current!}
        selectableTargets={['#selecto1 .icon']}
        onDragStart={(e) => {
          if (e.inputEvent.target.nodeName === 'BUTTON') {
            return false;
          }
          return true;
        }}
        onSelect={(e) => {
          const selections = new Set(e.selected.map((el) => el.id));
          props.onSelect((s) => ({ ...s, [props.weight]: selections }));
        }}
        onScroll={({ direction }) => {
          containerRef.current!.scrollBy(direction[0] * 10, direction[1] * 10);
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
      <div id="selecto1" className="flex flex-wrap justify-items-center gap-3">
        {props.entries.map((entry) => (
          <i
            id={entry.name}
            key={entry.name}
            title={entry.name}
            className={clsx(
              `icon rounded-md p-1 text-3xl ph${
                props.weight === 'regular' ? '' : `-${props.weight}`
              } ph-${entry.name}`,
              {
                'bg-backpack-pink': props.selections[props.weight]?.has(
                  entry.name,
                ),
              },
            )}
          />
        ))}
      </div>
    </div>
  );
};
