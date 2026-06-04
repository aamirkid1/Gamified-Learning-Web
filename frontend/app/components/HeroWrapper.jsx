'use client';

import dynamic from 'next/dynamic';

const HeroAnimation = dynamic(() => import('../../components/HeroAnimation'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[85vh] bg-[#2d1a0e] animate-pulse" />
  ),
});

export default function HeroWrapper() {
  return <HeroAnimation />;
}