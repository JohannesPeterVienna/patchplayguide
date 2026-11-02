// Order = order on the guides index and home page within each group.
import { graphicsSettings, frameGen, upscalers } from './pc-basics.mjs';
import { shaderStutter, bottleneck, vram } from './pc-problems.mjs';
import { rayTracing, frameCap, fpsFrameTime } from './pc-advanced.mjs';
import { testChange, readPatchNotes, retest } from './testing.mjs';
import { ps5Modes, ps5Pro, xbox } from './consoles.mjs';
import { switch2, steamDeck, vrrConsole } from './handheld-display.mjs';

export const GUIDES = [
  graphicsSettings, frameGen, upscalers, shaderStutter, bottleneck, vram, rayTracing, frameCap, fpsFrameTime,
  readPatchNotes, retest, testChange,
  ps5Modes, ps5Pro, xbox, switch2, steamDeck, vrrConsole
];
