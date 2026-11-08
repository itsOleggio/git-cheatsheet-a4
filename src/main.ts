import './styles/tokens.css';
import './styles/base.css';
import './styles/sheet.css';
import './styles/sheet1.css';
import './styles/sheet2.css';
import './styles/print.css';

import { COMMIT_HISTORY } from './data/commits';
import { SECTIONS } from './data/commands';
import { DESCRIPTIONS } from './data/descriptions';
import { initCopy } from './features/clipboard';
import { initFilter } from './features/filter';
import { initTooltip } from './features/tooltip';
import { renderBranchGraph } from './render/branchGraph';
import { renderCommitLog } from './render/commitLog';
import { createCommandLookup, renderSections } from './render/sections';
import { renderSheet1 } from './render/sheet1';
import { renderSheet2 } from './render/sheet2';
import { initTitleAlign } from './render/titleAlign';
import { byId } from './utils/dom';

renderSheet1(byId('sheet', HTMLElement));
renderSheet2(byId('sheet2', HTMLElement));

const graphRoot = byId('graph', SVGSVGElement);
const graph = renderBranchGraph(graphRoot);
initTitleAlign({
  title: byId('ttl', HTMLElement),
  middleLine: byId('ttl-mid', HTMLElement),
  graph: graphRoot,
});

const grid = byId('grid', HTMLElement);
const sections = renderSections(grid, SECTIONS, graph);
const lookup = createCommandLookup(sections);

const log = byId('log', SVGSVGElement);
renderCommitLog(log, COMMIT_HISTORY);

initTooltip(grid, byId('tip', HTMLElement), lookup, DESCRIPTIONS);
initCopy({
  grid,
  log,
  fullMessage: byId('fullmsg', HTMLElement),
  toast: byId('toast', HTMLElement),
  lookup,
});
initFilter(sections, byId('q', HTMLInputElement), [
  ...document.querySelectorAll<HTMLButtonElement>('.seg button'),
]);
