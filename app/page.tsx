'use client';

import { RecoilRoot } from 'recoil';
import { Main } from '#/ui/main';

export default function Page() {
  return (
    <RecoilRoot>
        <Main />
    </RecoilRoot>
  );
}
