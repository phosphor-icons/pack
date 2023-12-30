"use client";

import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { IconStyle } from "@phosphor-icons/core";

import {
  filteredQueryResultsSelector,
  reviewSelector,
  searchQueryAtom,
  selectionAtom,
} from "#/state";
import { Steps } from "./step";
import { Selector, SelectorActions } from "./selector";
import { Configurator } from "./configurator";
import { Review } from "./review";
import { Generator, GeneratorActions } from "./generator";

export const Main = () => {
  const [query, setQuery] = useRecoilState(searchQueryAtom);
  const [weight, setWeight] = useState<IconStyle>(IconStyle.REGULAR);
  const { glyphCounts } = useRecoilValue(reviewSelector);
  const entries = useRecoilValue(filteredQueryResultsSelector);
  const [selections, setSelection] = useRecoilState(selectionAtom);

  return (
    <Steps
      key={weight}
      steps={[
        {
          title: "Select icons",
          actions: <SelectorActions />,
          chilren: <Selector />,
        },
        {
          title: "Review font",
          chilren: <Review />,
        },
        {
          title: "Configure font",
          actions: "Phosphor version 2.1.0",
          chilren: <Configurator />,
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
