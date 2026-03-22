const TILE_SIZE=22;
const COLORS={
0:'#f5f0e0',
1:'#000000',
2:'#e8e0c8',
3:'#000000',
4:'#44cc44',
5:'#ff4444',
6:'#ffd700',
8:'#ccd8c0',
};
const WALL_COLOR='#000000';
let mapData=null;
let activeFloor=0;
function calculate(){
const seedStr=document.getElementById('seed').value.trim();
const seed=parseInt(seedStr,16);
const rank=parseInt(document.getElementById('rank').value);
if(isNaN(seed)||seed<0||seed>0x7FFF ||!/^[0-9a-fA-F]{1,4}$/.test(seedStr)){
document.getElementById('result').innerHTML='<div class="error">Seed must be 0000~7FFF</div>';
return;
}
mapData=new GrottoDetail();
mapData.MapSeed=seed;
mapData.MapRank=rank;
mapData.calculateDetail();
activeFloor=0;
renderResult();
}
function renderResult(){
const safeZone=document.getElementById('controls_container');
const controlsDiv=document.getElementById('single_map_controls');
if(safeZone&&controlsDiv){
safeZone.appendChild(controlsDiv);
}
const el=document.getElementById('result');
if(!mapData||mapData.floorCount===0){
el.innerHTML='<div class="error">Invalid Seed/Rank</div>';
return;
}
const seedHex=mapData.MapSeed.toString(16).toUpperCase().padStart(4,'0');
const rankHex=mapData.MapRank.toString(16).toUpperCase().padStart(2,'0');
const locData=calcLocations(mapData.MapSeed,rankHex);
let locHtmlString='';
if(locData.outputOrder.length>0){
const locStrings=locData.outputOrder.map(item=>{
const bqs=Array.from(locData.seenLocations[item.location]);
return `${item.location.toString(16).toUpperCase().padStart(2,'0')}(${formatRanges(bqs)})`;
});
locHtmlString=locStrings.join('<br>');
}else{
locHtmlString='No Location';
}
let currentSeed=mapData.MapSeed;
const atValues=[];
for(let i=1;i<=37;i++){
currentSeed=lcg(currentSeed);
if(i>=35&&i<=37){
atValues.push((currentSeed>>>16)& 0x7FFF);
}
}
const atHtmlString=`[35] ${atValues[0]}<br>[36] ${atValues[1]}<br>[37] ${atValues[2]}`;
let boxCounts={10:0,9:0,8:0,7:0,6:0,5:0,4:0,3:0,2:0,1:0};
let totalBoxes=0;
for(let f=2;f<mapData.floorCount;f++){
let boxes=mapData.getTreasureBoxCount(f);
for(let b=0;b<boxes;b++){
boxCounts[mapData.getTreasureBoxInfo(f,b).rank]++;
totalBoxes++;
}
}
let boxCountHtmlArr=[];
for(let r=10;r>=1;r--){
if(boxCounts[r]>0){
let color="#aaa";
if(r===10)color="#ffd700";
else if(r>=8)color="#ff4444";
else if(r>=4)color="#44cc44";
else if(r===3)color="#62a1ff";
boxCountHtmlArr.push(`<span style="margin-right:14px;display:inline-block;background:#000;padding:2px 8px;border-radius:4px;border:1px solid #333;"><strong style="color:${color};font-size:14px;text-shadow:1px 1px 1px #000;">${RANK_NAMES[r]}</strong><span style="color:#fff;font-weight:bold;">${boxCounts[r]}</span></span>`);
}
}
let boxString=boxCountHtmlArr.length>0?boxCountHtmlArr.join(''):'<span style="color:#888;">None</span>';
let html=`<div class="info-bar">
<span>Rank:<strong>${rankHex}</strong></span>
<span>Seed:<strong>${seedHex}</strong></span>
<span>Name:<strong style="display:inline-block;vertical-align:top;">
<span style="display:block;color:#ffd700">${mapData.mapName}</span>
<span style="display:block;color:#ffd700">${mapData.mapNameJP}</span>
</strong></span>
<span>Environment:<strong style="display:inline-block;vertical-align:top;">
<span style="display:block;color:#ffd700">${mapData.mapTypeName}</span>
<span style="display:block;color:#ffd700">${mapData.mapTypeNameJP}</span>
</strong></span>
<span>SMR:<strong>${mapData.monsterRank}</strong></span>
<span>Floor:<strong>${mapData.floorCount}</strong></span>
<span>Boss:<strong style="display:inline-block;vertical-align:top;">
<span style="display:block;color:#ffd700">${mapData.bossName}</span>
<span style="display:block;color:#ffd700">${mapData.bossNameJP}</span>
</strong></span>
<span style="display:inline-block;vertical-align:top;border-left:1px dashed #4a4a8a;padding-left:15px;margin-left:5px;">Location & BQ:
<strong style="display:block;color:#00ffff;font-family:monospace;font-size:12px;margin-top:2px;">${locHtmlString}</strong>
</span>
<span style="display:inline-block;vertical-align:top;border-left:1px dashed #4a4a8a;padding-left:15px;margin-left:5px;">AT:
<strong style="display:block;color:#44cc44;font-family:monospace;font-size:12px;margin-top:2px;text-align:left;">${atHtmlString}</strong>
</span>
</div>
<div class="info-bar" style="align-items:center;background:#16162a;border-bottom:1px solid #4a4a8a;padding:10px 20px;">
<span style="color:#8888bb;font-weight:bold;margin-right:10px;">📦 Chests:</span>
<div style="display:flex;flex-wrap:wrap;align-items:center;flex:1;">
${boxString}
<span style="margin-left:auto;padding-left:12px;border-left:2px solid #4a4a8a;color:#8cc8ff;font-weight:bold;margin-right:15px;">Total ${totalBoxes}</span>
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
document.querySelectorAll('.floor-tab').forEach((t,i)=>t.classList.toggle('active',i===f));
renderFloor(f);
}
function renderFloor(f){
const container=document.getElementById('floor-content');
const w=mapData.getFloorWidth(f);
const h=mapData.getFloorHeight(f);
const map=mapData.getFloorMap(f);
const up=mapData.getUpStair(f);
const down=mapData.getDownStair(f);
const boxCount=mapData.getTreasureBoxCount(f);
const canvasW=w*TILE_SIZE;
const canvasH=h*TILE_SIZE;
let infoHtml='<div class="floor-info">';
infoHtml+=`<h3>B${f+1}F</h3>`;
infoHtml+='<table>';
infoHtml+=`<tr><td>Size</td><td>${w}× ${h}</td></tr>`;
infoHtml+=`<tr><td>Upstairs ▲</td><td>(${up.x},${up.y})</td></tr>`;
if(f<mapData.floorCount-1)
infoHtml+=`<tr><td>Downstairs ▼</td><td>(${down.x},${down.y})</td></tr>`;
else
infoHtml+=`<tr><td>Boss</td><td>(${down.x},${down.y})</td></tr>`;
const elistInfo=getFloorElistInfo(mapData,f);
let stateHtml=elistInfo.state?`<span style="background:#ff44cc;color:#fff;padding:1px 5px;border-radius:3px;font-size:10px;margin-left:6px;white-space:nowrap;">${elistInfo.state}</span>`:'';
let dHtml=elistInfo.dValue>0?`<span style="background:#ffaa00;color:#000;padding:1px 5px;border-radius:3px;font-size:10px;margin-left:4px;white-space:nowrap;">${elistInfo.dValue}</span>`:'';
infoHtml+=`<tr><td style="padding:6px 10px;border-bottom:1px solid #222;color:#8888bb;">ElistOfs</td><td style="padding:6px 10px;border-bottom:1px solid #222;font-family:monospace;color:#44cc44;">${elistInfo.hex}${stateHtml}${dHtml}</td></tr>`;
if(boxCount>0){
infoHtml+=`<tr><td>Chest</td><td>${boxCount}<font color=666666>(Tap to see Chest Timer)</font></td></tr>`;
for(let i=0;i<boxCount;i++){
const box=mapData.getTreasureBoxInfo(f,i);
const rn=RANK_NAMES[box.rank]||box.rank;
const soloEN=mapData.getBoxItem(f,i,1)||'?';
const soloJP=mapData.getBoxItemJP(f,i,1)||'?';
const partyEN=mapData.getBoxItem(f,i,2)||'?';
const partyJP=mapData.getBoxItemJP(f,i,2)||'?';
infoHtml+=`<tr><td>Chest ${i+1}</td><td>
<div class="chest-row"><span class="chest-rank rank-${rn}">Rank ${rn}</span>(${box.x},${box.y})</div>
<div class="chest-item"><span class="chest-item-solo">Item(Solo):${soloEN}</span></div>
<div class="chest-item"><span class="chest-item-party">Item(Party):${partyEN}</span></div>
</td></tr>`;
}
}else{
infoHtml+=`<tr><td>Chest</td><td>None</td></tr>`;
}
infoHtml+='</table>';
infoHtml+='<div class="legend" style="margin-top:20px">';
infoHtml+='<div class="legend-item"><div class="legend-swatch" style="background:#f5f0e0"></div>Floor</div>';
infoHtml+='<div class="legend-item"><div class="legend-swatch" style="background:#000"></div>Wall</div>';
infoHtml+='<div class="legend-item"><div class="legend-swatch" style="background:#e8e0c8"></div>Corridor</div>';
infoHtml+='<div class="legend-item"><div class="legend-swatch" style="background:#ccd8c0"></div>Door</div>';
infoHtml+='<div class="legend-item"><div class="legend-swatch" style="background:#44cc44"></div>Upstairs</div>';
infoHtml+='<div class="legend-item"><div class="legend-swatch" style="background:#ff4444"></div>Downstairs</div>';
infoHtml+='<div class="legend-item"><div class="legend-swatch" style="background:#ffd700"></div>Chest</div>';
infoHtml+='</div></div>';
container.innerHTML=`<div class="map-container"><canvas id="mapCanvas" width="${canvasW}" height="${canvasH}" title=""></canvas><div id="coordDisplay" style="position:absolute;bottom:4px;right:8px;font-size:11px;color:#aaa;font-family:monospace;pointer-events:none"></div></div>${infoHtml}`;
document.querySelector('.map-container').style.position='relative';
const mapCanvas=document.getElementById('mapCanvas');
mapCanvas.addEventListener('mousemove',(e)=>{
const rect=mapCanvas.getBoundingClientRect();
const mx=Math.floor((e.clientX-rect.left)/ TILE_SIZE);
const my=Math.floor((e.clientY-rect.top)/ TILE_SIZE);
const coordEl=document.getElementById('coordDisplay');
if(mx>=0&&mx<w&&my>=0&&my<h){
const tNames={0:'Floor',1:'Wall',2:'Corridor',3:'Wall',4:'Upstairs',5:'Downstairs',6:'Chest',8:'Door'};
const tile=map[my][mx];
let label=tNames[tile]||`tile:${tile}`;
if(mx===up.x&&my===up.y)label='Upstairs▲';
if(mx===down.x&&my===down.y)label=(f<mapData.floorCount-1)?'Downstairs▼':'Boss▼';
coordEl.textContent=`(${mx},${my}) ${label}`;
}else{
coordEl.textContent='';
}
});
const boxPositions=new Map();
for(let i=0;i<boxCount;i++){
const b=mapData.getTreasureBoxInfo(f,i);
boxPositions.set(b.x+','+b.y,i+1);
}
mapCanvas.addEventListener('click',(e)=>{
const rect=mapCanvas.getBoundingClientRect();
const mx=Math.floor((e.clientX-rect.left)/ TILE_SIZE);
const my=Math.floor((e.clientY-rect.top)/ TILE_SIZE);
if(boxPositions&&boxPositions.has(mx+','+my)){
const boxNum=boxPositions.get(mx+','+my);
showChestTimer(f,boxNum-1,mx,my);
}
});
const canvas=document.getElementById('mapCanvas');
const ctx=canvas.getContext('2d');
ctx.fillStyle='#000';
ctx.fillRect(0,0,canvasW,canvasH);
for(let y=0;y<h;y++){
for(let x=0;x<w;x++){
let tile=map[y][x];
const px=x*TILE_SIZE;
const py=y*TILE_SIZE;
const isUpStair=(x===up.x&&y===up.y);
const isDownStair=(x===down.x&&y===down.y);
const boxNum=boxPositions.get(x+','+y)||0;
const isBox=boxNum>0;
let displayTile=tile;
if(isUpStair)displayTile=4;
else if(isDownStair)displayTile=5;
else if(isBox)displayTile=6;
else if(tile===4||tile===5||tile===6)displayTile=0;
if(displayTile===1||displayTile===3){
ctx.fillStyle=WALL_COLOR;
ctx.fillRect(px,py,TILE_SIZE,TILE_SIZE);
}else{
ctx.fillStyle=COLORS[displayTile]||COLORS[0];
ctx.fillRect(px,py,TILE_SIZE,TILE_SIZE);
ctx.strokeStyle='rgba(0,0,0,0.08)';
ctx.strokeRect(px+0.5,py+0.5,TILE_SIZE-1,TILE_SIZE-1);
}
ctx.textAlign='center';
ctx.textBaseline='middle';
if(isUpStair){
ctx.fillStyle='#000';
ctx.font='bold 12px sans-serif';
ctx.fillText('▲',px+TILE_SIZE/2,py+TILE_SIZE/2);
}else if(isDownStair){
ctx.fillStyle='#000';
ctx.font='bold 12px sans-serif';
ctx.fillText('▼',px+TILE_SIZE/2,py+TILE_SIZE/2);
}else if(isBox){
ctx.fillStyle='#000';
ctx.font='bold 11px sans-serif';
ctx.fillText(boxNum,px+TILE_SIZE/2,py+TILE_SIZE/2);
}
}
}
ctx.fillStyle='rgba(0,0,0,0.3)';
ctx.font='9px monospace';
ctx.textAlign='center';
ctx.textBaseline='top';
for(let x=0;x<w;x++)ctx.fillText(x,x*TILE_SIZE+TILE_SIZE/2,2);
ctx.textBaseline='middle';
ctx.textAlign='left';
for(let y=0;y<h;y++)ctx.fillText(y,2,y*TILE_SIZE+TILE_SIZE/2);
}
function showChestTimer(floorIndex,boxIndex,x,y){
const modal=document.getElementById('chestModal');
const title=document.getElementById('chestModalTitle');
const body=document.getElementById('chestModalBody');
const boxInfo=mapData.getTreasureBoxInfo(floorIndex,boxIndex);
const rn=RANK_NAMES[boxInfo.rank]||boxInfo.rank;
title.textContent=`B${floorIndex+1}F Chest ${boxIndex+1}(Rank ${rn})@(${x},${y})`;
let results=[];
let currentStart=0;
let currentItemEN=mapData.getBoxItem(floorIndex,boxIndex,0);
let currentItemJP=mapData.getBoxItemJP(floorIndex,boxIndex,0);
for(let s=1;s<=255;s++){
let itemEN=mapData.getBoxItem(floorIndex,boxIndex,s);
let itemJP=mapData.getBoxItemJP(floorIndex,boxIndex,s);
if(itemEN!==currentItemEN){
results.push({start:currentStart,end:s-1,itemEN:currentItemEN,itemJP:currentItemJP});
currentStart=s;
currentItemEN=itemEN;
currentItemJP=itemJP;
}
}
results.push({start:currentStart,end:255,itemEN:currentItemEN,itemJP:currentItemJP});
let htmlEN='';
let htmlJP='';
results.forEach(res=>{
const rangeStr=res.start===res.end 
?(res.start+5).toString().padStart(3,'0')
:`${(res.start+5).toString().padStart(3,'0')}~ ${(res.end+5).toString().padStart(3,'0')}`;
const isHighlight=(res.start<=2&&res.end>=1);
const rowStyle=isHighlight?'background:rgba(255,215,0,0.15);border-left:3px solid #ffd700;padding-left:8px;':'';
const textStyle=isHighlight?'color:#ffd700;font-weight:bold;':'';
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
body.innerHTML=`
<div style="display:flex;gap:4px;background:#111128;padding:12px 16px 0 16px;border-bottom:2px solid #4a4a8a;flex-shrink:0;">
<div id="tabEN" style="padding:6px 16px;background:#1a1a3a;color:#ffd700;border:1px solid #4a4a8a;border-bottom:none;border-radius:6px 6px 0 0;cursor:pointer;font-size:13px;font-weight:bold;margin-bottom:-2px;transition:all 0.2s;" onclick="switchTimerTab('EN')">English</div>
<div id="tabJP" style="padding:6px 16px;background:#222244;color:#888;border:1px solid #333;border-bottom:none;border-radius:6px 6px 0 0;cursor:pointer;font-size:13px;font-weight:bold;margin-bottom:-2px;transition:all 0.2s;" onclick="switchTimerTab('JP')">日本語</div>
</div>
<div style="padding:12px 16px;overflow-y:auto;flex:1;">
<div id="listEN" style="display:block;">${htmlEN}</div>
<div id="listJP" style="display:none;">${htmlJP}</div>
</div>
`;
modal.style.display='flex';
switchTimerTab('EN');
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
tabJP.style.background='#222244';
tabJP.style.color='#888';
tabJP.style.borderColor='#333';
listEN.style.display='block';
listJP.style.display='none';
}else{
tabJP.style.background='#1a1a3a';
tabJP.style.color='#ffd700';
tabJP.style.borderColor='#4a4a8a';
tabEN.style.background='#222244';
tabEN.style.color='#888';
tabEN.style.borderColor='#333';
listJP.style.display='block';
listEN.style.display='none';
}
}
let isModalDragging=false;
function closeChestModal(e){
if(e&&e.target!==e.currentTarget)return;
const modal=document.getElementById('chestModal');
if(modal)modal.style.display='none';
}
window.addEventListener('DOMContentLoaded',()=>{
function populateDropdownObj(selectId,dataObj,nameIdx1,nameIdx2){
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
if(typeof PREFIX_NAMES!=='undefined')populateDropdownObj('cond_prefix',PREFIX_NAMES,0,1);
if(typeof SUFFIX_NAMES!=='undefined')populateDropdownObj('cond_suffix',SUFFIX_NAMES,0,1);
if(typeof LOCALE_NAMES!=='undefined')populateDropdownObj('cond_locale',LOCALE_NAMES,0,1);
if(typeof ENV_NAMES!=='undefined')populateDropdownObj('cond_env',ENV_NAMES,0,1);
if(typeof BOSS_NAMES!=='undefined')populateDropdownObj('cond_boss',BOSS_NAMES,0,2);
let topIds=["0B5","01B","0B9"];
let orderedRemainingIds=[];
let envOrder=['Caves','Ruins','Ice','Water','Fire'];
envOrder.forEach(env=>{
if(ONLY_MONSTERS[env]){
ONLY_MONSTERS[env].forEach(id=>{
if(id &&!topIds.includes(id)&&!orderedRemainingIds.includes(id)){
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
const prefixEl=document.getElementById('cond_prefix');
const suffixEl=document.getElementById('cond_suffix');
const elistEl=document.getElementById('cond_elist');
const onlyMonEl=document.getElementById('cond_only_mon');
if(prefixEl)prefixEl.addEventListener('change',checkBQStatus);
if(suffixEl)suffixEl.addEventListener('change',checkBQStatus);
if(elistEl)elistEl.addEventListener('change',checkBQStatus);
if(onlyMonEl)onlyMonEl.addEventListener('change',checkBQStatus);
const seedInput=document.getElementById('seed');
const rankSelect=document.getElementById('rank');
if(seedInput){
seedInput.addEventListener('keydown',(e)=>{
if(e.key==='Enter')calculate();
});
}
if(rankSelect){
rankSelect.addEventListener('change',()=>{
if(mapData)calculate();
});
}
const chestModal=document.getElementById('chestModal');
if(chestModal){
chestModal.addEventListener('mousedown',(e)=>{
isModalDragging=(e.target!==chestModal);
});
chestModal.addEventListener('mouseup',(e)=>{
if(!isModalDragging&&e.target===chestModal){
closeChestModal();
}
});
}
calculate();
});
function openDisclaimerModal(){
const modal=document.getElementById('disclaimerModal');
if(modal){
modal.style.display='flex';
switchDisclaimerTab('EN');
}
}
function closeDisclaimerModal(e){
if(e&&e.target!==e.currentTarget)return;
const modal=document.getElementById('disclaimerModal');
if(modal)modal.style.display='none';
}
function switchDisclaimerTab(lang){
const tabs={
'TW':document.getElementById('discTabTW'),
'EN':document.getElementById('discTabEN'),
'JP':document.getElementById('discTabJP')
};
const lists={
'TW':document.getElementById('discListTW'),
'EN':document.getElementById('discListEN'),
'JP':document.getElementById('discListJP')
};
for(let key in tabs){
if(!tabs[key])continue;
if(key===lang){
tabs[key].style.background='#1a1a3a';
tabs[key].style.color='#ffd700';
tabs[key].style.borderColor='#4a4a8a';
lists[key].style.display='block';
}else{
tabs[key].style.background='#222244';
tabs[key].style.color='#888';
tabs[key].style.borderColor='#333';
lists[key].style.display='none';
}
}
}
function openHelpModal(){
const modal=document.getElementById('helpModal');
if(modal){
modal.style.display='flex';
switchHelpTab('EN');
}
}
function closeHelpModal(e){
if(e&&e.target!==e.currentTarget)return;
const modal=document.getElementById('helpModal');
if(modal)modal.style.display='none';
}
function switchHelpTab(lang){
const tabs={
'TW':document.getElementById('helpTabTW'),
'EN':document.getElementById('helpTabEN'),
'JP':document.getElementById('helpTabJP')
};
const lists={
'TW':document.getElementById('helpListTW'),
'EN':document.getElementById('helpListEN'),
'JP':document.getElementById('helpListJP')
};
for(let key in tabs){
if(!tabs[key])continue;
if(key===lang){
tabs[key].style.background='#1a1a3a';
tabs[key].style.color='#00ffff';
tabs[key].style.borderColor='#4a4a8a';
lists[key].style.display='block';
}else{
tabs[key].style.background='#222244';
tabs[key].style.color='#888';
tabs[key].style.borderColor='#333';
lists[key].style.display='none';
}
}
}
window.addEventListener('mousedown',(e)=>{
let helpModal=document.getElementById('helpModal');
let discModal=document.getElementById('disclaimerModal');
if(helpModal&&e.target===helpModal)isModalDragging=true;
if(discModal&&e.target===discModal)isModalDragging=true;
});
function exportSearchResults(){
try{
const items=document.querySelectorAll('#searchGrid .search-result-item,#atSearchGrid .search-result-item');
if(items.length===0){
alert("No output! Please perform a search first.");
return;
}
let txtContent="RANK,SEED,Result\n";
items.forEach(item=>{
let lines=item.innerText.split('\n').map(s=>s.trim()).filter(s=>s!=="");
if(lines.length===0)return;
let firstLine=lines[0];
let seed="";
let rank="--";
let seedMatch=firstLine.match(/^([0-9A-F]{4})/i);
if(seedMatch)seed=seedMatch[1].toUpperCase();
let rankMatch=firstLine.match(/\(Rank\s*([0-9A-F]{2})\)/i);
if(rankMatch)rank=rankMatch[1].toUpperCase();
let resultLines=lines.slice(1).filter(line=>{
if(/Lv\.?\s*\d+/i.test(line))return false;
if(/^(Caves|Ruins|Ice|Water|Fire|洞窟|遺跡|氷|水|火山)$/i.test(line))return false;
return true;
});
let resultText=resultLines.join(" / ");
if(/^(B3F|B4F)\s+(Solo|Party)/i.test(resultText)){
const itemName=document.getElementById('searchItem').value;
resultText=`${itemName}${resultText}`;
}
else if(/^B9F\s+(Solo|Party)/i.test(resultText)){
const itemName=document.getElementById('searchItemB9F').value;
resultText=`${itemName}${resultText}`;
}
let hasD=item.dataset.hasD==="true";
if(hasD){
txtContent+=`${rank},${seed},${resultText},D\n`;
}else{
txtContent+=`${rank},${seed},${resultText}\n`;
}
});
const blob=new Blob([txtContent],{type:'text/plain;charset=utf-8'});
const url=URL.createObjectURL(blob);
const a=document.createElement('a');
a.href=url;
a.download=`DQ9_Search_Results_${new Date().getTime()}.txt`;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);
}catch(error){
alert("❌ Output error！\n\nReason："+error.message);
console.error("Details：",error);
}
}