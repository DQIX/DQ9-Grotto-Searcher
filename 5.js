const TILE_SIZE=22;
const COLORS={
0: '#f5f0e0',
1: '#000',
2: '#e8e0c8',
3: '#000',
4: '#4c4',
5: '#f44',
6: '#ffd700',
8: '#ccd8c0',
};
const WALL_COLOR='#000';
let mapData=null;
let activeFloor=0;
function calculate(){
const safeZone=document.getElementById('controls_container');
const controlsDiv=document.getElementById('single_map_controls');
if(safeZone&&controlsDiv){safeZone.appendChild(controlsDiv);}
const seedStr=document.getElementById('seed').value.trim();
const seed=parseInt(seedStr, 16);
const rank=parseInt(document.getElementById('rank').value);
if(isNaN(seed)||seed<0||seed>0x7FFF||!/^[0-9a-fA-F]{1,4}$/.test(seedStr)){
document.getElementById('result').innerHTML='<div class="error">'+C17+'</div>';
return;
}
mapData=new GrottoDetail();
mapData.MapSeed=seed;
mapData.MapRank=rank;
mapData.calculateDetail();
activeFloor=0;
renderResult();
}
function calcR2N2(seed){
const threshR=Math.floor(32768/256);
const threshN=Math.floor(32768/128);
const MAX=400;
let rng=seed>>>0;
const v=[];
for(let i=0;i<MAX+4;i++){rng=lcg(rng);v.push((rng>>>16)&0x7FFF);}
let r2=-1, r2_3=-1, n2=-1;
for(let i=0;i<MAX;i++){
if(r2===-1&&v[i]<threshR&&v[i+1]<threshR) r2=i+1;
if(r2_3===-1&&v[i]<threshR&&i+3<v.length&&v[i+3]<threshR) r2_3=i+1;
if(n2===-1&&i+3<v.length&&v[i]>=threshR&&v[i+1]<threshN&&v[i+2]>=threshR&&v[i+3]<threshN) n2=i+1;
}
return {r2, r2_3, n2};
}
function renderResult(){
const el=document.getElementById('result');
if(!mapData||mapData.floorCount===0){
el.innerHTML='<div class="error">'+C18+'</div>';
return;
}
const seedHex=mapData.MapSeed.toString(16).toUpperCase().padStart(4,'0');
const rStr=mapData.MapRank.toString(16).toUpperCase().padStart(2,'0');
const locData=calcLocations(mapData.MapSeed, rStr);
let locHtmlString='';
if(locData.outputOrder.length>0){
const locStrings=locData.outputOrder.map(item=>{
const bqs=Array.from(locData.seenLocations[item.location]);
return `${item.location.toString(16).toUpperCase().padStart(2, '0')} (${formatRanges(bqs)})`;
});
locHtmlString=locStrings.join('<br>');
}else{
locHtmlString=C19;
}
let currentSeed=mapData.MapSeed;
const atValues=[];
for(let i=1;i<=37;i++){
currentSeed=lcg(currentSeed);
if(i>=35&&i<=37){
atValues.push((currentSeed>>>16)&0x7FFF);
}
}
const atHtmlString=`[35] ${atValues[0]}<br>[36] ${atValues[1]}<br>[37] ${atValues[2]}`;
const rn=calcR2N2(mapData.MapSeed);
const fmtRN=v=>v===-1?`<span style="color:#555;">—</span>`:`<span style="color:#0f0;">${v}</span>`;
const rnHtml=`<span style="color:#f88;">[R2] ${fmtRN(rn.r2)}</span><br><span style="color:#f88;">[+3] ${fmtRN(rn.r2_3)}</span><br><span style="color:#8cf;">[N2] ${fmtRN(rn.n2)}</span>`;
const boxData=mapData.getMapBoxCounts();
const boxCounts=boxData.counts;
const totalBoxes=boxData.total;
let boxCountHtmlArr=[];
for(let r=10;r>=1;r--){
if(boxCounts[r]>0){
let color="#aaa";
if(r===10) color="#ffd700";
else if(r>=8) color="#f44";
else if(r>=4) color="#4c4";
else if(r===3) color="#62a1ff";
boxCountHtmlArr.push(`<span style="margin-right:14px;display:inline-block;background:#000;padding:2px 8px;border-radius:4px;border:1px solid #333;"><strong style="color:${color};font-size:14px;text-shadow: 1px 1px 1px #000;">${CHEST_RANK[r]}</strong> <span style="color:#fff;font-weight:bold;">${boxCounts[r]}</span></span>`);
}
}
let boxString=boxCountHtmlArr.length>0?boxCountHtmlArr.join(''):'<span style="color:#888;">'+C09+'</span>';
let html=`<div class="info-bar">
<span>Rank: <strong>${rStr}</strong></span>
<span>Seed: <strong>${seedHex}</strong></span>
<span>${C01}: <strong style="display:inline-block;vertical-align:top;">
<span style="display:block;color:#ffd700">${mapData.mapName}</span>
<span style="display:block;color:#ffd700">${mapData.mapNameJP}</span>
</strong></span>
<span>${C02}: <strong style="display:inline-block;vertical-align:top;">
<span style="display:block;color:#ffd700">${mapData.mapTypeName}</span>
<span style="display:block;color:#ffd700">${mapData.mapTypeNameJP}</span>
</strong></span>
<span>${C03}: <strong>${mapData.monsterRank}</strong></span>
<span>${C04}: <strong>${mapData.floorCount}</strong></span>
<span>Boss: <strong style="display:inline-block;vertical-align:top;">
<span style="display:block;color:#ffd700">${mapData.bossName}</span>
<span style="display:block;color:#ffd700">${mapData.bossNameJP}</span>
</strong></span>
<span style="display:inline-block;vertical-align:top;border-left:1px dashed #4a4a8a;padding-left:15px;margin-left:5px;">${C05}:
<strong style="display:block;color:#0ff;font-family:monospace;font-size:12px;margin-top:2px;">${locHtmlString}</strong>
</span>
<span style="display:inline-block;vertical-align:top;border-left:1px dashed #4a4a8a;padding-left:15px;margin-left:5px;">${C06}:
<strong style="display:block;color:#4c4;font-family:monospace;font-size:12px;margin-top:2px;text-align:left;">${atHtmlString}</strong>
</span>
<span style="display:inline-block;vertical-align:top;border-left:1px dashed #4a4a8a;padding-left:15px;margin-left:5px;">${C06b}:
<strong style="display:block;font-family:monospace;font-size:12px;margin-top:2px;text-align:left;">${rnHtml}</strong>
</span>
</div>
<div class="info-bar" style="align-items:center;background:#16162a;border-bottom:1px solid #4a4a8a;padding: 10px 20px;">
<span style="color:#88b;font-weight:bold;margin-right:10px;">${C07}</span>
<div style="display:flex;flex-wrap:wrap;align-items:center;flex:1;">
${boxString}
<span style="margin-left:auto;padding-left:12px;border-left:2px solid #4a4a8a;color:#8cc8ff;font-weight:bold;margin-right:15px;">${totalBoxes} ${C08}</span>
<div id="controls_target_area"></div>
</div>
</div>`;
setTimeout(()=>{
const target=document.getElementById('controls_target_area');
const controls=document.getElementById('single_map_controls');
if(target&&controls){
target.appendChild(controls);
}
},0);
html+='<div class="floor-tabs">';
for(let i=0;i<mapData.floorCount;i++){
html+=`<div class="floor-tab${i===activeFloor?' active':''}" onclick="switchFloor(${i})">B${i+1}F</div>`;
}
html+='</div>';
html+='<div class="floor-content" id="floor-content"></div>';
el.innerHTML=html;
renderFloor(activeFloor);
}
function switchFloor(f){
activeFloor=f;
document.querySelectorAll('.floor-tab').forEach((t,i)=>t.classList.toggle('active', i===f));
renderFloor(f);
}
function renderFloor(f){
const container=document.getElementById('floor-content');
const w=mapData.getFloorWidth(f);
const h=mapData.getFloorHeight(f);
const map=mapData.getFloorMap(f);
const up=mapData.getUpStair(f);
const down=mapData.getDownStair(f);
const boxCount=mapData.getBoxCount(f);
const canvasW=w * TILE_SIZE;
const canvasH=h * TILE_SIZE;
let infoHtml='<div class="floor-info">';
infoHtml+=`<h3>B${f+1}F</h3>`;
infoHtml+='<table>';
infoHtml+=`<tr><td>${C10}</td><td>${w} × ${h}</td></tr>`;
if(f<mapData.floorCount-1)
infoHtml+=`<tr><td>${C11}</td><td>▲ (${up.x}, ${up.y})　▼ (${down.x}, ${down.y})</td></tr>`;
else
infoHtml+=`<tr><td>${C11}</td><td>▲ (${up.x}, ${up.y})　Boss (${down.x}, ${down.y})</td></tr>`;
const elistInfo=getFloorElistInfo(mapData, f);
let stateHtml=elistInfo.state?` <span style="background:#f4c;color:#fff;padding:1px 5px;border-radius:3px;font-size:10px;margin-left:6px;white-space:nowrap;">${elistInfo.state}</span>`:'';
let dHtml=elistInfo.dValue>0?` <span style="background:#fa0;color:#000;padding:1px 5px;border-radius:3px;font-size:10px;margin-left:4px;white-space:nowrap;">${elistInfo.dValue}</span>`:'';
infoHtml+=`<tr><td>ElistOfs</td><td style="font-family:monospace;color:#4c4;">${elistInfo.hex}${stateHtml}${dHtml}</td></tr>`;
const envType=mapData._details[3];
let floorMR=mapData._details[2]+(f >> 2);
if(floorMR>12) floorMR=12;
const spawnList=(SPAWN_DB[envType]&&SPAWN_DB[envType][floorMR])||[];
const normals=spawnList.filter(e=>e.length===3);
const isJP=(DISPLAY_LANG!=='EN');
const st=elistInfo.state||'';
let grayFrom=normals.length;
if(st.includes(EL_4)) grayFrom=4;
else if(st.includes(EL_3)) grayFrom=3;
else if(st.includes(EL_2)) grayFrom=2;
else if(st.includes('only')||st.includes('オンリー')) grayFrom=-1;
else if(st.includes(EL_0)&&!st.includes(EL_P)) grayFrom=0;
if(grayFrom<0) grayFrom=0;
const onlyMonId=(ONLY_MONSTERS[envType]&&ONLY_MONSTERS[envType][floorMR])||'';
const isOnlyMode=(st.includes('only')||st.includes('オンリー'));
let monsterSpans=normals.map((entry, i)=>{
const md=MONSTER_DATA[entry[0]];
if(!md)return '';
const name=isJP?md.jp:md.en;
let isGray;
if(isOnlyMode){
isGray=(entry[0]!==onlyMonId);
}else{
isGray=(i>=grayFrom);
}
const bg=isGray?'#1a1a2e':'#2a2a4a';
const fg=isGray?'#555':'#ddd';
return `<span class="mon-pill" style="color:${fg};background:${bg};">${name}</span>`;
}).filter(Boolean);
if(monsterSpans.length>0){
infoHtml+=`<tr><td>${C12}</td><td class="mon-td">${monsterSpans.join('')}</td></tr>`;
}
if(boxCount>0){
infoHtml+=`<tr><td>${C13}</td><td>${boxCount} <font color=#666>${C14}</font></td></tr>`;
for(let i=0;i<boxCount;i++){
const box=mapData.getBoxInfo(f, i);
const rn=CHEST_RANK[box.rank]||box.rank;
const [soloEN, soloJP]=mapData.getBoxItem(f,i,1).map(v=>v||'?');
const [partyEN, partyJP]=mapData.getBoxItem(f,i,2).map(v=>v||'?');
const dispSolo=DISPLAY_LANG!=='EN'?soloJP:soloEN;
const dispParty=DISPLAY_LANG!=='EN'?partyJP:partyEN;
infoHtml+=`<tr><td>${C15} ${i+1}</td><td>
<div class="chest-row"><span class="chest-rank rank-${rn}">Rank ${rn}</span> (${box.x}, ${box.y})</div>
<div class="chest-item"><span class="chest-item-solo">Item (${STR_SOLO}): ${dispSolo}</span></div>
<div class="chest-item"><span class="chest-item-party">Item (${STR_PARTY}): ${dispParty}</span></div>
</td></tr>`;
}
}else{
infoHtml+=`<tr><td>${C15}</td><td>${C16}</td></tr>`;
}
infoHtml+='</table>';
infoHtml+='<div class="legend" style="margin-top:20px">';
infoHtml+=`<div class="legend-item"><div class="legend-swatch" style="background:#f5f0e0"></div>${D01}</div>`;
infoHtml+=`<div class="legend-item"><div class="legend-swatch" style="background:#000"></div>${D02}</div>`;
infoHtml+=`<div class="legend-item"><div class="legend-swatch" style="background:#e8e0c8"></div>${D03}</div>`;
infoHtml+=`<div class="legend-item"><div class="legend-swatch" style="background:#ccd8c0"></div>${D04}</div>`;
infoHtml+=`<div class="legend-item"><div class="legend-swatch" style="background:#4c4"></div>${D05}</div>`;
infoHtml+=`<div class="legend-item"><div class="legend-swatch" style="background:#f44"></div>${D06}</div>`;
infoHtml+=`<div class="legend-item"><div class="legend-swatch" style="background:#ffd700"></div>${D07}</div>`;
infoHtml+='</div></div>';
container.innerHTML=`<div class="map-container"><canvas id="mapCanvas" width="${canvasW}" height="${canvasH}" title=""></canvas><div id="coordDisplay" style="position:absolute;bottom:4px;right:8px;font-size:11px;color:#aaa;font-family:monospace;pointer-events:none"></div></div>${infoHtml}`;
document.querySelector('.map-container').style.position='relative';
const mapCanvas=document.getElementById('mapCanvas');
mapCanvas.addEventListener('mousemove', (e)=>{
const rect=mapCanvas.getBoundingClientRect();
const mx=Math.floor((e.clientX-rect.left) / TILE_SIZE);
const my=Math.floor((e.clientY-rect.top) / TILE_SIZE);
const coordEl=document.getElementById('coordDisplay');
if(mx>=0&&mx<w&&my>=0&&my<h){
const tNames={0:D01,1:D02,2:D03,3:D02,4:C11,5:C11,6:D07,8:D04};
const tile=map[my][mx];
let label=tNames[tile]||`tile:${tile}`;
if(mx===up.x&&my===up.y) label=D05+'▲';
if(mx===down.x&&my===down.y) label=(f<mapData.floorCount-1)?D06+'▼':'Boss▼';
coordEl.textContent=`(${mx},${my}) ${label}`;
mapCanvas.style.cursor=boxPositions.has(mx+','+my)?'pointer':'default';
}else{
coordEl.textContent='';
mapCanvas.style.cursor='default';
}
});
const boxPositions=new Map();
for(let i=0;i<boxCount;i++){
const b=mapData.getBoxInfo(f, i);
boxPositions.set(b.x+','+b.y, i+1);
}
mapCanvas.addEventListener('click', (e)=>{
const rect=mapCanvas.getBoundingClientRect();
const mx=Math.floor((e.clientX-rect.left) / TILE_SIZE);
const my=Math.floor((e.clientY-rect.top) / TILE_SIZE);
if(boxPositions&&boxPositions.has(mx+','+my)){
const boxNum=boxPositions.get(mx+','+my);
showChestTimer(f, boxNum-1, mx, my);
}
});
const canvas=document.getElementById('mapCanvas');
const ctx=canvas.getContext('2d');
ctx.fillStyle='#000';
ctx.fillRect(0, 0, canvasW, canvasH);
for(let y=0;y<h;y++){
for(let x=0;x<w;x++){
let tile=map[y][x];
const px=x * TILE_SIZE;
const py=y * TILE_SIZE;
const isUpStair=(x===up.x&&y===up.y);
const isDownStair=(x===down.x&&y===down.y);
const boxNum=boxPositions.get(x+','+y)||0;
const isBox=boxNum>0;
let displayTile=tile;
if(isUpStair) displayTile=4;
else if(isDownStair) displayTile=5;
else if(isBox) displayTile=6;
else if(tile===4||tile===5||tile===6) displayTile=0;
if(displayTile===1||displayTile===3){
ctx.fillStyle=WALL_COLOR;
ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
}else{
ctx.fillStyle=COLORS[displayTile]||COLORS[0];
ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
ctx.strokeStyle='rgba(0,0,0,0.08)';
ctx.strokeRect(px+0.5, py+0.5, TILE_SIZE-1, TILE_SIZE-1);
}
ctx.textAlign='center';
ctx.textBaseline='middle';
if(isUpStair){
ctx.fillStyle='#000';
ctx.font='bold 12px sans-serif';
ctx.fillText('▲', px+TILE_SIZE/2, py+TILE_SIZE/2);
}else if(isDownStair){
ctx.fillStyle='#000';
ctx.font='bold 12px sans-serif';
ctx.fillText('▼', px+TILE_SIZE/2, py+TILE_SIZE/2);
}else if(isBox){
ctx.fillStyle='#000';
ctx.font='bold 11px sans-serif';
ctx.fillText(boxNum, px+TILE_SIZE/2, py+TILE_SIZE/2);
}
}
}
ctx.fillStyle='rgba(0,0,0,0.3)';
ctx.font='9px monospace';
ctx.textAlign='center';
ctx.textBaseline='top';
for(let x=0;x<w;x++) ctx.fillText(x, x*TILE_SIZE+TILE_SIZE/2, 2);
ctx.textBaseline='middle';
ctx.textAlign='left';
for(let y=0;y<h;y++) ctx.fillText(y, 2, y*TILE_SIZE+TILE_SIZE/2);
}
function showChestTimer(floorIndex, boxIndex, x, y){
const modal=document.getElementById('chestModal');
const title=document.getElementById('chestModalTitle');
const body=document.getElementById('chestModalBody');
const boxInfo=mapData.getBoxInfo(floorIndex, boxIndex);
const rn=CHEST_RANK[boxInfo.rank]||boxInfo.rank;
title.textContent=`B${floorIndex+1}F ${C15} ${boxIndex+1} (Rank ${rn}) @ (${x}, ${y})`;
let results=[];
let currentStart=0;
let [currentItemEN, currentItemJP]=mapData.getBoxItem(floorIndex, boxIndex, 0);
for(let s=1;s<=255;s++){
let [itemEN, itemJP]=mapData.getBoxItem(floorIndex, boxIndex, s);
if(itemEN!==currentItemEN){
results.push({ start: currentStart, end: s-1, itemEN: currentItemEN, itemJP: currentItemJP });
currentStart=s;
currentItemEN=itemEN;
currentItemJP=itemJP;
}
}
results.push({ start: currentStart, end: 255, itemEN: currentItemEN, itemJP: currentItemJP });
let htmlEN='';
let htmlJP='';
results.forEach(res=>{
const rangeStr=res.start===res.end?(res.start+5).toString().padStart(3, '0'):`${(res.start+5).toString().padStart(3, '0')} ~ ${(res.end+5).toString().padStart(3, '0')}`;
const isHighlight=(res.start<=2&&res.end>=1);
const rowStyle=isHighlight?'background: rgba(255, 215, 0, 0.15);border-left: 3px solid #ffd700;padding-left: 8px;':'';
const textStyle=isHighlight?'color: #ffd700;font-weight: bold;':'';
htmlEN+=`<div class="timer-row" style="${rowStyle}">
<span class="timer-range" style="${textStyle}">${rangeStr}</span>
<span class="timer-item" style="${textStyle}">${res.itemEN}</span>
</div>`;
htmlJP+=`<div class="timer-row" style="${rowStyle}">
<span class="timer-range" style="${textStyle}">${rangeStr}</span>
<span class="timer-item" style="${textStyle}">${res.itemJP}</span>
</div>`;
});
body.style.padding='0';
body.style.overflowY='hidden';
body.style.display='flex';
body.style.flexDirection='column';
body.innerHTML=`<div class="modal-tabs">
<div id="tabEN" style="padding: 6px 16px;background: #1a1a3a;color: #ffd700;border: 1px solid #4a4a8a;border-bottom: none;border-radius: 6px 6px 0 0;cursor: pointer;font-size: 13px;font-weight: bold;margin-bottom: -2px;transition: all 0.2s;" onclick="switchTimerTab('EN')">English</div>
<div id="tabJP" style="padding: 6px 16px;background: #224;color: #888;border: 1px solid #333;border-bottom: none;border-radius: 6px 6px 0 0;cursor: pointer;font-size: 13px;font-weight: bold;margin-bottom: -2px;transition: all 0.2s;" onclick="switchTimerTab('JP')">日本語</div>
</div>
<div style="padding: 12px 16px;overflow-y: auto;flex: 1;">
<div id="listEN" style="display: block;">${htmlEN}</div>
<div id="listJP" style="display: none;">${htmlJP}</div>
</div>
`;
modal.style.display='flex';
switchTimerTab(DISPLAY_LANG!=='EN'?'JP':'EN');
}
function switchTimerTab(lang){
const tabEN=document.getElementById('tabEN');
const tabJP=document.getElementById('tabJP');
const listEN=document.getElementById('listEN');
const listJP=document.getElementById('listJP');
if(!tabEN||!tabJP)return;
if(lang==='EN'){
tabEN.style.background='#1a1a3a';
tabEN.style.color='#ffd700';
tabEN.style.borderColor='#4a4a8a';
tabJP.style.background='#224';
tabJP.style.color='#888';
tabJP.style.borderColor='#333';
listEN.style.display='block';
listJP.style.display='none';
}else{
tabJP.style.background='#1a1a3a';
tabJP.style.color='#ffd700';
tabJP.style.borderColor='#4a4a8a';
tabEN.style.background='#224';
tabEN.style.color='#888';
tabEN.style.borderColor='#333';
listJP.style.display='block';
listEN.style.display='none';
}
}
function closeChestModal(){
const modal=document.getElementById('chestModal');
if(modal) modal.style.display='none';
}
function switchTab(prefix, lang, activeColor, activeBorder, inactiveBg, inactiveColor, inactiveBorder){
const keys=['TW', 'EN', 'JP', 'SP'];
keys.forEach(key=>{
let tab=document.getElementById(prefix+'Tab'+key);
let list=document.getElementById(prefix+'List'+key);
if(!tab||!list)return;
if(key===lang){
tab.style.background='#1a1a3a';tab.style.color=activeColor;tab.style.borderColor=activeBorder;list.style.display='block';
}else{
tab.style.background=inactiveBg;tab.style.color=inactiveColor;tab.style.borderColor=inactiveBorder;list.style.display='none';
}
});
}
function openModal(modalId, tabPrefix, activeColor, activeBorder, inactiveBg, inactiveColor, inactiveBorder){
const modal=document.getElementById(modalId);
if(modal){
modal.style.display='flex';
const targetLang=['TW', 'EN', 'JP'].includes(DISPLAY_LANG)?DISPLAY_LANG:'TW';
switchTab(tabPrefix, targetLang, activeColor, activeBorder, inactiveBg, inactiveColor, inactiveBorder);
}
}
function openDisclaimerModal(){openModal('disclaimerModal', 'disc', '#ffd700', '#4a4a8a', '#224', '#888', '#333');}
function closeDisclaimerModal(){document.getElementById('disclaimerModal').style.display='none';}
function switchDisclaimerTab(lang){switchTab('disc', lang, '#ffd700', '#4a4a8a', '#224', '#888', '#333');}
function openh1Modal(){openModal('h1Modal', 'h1', '#0ff', '#4a4a8a', '#224', '#888', '#333');}
function closeh1Modal(){document.getElementById('h1Modal').style.display='none';}
function switchH1Tab(lang){switchTab('h1', lang, '#0ff', '#4a4a8a', '#224', '#888', '#333');}
function openh2Modal(){openModal('h2Modal', 'h2', '#0ff', '#4a4a8a', '#224', '#888', '#333');}
function closeh2Modal(){document.getElementById('h2Modal').style.display='none';}
function switchH2Tab(lang){switchTab('h2', lang, '#0ff', '#4a4a8a', '#224', '#888', '#333');}
function openh3Modal(){openModal('h3Modal', 'h3', '#0ca', '#055', '#001a1a', '#598', '#033');}
function closeh3Modal(){document.getElementById('h3Modal').style.display='none';}
function switchH3Tab(lang){switchTab('h3', lang, '#0ca', '#055', '#001a1a', '#598', '#033');}
window.addEventListener('DOMContentLoaded', ()=>{
function populateDropdownObj(selectId, dataObj, nameIdx1, nameIdx2){
let selectElement=document.getElementById(selectId);
if(!selectElement)return;
Object.keys(dataObj).forEach(key=>{
let item=dataObj[key];
let option=document.createElement("option");
option.value=key;
option.text=`${item[nameIdx1]} ${item[nameIdx2]}`;
selectElement.appendChild(option);
});
}
if(typeof PREFIX_NAMES!=='undefined') populateDropdownObj('cond_prefix', PREFIX_NAMES, 0, 1);
if(typeof SUFFIX_NAMES!=='undefined') populateDropdownObj('cond_suffix', SUFFIX_NAMES, 0, 1);
if(typeof LOCALE_NAMES!=='undefined') populateDropdownObj('cond_locale', LOCALE_NAMES, 0, 1);
if(typeof ENV_NAMES!=='undefined') populateDropdownObj('cond_env', ENV_NAMES, 0, 1);
if(typeof BOSS_NAMES!=='undefined') populateDropdownObj('cond_boss', BOSS_NAMES, 0, 2);
const atCountSel=document.getElementById('atConsecutiveCount');
if(atCountSel&&typeof AT_O!=='undefined'){
AT_O.forEach(pair=>{
let opt=document.createElement('option');
opt.value=pair[0];
opt.textContent=pair[1];
atCountSel.appendChild(opt);
});
}
let topIds=["0B5","01B","0B9"];
let orderedRemainingIds=[];
let envOrder=[1,2,3,4,5];
envOrder.forEach(env=>{
if(ONLY_MONSTERS[env]){
ONLY_MONSTERS[env].forEach(id=>{
if(id&&!topIds.includes(id)&&!orderedRemainingIds.includes(id)){
orderedRemainingIds.push(id);
}
});
}
});
let sel=document.getElementById('cond_only_mon');
if(sel){
const createOpt=(id)=>{
let opt=document.createElement('option');
let data=MONSTER_DATA[id];
opt.value=data.en;
opt.textContent=`${data.en} ${data.jp}`;
return opt;
};
topIds.forEach(id=>sel.appendChild(createOpt(id)));
let separator=document.createElement('option');
separator.disabled=true;
separator.textContent="──────────";
sel.appendChild(separator);
orderedRemainingIds.forEach(id=>sel.appendChild(createOpt(id)));
}
if(typeof TableR!=='undefined'){
TableR.forEach(pair =>{i18nDict['I_'+pair[0]]=T(pair[0], pair[1], pair[1]);});
}
Object.assign(i18nDict, {
"I_Millionaire": T("Millionaire","大富豪","大富豪"),
"I_S weapon": T("S weapon","S武器","S武器")
});
document.querySelectorAll('[data-i18n]').forEach(el=>{
const key=el.getAttribute('data-i18n');
let text=i18nDict[key];
if(text){
if(el.tagName==='OPTION'&&b3fThreeItems.includes(el.value)){text+=T(' (3)', ' (3)', ' (3)');}
el.textContent=text;
}
});
const _setOg=(id, t) =>{const el=document.getElementById(id);if(el) el.label=t;};
_setOg('og1', T('Materials','素材/消耗品','素材/消耗品'));
_setOg('ogS', T('B9F Items','B9F物品','B9Fアイテム'));
_setOg('og2', T('Rare Equipment','限定裝備/大富豪','限定装備/大富豪'));
_setOg('og3', T('Cursed Equipment','詛咒裝備','呪い装備'));
_setOg('og4', T('Other Equipment','其他裝備','その他の装備'));
_setOg('og5', T('Chest Monsters','寶箱怪','宝箱モンスター'));
const stepsLbl=document.getElementById('lblSteps');
if(stepsLbl) stepsLbl.textContent=T('Steps','步數','歩');
const srDiv=document.getElementById('searchResults');
if(srDiv&&srDiv.children.length<=1) srDiv.innerHTML='<div style="color:#666;font-size:13px;text-align:center;margin-top:20px;">'+J02+'</div>';
const prefixEl=document.getElementById('cond_prefix');
const suffixEl=document.getElementById('cond_suffix');
const elistEl=document.getElementById('cond_elist');
const onlyMonEl=document.getElementById('cond_only_mon');
const seedInput=document.getElementById('seed');
const rankSelect=document.getElementById('rank');
if(seedInput){
seedInput.addEventListener('keydown', (e)=>{
if(e.key==='Enter') calculate();
});
}
if(rankSelect){
rankSelect.addEventListener('change', ()=>{
if(mapData) calculate();
});
}
function initFreeSearchUI(){
const container=document.getElementById('fs_container');
if(!container)return;
let floorOpts=`<option value="0">---</option>`;
for(let i=3;i<=16;i++) floorOpts+=`<option value="${i}">B${i}F</option>`;
let boxOpts=`
<option value="-1">---</option>
<option value="0">1</option>
<option value="1">2</option>
<option value="2">3${T('rd','(整列)','(整列)')}</option>
<option value="3">${T('Non-3','非整列','非整列')}</option>
`;
let rankOpts=`<option value="0">---</option>`;
['S','A','B','C','D','E','F','G','H','I'].forEach((r,idx) =>{rankOpts+=`<option value="${10-idx}">${r}</option>`;});
window.updateFSItems=function(groupId){
let rankSelect=document.getElementById(`fs_r_${groupId}`);
let itemSelect=document.getElementById(`fs_i_${groupId}`);
if(!rankSelect||!itemSelect)return;
let currentVal=itemSelect.value;
let r=parseInt(rankSelect.value);
let itemOpts=`<option value="ANY">---</option>`;
let seen=new Set();
let hasSpecial=false;
if(r===0||r===10){
itemOpts+=`<option value="Sainted soma">${getDispItem("Sainted soma")}</option>`;
seen.add("Sainted soma");
hasSpecial=true;
}
if(r===0||r===9){
itemOpts+=`<option value="Ethereal stone">${getDispItem("Ethereal stone")}</option>`;
seen.add("Ethereal stone");
hasSpecial=true;
}
if(r===0||r===9||r===8){
itemOpts+=`<option value="Rich">${T('Millionaire','大富豪','大富豪')}</option>`;
hasSpecial=true;
}
if(r===0||r===8){
itemOpts+=`<option value="Attribeauty">${getDispItem("Attribeauty")}</option>`;
seen.add("Attribeauty");
hasSpecial=true;
}
if(r===0||r===9){
itemOpts+=`<option value="Metasla">${T('Metal Slime Equips','金屬史萊姆裝備','メタスラ装備')}</option>`;
hasSpecial=true;
}
if(r===0||r===10){
itemOpts+=`<option value="S_wpn">${T('S Weapon','S武器','S武器')}</option>`;
hasSpecial=true;
}
if(hasSpecial){
itemOpts+=`<option disabled>──────</option>`;
}
let validItems=[];
if(typeof TableR!=='undefined'&&typeof TableO!=='undefined'&&typeof TableQ!=='undefined'){
if(r===0){
TableR.forEach(p =>{if(!seen.has(p[0])){seen.add(p[0]);validItems.push(p[0]);} });
}else{
let startIdx=TableO[r-1];
let endIdx=(TableO[r]!==undefined)?TableO[r]:TableQ.length;
for(let i=startIdx;i<endIdx;i++){
let itemName=TableR[TableQ[i]][0];
if(!seen.has(itemName)){seen.add(itemName);validItems.push(itemName);}
}
}
validItems.forEach(en =>{itemOpts+=`<option value="${en}">${getDispItem(en)}</option>`;});
}
itemSelect.innerHTML=itemOpts;
if(itemSelect.querySelector(`option[value="${currentVal}"]`)){
itemSelect.value=currentVal;
}else{
itemSelect.value="ANY";
}
};
for(let i=1;i<=3;i++){
container.innerHTML+=`
<div style="display:flex;gap:2px;align-items:center;">
<span style="color:#0ff;font-size:10px;width:10px;text-align:center;">${i}</span>
<select id="fs_f_${i}" style="width:45px;padding:0;font-size:11px;height:24px;background:#000;color:#0f0;border:1px solid #555;">${floorOpts}</select>
<select id="fs_b_${i}" style="width:50px;padding:0;font-size:11px;height:24px;background:#000;color:#0f0;border:1px solid #555;">${boxOpts}</select>
<select id="fs_r_${i}" onchange="updateFSItems(${i})" style="width:40px;padding:0;font-size:11px;height:24px;background:#000;color:#0f0;border:1px solid #555;">${rankOpts}</select>
<select id="fs_i_${i}" style="flex:1;width:50px;padding:0;font-size:11px;height:24px;background:#000;color:#0f0;border:1px solid #555;text-overflow:ellipsis;"></select>
<input type="number" inputmode="numeric" id="fs_t_${i}" value="7" min="5" placeholder="sec" style="width:35px;padding:0;font-size:11px;height:24px;background:#000;color:#0f0;border:1px solid #555;text-align:center;">
</div>`;
}
for(let i=1;i<=3;i++){
updateFSItems(i);
}
}
initFreeSearchUI();
if(typeof initSeedInspectorUI==='function'){initSeedInspectorUI();}
calculate();
});
let isModalDragging=false;
const allModalIds=['chestModal','disclaimerModal','h1Modal','h2Modal','h3Modal'];
window.addEventListener('mousedown', (e)=>{
if(allModalIds.includes(e.target.id)){isModalDragging=false;}
else {isModalDragging=true;}
});
window.addEventListener('mouseup', (e)=>{
if(!isModalDragging&&allModalIds.includes(e.target.id)){e.target.style.display='none';}
isModalDragging=false;
});
function exportSearchResults(){
try {
const items=document.querySelectorAll('#searchGrid .search-result-item, #atSearchGrid .search-result-item');
if(items.length===0){
alert(A06);
return;
}
let txtContent="RANK,SEED,"+T('Result','搜尋結果','検索結果')+"\n";
items.forEach(item=>{
let lines=item.innerText.split('\n').map(s=>s.trim()).filter(s=>s!=="");
if(lines.length===0)return;
let firstLine=lines[0];
let seed="";
let rank="--";
let seedMatch=firstLine.match(/^([0-9A-F]{4})/i);
if(seedMatch) seed=seedMatch[1].toUpperCase();
let rankMatch=firstLine.match(/\(Rank\s*([0-9A-F]{2})\)/i);
if(rankMatch) rank=rankMatch[1].toUpperCase();
let resultLines=lines.slice(1).filter(line=>{
if(/Lv\.?\s*\d+/i.test(line))return false;
if(/^(Caves|Ruins|Ice|Water|Fire|洞窟|遺跡|氷|水|火山)$/i.test(line))return false;
return true;
});
let resultText=resultLines.join(" / ");
if(/^(B3F|B4F)\s+(Solo|Party|一人旅|即開)/i.test(resultText)){
const itemName=document.getElementById('searchItem').value;
resultText=`${getDispItem(itemName)} ${resultText}`;
}
else if(/^B9F\s+(Solo|Party|一人旅|即開)/i.test(resultText)){
const itemName=document.getElementById('searchItem').value;
resultText=`${getDispItem(itemName)} ${resultText}`;
}
let hasD=item.dataset.hasD==="true";
if(hasD){
txtContent+=`${rank},${seed},${resultText},D\n`;
}else{
txtContent+=`${rank},${seed},${resultText}\n`;
}
});
const blob=new Blob([txtContent],{type: 'text/plain;charset=utf-8' });
const url=URL.createObjectURL(blob);
const a=document.createElement('a');
a.href=url;
a.download=`DQ9_Search_Results_${new Date().getTime()}.txt`;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);
} catch (error){
alert(A07+error.message);
console.error("匯出錯誤詳細資訊：", error);
}
}