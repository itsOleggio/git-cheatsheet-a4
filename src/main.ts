/* eslint-disable */
// @ts-nocheck
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

// Copy
const toast=document.getElementById("toast");let tt;
const show=m=>{toast.textContent=m;toast.hidden=false;clearTimeout(tt);tt=setTimeout(()=>toast.hidden=true,1400)};
grid.addEventListener("click",e=>{
  const b=e.target.closest(".cmd");if(!b)return;const text=lookup(b).command.command;
  const fallback=()=>{const r=document.createRange();r.selectNodeContents(b.querySelector("code"));const s=getSelection();s.removeAllRanges();s.addRange(r);show("Выделено — нажми Ctrl+C")};
  try{navigator.clipboard.writeText(text).then(()=>show("Скопировано: "+text),fallback)}catch(_){fallback()}
});

document.querySelectorAll(".ntab .ex").forEach(td=>{td.title="Скопировать git switch -c";td.addEventListener("click",()=>{
  const t="git switch -c "+td.textContent;try{navigator.clipboard.writeText(t).then(()=>show("Скопировано: "+t),()=>show(t))}catch(_){show(t)}
})});


renderCommitLog(document.getElementById("log"),COMMIT_HISTORY);

// generic copy for sheet 2
function copyText(t){try{navigator.clipboard.writeText(t).then(()=>show("Скопировано: "+t.split("\n")[0]),()=>show(t.split("\n")[0]))}catch(_){show(t.split("\n")[0])}}
document.getElementById("log").addEventListener("click",e=>{const g=e.target.closest(".row");if(g)copyText(g.dataset.copy)});
document.getElementById("log").addEventListener("keydown",e=>{const g=e.target.closest(".row");if(g&&(e.key==="Enter"||e.key===" ")){e.preventDefault();copyText(g.dataset.copy)}});
document.querySelectorAll(".ex-list .e.ok").forEach(e=>{const go=()=>copyText(e.querySelector("span").textContent);e.addEventListener("click",go);e.addEventListener("keydown",k=>{if(k.key==="Enter"||k.key===" "){k.preventDefault();go()}})});
const fm=document.getElementById("fullmsg");fm.addEventListener("keydown",k=>{if(k.key==="Enter"){k.preventDefault();fm.click()}});
fm.addEventListener("click",()=>{
  const t=[...document.getElementById("fullmsg").childNodes].filter(n=>!(n.classList&&(n.classList.contains("lbl")||n.classList.contains("cm")))).map(n=>n.textContent).join("").replace(/\n{3,}/g,"\n\n").trim();
  copyText(t);
});

// Filter + search
let F="all";const q=document.getElementById("q");
function apply(){
  const s=q.value.trim().toLowerCase();
  document.querySelectorAll(".sec").forEach(sec=>{
    let any=false;
    sec.querySelectorAll(".cmd").forEach(b=>{
      const c=lookup(b).command,okF=F==="all"||c.era===F,okS=!s||(c.command+" "+c.label+" "+(c.hint||"")).toLowerCase().includes(s);
      b.hidden=!(okF&&okS);if(!b.hidden)any=true;
    });
    sec.querySelectorAll(".pair").forEach(p=>p.hidden=F!=="all"||!!s);
    sec.hidden=!any;
  });
}
document.querySelectorAll(".seg button").forEach(b=>b.addEventListener("click",()=>{
  F=b.dataset.f;document.querySelectorAll(".seg button").forEach(x=>x.setAttribute("aria-pressed",x===b));apply();
  try{localStorage.setItem("gitcs-f",F)}catch(_){}
}));
q.addEventListener("input",apply);
try{const s=localStorage.getItem("gitcs-f");if(s){document.getElementById("f-"+s)?.click()}}catch(_){}
