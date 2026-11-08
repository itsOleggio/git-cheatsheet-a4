/* eslint-disable */
// @ts-nocheck
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

// Align the middle title line with the main branch
function alignTitle(){
  const h=document.getElementById("ttl"),m=document.getElementById("ttl-mid");
  h.style.top="0px";
  if(innerWidth<=760)return;
  const g=G.getBoundingClientRect(),mr=m.getBoundingClientRect();
  const mainY=g.top+g.height*60/150, midY=mr.top+mr.height/2;
  h.style.top=(mainY-midY)+"px";
}
addEventListener("resize",alignTitle);
(document.fonts?document.fonts.ready:Promise.resolve()).then(alignTitle);alignTitle();

// Sections
const grid=document.getElementById("grid");
S.forEach(s=>{
  const sec=document.createElement("section");sec.className="sec";sec.style.setProperty("--c",LANES[s.lane]);sec.dataset.l=s.lane;
  sec.innerHTML=`<h2>${s.title}</h2>`;
  s.commands.forEach(c=>{
    const b=document.createElement("button");b.className="cmd"+(c.warning?" danger":"");b.dataset.t=c.era||"";
    b.innerHTML=`<code></code>${c.era?`<span class="badge ${c.era}">${c.era.toUpperCase()}</span>`:""}<span class="d"></span>`;
    b.querySelector("code").textContent=c.command;b.querySelector(".d").textContent=c.label;b._c=c;b._sec=s;
    sec.append(b);
  });
  if(s.pairs){s.pairs.forEach(([o,n])=>{const p=document.createElement("div");p.className="pair";p.innerHTML=`<span></span> <span class="arrow">→</span> <span style="color:var(--fg)"></span>`;p.children[0].textContent=o;p.children[2].textContent=n;sec.append(p)})}
  sec.addEventListener("mouseenter",()=>{G.classList.add("dim");G.querySelector(`[data-l="${s.lane}"]`).classList.add("on")});
  sec.addEventListener("mouseleave",()=>{G.classList.remove("dim");G.querySelectorAll(".on").forEach(e=>e.classList.remove("on"))});
  grid.append(sec);
});

// Tooltip
const tip=document.getElementById("tip");
grid.addEventListener("mousemove",e=>{
  const b=e.target.closest(".cmd");if(!b){tip.hidden=true;return}
  const c=b._c;tip.innerHTML="";
  const code=document.createElement("code");code.textContent=c.command;tip.append(code);
  const h=document.createElement("div");h.className="tl";h.textContent=c.label[0].toUpperCase()+c.label.slice(1)+(c.era==="new"?" · новый способ":c.era==="old"?" · старый способ":"");tip.append(h);
  const d=document.createElement("div");d.textContent=LONG[c.command]||c.hint||"";tip.append(d);
  if(c.hint&&LONG[c.command]){const x=document.createElement("div");x.className="ex";x.textContent="→ "+c.hint;tip.append(x)}
  if(c.warning){const w=document.createElement("div");w.className="w";w.textContent="⚠ "+c.warning;tip.append(w)}
  tip.hidden=false;
  const r=tip.getBoundingClientRect();let x=e.clientX+14,y=e.clientY+14;
  if(x+r.width>innerWidth-8)x=e.clientX-r.width-14;if(y+r.height>innerHeight-8)y=e.clientY-r.height-14;
  tip.style.left=Math.max(8,x)+"px";tip.style.top=Math.max(8,y)+"px";
});
grid.addEventListener("mouseleave",()=>tip.hidden=true);

// Copy
const toast=document.getElementById("toast");let tt;
const show=m=>{toast.textContent=m;toast.hidden=false;clearTimeout(tt);tt=setTimeout(()=>toast.hidden=true,1400)};
grid.addEventListener("click",e=>{
  const b=e.target.closest(".cmd");if(!b)return;const text=b._c.command;
  const fallback=()=>{const r=document.createRange();r.selectNodeContents(b.querySelector("code"));const s=getSelection();s.removeAllRanges();s.addRange(r);show("Выделено — нажми Ctrl+C")};
  try{navigator.clipboard.writeText(text).then(()=>show("Скопировано: "+text),fallback)}catch(_){fallback()}
});

document.querySelectorAll(".ntab .ex").forEach(td=>{td.title="Скопировать git switch -c";td.addEventListener("click",()=>{
  const t="git switch -c "+td.textContent;try{navigator.clipboard.writeText(t).then(()=>show("Скопировано: "+t),()=>show(t))}catch(_){show(t)}
})});


// ---- Sheet 2: commit log graph ----
(function(){
  const L=document.getElementById("log"),X={main:22,feat:46,hot:70},RH=24,T=14;
  const TC={feat:"var(--feat)",fix:"var(--fix)",refactor:"#2dd4bf",perf:"#facc15",test:"#a3e635",docs:"var(--rel)",ci:"var(--muted)",chore:"var(--muted)",build:"var(--muted)",style:"var(--muted)",revert:"var(--warn)"};
  const R=[
    {l:"main",h:"e41b7d2",m:"chore(release): 1.5.0 [skip ci]",tag:"v1.5.0"},
    {l:"main",h:"9c03a1f",m:"Merge pull request #142 from feature/SHOP-142-cart-promo-code",merge:true},
    {l:"feat",h:"5d2e8b0",m:"test(cart): cover promo code validation"},
    {l:"main",h:"77af3c4",m:"Merge pull request #151 from hotfix/1.4.1-payment-timeout",merge:true,tag:"v1.4.1"},
    {l:"hot", h:"b18f6e9",m:"fix(payment): retry request on gateway timeout"},
    {l:"feat",h:"c4a9e12",m:"refactor(cart): extract usePromoCode hook"},
    {l:"feat",h:"0f6d3ab",m:"feat(cart): add promo code field"},
    {l:"main",h:"3e8c5a7",m:"chore(release): 1.4.0 [skip ci]",tag:"v1.4.0"},
    {l:"main",h:"a29d4f1",m:"ci: cache npm dependencies in GitHub Actions"},
    {l:"main",h:"1b7e0c3",m:"chore: init project with Vite + React"},
  ];
  const y=i=>T+i*RH, P=(d,c,w=2.5)=>L.append(el("path",{d,fill:"none",stroke:c,"stroke-width":w,"stroke-linecap":"round"}));
  const curve=(x1,y1,x2,y2)=>`M${x1} ${y1} C${x1} ${(y1+y2)/2} ${x2} ${(y1+y2)/2} ${x2} ${y2}`;
  // lanes
  P(`M${X.main} ${y(0)} V${y(9)}`,"var(--main)");
  P(`M${X.feat} ${y(2)} V${y(6)}`,"var(--feat)");
  P(curve(X.main,y(8),X.feat,y(6)),"var(--feat)");     // branch feature from row 8
  P(curve(X.feat,y(2),X.main,y(1)),"var(--feat)");     // merge feature into row 1
  P(curve(X.main,y(7),X.hot,y(4)),"var(--fix)");       // hotfix from row 7
  P(curve(X.hot,y(4),X.main,y(3)),"var(--fix)");       // merge hotfix into row 3
  // lane labels
  [["main",X.main,"var(--main)"],["feature/SHOP-142-cart-promo-code",X.feat,"var(--feat)"],["hotfix/1.4.1",X.hot,"var(--fix)"]];
  const lab=(t,x,yy,c)=>{const e=el("text",{x,y:yy,fill:c,"font-family":"JetBrains Mono, monospace","font-size":9});e.textContent=t;L.append(e)};
  const LC={main:"var(--main)",feat:"var(--feat)",hot:"var(--fix)"};
  R.forEach((r,i)=>{
    const g=el("g",{class:"row",tabindex:0,role:"button","aria-label":"Скопировать: "+r.m});g.dataset.copy=r.m;
    g.append(el("rect",{class:"hl",x:100,y:y(i)-10,width:636,height:20,rx:3,fill:"transparent"}));
    g.append(el("circle",{cx:X[r.l],cy:y(i),r:r.merge?6:5,fill:r.merge?LC[r.l]:"var(--sheet)",stroke:LC[r.l],"stroke-width":2.5}));
    const tx=el("text",{x:108,y:y(i)+3.5,"font-family":"JetBrains Mono, monospace","font-size":10.5});
    const ts=(t,a)=>{const e=el("tspan",a);e.textContent=t;tx.append(e);return e};
    ts(r.h+"  ",{fill:"var(--muted)"});
    const m=r.m.match(/^(\w+)(\([^)]*\))?(!)?:\s(.*)$/);
    if(m){
      ts(m[1],{fill:TC[m[1]]||"var(--fg)","font-weight":700});
      if(m[2])ts(m[2],{fill:"var(--rel)"});
      if(m[3])ts("!",{fill:"var(--warn)"});
      ts(": "+m[4],{fill:"var(--fg)"});
    } else ts(r.m,{fill:"var(--muted)"});
    g.append(tx);
    if(r.tag){
      const w=r.tag.length*6.4+12, bx=736-w;
      g.append(el("rect",{x:bx,y:y(i)-8,width:w,height:16,rx:3,fill:"none",stroke:"var(--tag)","stroke-width":1}));
      const t=el("text",{x:bx+6,y:y(i)+3.5,fill:"var(--tag)","font-family":"JetBrains Mono, monospace","font-size":9.5,"font-weight":700});t.textContent=r.tag;g.append(t);
    }
    L.append(g);
  });
})();

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
      const c=b._c,okF=F==="all"||c.era===F,okS=!s||(c.command+" "+c.label+" "+(c.hint||"")).toLowerCase().includes(s);
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
