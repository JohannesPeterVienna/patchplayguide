// Order = order on the tools hub and on the home page.
import resolution from './upscaler-resolution-calculator.mjs';
import frametime from './frame-time-calculator.mjs';
import testlog from './settings-test-log.mjs';
import finder from './bottleneck-finder.mjs';
import translator from './settings-translator.mjs';
import decoder from './patch-decoder.mjs';
import names from './setting-names.mjs';
import upgrades from './console-upgrades.mjs';
export const TOOLS = [resolution, frametime, testlog, finder, translator, decoder];
export const REFERENCES = [names, upgrades];
