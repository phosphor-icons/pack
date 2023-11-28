'use client';

import { useRef, useState, useEffect } from 'react';
import { IconEntry, SelectionEntry } from '#/types';
import Selecto from './selecto';

type SelectorProps = {
  entries: ReadonlyArray<IconEntry>;
  onSelect: (entries: SelectionEntry[]) => void;
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
      className="overflow-y-auto p-3 cursor-crosshair"
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
          e.added.forEach((el) => {
            el.classList.add('bg-backpack-pink');
          });
          e.removed.forEach((el) => {
            el.classList.remove('bg-backpack-pink');
          });

          const selections = e.selected.map<SelectionEntry>((el) => ({
            name: el.id,
            weight: 'regular',
          }));
          props.onSelect(selections);
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
        innerScrollOptions={true}
        hitRate={0}
        selectByClick={true}
        selectFromInside={false}
        toggleContinueSelect={['shift']}
        ratio={0}
      />
      <div id="selecto1" className="flex flex-wrap justify-items-center gap-4">
        {props.entries.map((entry) => (
          <entry.Icon
            className="icon"
            key={entry.name}
            id={entry.name}
            alt={entry.name}
            size={32}
          />
        ))}
      </div>
    </div>
  );
};
