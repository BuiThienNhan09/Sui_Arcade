'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ParallaxContainer, { useParallax } from '@/components/ParallaxContainer';
import BackgroundLayer from '@/components/BackgroundLayer';
import ScrollSection from '@/components/ScrollSection';
import ScrollHint from '@/components/ScrollHint';
import HomeLayer from '@/components/layers/HomeLayer';
import GameSelectionLayer from '@/components/layers/GameSelectionLayer';
import FollowUsLayer from '@/components/layers/FollowUsLayer';

function SectionNavigator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { scrollToSection } = useParallax();

  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      const sectionIndex = parseInt(section);
      if (!isNaN(sectionIndex) && sectionIndex >= 0 && sectionIndex <= 2) {
        // Small delay to ensure component is mounted
        setTimeout(() => {
          scrollToSection(sectionIndex);
          // Clear the URL parameter after scrolling
          router.replace('/', { scroll: false });
        }, 150);
      }
    }
  }, [searchParams, scrollToSection, router]);

  return null;
}

function HomeContent() {
  return (
    <>
      {/* Handle URL section parameter */}
      <Suspense fallback={null}>
        <SectionNavigator />
      </Suspense>

      {/* SECTION 0: HOME */}
      <ScrollSection index={0}>
        <HomeLayer />
        <ScrollHint text="Select Game" direction="down" />
      </ScrollSection>

      {/* SECTION 1: GAME SELECTION */}
      <ScrollSection index={1}>
        <GameSelectionLayer />
        <ScrollHint text="Follow Us" direction="down" />
      </ScrollSection>

      {/* SECTION 2: FOLLOW US */}
      <ScrollSection index={2}>
        <FollowUsLayer />
        <ScrollHint text="Go Back" direction="up" />
      </ScrollSection>
    </>
  );
}

export default function Home() {
  return (
    <>
      {/* Static Background - Always visible */}
      <BackgroundLayer />

      {/* Animated Content Sections */}
      <ParallaxContainer>
        <HomeContent />
      </ParallaxContainer>
    </>
  );
}
