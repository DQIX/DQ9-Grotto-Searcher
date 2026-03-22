function getUltimateConds(){
const reqBox={
10:parseInt(document.getElementById('cond_box_S')?document.getElementById('cond_box_S').value:0)||0,
9:parseInt(document.getElementById('cond_box_A')?document.getElementById('cond_box_A').value:0)||0,
8:parseInt(document.getElementById('cond_box_B')?document.getElementById('cond_box_B').value:0)||0,
7:parseInt(document.getElementById('cond_box_C')?document.getElementById('cond_box_C').value:0)||0,
6:parseInt(document.getElementById('cond_box_D')?document.getElementById('cond_box_D').value:0)||0,
5:parseInt(document.getElementById('cond_box_E')?document.getElementById('cond_box_E').value:0)||0,
4:parseInt(document.getElementById('cond_box_F')?document.getElementById('cond_box_F').value:0)||0,
3:parseInt(document.getElementById('cond_box_G')?document.getElementById('cond_box_G').value:0)||0,
2:parseInt(document.getElementById('cond_box_H')?document.getElementById('cond_box_H').value:0)||0,
1:parseInt(document.getElementById('cond_box_I')?document.getElementById('cond_box_I').value:0)||0
};
return{
prefix:document.getElementById('cond_prefix')?document.getElementById('cond_prefix').value:"",
suffix:document.getElementById('cond_suffix')?document.getElementById('cond_suffix').value:"",
locale:document.getElementById('cond_locale')?document.getElementById('cond_locale').value:"",
lv:document.getElementById('cond_lv')?document.getElementById('cond_lv').value:"",
location:document.getElementById('cond_location')?document.getElementById('cond_location').value:"",
bq:document.getElementById('cond_bq')?document.getElementById('cond_bq').value:"",
env:document.getElementById('cond_env')?document.getElementById('cond_env').value:"",
monster:document.getElementById('cond_monster')?document.getElementById('cond_monster').value:"",
depth:document.getElementById('cond_depth')?document.getElementById('cond_depth').value:"",
boss:document.getElementById('cond_boss')?document.getElementById('cond_boss').value:"",
elist:document.getElementById('cond_elist')?document.getElementById('cond_elist').value:"",
onlyMon:document.getElementById('cond_only_mon')?document.getElementById('cond_only_mon').value:"",
anomaly:document.getElementById('cond_anomaly')?document.getElementById('cond_anomaly').value:"",
reqBox:reqBox,
hasBoxCond:Object.values(reqBox).some(v=>v>0)
};
}
function checkUltimateCondsMatch(engine,seed,targetRankKey,conds,searchFilterLoc){
if(conds.prefix&&engine._details[5]!=conds.prefix)return false;
if(conds.suffix&&engine._details[6]!=conds.suffix)return false;
if(conds.locale&&(engine.MapLocale)!=conds.locale)return false;
if(conds.lv&&engine._details[4]!=conds.lv)return false;
if(conds.env&&engine._details[3]!=conds.env)return false;
if(conds.monster&&engine._details[2]!=conds.monster)return false;
if(conds.depth&&engine._details[1]!=conds.depth)return false;
if(conds.boss&&engine._details[0]!=conds.boss)return false;
let targetLocNum=conds.location?parseInt(conds.location,16):null;
let targetBqNum=conds.bq?parseInt(conds.bq):null;
if(targetLocNum!==null||targetBqNum!==null||searchFilterLoc){
if(targetRankKey!==null&&typeof calcLocations==='function'){
let locData=calcLocations(seed,targetRankKey);
if(locData.outputOrder.length===0)return false;
if(targetLocNum!==null){
if(!locData.seenLocations[targetLocNum])return false;
if(targetBqNum!==null &&!locData.seenLocations[targetLocNum].has(targetBqNum))return false;
}else if(targetBqNum!==null){
let bqFound=false;
for(let loc in locData.seenLocations){
if(locData.seenLocations[loc].has(targetBqNum)){bqFound=true;break;}
}
if(!bqFound)return false;
}
}
}
return true;
}
async function startUltimateSearch(){
if(isSearching){searchCancel=true;return;}
const conds=getUltimateConds();
const reqBox=conds.reqBox;
const hasBasicCond=Object.keys(conds).some(k=>k!=='reqBox'&&k!=='hasBoxCond'&&conds[k]!=="");
const hasBoxCond=conds.hasBoxCond;
if(!hasBasicCond &&!hasBoxCond){
alert("Please choose at least one condition.");
return;
}
isSearching=true;searchCancel=false;
const btn=document.getElementById('searchBtnSpecific');
if(btn){btn.textContent='🛑 STOP';btn.style.background='#ff4444';btn.style.color='#fff';}
const searchAllRanks=document.getElementById('searchAllRanks').checked;
const searchFilterLoc=true;
const searchOnlyWithD=document.getElementById('searchOnlyWithD').checked;
const baseRankStr=document.getElementById('rank').value;
const maxSeed=0x7FFF;
const resultDiv=document.getElementById('searchResults');
resultDiv.innerHTML='<div style="color:#aaa;font-size:13px;margin-bottom:8px">Progress: <span id="searchProgress" style="color:#fff;font-weight:bold">0%</span></div><div id="searchGrid" class="search-grid"></div>';
const grid=document.getElementById('searchGrid');
const progressSpan=document.getElementById('searchProgress');
let ranksToSearch=searchAllRanks?[0x02,0x38,0x3D,0x4C,0x51,0x65,0x79,0x8D,0xA1,0xB5,0xC9,0xDD]:[parseInt(baseRankStr)];
if(conds.onlyMon||conds.monster||conds.bq){
ranksToSearch=ranksToSearch.filter(rank=>{
if(conds.bq){
let baseQ=parseInt(conds.bq);
let modulo=Math.floor(baseQ/10)*2+1;
let minOffset=Math.trunc(0-baseQ/10);
let maxOffset=Math.trunc((modulo-1)-baseQ/10);
let minFinalQ=Math.max(2,baseQ+minOffset);
let maxFinalQ=Math.min(248,baseQ+maxOffset);
let rankHex=rank.toString(16).toUpperCase().padStart(2,'0');
let rankInfo=RANKS[rankHex];
if(rankInfo&&(maxFinalQ<rankInfo.fqMin||minFinalQ>rankInfo.fqMax))return false;
}
if(!conds.onlyMon &&!conds.monster)return true;
let minSMR=1,maxSMR=9;
for(let i=0;i<8;i++){
if(rank>=TableC[i*4]&&rank<=TableC[i*4+1]){
minSMR=TableC[i*4+2];maxSMR=TableC[i*4+3];break;
}
}
if(conds.monster){
let targetSMR=parseInt(conds.monster);
if(targetSMR<minSMR||targetSMR>maxSMR)return false;
}
if(conds.onlyMon){
let maxFloorCount=16;
for(let i=0;i<9;i++){
if(rank>=TableB[i*4]&&rank<=TableB[i*4+1]){
maxFloorCount=TableB[i*4+3];break;
}
}
let maxOffset=Math.floor((maxFloorCount-1)/ 4);
let targetEnvStr=conds.env?ENV_NAMES[conds.env][0]:null;
let isPossible=false;
for(let env in ONLY_MONSTERS){
if(targetEnvStr&&env!==targetEnvStr)continue;
for(let fMR=1;fMR<=12;fMR++){
let mId=ONLY_MONSTERS[env][fMR];
if(mId&&MONSTER_DATA[mId]&&MONSTER_DATA[mId].en===conds.onlyMon){
let smrStart=conds.monster?parseInt(conds.monster):minSMR;
let smrEnd=conds.monster?parseInt(conds.monster):maxSMR;
for(let smr=smrStart;smr<=smrEnd;smr++){
if(fMR>=smr&&fMR<=smr+maxOffset){isPossible=true;break;}
}
}
if(isPossible)break;
}
if(isPossible)break;
}
if(!isPossible)return false;
}
return true;
});
if(ranksToSearch.length===0){
alert("Sorry! Unable to search any result for these conditions.");
progressSpan.textContent="100% (Conditions conflict. Skipped all searches.)";
isSearching=false;
if(btn){btn.textContent='🎯 Search';btn.style.background='linear-gradient(135deg,#00ffff,#0088aa)';btn.style.color='#000';}
return;
}
}
let totalCombos=ranksToSearch.length*(maxSeed+1);
let processed=0;
let hitCount=0;
let searchEngine=new GrottoDetail();
let targetLocNum=conds.location?parseInt(conds.location,16):null;
let targetBqNum=conds.bq?parseInt(conds.bq):null;
const rankNames={10:'S',9:'A',8:'B',7:'C',6:'D',5:'E',4:'F',3:'G',2:'H',1:'I'};
let fragment=document.createDocumentFragment();
try{
for(let rank of ranksToSearch){
if(searchCancel)break;
let rankHex=rank.toString(16).toUpperCase().padStart(2,'0');
let targetRankKey=RANKS[rankHex]?rankHex:(RANKS["0x"+rankHex]?"0x"+rankHex:null);
for(let seed=0;seed<=maxSeed;seed++){
if(searchCancel)break;
if(seed % 250===0){
progressSpan.textContent=Math.floor((processed/totalCombos)*100)+'% (Rank '+rankHex+',Seed '+seed.toString(16).toUpperCase().padStart(4,'0')+') ['+hitCount+' found]';
if(fragment.children.length>0)grid.appendChild(fragment);
await new Promise(r=>setTimeout(r,0));
}
searchEngine.MapSeed=seed;
searchEngine.MapRank=rank;
searchEngine.calculateDetail(true);
let match=true;
if(conds.prefix&&searchEngine._details[5]!=conds.prefix)match=false;
if(match&&conds.suffix&&searchEngine._details[6]!=conds.suffix)match=false;
if(match&&conds.locale&&(searchEngine.MapLocale)!=conds.locale)match=false;
if(match&&conds.lv&&searchEngine._details[4]!=conds.lv)match=false;
if(match&&conds.env&&searchEngine._details[3]!=conds.env)match=false;
if(match&&conds.monster&&searchEngine._details[2]!=conds.monster)match=false;
if(match&&conds.depth&&searchEngine._details[1]!=conds.depth)match=false;
if(match&&conds.boss&&searchEngine._details[0]!=conds.boss)match=false;
if(match&&conds.onlyMon){
let possible=false;
let mapType=searchEngine.mapTypeName;
let baseMR=searchEngine.monsterRank;
let maxFloorMR=Math.min(12,baseMR+Math.floor((searchEngine.floorCount-1)/ 4));
let envMonsters=ONLY_MONSTERS[mapType];
if(envMonsters){
for(let fMR=baseMR;fMR<=maxFloorMR;fMR++){
let mId=envMonsters[fMR];
if(mId&&MONSTER_DATA[mId]&&MONSTER_DATA[mId].en===conds.onlyMon){
possible=true;
break;
}
}
}
if(!possible)match=false;
}
if(!match){processed++;continue;}
const needMapGeneration=hasBoxCond||conds.elist||conds.onlyMon||searchOnlyWithD||conds.anomaly!=="";
if(needMapGeneration){
searchEngine.cDungeonDetail();
}
if(match&&hasBoxCond){
let boxCounts=searchEngine.getMapBoxCounts();
for(let r=10;r>=1;r--){
if(reqBox[r]>0&&boxCounts[r]!==reqBox[r]){match=false;break;}
}
}
let specialHitDetails=[];
let jumpToFloor=-1;
let hasMatchedD=false;
if(match&&(conds.elist||conds.onlyMon||searchOnlyWithD)){
let hasAnyD=false;
let elistMatched=!conds.elist;
let onlyMatched=!conds.onlyMon;
let specialFloorCount=0;
let currentMapSpecials=[];
for(let f=0;f<searchEngine.floorCount;f++){
let info=getFloorElistInfo(searchEngine,f);
if(!info.state)continue;
if(info.dValue>0)hasAnyD=true;
specialFloorCount++;
currentMapSpecials.push({f:f,state:info.state,dValue:info.dValue});
let dBadge=info.dValue>0?`<span style="background:#ffaa00;color:#000;padding:1px 4px;border-radius:3px;font-size:10px;">${info.dValue}</span>`:'';
if(conds.elist&&conds.elist!=='MULTI_SPECIAL' &&!elistMatched){
let isElistHit=false;
if(conds.elist==='PARTIAL_NONE'&&info.state.includes('Partially No-enemy'))isElistHit=true;
else if(conds.elist==='4'&&info.state.includes('4-enemy'))isElistHit=true;
else if(conds.elist==='3'&&info.state.includes('3-enemy'))isElistHit=true;
else if(conds.elist==='2'&&info.state.includes('2-enemy'))isElistHit=true;
else if(conds.elist==='ONLY'&&info.state.includes('only'))isElistHit=true;
else if(conds.elist==='NONE'&&info.state.includes('No-enemy')&&!info.state.includes('Partially'))isElistHit=true;
if(isElistHit){
elistMatched=true;
specialHitDetails.push(`B${f+1}F: ${info.state} ${dBadge}`);
if(jumpToFloor===-1)jumpToFloor=f;
if(info.dValue>0)hasMatchedD=true;
}
}
if(conds.onlyMon &&!onlyMatched){
if(info.state.includes(conds.onlyMon+' only')){
onlyMatched=true;
let text=`B${f+1}F: ${info.state} ${dBadge}`;
if(!specialHitDetails.includes(text))specialHitDetails.push(text);
if(jumpToFloor===-1)jumpToFloor=f;
if(info.dValue>0)hasMatchedD=true;
}
}
}
if(conds.elist==='MULTI_SPECIAL'){
if(specialFloorCount>=2){
elistMatched=true;
currentMapSpecials.forEach(s=>{
let dBadge=s.dValue>0?`<span style="background:#ffaa00;color:#000;padding:1px 4px;border-radius:3px;font-size:10px;">${s.dValue}</span>`:'';
let text=`B${s.f+1}F: ${s.state} ${dBadge}`;
if(!specialHitDetails.includes(text))specialHitDetails.push(text);
if(s.dValue>0)hasMatchedD=true;
});
if(jumpToFloor===-1&&currentMapSpecials.length>0){
jumpToFloor=currentMapSpecials[0].f;
}
}else{
elistMatched=false;
}
}
if(searchOnlyWithD&&!hasAnyD)match=false;
if(!elistMatched||!onlyMatched)match=false;
if(searchOnlyWithD&&hasAnyD)hasMatchedD=true;
}
if(match&&(targetLocNum!==null||targetBqNum!==null||searchFilterLoc)){
let locData=calcLocations(seed,targetRankKey);
if(locData.outputOrder.length===0){
match=false;
}else{
if(targetLocNum!==null){
if(!locData.seenLocations[targetLocNum])match=false;
else if(targetBqNum!==null &&!locData.seenLocations[targetLocNum].has(targetBqNum))match=false;
}else if(targetBqNum!==null){
let bqFound=false;
for(let loc in locData.seenLocations){
if(locData.seenLocations[loc].has(targetBqNum)){bqFound=true;break;}
}
if(!bqFound)match=false;
}
}
}
let anomalyDetails=[];
if(match&&conds.anomaly!==""){
let hasAnyChestAnomaly=false;
let hasAnyCorridorAnomaly=false;
let hasAnyNoChestAnomaly=false;
let hasAnyMultiRegionAnomaly=false;
let hasAnyChestCorridorCombo=false;
let corridorFloorCount=0;
let firstChestFloor=-1;
let firstCorridorFloor=-1;
let firstNoChestFloor=-1;
let firstMultiRegionFloor=-1;
for(let f=0;f<searchEngine.floorCount;f++){
let anom=getFloorAnomalies(searchEngine,f);
if(anom.hasInaccessibleChest){
hasAnyChestAnomaly=true;
if(anom.totalChests===1){
hasAnyNoChestAnomaly=true;
anomalyDetails.push(`<span style="color:#00ffff;font-size:11px;font-weight:bold;background:#004466;padding:1px 4px;border-radius:3px;border:1px solid #0088aa;">B${f+1}F No Chest</span>`);
if(firstNoChestFloor===-1)firstNoChestFloor=f;
}else{anomalyDetails.push(`<span style="color:#ff4444;font-size:11px;font-weight:bold;">B${f+1}F Nipple</span>`);
}if(firstChestFloor===-1)firstChestFloor=f;
}
if(anom.hasIsolatedCorridor){
hasAnyCorridorAnomaly=true;
corridorFloorCount++;
if(anom.isolatedRegions.length>=2){
hasAnyMultiRegionAnomaly=true;
if(firstMultiRegionFloor===-1)firstMultiRegionFloor=f;
}
let countBadges=anom.isolatedRegions.map(size=>`<span style="background:#FF69B4;color:#fff;padding:1px 4px;border-radius:3px;font-size:10px;margin-left:4px;box-shadow:1px 1px 2px rgba(0,0,0,0.5);">${size}</span>`).join('');
anomalyDetails.push(`<span style="color:#ffaa00;font-size:11px;">B${f+1}F Chamber ${countBadges}</span>`);
if(firstCorridorFloor===-1)firstCorridorFloor=f;
}
if(anom.hasInaccessibleChest && anom.hasIsolatedCorridor){
hasAnyChestCorridorCombo=true;
}
}
if(conds.anomaly==='chest'&&!hasAnyChestAnomaly)match=false;
else if(conds.anomaly==='nochest'&&!hasAnyNoChestAnomaly)match=false;
else if(conds.anomaly==='corridor'&&!hasAnyCorridorAnomaly)match=false; 
else if(conds.anomaly==='chest_corridor'&&!hasAnyChestCorridorCombo)match=false;
else if(conds.anomaly==='multi_corridor'&&corridorFloorCount<2)match=false;
else if(conds.anomaly==='multi_region'&&!hasAnyMultiRegionAnomaly)match=false;
if(match){
if(conds.anomaly==='chest')jumpToFloor=firstChestFloor;
else if(conds.anomaly==='nochest')jumpToFloor=firstNoChestFloor;
else if(conds.anomaly==='corridor'||conds.anomaly==='multi_corridor')jumpToFloor=firstCorridorFloor;
else if(conds.anomaly==='multi_region')jumpToFloor=firstMultiRegionFloor;
else if(conds.anomaly==='chest_corridor')jumpToFloor=(firstChestFloor!==-1)?firstChestFloor:firstCorridorFloor;
if(jumpToFloor===-1){
if(firstStairFloor!==-1)jumpToFloor=firstStairFloor;
else if(firstNoChestFloor!==-1)jumpToFloor=firstNoChestFloor;
else if(firstChestFloor!==-1)jumpToFloor=firstChestFloor;
else if(firstMultiRegionFloor!==-1)jumpToFloor=firstMultiRegionFloor;
else if(firstCorridorFloor!==-1)jumpToFloor=firstCorridorFloor;
}
}
}
if(match){
hitCount++;
let itemNode=document.createElement('div');
itemNode.className='search-result-item';
if(hasMatchedD)itemNode.dataset.hasD="true";
let locHtml="";
if(conds.bq&&targetRankKey!==null&&typeof calcLocations==='function'){
let targetBqNum=parseInt(conds.bq);
let locData=calcLocations(seed,targetRankKey);
let matchedLocs=[];
for(let locObj of locData.outputOrder){
let locNum=locObj.location;
if(locData.seenLocations[locNum].has(targetBqNum)){
let locHex=locNum.toString(16).toUpperCase().padStart(2,'0');
matchedLocs.push(locHex);
}
}
if(matchedLocs.length>0){
locHtml=`<br><span style="color:#aaa;font-size:11px;background:#222;padding:1px 4px;border-radius:3px;margin-top:2px;display:inline-block;">Loc:<span style="color:#fff;">${matchedLocs.join(' / ')}</span></span>`;
}
}
let detailsStr=[];
if(conds.lv)detailsStr.push(`Lv${searchEngine.mapLevel}`);
if(conds.env)detailsStr.push(searchEngine.mapTypeName);
let detailsHtml=detailsStr.length>0?`<span style="color:#aaa;font-size:10px">(${detailsStr.join(' / ')})</span>`:'';
let boxStr=[];
for(let r=10;r>=1;r--)if(reqBox[r]>0)boxStr.push(`${rankNames[r]}x${reqBox[r]}`);
let specialHtml=specialHitDetails.length>0?`<div style="margin-top:4px;">${specialHitDetails.map(s=>`<span style="color:#ffccff;font-size:11px">${s}</span>`).join('<br>')}</div>`:'';
let boxHtml=boxStr.length>0?`<div style="margin-top:4px;"><span style="color:#ffcc00;font-size:11px;background:#442200;padding:2px 4px;border-radius:3px;display:inline-block;">Chest: ${boxStr.join(',')}</span></div>`:'';
let anomalyHtml=anomalyDetails.length>0?`<div style="margin-top:4px;">${anomalyDetails.join('<br>')}</div>`:'';
itemNode.innerHTML=`
<span style="color:#ffd700;font-weight:bold">${seed.toString(16).toUpperCase().padStart(4,'0')}</span> 
<span style="color:#888">(Rank ${rankHex})</span><br>
<span style="color:#00ffff;font-size:11px">${searchEngine.mapName}</span>${detailsHtml}
${boxHtml}${locHtml}
${specialHtml}
${anomalyHtml}
`;
itemNode.onclick=()=>{
document.getElementById('seed').value=seed.toString(16).toUpperCase().padStart(4,'0');
document.getElementById('rank').value="0x"+rankHex;
calculate();
document.getElementById('result').scrollIntoView({behavior:'smooth'});
if(jumpToFloor!==-1){
setTimeout(()=>{
const tab=document.querySelectorAll('.floor-tab') [jumpToFloor];
if(tab)tab.click();
},50);
}
};
fragment.appendChild(itemNode);
let targetFloorForElist=jumpToFloor!==-1?jumpToFloor:0;
let elistHex=typeof getFloorElistInfo==='function'&&searchEngine.floorCount>targetFloorForElist?getFloorElistInfo(searchEngine,targetFloorForElist).hex:"0000";
}
processed++;
}
}
if(fragment.children.length>0)grid.appendChild(fragment);
}catch(error){
console.error("E R R O R",error);
alert("Unknown error.");
searchCancel=true;
}finally{
isSearching=false;
if(btn){btn.textContent='🎯 Search';btn.style.background='linear-gradient(135deg,#00ffff,#0088aa)';btn.style.color='#000';}
progressSpan.textContent=searchCancel?`Stopped (${hitCount} found)`:`100% (${hitCount} found)`;
}
}