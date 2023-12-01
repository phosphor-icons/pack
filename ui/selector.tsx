'use client';

import { useRef, useState, useEffect } from 'react';
import { SetterOrUpdater } from 'recoil';
import { IconWeight } from '@phosphor-icons/react';
import clsx from 'clsx';
import { IconEntry, SelectionEntry } from '#/types';
import Selecto from './selecto';

type SelectorProps = {
  weight: IconWeight;
  entries: ReadonlyArray<IconEntry>;
  selections: Partial<Record<IconWeight, Set<string>>>;
  onSelect: SetterOrUpdater<Partial<Record<IconWeight, Set<string>>>>;
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
          e.added.forEach((el) => {
            el.classList.add('bg-backpack-pink');
          });
          e.removed.forEach((el) => {
            el.classList.remove('bg-backpack-pink');
          });

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
        innerScrollOptions={true}
        hitRate={0}
        selectByClick={true}
        selectFromInside={false}
        toggleContinueSelect={['shift']}
        ratio={0}
      />
      <div id="selecto1" className="flex flex-wrap justify-items-center gap-3">
        {props.entries.map((entry) => (
          <entry.Icon
            className={clsx('icon rounded-md p-1', {
              'bg-backpack-pink': props.selections[props.weight]?.has(
                entry.name,
              ),
            })}
            weight={props.weight}
            key={entry.name}
            id={entry.name}
            alt={entry.name}
            size={40}
          />
        ))}
      </div>
    </div>
  );
};
