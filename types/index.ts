import { Icon, IconWeight } from '@phosphor-icons/react';
import { IconEntry as CoreEntry } from '@phosphor-icons/core';

export interface IconEntry extends CoreEntry {
  Icon: Icon;
}

export type SelectionEntry = {
  name: string;
  weight: IconWeight;
};
