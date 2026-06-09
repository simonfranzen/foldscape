// Scene metadata for the scroll-driven cosmos. Each category gets one scene;
// the order here is the *vertical* order of the page (paradox up top, analysis
// at the bottom — see SCENE_ORDER in layout.ts). The i18n key picks copy out
// of lib/i18n/cosmos.ts at render time.

import type { TopicCategory } from "@/lib/topics";
import { SCENE_ORDER } from "@/lib/cosmos/layout";

export interface SceneMeta {
  category: TopicCategory;
  index: number;
}

export const SCENES: SceneMeta[] = SCENE_ORDER.map((category, index) => ({
  category,
  index,
}));
