'use client';

import { Welcome } from '../components/Welcome/Welcome';
import { HeaderMegaMenu } from '@/components/Header/HeaderMegaMenu';
import { FooterCentered } from '@/components/Footer/FooterCentered';
import { InitialButtons } from '@/components/InitialButtons/InitialButtons';

export default function HomePage() {
  return (
    <>
      <HeaderMegaMenu />
      <Welcome />
      <InitialButtons />
      <FooterCentered />
    </>
  );
}
