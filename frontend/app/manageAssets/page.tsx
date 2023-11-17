'use client';

import { FooterCentered } from '@/components/Footer/FooterCentered';
import { HeaderMegaMenu } from '@/components/Header/HeaderMegaMenu';

export default function HomePage() {
  return (
    <>
      <HeaderMegaMenu />
      <h1>Manage assets</h1>
      <FooterCentered />
    </>
  );
}
