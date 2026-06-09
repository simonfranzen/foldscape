"use client";

// Landing — the scroll-driven cosmos. The whole page is delegated to
// CosmosScene, which mounts the parallax starfield + nebula backdrop,
// the six per-category constellation scenes, the atlas overview at the
// bottom, and the persistent HUD (compass, search palette, progress).
//
// The list-style "atlas" of v3 lives on inside CosmosScene at the bottom
// of the page (#topic-index) as the reduced-motion + screen-reader path.

import { CosmosScene } from "@/components/cosmos/CosmosScene";

export default function Landing() {
  return <CosmosScene />;
}
