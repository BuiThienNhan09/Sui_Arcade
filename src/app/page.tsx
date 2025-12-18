'use client';

import ParallaxContainer from '@/components/ParallaxContainer';
import BackgroundLayer from '@/components/BackgroundLayer';
import ScrollSection from '@/components/ScrollSection';
import ScrollHint from '@/components/ScrollHint';
import HomeLayer from '@/components/layers/HomeLayer';
import GameSelectionLayer from '@/components/layers/GameSelectionLayer';
import FollowUsLayer from '@/components/layers/FollowUsLayer';

export default function Home() {
  return (
    <>
      {/* Static Background - Always visible */}
      <BackgroundLayer />

      {/* Animated Content Sections */}
      <ParallaxContainer>
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
      </ParallaxContainer>
    </>
  );
}
