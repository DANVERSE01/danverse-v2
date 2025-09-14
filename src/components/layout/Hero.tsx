'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the 3D component to avoid SSR issues
const HeroGalaxy = dynamic(() => import('../3d/HeroGalaxy'), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto mb-8"></div>
        <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          DANVERSE
        </h1>
        <p className="text-2xl text-gray-300">Loading Digital Universe...</p>
      </div>
    </div>
  )
});

interface HeroProps {
  locale: string;
}

export default function Hero({ locale }: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <Suspense fallback={
        <div className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto mb-8"></div>
            <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              DANVERSE
            </h1>
            <p className="text-2xl text-gray-300">Loading Digital Universe...</p>
          </div>
        </div>
      }>
        <HeroGalaxy />
      </Suspense>
    </section>
  );
}

