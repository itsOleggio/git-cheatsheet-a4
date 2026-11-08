/* eslint-disable */
// @ts-nocheck
import {initFilter} from './features/filter';
import {initCopy} from './features/clipboard';
import {initTooltip} from './features/tooltip';
import {COMMIT_HISTORY} from './data/commits';
import {renderCommitLog} from './render/commitLog';
import {createCommandLookup,renderSections} from './render/sections';
import {initTitleAlign} from './render/titleAlign';
import {svg as el} from './utils/dom';
import {renderBranchGraph} from './render/branchGraph';
import {LANE_COLORS as LANES,SECTIONS as S} from './data/commands';
import {DESCRIPTIONS as LONG} from './data/descriptions';
import './styles/tokens.css';
import './styles/base.css';
import './styles/sheet.css';
import './styles/sheet1.css';
import './styles/sheet2.css';
import './styles/print.css';

const G=document.getElementById("graph");
const graph=renderBranchGraph(G);

initTitleAlign({title:document.getElementById("ttl"),middleLine:document.getElementById("ttl-mid"),graph:G});

const grid=document.getElementById("grid");
const rendered=renderSections(grid,S,graph);
const lookup=createCommandLookup(rendered);

initTooltip(grid,document.getElementById("tip"),lookup,LONG);



renderCommitLog(document.getElementById("log"),COMMIT_HISTORY);

initCopy({grid,log:document.getElementById("log"),fullMessage:document.getElementById("fullmsg"),toast:document.getElementById("toast"),lookup});

initFilter(rendered,document.getElementById("q"),[...document.querySelectorAll(".seg button")]);

