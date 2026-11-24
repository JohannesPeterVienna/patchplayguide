// Order = order on the guides index and home page within each group.
import { graphicsSettings, frameGen, upscalers } from './pc-basics.mjs';
import { shaderStutter, bottleneck, vram } from './pc-problems.mjs';
import { rayTracing, frameCap, fpsFrameTime } from './pc-advanced.mjs';
import { testChange, readPatchNotes } from './testing.mjs';
import { ps5Modes, xbox } from './consoles.mjs';
import { switch2, steamDeck, vrrConsole } from './handheld-display.mjs';

export const GUIDES = [
  graphicsSettings, frameGen, upscalers, shaderStutter, bottleneck, vram, rayTracing, frameCap, fpsFrameTime,
  readPatchNotes, testChange,
  ps5Modes, xbox, switch2, steamDeck, vrrConsole
];

// "Read next" since the November 18, 2026 revision: the matching tool first, then two guides.
const RELATED = {
  'graphics-settings-explained': ['settings-translator', 'upscaler-resolution-calculator', 'cpu-or-gpu-bottleneck'],
  'frame-generation-explained': ['frame-time-calculator', 'setting-names', 'frame-cap-vsync-latency-pc'],
  'dlss-vs-fsr-vs-xess': ['upscaler-resolution-calculator', 'setting-names', 'frame-generation-explained'],
  'shader-compilation-stutter-after-update': ['settings-test-log', 'how-to-test-a-settings-change', 'fps-frame-time-1-percent-lows'],
  'cpu-or-gpu-bottleneck': ['bottleneck-finder', 'settings-translator', 'graphics-settings-explained'],
  'vram-full-what-to-lower': ['settings-translator', 'frame-generation-explained', 'ray-tracing-settings-explained'],
  'ray-tracing-settings-explained': ['upscaler-resolution-calculator', 'vram-full-what-to-lower', 'dlss-vs-fsr-vs-xess'],
  'frame-cap-vsync-latency-pc': ['frame-time-calculator', 'vrr-120hz-console-setup', 'frame-generation-explained'],
  'fps-frame-time-1-percent-lows': ['frame-time-calculator', 'settings-test-log', 'how-to-test-a-settings-change'],
  'how-to-read-patch-notes': ['patch-decoder', 'setting-names', 'how-to-test-a-settings-change'],
  'ps5-performance-vs-fidelity-mode': ['console-upgrades', 'frame-time-calculator', 'vrr-120hz-console-setup'],
  'xbox-series-s-vs-x-modes': ['frame-time-calculator', 'vrr-120hz-console-setup', 'ps5-performance-vs-fidelity-mode'],
  'switch-2-docked-vs-handheld': ['console-upgrades', 'frame-time-calculator', 'vrr-120hz-console-setup'],
  'steam-deck-frame-cap-tdp-battery': ['upscaler-resolution-calculator', 'frame-time-calculator', 'switch-2-docked-vs-handheld'],
  'vrr-120hz-console-setup': ['frame-time-calculator', 'setting-names', 'ps5-performance-vs-fidelity-mode']
};
for (const g of GUIDES) if (RELATED[g.slug]) g.related = RELATED[g.slug];
