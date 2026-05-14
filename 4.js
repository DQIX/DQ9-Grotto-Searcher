function calcDeftness(at){
const raw=Math.ceil(at/32768*100-2)*20;
if(raw<=0)return 0;
if(raw>999)return 1000;
return raw;
}
function formatDeftness(at){
const deft=calcDeftness(at);
const color=deft>=1000?'#f44':deft<=1?'#888':'#39C5BB';
const label=deft>=1000?'1000':(deft<=0?'1':deft.toString());
return{deft,color,label};
}
function siFormatAT(val){
if(val<-2)return '⊖';
if(val>458)return '⊕';
return val;
}
function getATPair(seed,N){
let s=seed>>>0;
for(let i=0;i<N;i++) s=lcg(s);
const atN=(s>>>16)&0x7FFF;
s=lcg(s);
const atN1=(s>>>16)&0x7FFF;
return{atN,atN1};
}
function atUpd(){
const envType=parseInt(document.getElementById('at_env').value);
const floorMR=parseInt(document.getElementById('at_mr').value);
const sel=document.getElementById('at_mon');
sel.innerHTML='';
const spawnList=SPAWN_DB[envType]&&SPAWN_DB[envType][floorMR];
if(!spawnList)return;
for(const entry of spawnList){
if(entry.length<3)continue;
const md=MONSTER_DATA[entry[0]];
if(!md)continue;
const opt=document.createElement('option');
opt.value=entry[0];
opt.textContent=`${md.jp} (${md.en})`;
sel.appendChild(opt);
}
if(typeof updateATOnlyMonsters==='function') updateATOnlyMonsters();
}
if(document.readyState==='loading'){
document.addEventListener('DOMContentLoaded',atinit);
}else{
setTimeout(atinit,0);
}
function atinit(){
atUpd();
const patSel=document.getElementById('at_pattern');
if(patSel&&typeof AT_O!=='undefined'){
AT_O.forEach(pair=>{
const opt=document.createElement('option');
opt.value=pair[0];
opt.textContent=pair[1];
patSel.appendChild(opt);
});
}
const lbl=document.getElementById('at_lblSteps');
if(lbl) lbl.textContent=T('Steps','步數','ｽﾃｯﾌﾟ');
}
function getMonsterNameByAT(atVal,envType,floorMR){
const spawnList=SPAWN_DB[envType]&&SPAWN_DB[envType][floorMR];
if(!spawnList)return "?";
for(const entry of spawnList){
if(entry.length>=3&&atVal>=entry[1]&&atVal<=entry[2]){
const md=MONSTER_DATA[entry[0]];
return md?(DISPLAY_LANG!=='EN'?md.jp:md.en):"?";
}
}
return "?";
}
function updateATOnlyMonsters(){
const envType=parseInt(document.getElementById('at_env').value);
const floorMR=parseInt(document.getElementById('at_mr').value);
document.querySelectorAll('.at-dynamic-mon').forEach(el=>{
const atVal=parseInt(el.getAttribute('data-at'));
if(!isNaN(atVal)){
el.textContent=getMonsterNameByAT(atVal,envType,floorMR);
}
});
}
function updateBattleAT(){
let deftInput=document.getElementById('at_deft');
let userDeft=(deftInput&&deftInput.value!=='')?parseInt(deftInput.value):999;
let nInput=document.getElementById('at_n_input');
let n=(nInput&&nInput.value!=='')?parseInt(nInput.value):0;
document.querySelectorAll('.at-m-card').forEach(card=>{
let seed=parseInt(card.getAttribute('data-seed'));
let cN=35+(29 * n);
const {atN,atN1}=getATPair(seed,cN);
const {deft,color: deftColor,label: deftLabel}=formatDeftness(atN1);
let atnLabel=card.querySelector('.at-m-atn-label');
if(atnLabel){
if(atnLabel.textContent.includes('AT[')) atnLabel.textContent=`AT[${cN}]: `;
else atnLabel.textContent=`AT +${cN}: `;
}
let atnVal=card.querySelector('.at-m-atval');
if(atnVal) atnVal.textContent=atN;
let monStrong=card.querySelector('.at-dynamic-mon');
if(monStrong){
monStrong.setAttribute('data-at',atN);
let envType=parseInt(document.getElementById('at_env').value);
let floorMR=parseInt(document.getElementById('at_mr').value);
if(typeof getMonsterNameByAT==='function'){
monStrong.textContent=getMonsterNameByAT(atN,envType,floorMR);
}
}
let deftSpan=card.querySelector('.at-m-deft');
if(deftSpan){
deftSpan.style.color=deftColor;
deftSpan.textContent=`${G18} ${deftLabel}`;
}
card.querySelectorAll('.at-dynamic-battle').forEach(el=>{
el.setAttribute('data-req',deft);
el.setAttribute('data-current-n',cN);
});
});
document.querySelectorAll('.at-dynamic-battle').forEach(el=>{
let target=parseInt(el.getAttribute('data-target'));
let req=parseInt(el.getAttribute('data-req'));
let pop=el.hasAttribute('data-current-n')?parseInt(el.getAttribute('data-current-n')):parseInt(el.getAttribute('data-n'));
let d1,d2,d4;
if(userDeft<req){
d1=target-(pop+4);
d2=target-(pop+5);
d4=target-(pop+6);
}else{
d1=target-(pop+3);
d2=target-(pop+4);
d4=target-(pop+5);
}
el.textContent=`${siFormatAT(d1)} / ${siFormatAT(d2)} / ${siFormatAT(d4)}`;
});
}
function evaluateATPtn(pType,validCount,hb){
let matched=false,extractLen=0;
switch (pType){
case 1: if(validCount>=2&&(hb&3)===3){matched=true;extractLen=2;} break;
case 2: if(validCount>=3&&(hb&15)===5){matched=true;extractLen=4;} break;
case 3: if(validCount>=4&&(hb&9)===9){matched=true;extractLen=4;} break;
case 4: if(validCount>=3&&(hb&7)===7){matched=true;extractLen=3;} break;
case 5: if(validCount>=4&&(hb&15)===15){matched=true;extractLen=4;} break;
case 6: if(validCount>=5&&(hb&31)===31){matched=true;extractLen=5;} break;
case 7: if(validCount>=6){let v=hb&63;if(v===57||v===51||v===39){matched=true;extractLen=6;}} break;
case 8: if(validCount>=7){let v=hb&127;if(v===97||v===100||v===76||v===73||v===67){matched=true;extractLen=7;}} break;
case 9: if(validCount>=6&&(hb&63)===21){matched=true;extractLen=6;} break;
case 10: if(validCount>=8&&(hb&255)===85){matched=true;extractLen=8;} break;
case 11: if(validCount>=10&&(hb&1023)===341){matched=true;extractLen=10;} break;
case 12: if(validCount>=10){let v=hb&1023;if(v===337||v===325||v===277){matched=true;extractLen=10;}} break;
case 13: if(validCount>=10){let v=hb&1023;if(v===321||v===324||v===276||v===273||v===261){matched=true;extractLen=10;}} break;
}
return{matched,extractLen};
}
function formatATPtnHTML(extractLen,step,valsBuffer,hb){
let formattedVals=[];
for(let i=extractLen-1;i>=0;i--){
let sv=step-i;
let v=valsBuffer[sv%10];
let m=(hb&(1 << i))!==0;
if(m) formattedVals.push(`<strong style="color:#f44;">${v}</strong>`);
else formattedVals.push(`<span style="color:#666;">${v}</span>`);
}
return formattedVals.join(',');
}
async function atSearch(){
if(isSearching){searchCancel=true;return;}
isSearching=true;searchCancel=false;
const btn=document.getElementById('atSearchBtn');
btn.textContent='STOP';btn.style.background='#f44';btn.style.color='#fff';
const monEnvType=parseInt(document.getElementById('at_env').value);
const monFloorMR=parseInt(document.getElementById('at_mr').value);
const monId=document.getElementById('at_mon').value;
const nVal=parseInt(document.getElementById('at_n_input').value);
if(isNaN(nVal)||nVal<0){isSearching=false;btn.textContent='M';btn.style.background='linear-gradient(135deg,#0ca,#065)';btn.style.color='#fff';return;}
const N=35+29 * nVal;
const spawnList=SPAWN_DB[monEnvType]&&SPAWN_DB[monEnvType][monFloorMR];
let atmin=-1,atmax=-1;
for(const entry of spawnList){
if(entry[0]===monId&&entry.length>=3){
atmin=entry[1];atmax=entry[2];break;
}
}
if(atmin<0){isSearching=false;btn.textContent='M';btn.style.background='linear-gradient(135deg,#0ca,#065)';btn.style.color='#fff';return;}
const md=MONSTER_DATA[monId];
const conds=getUltimateConds();
const hasBoxCond=conds.hasBoxCond;
const searchFilterLoc=true;
const searchOnlyWithD=document.getElementById('searchOnlyWithD').checked;
const baseRankStr=document.getElementById('rank').value;
const maxSeed=0x7FFF;
const rangeData=getValidatedSeedRange();
if(rangeData.error){alert(rangeData.error);isSearching=false;btn.textContent='M';btn.style.background='linear-gradient(135deg,#0ca,#065)';btn.style.color='#fff';return;}
const {startSeed,endSeed}=rangeData;
const rank=parseInt(baseRankStr);
const rStr=rank.toString(16).toUpperCase().padStart(2,'0');
const targetRankKey=RANKS[rStr]?rStr :(RANKS["0x"+rStr]?"0x"+rStr:null);
const deftInput=document.getElementById('at_deft').value.trim();
const deftMax=deftInput!==''?parseInt(deftInput):-1;
const atThreshold=parseInt(document.getElementById('at_threshold').value);
let pType=AT_PAT[document.getElementById('at_pattern').value]||0;
let atMaxSteps=parseInt(document.getElementById('at_maxSteps').value);
if(isNaN(atMaxSteps)||atMaxSteps<38) atMaxSteps=400;
if(atMaxSteps<N) atMaxSteps=N;
let headerExtra='';
if(deftMax>=0) headerExtra+=` ｜ ${G18} ${deftMax}`;
if(pType>0){
const patSel=document.getElementById('at_pattern');
const probSel=document.getElementById('at_threshold');
headerExtra+=` ｜ ${patSel.options[patSel.selectedIndex].text} (${probSel.options[probSel.selectedIndex].text})`;
}
const resultDiv=document.getElementById('searchResults');
resultDiv.innerHTML=`<div style="color:#aaa;font-size:13px;margin-bottom:8px;">
<div style="color:#0ca;font-size:12px;margin-bottom:6px;">${ENV_NAMES[monEnvType][1]} Rank ${monFloorMR} ｜ ${md.jp} (${md.en}) ｜ POP=${N} (Zoom=${nVal}) ｜ AT: ${atmin}～${atmax} ${headerExtra}</div>
${B01} <span id="searchProgress" style="color:#fff;font-weight:bold">0%</span></div><div id="searchGrid" class="search-grid"></div>`;
const grid=document.getElementById('searchGrid');
const progressSpan=document.getElementById('searchProgress');
const atMchSeeds=new Map();
for(let seed=startSeed;seed<=Math.min(endSeed,maxSeed);seed++){
const {atN,atN1}=getATPair(seed,N);
if(atN<atmin||atN>atmax)continue;
if(deftMax>=0){
if(calcDeftness(atN1)>deftMax)continue;
}
atMchSeeds.set(seed,{atN,atN1});
}
const atPtnDetails=new Map();
if(pType>0){
const valsBuffer=new Int32Array(10);
for(const [seed] of [...atMchSeeds]){
let rng=seed;
let historyBits=0,validCount=0;
let foundOffsets=[];
for(let step=1;step<=atMaxSteps;step++){
rng=lcg(rng);
let val=(rng>>>16)&0x7FFF;
if(step<38)continue;
let isMatch=(val<=atThreshold)?1:0;
historyBits=((historyBits << 1) | isMatch)&1023;
valsBuffer[step%10]=val;
validCount++;
let{matched,extractLen}=evaluateATPtn(pType,validCount,historyBits);
if(matched){
let startStep=step-extractLen+1;
if(startStep>=N+3){
let valsHtml=formatATPtnHTML(extractLen,step,valsBuffer,historyBits);
foundOffsets.push({ start: startStep,valsHtml: valsHtml });
}
historyBits=0;validCount=0;
}
}
if(foundOffsets.length>0){
atPtnDetails.set(seed,{foundOffsets});
}else{
atMchSeeds.delete(seed);
}
}
}
const needMapGeneration=hasBoxCond||conds.elist||conds.onlyMon||searchOnlyWithD||conds.anomaly!=="";
let _onlyMonExpectedStr=buildOnlyMonExpectedStr(conds);
let searchEngine=new GrottoDetail();
searchEngine.trackOverflow=(conds.anomaly==='all_invalid'||conds.anomaly==='ghost');
let totalCombos=atMchSeeds.size;
let processed=0;
let hitCount=0;
let fragment=document.createDocumentFragment();
let allResults=[];
const patSel2=document.getElementById('at_pattern');
const probSel2=document.getElementById('at_threshold');
const patternName2=patSel2?patSel2.options[patSel2.selectedIndex].text:'';
const probText2=probSel2?probSel2.options[probSel2.selectedIndex].text:'';
try {
for(const [seed,atinfo] of atMchSeeds){
if(searchCancel) break;
if(processed%50===0){
progressSpan.textContent=Math.floor((processed/totalCombos)*100)+'% ['+B04+''+hitCount+' '+B03+']';
await new Promise(r=>setTimeout(r,0));
}
searchEngine.MapSeed=seed;
searchEngine.MapRank=rank;
_cachedLocData=null;
searchEngine.calculateDetail(true);
if(!checkBasicConds(searchEngine,conds)){processed++;continue;}
if(!checkOnlyMonPossible(searchEngine,conds)){processed++;continue;}
if(needMapGeneration) searchEngine.createDungeonDetail();
let boxHtml="";
if(hasBoxCond){
let chestResult=ChestHtml(searchEngine,conds);
if(!chestResult.isMatch){processed++;continue;}
boxHtml=chestResult.html;
}
let elistResult=checkElistAndD(searchEngine,conds,searchOnlyWithD,_onlyMonExpectedStr);
if(!elistResult.match){processed++;continue;}
let locResult=checkLocationBQ(seed,conds,searchFilterLoc,targetRankKey);
if(!locResult.match){processed++;continue;}
let anomResult=checkAnomalies(searchEngine,conds);
if(!anomResult.match){processed++;continue;}
let jumpToFloor=elistResult.jumpToFloor!==-1?elistResult.jumpToFloor:anomResult.jumpToFloor;
hitCount++;
let itemNode=document.createElement('div');
itemNode.className='search-result-item';
if(elistResult.hasMatchedD) itemNode.dataset.hasD="true";
let locHtml=getLocHtmlCached(seed,targetRankKey,conds);
let specialHtml=elistResult.specialHitDetails.length>0?`<div style="margin-top:4px;">${elistResult.specialHitDetails.map(s=>`<span style="color:#ffccff;font-size:11px">${s}</span>`).join('<br>')}</div>`:'';
let anomalyHtml=anomResult.anomalyDetails.length>0?`<div style="margin-top:6px;display:flex;flex-direction:column;align-items:flex-start;">${anomResult.anomalyDetails.map(h=>h.replace('<span style="','<span style="display:inline-block;line-height:1.4;margin-top:4px;')).join('')}</div>`:'';
let mapNameDisp=DISPLAY_LANG!=='EN'?searchEngine.mapNameJP:searchEngine.mapName;
const {deft,color: deftColor,label: deftLabel}=formatDeftness(atinfo.atN1);
let diffsHtml='';
let patHtml='';
const patData=atPtnDetails.get(seed);
if(pType>0&&patData){
let offsetsHtml=patData.foundOffsets.map(o =>
`<span style="color:#0ff;font-size:12px;">AT +${o.start} <span style="color:#888;">[${o.valsHtml}]</span></span>`
).join('<br>');
patHtml=`<div style="margin-top:4px;padding:4px 8px;background:#111;border:1px solid #333;border-radius:4px;">
<span style="color:#fa0;font-size:11px;font-weight:bold;">${patternName2} (${probText2})</span><br>
${offsetsHtml}</div>`;
diffsHtml=patData.foundOffsets.map(o=>{
const d1=o.start-(N+3);
const d2=o.start-(N+4);
const d4=o.start-(N+5);
return `<span class="at-dynamic-battle" data-target="${o.start}" data-n="${N}" data-req="${deft}" style="font-size:11px;text-shadow:0 0 2px rgba(255,170,0,0.5);">${d1} / ${d2} / ${d4}</span>`;
}).join(`<br><span style="color:transparent;font-size:11px;">${BATTLE_LABEL} </span>`);
diffsHtml=`<span style="color:#fa0;margin-left:12px;font-size:11px;">${BATTLE_LABEL} ${diffsHtml}</span>`;
}
let atHtml=`<div class="at-m-card" data-seed="${seed}" style="margin-top:4px;padding:5px 8px;background:#0a1a1a;border:1px solid #055;border-radius:3px;">
<span style="color:#4c4;font-size:11px;"><span class="at-m-atn-label">AT[${N}]: </span><span class="at-m-atval">${atinfo.atN}</span></span>
<strong class="at-dynamic-mon" data-at="${atinfo.atN}" style="color:#f8f;margin-left:8px;font-size:11px;text-shadow:0 0 2px rgba(255,136,255,0.5);"></strong>
<br>
<span class="at-m-deft" style="color:${deftColor};display:inline-block;margin-top:4px;font-size:11px;">${G18} ${deftLabel}</span>
${diffsHtml}
</div>`;
const capturedJumpToFloor=jumpToFloor;
itemNode.innerHTML=`
<span style="color:#ffd700;font-weight:bold">${seed.toString(16).toUpperCase().padStart(4,'0')}</span>
<span style="color:#888">(Rank ${rStr})</span><br>
<span style="color:#0ff;font-size:11px">${mapNameDisp}</span>${locHtml}
<div style="margin-top:4px;">${boxHtml}</div>
${specialHtml}
${anomalyHtml}
${atHtml}
${patHtml}
`;
itemNode.onclick=makeResultClickHandler(seed,rStr,capturedJumpToFloor);
allResults.push({ node: itemNode,pop: atinfo.atN });
processed++;
}
const atSortPOP=document.getElementById('at_sortPOP').checked;
if(atSortPOP){
allResults.sort((a,b)=>a.pop-b.pop);
}
for(let res of allResults) fragment.appendChild(res.node);
if(fragment.children.length>0) grid.appendChild(fragment);
if(typeof updateATOnlyMonsters==='function') updateATOnlyMonsters();
if(typeof updateBattleAT==='function') updateBattleAT();
} catch (error){
console.error("AT Monster Search error:",error);
alert(A03);
searchCancel=true;
} finally {
isSearching=false;
btn.textContent='M';btn.style.background='linear-gradient(135deg,#0ca,#065)';btn.style.color='#fff';
progressSpan.textContent=searchCancel?`${B05} (${B04}${hitCount} ${B03})`:`100% (${B06?B06+' ':''}${hitCount} ${B03})`;
}
}
async function atPtnSearch(){
if(isSearching){searchCancel=true;return;}
isSearching=true;searchCancel=false;
const btn=document.getElementById('atPtnSchBtn');
btn.textContent='STOP';btn.style.background='#f44';
const threshold=parseInt(document.getElementById('at_threshold').value);
let pType=AT_PAT[document.getElementById('at_pattern').value]||0;
if(pType===0){alert(A01);isSearching=false;btn.textContent='AT';btn.style.background='linear-gradient(135deg,#f80,#a30)';return;}
let maxSteps=parseInt(document.getElementById('at_maxSteps').value);
if(isNaN(maxSteps)||maxSteps<38) maxSteps=400;
const nVal=parseInt(document.getElementById('at_n_input').value);
const POPIndex=(isNaN(nVal)||nVal<0)?35:35+29 * nVal;
if(maxSteps<POPIndex) maxSteps=POPIndex+1;
const searchFilterLoc=true;
const baseRankStr=document.getElementById('rank').value;
const rStr=parseInt(baseRankStr).toString(16).toUpperCase().padStart(2,'0');
const targetRankKey=RANKS[rStr]?rStr :(RANKS["0x"+rStr]?"0x"+rStr:null);
const rangeData=getValidatedSeedRange();
if(rangeData.error){alert(rangeData.error);isSearching=false;btn.textContent='AT';btn.style.background='linear-gradient(135deg,#f80,#a30)';return;}
const startSeed=rangeData.startSeed;
const endSeed=searchFilterLoc?Math.min(rangeData.endSeed,0x7FFF):rangeData.endSeed;
if(startSeed>endSeed){alert(A09);isSearching=false;btn.textContent='AT';btn.style.background='linear-gradient(135deg,#f80,#a30)';return;}
const patSel=document.getElementById('at_pattern');
const patternName=patSel.options[patSel.selectedIndex].text;
const probSel=document.getElementById('at_threshold');
const probText=probSel.options[probSel.selectedIndex].text;
const resultDiv=document.getElementById('searchResults');
resultDiv.innerHTML=`<div style="color:#aaa;font-size:13px;margin-bottom:8px;">
<div style="color:#f80;font-size:12px;margin-bottom:6px;">${patternName} ｜ ${probText} ｜ N=${POPIndex} (n=${nVal||0}) ｜ Rank ${rStr}</div>
${B01} <span id="searchProgress" style="color:#fff;font-weight:bold">0%</span></div><div id="searchGrid" class="search-grid"></div>`;
const grid=document.getElementById('searchGrid');
const progressSpan=document.getElementById('searchProgress');
let hitCount=0;
let processed=0;
let totalSeeds=endSeed-startSeed+1;
let fragment=document.createDocumentFragment();
let allATResults=[];
const valsBuffer=new Int32Array(10);
try {
for(let seed=startSeed;seed<=endSeed;seed++){
if(searchCancel) break;
if(searchFilterLoc){
let locData=calcLocations(seed,targetRankKey);
if(locData.outputOrder.length===0){processed++;continue;}
}
if(processed%1000===0){
progressSpan.textContent=Math.floor((processed/totalSeeds)*100)+'% (Seed '+seed.toString(16).toUpperCase().padStart(4,'0')+') ['+B04+''+hitCount+' '+B03+']';
await new Promise(r=>setTimeout(r,0));
}
processed++;
let rng=seed;
let historyBits=0;
let validCount=0;
let foundOffsets=[];
let POPValue=null;
let DefValue=null;
for(let step=1;step<=maxSteps;step++){
rng=lcg(rng);
let val=(rng>>>16)&0x7FFF;
if(step===POPIndex) POPValue=val;
if(step===POPIndex+1) DefValue=val;
if(step<38)continue;
let isMatch=(val<=threshold)?1:0;
historyBits=((historyBits << 1) | isMatch)&1023;
valsBuffer[step%10]=val;
validCount++;
let{matched,extractLen }=evaluateATPtn(pType,validCount,historyBits);
if(matched){
let startStep=step-extractLen+1;
if(startStep>=POPIndex+3){
let valsHtml=formatATPtnHTML(extractLen,step,valsBuffer,historyBits);
foundOffsets.push({ start: startStep,valsHtml: valsHtml });
}
historyBits=0;validCount=0;
}
}
if(foundOffsets.length>0){
hitCount++;
let seedHex=seed.toString(16).toUpperCase().padStart(4,'0');
let offsetsHtml=foundOffsets.map(o =>
`<span style="color:#0ff;">AT +${o.start} <span style="color:#888;">[${o.valsHtml}]</span></span>`
).join('<br>');
let specificAtHtml='';
if(POPValue!==null&&DefValue!==null){
const {deft,color: deftColor,label: deftLabel}=formatDeftness(DefValue);
const diffsHtml=foundOffsets.map(o=>{
const d1=o.start-(POPIndex+3);
const d2=o.start-(POPIndex+4);
const d4=o.start-(POPIndex+5);
return `<span class="at-dynamic-battle" data-target="${o.start}" data-n="${POPIndex}" data-req="${deft}" style="font-size:13px;text-shadow:0 0 2px rgba(255,170,0,0.5);">${d1} / ${d2} / ${d4}</span>`;
}).join(`<br><span style="color:transparent;font-size:11px;">${BATTLE_LABEL} </span>`);
specificAtHtml=`<div class="at-m-card" data-seed="${seed}" style="margin-top:6px;padding-top:4px;border-top:1px dashed #432;">
<span class="at-m-atn-label" style="color:#aaa;">AT +${POPIndex}: </span>
<strong class="at-m-atval" style="color:#39C5BB;text-shadow:0 0 2px rgba(57,197,187,0.5);">${POPValue}</strong>
<strong class="at-dynamic-mon" data-at="${POPValue}" style="color:#f8f;margin-left:8px;text-shadow:0 0 2px rgba(255,136,255,0.5);"></strong>
<br><span class="at-m-deft" style="color:${deftColor};display:inline-block;margin-top:4px;">${G18} ${deftLabel}</span>
<span style="color:#fa0;margin-left:12px;font-size:11px;">${BATTLE_LABEL} ${diffsHtml}</span></div>`;
}
let itemNode=document.createElement('div');
itemNode.className='search-result-item';
itemNode.innerHTML=`
<span style="color:#ffd700;font-weight:bold;font-size:13px;">${seedHex}</span><br>
<div style="background:#111;padding:4px 8px;border-radius:4px;margin:4px 0;border:1px solid #333;">
<span style="color:#fa0;font-weight:bold;">${patternName} (${probText})</span></div>
<div style="padding-top:2px;">${offsetsHtml}</div>
${specificAtHtml}
`;
itemNode.onclick=makeResultClickHandler(seed,null);
allATResults.push({ node: itemNode,pop: POPValue!==null?POPValue:99999 });
}
}
const atSortPOP=document.getElementById('at_sortPOP').checked;
if(atSortPOP){
allATResults.sort((a,b)=>a.pop-b.pop);
}
for(let res of allATResults) fragment.appendChild(res.node);
if(fragment.children.length>0) grid.appendChild(fragment);
updateATOnlyMonsters();
updateBattleAT();
} catch (error){
console.error("AT Pattern Search error:",error);
alert(A03);
searchCancel=true;
} finally {
isSearching=false;
btn.textContent='AT';btn.style.background='linear-gradient(135deg,#f80,#a30)';
progressSpan.textContent=searchCancel?`${B05} (${B04}${hitCount} ${B03})`:`100% (${B06?B06+' ':''}${hitCount} ${B03})`;
}
}
const SI_PATTERN_INDICES={
'R2': [[1,2]],
'R2_3': [[1,4]],
'R3': [[1,2,3]],
'R4': [[1,2,3,4]],
'R5': [[1,2,3,4,5]],
'4_in_6': [[1,2,3,6],[1,2,5,6],[1,4,5,6]],
'3_in_7': [[1,2,5],[1,2,7],[1,4,5],[1,4,7],[1,6,7]],
'N2': [[2,4]],
'N3': [[2,4,6]],
'N4': [[2,4,6,8]],
'N5': [[2,4,6,8,10]],
'4_in_10': [[2,4,6,10],[2,4,8,10],[2,6,8,10]],
'3_in_10': [[2,4,8],[2,4,10],[2,6,8],[2,6,10],[2,8,10]]
};
function siRunBattleSim(startRng,gSize,rRarity,nRarity,tLevels,recordSeq){
let rng=startRng>>>0;
let seq=[];
let rareHits=[];
let normHits=[];
let rngCount=0;
let successRare=0;
let successNorm=0;
let threshR=rRarity>0?Math.floor(32768 / rRarity):-1;
let threshN=nRarity>0?Math.floor(32768 / nRarity):-1;
for(let m=0;m<gSize;m++){
rng=lcg(rng);
rngCount++;
let vR=(rng>>>16)&0x7FFF;
let okR=vR<=threshR;
if(recordSeq) seq.push({val: vR,red: okR,type: `Group${m+1} Drop (R)`});
if(okR){
successRare++;
rareHits.push(rngCount);
}else{
rng=lcg(rng);
rngCount++;
let vN=(rng>>>16)&0x7FFF;
let okN=vN<=threshN;
if(recordSeq) seq.push({val: vN,red: okN,type: `Group${m+1} Drop (N)`});
if(okN){
successNorm++;
normHits.push(rngCount);
}
}
}
for(let b=0;b<4;b++){
if(tLevels[b]<=0)continue;
for(let m=0;m<gSize;m++){
rng=lcg(rng);
rngCount++;
let vTR=(rng>>>16)&0x7FFF;
let eRateR=Math.floor((rRarity * 100) / tLevels[b]);
let thTR=Math.floor(32767 / eRateR)+1;
let okTR=vTR<=thTR;
if(recordSeq) seq.push({val: vTR,red: okTR,steal: true,type: `Book${b+1} Group${m+1} (R)`});
if(okTR){
successRare++;
rareHits.push(rngCount);
}else{
rng=lcg(rng);
rngCount++;
let vTN=(rng>>>16)&0x7FFF;
let eRateN=Math.floor((nRarity * 100) / tLevels[b]);
let thTN=Math.floor(32767 / eRateN)+1;
let okTN=vTN<=thTN;
if(recordSeq) seq.push({val: vTN,red: okTN,steal: true,type: `Book${b+1} Group${m+1} (N)`});
if(okTN){
successNorm++;
normHits.push(rngCount);
}
}
}
}
return {successRare,successNorm,seq,rareHits,normHits};
}
function siMatchesPattern(hits,patterns){
if(!patterns||patterns.length===0)return false;
for(let p of patterns){
if(hits.length<p.length)continue;
let match=true;
for(let i=0;i<p.length;i++){
if(hits[i]!==p[i]){ match=false;break;}
}
if(match)return true;
}
return false;
}
function siBuildSeqHtml(seqArray){
let items=seqArray.map(item=>{
let color=item.red?'#f44':'#fff';
let fw=item.red?'bold':'normal';
let bg=item.steal?'background:rgba(255,150,0,0.4);padding:0 2px;border-radius:3px;':'';
return `<span style="color:${color};font-weight:${fw};${bg}" title="${item.type}">${item.val}</span>`;
});
return `<div style="margin-top:6px;font-size:11px;color:#aaa;line-height:1.6;">`+C24+`: [ ${items.join(',')} ]</div>`;
}
function initSeedInspectorUI(){
const mrSel=document.getElementById('si_mr');
if(mrSel){
mrSel.options.length=0;
for(let i=1;i<=12;i++){
mrSel.options.add(new Option(i,i));
}
mrSel.value=2;
}
for(let b=1;b<=4;b++){
const tSel=document.getElementById(`si_t${b}`);
if(tSel){
tSel.options.length=0;
tSel.options.add(new Option('--',0));
for(let i=1;i<=99;i++){
tSel.options.add(new Option(i,i));
}
tSel.value=(b===1)?99:99;
}
}
const patSel=document.getElementById('si_pattern');
if(patSel){
patSel.options.length=0;
patSel.options.add(new Option('----','none'));
if(typeof AT_O!=='undefined'&&Array.isArray(AT_O)){
AT_O.forEach(pair=>{
patSel.options.add(new Option(pair[1],pair[0]));
});
}
}
}
function updateSeedInspector(){
const seedHex=document.getElementById('si_seed').value.trim()||'0000';
const seed=parseInt(seedHex,16);
const envType=parseInt(document.getElementById('si_env').value);
const floorMR=parseInt(document.getElementById('si_mr').value);
const userDeft=parseInt(document.getElementById('si_deft').value)||0;
const n=parseInt(document.getElementById('si_n').value)||0;
const enemyCount=parseInt(document.getElementById('si_enemy_count').value);
const groupSize=parseInt(document.getElementById('si_group_size').value)||1;
const is2ndTurn=document.getElementById('si_2nd_turn').checked;
const rareRarity=parseInt(document.getElementById('si_rare_rate').value);
const normRarity=parseInt(document.getElementById('si_norm_rate').value);
const tLvs=[
parseInt(document.getElementById('si_t1').value)||0,
parseInt(document.getElementById('si_t2').value)||0,
parseInt(document.getElementById('si_t3').value)||0,
parseInt(document.getElementById('si_t4').value)||0
];
const scanMax=parseInt(document.getElementById('si_scan_max').value)||0;
const targetTotalStep=parseInt(document.getElementById('si_target_step').value)||35;
const pSelect=document.getElementById('si_pattern');
const pTypeStr=pSelect.value;
const pType=(typeof AT_PAT!=='undefined')?(AT_PAT[pTypeStr]||0):0;
const pText=pSelect.options[pSelect.selectedIndex].text;
if(isNaN(seed))return;
const N=35+(29 * n);
const {atN: atN_val,atN1: atN1_val}=getATPair(seed,N);
const monName=(typeof getMonsterNameByAT==='function')?getMonsterNameByAT(atN_val,envType,floorMR):'?';
const mapDeft=(typeof calcDeftness==='function')?calcDeftness(atN1_val):0;
let actualCost=(userDeft>=mapDeft)?3:4;
let extraTurnCost=is2ndTurn?Math.floor(enemyCount / 2):0;
let totalStartCost=actualCost+extraTurnCost;
let patternMsg="";
let foundOffset=-1;
let foundSequence=null;
const isNormPat=pTypeStr.startsWith('N')||pTypeStr==='4_in_10'||pTypeStr==='3_in_10';
const targetPatterns=SI_PATTERN_INDICES[pTypeStr];
if(pType>0&&scanMax>0&&targetPatterns){
let baseRng=seed>>>0;
for(let i=0;i<37;i++) baseRng=lcg(baseRng);
for(let step=38;step<=N+scanMax;step++){
const rngSnapshot=baseRng;
let sim=siRunBattleSim(baseRng,groupSize,rareRarity,normRarity,tLvs,false);
baseRng=lcg(baseRng);
let currentHits=isNormPat?sim.normHits:sim.rareHits;
if(siMatchesPattern(currentHits,targetPatterns)){
if(step>=N+totalStartCost){
foundOffset=step-(N+totalStartCost);
foundSequence=siRunBattleSim(rngSnapshot,groupSize,rareRarity,normRarity,tLvs,true).seq;
break;
}
}
}
patternMsg=foundOffset!==-1 ?
C20+` <span class="si-highlight" style="color:#0f0;">AT +${N+totalStartCost+foundOffset}</span>`:`<span style="color:#888;">${scanMax}`+C21+`</span>`;
}
let battleStr="";
let seqHtml="";
if(pType>0&&foundOffset!==-1){
let target=N+totalStartCost+foundOffset;
let d1=target-(N+totalStartCost);
let d2=target-(N+totalStartCost+1);
let d4=target-(N+totalStartCost+2);
seqHtml=siBuildSeqHtml(foundSequence);
battleStr=`${BATTLE_LABEL}: <span style="color:#fa0;font-weight:bold;font-size:14px;">${siFormatAT(d1)} / ${siFormatAT(d2)} / ${siFormatAT(d4)}</span> <span style="color:#888;font-size:11px;">`+C22+`</span> ${seqHtml}`;
}else{
let abs_1=N+totalStartCost;
let abs_2=abs_1+1;
let abs_4=abs_1+2;
let currentRng=seed>>>0;
for(let i=0;i<abs_1-1;i++) currentRng=lcg(currentRng);
let defaultSim=siRunBattleSim(currentRng,groupSize,rareRarity,normRarity,tLvs,true);
seqHtml=siBuildSeqHtml(defaultSim.seq);
battleStr=`${BATTLE_LABEL}: <span style="color:#fa0;font-weight:bold;font-size:14px;">${abs_1} / ${abs_2} / ${abs_4}</span> <span style="color:#888;font-size:11px;">`+C23+`</span> ${seqHtml}`;
}
let s_target=seed>>>0;
for(let i=0;i<targetTotalStep;i++) s_target=lcg(s_target);
const atTarget_val=(s_target>>>16)&0x7FFF;
let DropThreshold=Math.floor(32768 / rareRarity);
let firstThiefLv=tLvs[0]>0?tLvs[0]:99;
const effectiveRate=Math.floor((rareRarity * 100) / firstThiefLv);
const ThiefThreshold=Math.floor(32767 / effectiveRate)+1;
const resBox=document.getElementById('si_at_results');
resBox.innerHTML=`
<div style="display:flex;justify-content:space-between;">
<span>POP: <span class="si-highlight">${N}</span> | AT ${N}: <span class="si-highlight">${atN_val}</span> (${monName})</span>
<span style="font-size:11px;">${patternMsg}</span>
</div>
<div>AT ${N+1}: <span style="color:#39C5BB;">${atN1_val}</span> ➔ `+G18+`: <span class="si-highlight">${mapDeft}</span></div>
<div style="margin-top:5px;padding-top:5px;border-top:1px dashed #335;">
${battleStr}
</div>`;
const targetBox=document.getElementById('si_target_results');
targetBox.innerHTML=`
<div>AT <span style="color:#fff;">${targetTotalStep}</span>: <span class="si-highlight" style="color:#f44;font-size:15px;">${atTarget_val}</span></div>
<div style="font-size:11px;margin-top:5px;color:#ccc;">
`+C25+` (≤${DropThreshold}): ${atTarget_val<=DropThreshold?'✅ YES':'❌ NO'}<br>
`+C26+` (Lv${firstThiefLv} ≤${ThiefThreshold}): ${atTarget_val<=ThiefThreshold?'✅ YES':'❌ NO'}
</div>`;
}
function openSeedInspector(){
document.getElementById('seedInspectorModal').style.display='flex';
updateSeedInspector();
}
function closeSeedInspector(e){
if(!e||e.target.className==='modal-close'){
document.getElementById('seedInspectorModal').style.display='none';
}
}