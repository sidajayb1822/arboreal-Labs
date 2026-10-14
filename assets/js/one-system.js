/* One System — scroll-scrubbed port of arboreal-one-system-transparent.html.
   Five disconnected tools get wired into one Arboreal Labs system; it plays once
   (T seconds) when the section comes into view, then holds on the final frame. */
(() => {
const section = document.querySelector('.one-system');
if (!section) return;
const stage = section.querySelector('.one-system-svg');
const NS = 'http://www.w3.org/2000/svg';
// Arboreal tree mark, traced from the favicon into a single vector path (no image download).
const TREE_W = 200, TREE_H = 196.5;
const TREE_D = 'M88 174.7 87.6 174.6 86.3 175.7 85.2 177.5 84.4 179.8 83.7 184 83.7 190.3 83.4 190.6 64.1 190.6 64.1 196.3 90.1 196.4 90.1 181.1 90.7 179ZM93.5 164.1 93.5 164.5 97 168.4 97.4 168.4 100.4 165.6 107.6 173.3 108.7 175.3 109.5 178.2 109.5 196.4 135.4 196.3 135.4 190.6 115.7 190.5 115.7 180.4 115.2 176.8 114 173.1 111.7 169.3 101 157.7ZM86.9 138.8 86 139.5 84.9 141.3 84 144.3 83.6 147.1 83.6 156.8 84.5 166.6 86.6 171.4 89.6 175.7 95.2 180.7 99.6 183.3 105.8 176.8 106.5 175.6 102.8 172 102.3 172 98.5 176 94.1 172 91.7 168.8 90.1 164.8 89.2 155.5 89.2 148.1 89.6 145.2 90.3 143.2 87.4 139.1ZM99.4 120.7 92.5 127.9 92.5 128.3 96.3 131.9 96.7 131.9 100.3 128.2 105.2 133.1 107.6 136.7 109.5 141.4 109.9 145 110.8 159.3 109.8 164.4 113 168.5 113.5 168.5 115.3 165.7 116.4 160.4 116.4 152.3 115.2 140.2 112.4 133.6 109.4 129.1 104.8 124.4 101 121.4ZM184.3 41.6 182.3 40.5 180.5 39.9 177.1 39.9 173.8 41.3 171.5 43.4 170.3 45.6 169.8 47.7 169.8 50.1 170.6 53 152.3 72 152.2 81.6 117.1 116.4 117.1 116.9 120.9 120.6 132.5 109.5 150.1 127.5 170 127.5 171.3 130 173.2 132 175.7 133.4 177.3 133.8 180.2 133.8 181.9 133.4 184.4 132 186 130.4 187.4 127.9 187.8 126.2 187.6 122.2 185.9 119.1 184 117.3 182.2 116.3 180.1 115.7 177.6 115.7 175.1 116.4 173.6 117.3 171.8 118.9 170.2 121.7 152.5 121.7 140.6 109.5 171 109.4 186.3 93.2 189.2 94.2 193.1 94.1 196.3 92.5 198.2 90.6 199.7 87.3 199.7 83.3 198.5 80.2 197.2 78.7 195.4 77.3 192.5 76.2 189.1 76.2 187.3 76.8 184.3 78.9 182.2 82 165.2 82 165.2 87.7 181.9 87.7 182.5 88.7 168.5 103.6 138.4 103.6 154.8 87.2 157.9 87.2 158 74.4 174.7 57 177.9 58 181.2 57.7 183.7 56.6 185.9 54.7 187.6 51.5 187.8 47.5 186.5 43.9ZM178.2 119.5 180.1 119.6 181.9 120.4 183.4 122.1 184.1 124 184.1 125.8 183.3 127.8 181.8 129.3 179.8 130.1 177.8 130.1 175.8 129.3 174.2 127.5 173.5 125.6 173.6 123.5 174.6 121.5 176.4 120ZM190.5 79.8 192.5 80.1 194.2 81.1 195.3 82.3 196.1 84.5 196 86.6 194.9 88.7 192.8 90.2 190.9 90.6 188.8 90.2 187.4 89.4 186 87.7 185.5 86 185.6 83.7 186.6 81.9 188 80.7ZM177.2 43.8 179.8 43.6 181.4 44.2 183 45.6 184 47.5 184.1 49.9 183.4 51.7 182 53.2 180.1 54.1 178.3 54.3 176.4 53.7 174.6 52.2 173.6 50.3 173.5 48.1 174.3 46 175.8 44.5ZM14.9 41.9 13 44.1 11.7 47.2 11.7 50.6 12.2 52.1 13.5 54.6 15.6 56.5 18.9 57.9 21.7 58 24.4 57.2 41.3 74.3 41.6 86.9 44.1 86.7 60.8 103.6 31.5 103.7 17.3 89 17.7 88.1 34.1 88.1 34.1 82.3 17.7 82.3 16.3 79.7 14.6 78 12.6 76.8 10.8 76.2 7.3 76.2 4.4 77.3 1.7 79.8 0.1 83.1 0.1 87.3 1.7 90.6 3.6 92.5 6.8 94.1 9.4 94.3 13.3 93.4 29 109.4 58.7 109.5 46.8 121.4 29.4 121.7 27.9 119.2 26.2 117.5 24 116.3 21.7 115.7 19.5 115.7 17.4 116.3 15.7 117.1 13.5 119.2 12.3 121.3 11.7 123.1 11.9 127.1 12.8 129.4 13.8 130.8 15.3 132.2 17.3 133.3 19.3 133.8 22.2 133.8 24.4 133.1 26.7 131.8 28.5 129.7 29.6 127.3 49.2 127.2 66.9 109.7 78.6 120.9 82.3 117.1 82.3 116.7 47.2 81.8 47.1 71.8 29 53.7 28.7 53.2 29.7 50.7 29.8 48.1 28.9 44.8 27.6 43 25.3 41 22.1 39.9 18 40.2ZM20 119.5 22.2 119.6 24 120.6 25.3 122 26.1 124.4 26 126.1 25 128 23.5 129.4 21.7 130.1 19.8 130.1 18 129.4 16.4 128 15.5 126 15.5 123.6 16.3 121.8 17.8 120.3ZM8.7 79.8 10.2 80 12.4 81.1 13.5 82.3 14.4 84.7 14.2 86.6 13.1 88.7 11 90.2 9.1 90.6 7.9 90.5 5.8 89.5 4.3 87.7 3.7 86 3.9 83.7 4.8 81.9 6.6 80.4ZM19.6 43.6 22 43.6 23.8 44.5 25.6 46.5 26.1 48.5 25.7 51 24.7 52.5 23.3 53.6 21.4 54.3 19.5 54.1 17.7 53.3 16.3 51.9 15.5 50 15.5 47.8 16.2 46.1 18 44.3ZM80.7 0 78.7 0.6 76.1 2.2 74.4 4.1 73.2 7.3 73.3 11.3 74.3 13.7 76.7 16.3 72.5 30.4 72.5 31.4 95.4 55 88.8 62.2 86.7 65.5 84.9 69.6 78.9 63.3 78.9 46.1 55.1 28.2 55.5 26.4 55.4 22.8 54.3 20.2 52.2 17.8 49.9 16.4 47.7 15.9 45.3 15.9 42 17 40.6 18 38.5 20.4 37.6 22.9 37.4 26.1 38.1 28.6 39.4 30.7 40.7 32 43.5 33.6 43.5 53.3 57 67.3 57 78.3 57.6 78.3 83.3 97.8 83.1 121.7 84.8 129.6 86.6 133.4 91.2 139.1 95.9 143.6 100.3 146.8 107.3 139.5 107.3 139.1 103.5 135.5 99.6 139.2 95.2 134.9 92.4 131.2 90.1 126.5 89.1 122.2 89.1 78.9 89.8 73.9 91.4 68.9 94.5 64.5 99.6 59.3 106.5 66.3 108.8 70.4 109.7 74 92.4 92 96.5 95.7 110.4 81.9 110.5 116.3 109.8 122 108.7 125.3 111.3 129.4 111.9 129.7 113.3 128.5 114.6 125.8 115.9 120.2 116.3 115.1 116.2 97.2 141.9 78.5 142 67.5 155.2 54 155.5 33.8 158.6 32.2 160.6 30 162 26.5 162 23.3 161.3 21.1 160.4 19.5 158.6 17.7 156.4 16.4 154.1 15.9 151.8 15.9 149.3 16.6 147 18.1 145.3 20 144.2 22.5 143.9 25.8 144.3 27.9 121.8 45.4 120.2 46.4 119.9 63.5 114.5 69.1 112.7 65.2 111.2 62.8 103.9 55.1 126.9 31.6 122.2 16.6 124.7 13.4 125.4 11.7 125.8 8.8 125.1 5.5 123.1 2.5 121 1 119.3 0.3 115.2 0 113.3 0.6 110.9 1.9 108.7 4.6 107.7 7.2 107.6 9.9 108.4 13.1 85.4 36.3 78.9 29.6 82 18.4 85.5 17.5 89 15.2 90.9 11.9 91.3 8.3 90.9 6.2 89.9 4.1 88.1 2.1 84.8 0.3ZM51.5 32.6 73.2 49 73.1 65.3 83.6 76.5 83.3 90.6 62.8 75.3 62.8 51 57 51 56.9 58.8 49.3 51.2 49.3 33.7ZM149.9 33.6 149.7 51.4 142.1 59.1 142.1 51.1 136.3 51 136.2 75.6 116.3 90.1 116 89.8 116.2 80.5 115.9 76 125.7 65.9 125.8 49.6 147.8 32.5ZM151.5 19.8 154 19.6 155.5 20.2 157.2 21.5 158.1 23.3 158.3 26 157.7 27.5 155.9 29.4 154.4 30.1 152.2 30.2 150.6 29.7 148.8 28.2 147.9 26.7 147.7 24.3 148.5 22.1 149.7 20.7ZM45 19.8 47.4 19.6 49 20.2 51 22 51.7 23.5 51.8 25.8 51.1 27.6 49.6 29.3 47.9 30.1 45.7 30.2 43.8 29.6 42.1 28 41.3 26.2 41.2 24.2 41.9 22.2 43.4 20.6ZM116.7 18.1 120.4 30.1 99.7 51.1 89.5 40.5 112.6 17.1 114.8 18ZM115.1 3.9 117.8 3.7 119.5 4.4 120.9 5.7 121.8 7.5 122 10.1 121.5 11.3 120.3 13 118.1 14.2 115.9 14.4 114 13.7 112.4 12.3 111.5 10.4 111.3 8.4 112 6.4 113.7 4.6ZM81.1 3.7 83.3 3.7 84.9 4.4 86.5 5.8 87.4 7.9 87.6 9.5 86.7 11.9 85.1 13.5 83 14.4 81.4 14.4 79.3 13.5 77.6 11.9 76.9 10.2 76.9 7.9 77.6 6.2 79 4.7Z';
// The end-card lockup only appears after T, so it is never shown; reuse the nav logo (already cached).
const LOCKUP = '/assets/images/Arboreal%20logo/Light%20whole%20logo.png';
const SHOW_TEXT = true, TRANSPARENT = true;
let LIGHT = false, C;
const C_BASE = { ink:'#F0F2F5', inkSoft:'#AEB2B7', bg:'#11131A', card:'#171A22', line:'#2A2E38', viz:'#343845', muted:'#6B7077', soft:'#AEB2B7', lunar:'#F0F2F5', red:'#FF3B3B', purple:'#8000FF', flow:'#590073', void:'#1A0033' };
const T = 9.6; // play once, then hold on the connected 'In practice' frame

/* ---------- helpers ---------- */
const clamp = (x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const P = (t,a,b)=>clamp((t-a)/(b-a));
const eio = x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const eout = x=>1-Math.pow(1-x,3);
const eback = x=>{const c1=1.6,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)};
const lerp = (a,b,u)=>a+(b-a)*u;
const bell = (t,c,w)=>Math.exp(-Math.pow((t-c)/w,2));
function el(tag, attrs={}, parent){ const n=document.createElementNS(NS,tag); for(const k in attrs) n.setAttribute(k,attrs[k]); if(parent) parent.appendChild(n); return n; }
function txt(parent, s, attrs){ const n=el('text',attrs,parent); n.textContent=s; return n; }

/* ---------- content ---------- */
const ICONS = {
  sales:'<polyline points="3 17 9 11 13 15 21 7"/><polyline points="15 7 21 7 21 13"/>',
  marketing:'<path d="M3 10v4h3l7 4V6l-7 4H3z"/><path d="M16.5 9a4 4 0 0 1 0 6"/><path d="M19 6.5a7.5 7.5 0 0 1 0 11"/>',
  inventory:'<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5"/><path d="M12 12v9"/>',
  logistics:'<rect x="2" y="6" width="12" height="10" rx="1"/><path d="M14 9.5h4l3 3.5v3h-7z"/><circle cx="6.5" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  presence:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z"/>'
};
const BLOCKS = [
  {id:'sales',     label:'Sales',     m:['₹2.41L','₹2.46L'], sub:'Revenue today',      tag:'+₹4,850',          viz:'bars'},
  {id:'marketing', label:'Marketing', m:['3,240','3,241'],   sub:'Contacts in CRM',    tag:'Follow-up queued', viz:'funnel'},
  {id:'inventory', label:'Inventory', m:['128','127'],       sub:'Units in stock',     tag:'−1 unit',          viz:'boxes'},
  {id:'logistics', label:'Logistics', m:['14','15'],         sub:'Shipments today',    tag:'Dispatched',       viz:'route'},
  {id:'presence',  label:'Presence',  m:['1,920','1,921'],   sub:'Store visits today', tag:'New order',        viz:'spark'},
];
// order flow: presence -> hub -> everyone else
const LEGS = { presence:{a:7.30,b:7.80,rev:true,ev:7.30}, sales:{a:7.85,b:8.25}, inventory:{a:8.05,b:8.45}, logistics:{a:8.25,b:8.65}, marketing:{a:8.45,b:8.85} };
const COPY = [
  {eb:'TODAY',              L:['Different spreadsheets. Nothing in sync.'],   P:['Different spreadsheets.','Nothing in sync.'], a:0.5, b:3.5},
  {eb:'WITH ARBOREAL LABS', L:['Every block, wired into one system.'],         P:['Every block, wired','into one system.'],     a:3.9, b:6.9},
  {eb:'IN PRACTICE',        L:['One order comes in. Everything updates.'],     P:['One order comes in.','Everything updates.'], a:7.2, b:99},
];
const END = { L:['One system for your entire business.'], P:['One system for your','entire business.'] };

const LAYOUTS = {
  landscape:{ w:1600,h:900, cs:1, hub:[800,470], copyY:92, titleSize:46, lineH:56,
    conn:{sales:[310,360],marketing:[310,640],inventory:[1290,360],logistics:[1290,640],presence:[800,762]},
    chaos:{sales:[520,610,-5],marketing:[1180,300,4],inventory:[330,320,3],logistics:[1290,600,-3],presence:[900,735,2]},
    lock:{x:800,y:322,w:220}, endTitleY:560, chipRows:[[0,1,2,3,4]], chipY:[648] },
  portrait:{ w:900,h:1500, cs:1.15, hub:[450,762], copyY:110, titleSize:50, lineH:60,
    conn:{sales:[235,470],inventory:[665,470],marketing:[235,1062],logistics:[665,1062],presence:[450,1316]},
    chaos:{inventory:[250,500,4],marketing:[650,420,-4],sales:[650,990,3],logistics:[262,1170,-3],presence:[600,1362,2]},
    lock:{x:450,y:560,w:280}, endTitleY:820, chipRows:[[0,1,2],[3,4]], chipY:[968,1050], chipScale:1.35 },
};

/* ---------- build ---------- */
const svg = stage;
let L, R; // current layout + element refs
const CW=280, CH=180;

function route(S,E){
  const dx=E[0]-S[0], dy=E[1]-S[1], sx=Math.sign(dx)||1, sy=Math.sign(dy)||1, ax=Math.abs(dx), ay=Math.abs(dy);
  let pts;
  if(ax>=ay){ const leg=(ax-ay)/2; pts=[S,[S[0]+sx*leg,S[1]],[S[0]+sx*(leg+ay),E[1]],E]; }
  else { const leg=(ay-ax)/2; pts=[S,[S[0],S[1]+sy*leg],[E[0],S[1]+sy*(leg+ax)],E]; }
  return 'M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L');
}

function build(name){
  L = LAYOUTS[name]; L.name=name; R={cards:{},traces:{},pulses:{},amb:{}};
  svg.innerHTML=''; svg.setAttribute('viewBox',`0 0 ${L.w} ${L.h}`);
  const defs=el('defs',{},svg);
  defs.innerHTML = `
    <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="16" cy="16" r="1.1" fill="${C.lunar}" opacity=".07"/></pattern>
    <radialGradient id="gPurple"><stop offset="0" stop-color="${C.purple}" stop-opacity=".22"/><stop offset=".55" stop-color="${C.flow}" stop-opacity=".10"/><stop offset="1" stop-color="${C.void}" stop-opacity="0"/></radialGradient>
    <radialGradient id="gFlow"><stop offset="0" stop-color="${C.flow}" stop-opacity=".35"/><stop offset="1" stop-color="${C.void}" stop-opacity="0"/></radialGradient>
    <radialGradient id="gRed"><stop offset="0" stop-color="${C.red}" stop-opacity=".30"/><stop offset=".5" stop-color="${C.red}" stop-opacity=".07"/><stop offset="1" stop-color="${C.red}" stop-opacity="0"/></radialGradient>
    <radialGradient id="gVig" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity=".85"/></radialGradient>`;
  const [hx,hy]=L.hub;

  // background atmosphere
  const bg=el('g',{},svg); R.bg=bg;
  if(!TRANSPARENT){
    el('rect',{width:L.w,height:L.h,fill:C.bg},bg);
    R.glowA=el('ellipse',{cx:L.w*.12,cy:L.h*.9,rx:L.w*.55,ry:L.h*.6,fill:'url(#gPurple)'},bg);
    R.glowB=el('ellipse',{cx:L.w*.92,cy:L.h*.08,rx:L.w*.45,ry:L.h*.5,fill:'url(#gFlow)'},bg);
    el('rect',{width:L.w,height:L.h,fill:'url(#dots)'},bg);
    el('rect',{width:L.w,height:L.h,fill:'url(#gVig)'},bg);
  }
  R.hubGlow=el('circle',{cx:hx,cy:hy,r:340,fill:'url(#gRed)',opacity:0},svg);

  // broken links (chaos)
  R.links=[]; const lg=el('g',{},svg);
  [['sales','inventory'],['marketing','logistics'],['presence','sales'],['inventory','marketing']].forEach(pair=>{
    const g=el('g',{},lg);
    const ln=el('line',{stroke:C.muted,'stroke-width':1.5,'stroke-dasharray':'6 7','stroke-linecap':'round'},g);
    const x=el('g',{},g);
    el('circle',{r:12,fill:C.bg,stroke:C.red,'stroke-width':1.5},x);
    el('path',{d:'M-4 -4 L4 4 M4 -4 L-4 4',stroke:C.lunar,'stroke-width':1.6,'stroke-linecap':'round'},x);
    R.links.push({pair,g,ln,x});
  });

  // traces
  const tg=el('g',{fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},svg);
  BLOCKS.forEach(b=>{
    const [cx,cy]=L.conn[b.id], w=CW*L.cs, h=CH*L.cs;
    const dx=cx-hx, dy=cy-hy; let E;
    if(Math.abs(dx)*(h/w) > Math.abs(dy)) E=[cx-Math.sign(dx)*w/2, cy]; else E=[cx, cy-Math.sign(dy)*h/2];
    const ang=Math.atan2(E[1]-hy,E[0]-hx), S=[hx+Math.cos(ang)*112, hy+Math.sin(ang)*112];
    const d=route(S,E);
    const base=el('path',{d,stroke:C.line,'stroke-width':2},tg);
    const p=el('path',{d,stroke:C.red,'stroke-width':2.2,pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1,opacity:.9},tg);
    const n1=el('circle',{cx:S[0],cy:S[1],r:4,fill:C.red},tg);
    const n2=el('circle',{cx:E[0],cy:E[1],r:6.5,fill:C.bg,stroke:C.red,'stroke-width':2.2},tg);
    R.traces[b.id]={base,p,n1,n2,len:p.getTotalLength()};
  });

  // hub
  const hub=el('g',{},svg); R.hub=hub;
  R.ring=el('circle',{cx:hx,cy:hy,r:112,fill:'none',stroke:C.line,'stroke-width':1.5},hub);
  R.ring2=el('circle',{cx:hx,cy:hy,r:124,fill:'none',stroke:C.muted,'stroke-width':1,'stroke-dasharray':'2 10',opacity:.6},hub);
  const tw=150, th=tw*TREE_H/TREE_W, sc=tw/TREE_W;
  R.tree=el('g',{transform:`translate(${hx-tw/2} ${hy-th/2}) scale(${sc})`},hub);
  el('path',{d:TREE_D,fill:C.red,'fill-rule':'evenodd',style:'filter:drop-shadow(0 0 5px rgba(255,59,59,.45))'},R.tree);

  // pulses (below cards)
  const pg=el('g',{},svg);
  BLOCKS.forEach(b=>{
    R.amb[b.id]=el('circle',{r:2.6,fill:C.red,opacity:0},pg);
    const g=el('g',{opacity:0},pg);
    el('circle',{r:15,fill:C.red,opacity:.22},g); el('circle',{r:6,fill:C.red},g);
    R.pulses[b.id]=g;
  });

  // cards
  const cg=el('g',{},svg);
  BLOCKS.forEach(b=>{ R.cards[b.id]=buildCard(cg,b); });

  // copy
  R.copy=[]; const copyG=el('g',{},svg); if(!SHOW_TEXT) copyG.style.display='none';
  COPY.forEach(c=>{
    const g=el('g',{opacity:0},copyG);
    const eb=txt(g,c.eb,{x:L.w/2+14,y:L.copyY,'text-anchor':'middle',class:'sg','font-weight':500,'font-size':16,'letter-spacing':3.2,fill:C.inkSoft});
    const ebw=eb.getComputedTextLength();
    el('rect',{x:L.w/2+14-ebw/2-30,y:L.copyY-6.5,width:20,height:2.5,fill:C.red},g);
    (L.name==='portrait'?c.P:c.L).forEach((s,i)=>txt(g,s,{x:L.w/2,y:L.copyY+52+i*L.lineH,'text-anchor':'middle',class:'sg','font-weight':700,'font-size':L.titleSize,'letter-spacing':-.8,fill:C.ink}));
    R.copy.push({g,c});
  });

  // end card
  const end=el('g',{opacity:0},svg); R.end=end;
  const lk=L.lock, lh=lk.w*640/628;
  R.lockG=el('g',{},end);
  el('image',{href:LOCKUP,x:lk.x-lk.w/2,y:lk.y-lh/2,width:lk.w,height:lh},R.lockG);
  R.endTitle=el('g',{},end); if(!SHOW_TEXT) R.endTitle.style.display='none';
  (L.name==='portrait'?END.P:END.L).forEach((s,i)=>txt(R.endTitle,s,{x:L.w/2,y:L.endTitleY+i*L.lineH,'text-anchor':'middle',class:'sg','font-weight':700,'font-size':L.titleSize,'letter-spacing':-.8,fill:C.ink}));
  R.chips=[]; R.chipLines=[];
  L.chipRows.forEach((row,ri)=>{
    const y=L.chipY[ri], rowG=el('g',{},end);
    const lineEl=el('line',{y1:y,y2:y,stroke:C.red,'stroke-width':2,pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1},rowG);
    const dot=el('circle',{r:4,cy:y,fill:C.red,opacity:0},rowG);
    const items=row.map(i=>{
      const b=BLOCKS[i], g=el('g',{},rowG);
      const r=el('rect',{y:-22,height:44,rx:22,fill:C.card,stroke:C.line,'stroke-width':1.5},g);
      const ic=el('g',{fill:'none',stroke:C.lunar,'stroke-width':1.7,'stroke-linecap':'round','stroke-linejoin':'round',transform:'translate(16,-9) scale(.75)'},g); ic.innerHTML=ICONS[b.id];
      const t=txt(g,b.label,{x:44,y:6,class:'in','font-weight':500,'font-size':16,fill:C.lunar});
      const w=t.getComputedTextLength()+62; r.setAttribute('width',w);
      return {g,w,i};
    });
    const gap=18, total=items.reduce((s,o)=>s+o.w,0)+gap*(items.length-1), sc=L.chipScale||1;
    rowG.setAttribute('transform',`translate(${L.w/2} ${y}) scale(${sc}) translate(${-L.w/2} ${-y})`);
    let x=L.w/2-total/2;
    items.forEach(o=>{ o.x=x; o.y=y; x+=o.w+gap; R.chips[o.i]=o; });
    lineEl.setAttribute('x1',L.w/2-total/2+20); lineEl.setAttribute('x2',L.w/2+total/2-20);
    R.chipLines.push({lineEl,dot,x1:L.w/2-total/2+20,x2:L.w/2+total/2-20,ri});
  });

  R.fade=el('rect',{width:L.w,height:L.h,fill:C.bg,opacity:1,'pointer-events':'none'},svg);
  if(TRANSPARENT) R.fade.style.display='none';
}

function buildCard(parent,b){
  const g=el('g',{},parent), o={g,b};
  o.rect=el('rect',{x:-CW/2,y:-CH/2,width:CW,height:CH,rx:16,fill:C.card,stroke:C.line,'stroke-width':1.5},g);
  o.edge=el('rect',{x:-CW/2,y:-CH/2,width:CW,height:CH,rx:16,fill:'none',stroke:C.red,'stroke-width':1.8,opacity:0},g);
  const ic=el('g',{fill:'none',stroke:C.lunar,'stroke-width':1.6,'stroke-linecap':'round','stroke-linejoin':'round',transform:'translate(-118,-72) scale(1.08)'},g); ic.innerHTML=ICONS[b.id];
  txt(g,b.label,{x:-80,y:-51,class:'sg','font-weight':500,'font-size':22,fill:C.lunar});
  o.m0=txt(g,b.m[0],{x:-118,y:16,class:'sg','font-weight':700,'font-size':32,fill:C.lunar});
  o.m1=txt(g,b.m[1],{x:-118,y:16,class:'sg','font-weight':700,'font-size':32,fill:C.lunar,opacity:0});
  txt(g,b.sub,{x:-118,y:40,class:'in','font-weight':400,'font-size':13,fill:C.soft});
  el('line',{x1:-118,x2:118,y1:56,y2:56,stroke:'#23262F','stroke-width':1},g);
  o.dot=el('circle',{cx:-114,cy:72,r:3.5,fill:C.muted},g);
  o.s0=txt(g,'Not synced',{x:-104,y:76.5,class:'in','font-weight':500,'font-size':12,fill:C.muted});
  o.s1=txt(g,'Live sync',{x:-104,y:76.5,class:'in','font-weight':500,'font-size':12,fill:C.lunar,opacity:0});
  // event tag
  o.tag=el('g',{opacity:0},g);
  const tt=txt(o.tag,b.tag,{x:0,y:4.5,'text-anchor':'middle',class:'in','font-weight':600,'font-size':12,fill:C.lunar});
  const tw=tt.getComputedTextLength()+22;
  o.tag.insertBefore(el('rect',{x:-tw/2,y:-11,width:tw,height:22,rx:11,fill:'rgba(255,59,59,.16)',stroke:C.red,'stroke-width':1.2}),tt);
  o.tagX=122-tw/2; o.tagY=72;
  // viz
  const v=el('g',{transform:'translate(0,0)'},g); o.v={};
  if(b.viz==='bars'){
    const H=[18,26,22,34,28,40,34]; o.v.bars=H.map((h,k)=>el('rect',{x:24+k*13,y:40-h,width:8,height:h,rx:2,fill:C.viz},v)); o.v.H=H;
  } else if(b.viz==='funnel'){
    o.v.f=[96,66,36].map((w,k)=>el('rect',{x:70-w/2,y:-18+k*20,width:w,height:12,rx:3,fill:C.viz},v));
  } else if(b.viz==='boxes'){
    o.v.b=[]; for(let r=0;r<2;r++)for(let c=0;c<3;c++) o.v.b.push(el('rect',{x:26+c*32,y:-16+r*30,width:24,height:24,rx:4,fill:C.viz,stroke:C.muted,'stroke-width':1},v));
  } else if(b.viz==='route'){
    o.v.path=el('path',{d:'M28 34 H62 L88 -2 H116',fill:'none',stroke:C.muted,'stroke-width':1.6,'stroke-dasharray':'3 5','stroke-linecap':'round'},v);
    el('circle',{cx:28,cy:34,r:3.5,fill:C.muted},v); el('circle',{cx:116,cy:-2,r:3.5,fill:'none',stroke:C.muted,'stroke-width':1.5},v);
    o.v.truck=el('circle',{r:5.5,fill:C.lunar},v); o.v.len=o.v.path.getTotalLength();
  } else if(b.viz==='spark'){
    const pts=[[24,30],[38,22],[52,26],[66,10],[80,16],[94,0],[110,-8]];
    el('polyline',{points:pts.map(p=>p.join(',')).join(' '),fill:'none',stroke:C.soft,'stroke-width':1.8,'stroke-linejoin':'round','stroke-linecap':'round'},v);
    o.v.halo=el('circle',{cx:110,cy:-8,r:10,fill:C.red,opacity:0},v);
    o.v.end=el('circle',{cx:110,cy:-8,r:4,fill:C.lunar},v);
  }
  return o;
}

/* ---------- render(t) ---------- */
function render(t){
  const [hx,hy]=L.hub, cs=L.cs;
  // ambient
  if(R.glowA){ R.glowA.setAttribute('cx',L.w*(.12+.03*Math.sin(t*2*Math.PI/T))); R.glowB.setAttribute('cy',L.h*(.08+.04*Math.cos(t*2*Math.PI/T))); }

  // phases
  const hubIn=eout(P(t,3.6,4.4)), hubOut=P(t,10.6,11.0);
  const flare=Math.sin(Math.PI*P(t,10.2,11.0));
  const presArrive=bell(t,7.8,.15);
  R.hubGlow.setAttribute('opacity', (.55*hubIn*(1-hubOut) + .9*flare + .4*presArrive).toFixed(3));
  R.hubGlow.setAttribute('r', 300+60*flare);
  R.tree.setAttribute('opacity', hubIn*(1-hubOut));
  const ts=lerp(.9,1,hubIn)*(1-.15*hubOut);
  R.hub.setAttribute('transform',`translate(${hx} ${hy}) scale(${ts}) translate(${-hx} ${-hy})`);
  R.ring.setAttribute('opacity',hubIn*(1-hubOut)); R.ring.setAttribute('stroke', presArrive>.3? C.red : C.line);
  R.ring2.setAttribute('opacity',.6*hubIn*(1-hubOut));
  R.ring2.setAttribute('transform',`rotate(${t*8} ${hx} ${hy})`);

  // cards
  const pos={};
  BLOCKS.forEach((b,i)=>{
    const o=R.cards[b.id], ch=L.chaos[b.id], cn=L.conn[b.id];
    const a=eout(P(t,.3+i*.12,.95+i*.12));
    const m=eio(P(t,4.2+i*.08,5.6+i*.08));
    const g=eio(P(t,10.0+i*.06,10.75+i*.06));
    const drift=1-m;
    let x=lerp(ch[0],cn[0],m)+drift*7*Math.sin(t*1.1+i*1.7);
    let y=lerp(ch[1],cn[1],m)+drift*6*Math.cos(t*.9+i*2.3)+(1-a)*18;
    x=lerp(x,hx,g); y=lerp(y,hy,g);
    const r=lerp(ch[2],0,m)+drift*1.2*Math.sin(t*.7+i);
    const s=cs*(.96+.04*a)*(1-.72*g);
    o.g.setAttribute('transform',`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${r.toFixed(2)}) scale(${s.toFixed(4)})`);
    o.g.setAttribute('opacity',(a*(1-g)).toFixed(3));
    pos[b.id]=[x,y];

    // connection state
    const u=eout(P(t,5.8+i*.08,6.3+i*.08));
    o.s0.setAttribute('opacity',1-u); o.s1.setAttribute('opacity',u);
    o.dot.setAttribute('fill',u>.5?C.red:C.muted);
    // event
    const leg=LEGS[b.id], ev=leg.ev ?? leg.b;
    const fl=bell(t,ev+.05,.22);
    o.edge.setAttribute('opacity',(.35*u*(1-g)+.65*fl).toFixed(3));
    const done=P(t,ev,ev+.35), tagOut=P(t,9.6,9.9);
    o.tag.setAttribute('opacity',(clamp(done*3)*(1-tagOut)).toFixed(3));
    o.tag.setAttribute('transform',`translate(${o.tagX} ${o.tagY}) scale(${eback(done)})`);
    o.s1.setAttribute('opacity',u);
    const sw=eio(P(t,ev,ev+.4));
    o.m0.setAttribute('opacity',1-sw); o.m0.setAttribute('transform',`translate(0 ${-8*sw})`);
    o.m1.setAttribute('opacity',sw); o.m1.setAttribute('transform',`translate(0 ${8*(1-sw)})`);
    // viz reactions
    if(o.v.bars){ const last=o.v.bars[6], h=lerp(o.v.H[6],56,sw); last.setAttribute('height',h); last.setAttribute('y',40-h); last.setAttribute('fill',sw>.05?C.red:C.viz); }
    if(o.v.f){ o.v.f[2].setAttribute('fill',fl>.2||sw>.99?C.red:C.viz); }
    if(o.v.b){ const bx=o.v.b[5]; bx.setAttribute('fill-opacity',1-sw); bx.setAttribute('stroke',sw>.05?C.red:C.muted); }
    if(o.v.truck){ const k=eio(P(t,ev,ev+.9)), pt=o.v.path.getPointAtLength(k*o.v.len); o.v.truck.setAttribute('cx',pt.x); o.v.truck.setAttribute('cy',pt.y); o.v.truck.setAttribute('fill',k>0&&k<1?C.red:C.lunar); }
    if(o.v.end){ o.v.halo.setAttribute('opacity',(.35*fl).toFixed(3)); o.v.end.setAttribute('fill',fl>.2?C.red:C.lunar); }
  });

  // broken links
  const linkIn=1-P(t,3.4,3.9);
  R.links.forEach((k,j)=>{
    const [A,B]=k.pair.map(id=>pos[id]);
    const d=eio(P(t,1.4+j*.15,2.1+j*.15));
    const ex=A[0]+(B[0]-A[0])*d, ey=A[1]+(B[1]-A[1])*d;
    k.ln.setAttribute('x1',A[0]);k.ln.setAttribute('y1',A[1]);k.ln.setAttribute('x2',ex);k.ln.setAttribute('y2',ey);
    k.g.setAttribute('opacity',(.9*linkIn*clamp(d*4)).toFixed(3));
    const xp=eback(P(t,2.2+j*.15,2.55+j*.15));
    k.x.setAttribute('transform',`translate(${(A[0]+B[0])/2} ${(A[1]+B[1])/2}) scale(${xp})`);
    k.x.setAttribute('opacity',clamp(xp));
  });

  // traces
  const retract=eio(P(t,9.8,10.4));
  BLOCKS.forEach((b,i)=>{
    const tr=R.traces[b.id];
    const d=eio(P(t,5.2+i*.1,6.2+i*.1))*(1-retract);
    tr.p.setAttribute('stroke-dashoffset',(1-d).toFixed(4));
    const baseO=clamp(P(t,4.8,5.4)*(1-retract));
    tr.base.setAttribute('opacity',baseO);
    tr.n1.setAttribute('opacity',clamp(d*5)); tr.n2.setAttribute('opacity',clamp((d-.9)*10));
    // ambient pulses
    const amb=R.amb[b.id], on=P(t,6.6,7.0)*(1-P(t,9.1,9.5));
    if(on>0){ const uu=((t-6.6)/1.8+i*.23)%1, pt=tr.p.getPointAtLength(uu*tr.len); amb.setAttribute('cx',pt.x); amb.setAttribute('cy',pt.y); amb.setAttribute('opacity',(.55*on*Math.sin(Math.PI*uu)).toFixed(3)); }
    else amb.setAttribute('opacity',0);
    // order pulse
    const leg=LEGS[b.id], pu=R.pulses[b.id];
    if(t>=leg.a && t<=leg.b){ let k=eio(P(t,leg.a,leg.b)); if(leg.rev) k=1-k; const pt=tr.p.getPointAtLength(k*tr.len); pu.setAttribute('transform',`translate(${pt.x} ${pt.y})`); pu.setAttribute('opacity',Math.min(1,Math.sin(Math.PI*P(t,leg.a,leg.b))*3)); }
    else pu.setAttribute('opacity',0);
  });

  // copy
  R.copy.forEach(({g,c})=>{
    const i=eout(P(t,c.a,c.a+.6)), o=eio(P(t,c.b,c.b+.4));
    g.setAttribute('opacity',(i*(1-o)).toFixed(3));
    g.setAttribute('transform',`translate(0 ${(14*(1-i)-10*o).toFixed(2)})`);
  });

  // end card
  R.end.setAttribute('opacity',1);
  const lk=eout(P(t,10.8,11.6)), ls=lerp(.94,1,lk);
  R.lockG.setAttribute('opacity',lk);
  R.lockG.setAttribute('transform',`translate(${L.lock.x} ${L.lock.y}) scale(${ls}) translate(${-L.lock.x} ${-L.lock.y})`);
  const et=eout(P(t,11.2,11.8));
  R.endTitle.setAttribute('opacity',et); R.endTitle.setAttribute('transform',`translate(0 ${12*(1-et)})`);
  R.chips.forEach((o,j)=>{
    const c=eback(P(t,11.5+j*.08,11.95+j*.08));
    o.g.setAttribute('opacity',clamp(c)); o.g.setAttribute('transform',`translate(${o.x} ${o.y+10*(1-clamp(c))})`);
  });
  R.chipLines.forEach(({lineEl,dot,x1,x2,ri})=>{
    const d=eio(P(t,11.8+ri*.1,12.5+ri*.1));
    lineEl.setAttribute('x1',x1); lineEl.setAttribute('x2',x2);
    lineEl.setAttribute('stroke-dashoffset',1-d); lineEl.setAttribute('opacity',.7);
    const k=P(t,12.5,13.3); dot.setAttribute('cx',lerp(x1,x2,eio(k))); dot.setAttribute('opacity',Math.sin(Math.PI*k));
  });

  // loop fade
  R.fade.setAttribute('opacity',(1-P(t,0,.45)).toFixed(3));
}

/* ---------- run (plays in real time when in view) ---------- */
function applyTheme(){
  LIGHT = document.documentElement.getAttribute('data-theme') === 'light';
  C = Object.assign({}, C_BASE);
  if (LIGHT) { C.ink='#11131A'; C.inkSoft='#44474B'; }
}
function pickLayout(){ const r = stage.getBoundingClientRect(); return (r.width/Math.max(1,r.height))<0.95?'portrait':'landscape'; }
let cur=null, lastT=0;
function ensureLayout(force){ const n=pickLayout(); if(force||n!==cur){ cur=n; build(n); render(lastT); } }
function seek(t){ lastT=clamp(t,0,T); if(L) render(lastT); }

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const start = () => {
  applyTheme();
  ensureLayout(true);
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => ensureLayout(false), 120); });
  // Rebuild in the new palette when the footer theme switch flips data-theme.
  new MutationObserver(() => { applyTheme(); ensureLayout(true); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  if (reduced) {
    section.classList.add('is-static');
    seek(T);
    return;
  }
  // Play once in real time when the section is mostly on screen; pause while it is
  // scrolled away or the tab is hidden, then resume. Holds on the final frame.
  const SPEED = 1.6; // 1 = original pacing (9.6s); 1.6 plays it in 6s
  let playing = false, onScreen = false, raf = 0, prev = 0;
  const frame = (now) => {
    if (!prev) prev = now;
    seek(lastT + (now - prev) / 1000 * SPEED);
    prev = now;
    section.style.setProperty('--os-progress', (lastT / T).toFixed(4));
    if (lastT >= T) { playing = false; section.classList.add('is-done'); return; }
    raf = requestAnimationFrame(frame);
  };
  const play = () => { if (playing || lastT >= T || !onScreen || document.hidden) return; playing = true; prev = 0; raf = requestAnimationFrame(frame); };
  const pause = () => { cancelAnimationFrame(raf); playing = false; };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; onScreen ? play() : pause(); }, { threshold: 0.45 }).observe(stage);
  } else { onScreen = true; play(); }
  document.addEventListener('visibilitychange', () => (document.hidden ? pause() : play()));
};
(document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(start);
})();
