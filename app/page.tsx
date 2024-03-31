"use client";

import Script from "next/script";
import { RecoilRoot } from "recoil";
import { Main } from "#/ui/main";

export default function Page() {
  return (
    <RecoilRoot>
      <Script src="https://unpkg.com/@phosphor-icons/web@2.1.1" />
      <Main />
    </RecoilRoot>
  );
}
