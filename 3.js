function checkBQStatus(){
let prefix=document.getElementById('cond_prefix').value;
let suffix=document.getElementById('cond_suffix').value;
let elist=document.getElementById('cond_elist').value;
let onlyMon=document.getElementById('cond_only_mon').value;
let bqInput=document.getElementById('cond_bq');
if((prefix!==""&&suffix!=="")||elist!==""||onlyMon!==""){
bqInput.disabled=false;
bqInput.placeholder="2-248";
bqInput.style.background="#000";
bqInput.style.color="#0f0";
bqInput.style.border="1px solid #555";
bqInput.style.cursor="text";
}else{
bqInput.disabled=true;
bqInput.value="";
bqInput.placeholder=T("🔒 Name/Special","🔒 需名/特殊層","🔒 地図名/特殊フロア");
bqInput.style.background="#333";
bqInput.style.color="#777";
bqInput.style.border="1px solid #444";
bqInput.style.cursor="not-allowed";
}
}
function getValidatedSeedRange(){
let minStr=document.getElementById('cond_seed_min')?document.getElementById('cond_seed_min').value.trim():"";
let maxStr=document.getElementById('cond_seed_max')?document.getElementById('cond_seed_max').value.trim():"";
let customMin=minStr?parseInt(minStr, 16):0;
let customMax=maxStr?parseInt(maxStr, 16):0x7FFF;
if(isNaN(customMin)||customMin<0) customMin=0;
if(isNaN(customMax)||customMax>0x7FFF) customMax=0x7FFF;
if(customMin>customMax){
return{error:A08};
}
const searchFilterLoc=true;
const startSeed=customMin;
const endSeed=searchFilterLoc?Math.min(customMax,0x7FFF):customMax;
if(startSeed>endSeed){
return{error:A09};
}
return {startSeed,endSeed,searchFilterLoc};
}
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
seedMin:document.getElementById('cond_seed_min')?document.getElementById('cond_seed_min').value.trim():"",
seedMax:document.getElementById('cond_seed_max')?document.getElementById('cond_seed_max').value.trim():"",
elist:document.getElementById('cond_elist')?document.getElementById('cond_elist').value:"",
onlyMon:document.getElementById('cond_only_mon')?document.getElementById('cond_only_mon').value:"",
anomaly:document.getElementById('cond_anomaly')?document.getElementById('cond_anomaly').value:"",
reqBox:reqBox,
hasBoxCond:Object.values(reqBox).some(v=>v>0)
};
}
function checkUltimateCondsMatch(engine,seed,targetRankKey,conds,searchFilterLoc){
_cachedLocData=null;
if(conds.prefix&&engine._details[5]!=conds.prefix) return false;
if(conds.suffix&&engine._details[6]!=conds.suffix) return false;
if(conds.locale&&(engine.MapLocale)!=conds.locale) return false;
if(conds.lv&&engine._details[4]!=conds.lv) return false;
if(conds.env&&engine._details[3]!=conds.env) return false;
if(conds.monster&&engine._details[2]!=conds.monster) return false;
if(conds.depth&&engine._details[1]!=conds.depth) return false;
if(conds.boss&&engine._details[0]!=conds.boss) return false;

let targetLocNum=conds.location?parseInt(conds.location, 16):null;
let targetBqNum=conds.bq?parseInt(conds.bq):null;

if(targetLocNum!==null||targetBqNum!==null||searchFilterLoc){
if(targetRankKey!==null&&typeof calcLocations==='function'){
let locData=calcLocations(seed, targetRankKey);
_cachedLocData=locData;
if(locData.outputOrder.length===0) return false; 
if(targetLocNum!==null){
if(!locData.seenLocations[targetLocNum]) return false;
if(targetBqNum!==null&&!locData.seenLocations[targetLocNum].has(targetBqNum)) return false;
} else if(targetBqNum!==null){
let bqFound=false;
for(let loc in locData.seenLocations){
if(locData.seenLocations[loc].has(targetBqNum)){bqFound=true;break;}
}
if(!bqFound) return false;
}
}
}
return true; 
}
function ChestHtml(engine,conds){
if(!conds.hasBoxCond) return {isMatch:true,html:""};
let boxStr=[];
for(let r=10; r>=1; r--){
if(conds.reqBox[r]>0){
if(engine._details2[r-1]!==conds.reqBox[r]) return {isMatch:false,html:""};
boxStr.push(`${CHEST_RANK[r]}${conds.reqBox[r]}`);
}
}return{
isMatch:true,
html:`<span style="color:#ffcc00;font-size:11px;background:#442200;padding:2px 4px;border-radius:3px;">${boxStr.join(' ')}</span>`
};
}
function LocaHtml(seed,targetRankKey,conds,searchFilterLoc){
let targetLocNum=conds.location?parseInt(conds.location,16):null;
let targetBqNum=conds.bq?parseInt(conds.bq):null;
if(targetLocNum===null&&targetBqNum===null&&!searchFilterLoc) return "";
if(targetRankKey===null||typeof calcLocations!=='function') return "";
let locData=calcLocations(seed,targetRankKey);
if(locData.outputOrder.length===0) return "";
let matchedLocs=[];
for(let locObj of locData.outputOrder){
let locNum=locObj.location;
let isMatch=true;
if(targetLocNum!==null&&locNum!==targetLocNum) isMatch=false;
if(targetBqNum!==null&&!locData.seenLocations[locNum].has(targetBqNum)) isMatch=false;
if(isMatch){matchedLocs.push(locNum.toString(16).toUpperCase().padStart(2,'0'));}
}
if(matchedLocs.length>0){
return `<span style="margin-left:4px;color:#ccc;font-size:10px;background:#222;padding:1px 4px;border-radius:3px;">${matchedLocs.join(' / ')}</span>`;
}
return "";
}
function LocaHtmlFromData(locData,conds){
if(!locData||locData.outputOrder.length===0) return "";
let targetLocNum=conds.location?parseInt(conds.location,16):null;
let targetBqNum=conds.bq?parseInt(conds.bq):null;
let matchedLocs=[];
for(let locObj of locData.outputOrder){
let locNum=locObj.location;
let isMatch=true;
if(targetLocNum!==null&&locNum!==targetLocNum) isMatch=false;
if(targetBqNum!==null&&!locData.seenLocations[locNum].has(targetBqNum)) isMatch=false;
if(isMatch){matchedLocs.push(locNum.toString(16).toUpperCase().padStart(2,'0'));}
}
if(matchedLocs.length>0){
return `<span style="margin-left:4px;color:#ccc;font-size:10px;background:#222;padding:1px 4px;border-radius:3px;">${matchedLocs.join(' / ')}</span>`;
}
return "";
}
let _cachedLocData=null;
async function startUltimateSearch(){
if(isSearching){searchCancel=true;return;}
const conds=getUltimateConds();
const reqBox=conds.reqBox;
const hasBasicCond=Object.keys(conds).some(k=>k!=='reqBox'&&k!=='hasBoxCond'&&conds[k]!=="");
const hasBoxCond=conds.hasBoxCond;
const searchFilterLoc=true;
if(!hasBasicCond&&!hasBoxCond&&!searchFilterLoc){
alert(A01);
return;
}
isSearching=true; searchCancel=false;
const btn=document.getElementById('searchBtnSpecific');
if(btn){btn.textContent='🛑 STOP';btn.style.background='#ff4444';btn.style.color='#fff';}
const rangeData=getValidatedSeedRange();
if(rangeData.error){alert(rangeData.error);return;}
const {startSeed,endSeed}=rangeData;
const searchAllRanks=document.getElementById('searchAllRanks').checked;
const searchOnlyWithD=document.getElementById('searchOnlyWithD').checked;
const baseRankStr=document.getElementById('rank').value;
const maxSeed=0x7FFF;
const resultDiv=document.getElementById('searchResults');
resultDiv.innerHTML='<div style="color:#aaa; font-size:13px; margin-bottom:8px">'+B01+' <span id="searchProgress" style="color:#fff; font-weight:bold">0%</span></div><div id="searchGrid" class="search-grid"></div>';
const grid=document.getElementById('searchGrid');
const progressSpan=document.getElementById('searchProgress');
let ranksToSearch=searchAllRanks?MAP_RANK:[parseInt(baseRankStr)];
if(conds.onlyMon||conds.monster||conds.bq||conds.hasBoxCond){
ranksToSearch=ranksToSearch.filter(rank=>{
if(conds.bq){
let baseQ=parseInt(conds.bq);
let modulo=Math.floor(baseQ/10)*2+1;
let minOffset=Math.trunc(0-baseQ/10);
let maxOffset=Math.trunc((modulo-1)-baseQ/10);
let minFinalQ=Math.max(2,baseQ+minOffset);
let maxFinalQ=Math.min(248,baseQ+maxOffset);
let rStr=rank.toString(16).toUpperCase().padStart(2,'0');
let rankInfo=RANKS[rStr];
if(rankInfo&&(maxFinalQ<rankInfo.fqMin||minFinalQ>rankInfo.fqMax))return false;
}
let minSMR=1,maxSMR=9;
for(let i=0;i<8;i++){
if(rank>=TableC[i*4]&&rank<=TableC[i*4+1]){
minSMR=TableC[i*4+2];maxSMR=TableC[i*4+3];break;
}
}
if(conds.hasBoxCond){
let maxFloorCount=16;
for(let i=0;i<9;i++){
if(rank>=TableB[i*4]&&rank<=TableB[i*4+1]){maxFloorCount=TableB[i*4+3];break;}
}
if(conds.depth)maxFloorCount=parseInt(conds.depth);
let maxPossibleNum=Math.min(12, maxSMR+Math.floor((maxFloorCount-1)/4));
for(let r=10;r>=1;r--){
if(conds.reqBox[r]>0){
let canDrop=false;
for(let num=minSMR; num<=maxPossibleNum; num++){
let cMin=TableN[(num-1)*4+1];
let cMax=TableN[(num-1)*4+2];
if(r>=cMin&&r<=cMax){canDrop=true; break;}
}
if(!canDrop) return false;
}
}
}
if(!conds.onlyMon&&!conds.monster) return true;
if(conds.monster){
let targetSMR=parseInt(conds.monster);
if(targetSMR<minSMR||targetSMR>maxSMR)return false;
}
if(conds.onlyMon){
let maxFloorCount=16;
for(let i=0;i<9;i++){
if(rank>=TableB[i*4]&&rank<=TableB[i*4+1]){maxFloorCount=TableB[i*4+3]; break;}
}
let maxOffset=Math.floor((maxFloorCount-1)/ 4);
let targetEnv=conds.env?parseInt(conds.env):0;
let isPossible=false;
for(let env=1;env<=5;env++){
if(targetEnv&&env!==targetEnv)continue;
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
alert(A02);
progressSpan.textContent="100% ("+B12+")";
isSearching=false;
if(btn){btn.textContent='🎯 Search'; btn.style.background='linear-gradient(135deg,#00ffff,#0088aa)'; btn.style.color='#000';}
return;
}
}
let totalCombos=ranksToSearch.length*(endSeed-startSeed+1);
let processed=0;
let hitCount=0;
let searchEngine=new GrottoDetail();
searchEngine.trackOverflow=(conds.anomaly==='all_invalid'||conds.anomaly==='ghost');
let targetLocNum=conds.location?parseInt(conds.location, 16):null;
let targetBqNum=conds.bq?parseInt(conds.bq):null;
let fragment=document.createDocumentFragment();
let _onlyMonExpectedStr='';
if(conds.onlyMon){
let targetJpName=conds.onlyMon;
for(let id in MONSTER_DATA){
if(MONSTER_DATA[id].en===conds.onlyMon){targetJpName=MONSTER_DATA[id].jp; break; }
}
let expectedName=(DISPLAY_LANG!=='EN')?targetJpName:conds.onlyMon;
let expectedSuffix=(DISPLAY_LANG!=='EN')?"オンリー":" only";
_onlyMonExpectedStr=expectedName+expectedSuffix;
}
const needMapGeneration=hasBoxCond||conds.elist||conds.onlyMon||searchOnlyWithD||conds.anomaly!=="";
try{
for(let rank of ranksToSearch){
if(searchCancel)break;
let rStr=rank.toString(16).toUpperCase().padStart(2,'0');
let targetRankKey=RANKS[rStr]?rStr:(RANKS["0x"+rStr]?"0x"+rStr:null);
for(let seed=startSeed;seed<=endSeed;seed++){
if(searchCancel)break;
if(seed%250===0){
progressSpan.textContent=Math.floor((processed/totalCombos)*100)+'% ('+B02+' '+rStr+', Seed '+seed.toString(16).toUpperCase().padStart(4,'0')+') ['+B04+''+hitCount+' '+B03+']';
if(fragment.children.length>0) grid.appendChild(fragment);
await new Promise(r=>setTimeout(r,0));
}
searchEngine.MapSeed=seed;
searchEngine.MapRank=rank;
_cachedLocData=null;
searchEngine.calculateDetail(true);
let match=true;
if(conds.prefix&&searchEngine._details[5]!=conds.prefix) match=false;
if(match&&conds.suffix&&searchEngine._details[6]!=conds.suffix) match=false;
if(match&&conds.locale&&(searchEngine.MapLocale)!=conds.locale) match=false;
if(match&&conds.lv&&searchEngine._details[4]!=conds.lv) match=false;
if(match&&conds.env&&searchEngine._details[3]!=conds.env) match=false;
if(match&&conds.monster&&searchEngine._details[2]!=conds.monster) match=false;
if(match&&conds.depth&&searchEngine._details[1]!=conds.depth) match=false;
if(match&&conds.boss&&searchEngine._details[0]!=conds.boss) match=false;
if(match&&conds.onlyMon){
let possible=false;
let baseMR=searchEngine.monsterRank;
let maxFloorMR=Math.min(12, baseMR+Math.floor((searchEngine.floorCount-1) / 4));
let envMonsters=ONLY_MONSTERS[searchEngine._details[3]];
if(envMonsters){
for(let fMR=baseMR; fMR<=maxFloorMR; fMR++){
let mId=envMonsters[fMR];
if(mId&&MONSTER_DATA[mId]&&MONSTER_DATA[mId].en===conds.onlyMon){possible=true; break;}
}
}
if(!possible)match=false; 
}
if(!match){processed++;continue;}
if(needMapGeneration){searchEngine.createDungeonDetail();}
let boxHtml="";
if(match&&hasBoxCond){
let chestResult=ChestHtml(searchEngine, conds);
if(!chestResult.isMatch) match=false;
else boxHtml=chestResult.html;
}
let specialHitDetails=[];
let jumpToFloor=-1;
let hasMatchedD=false;
if(match&&(conds.elist||conds.onlyMon||searchOnlyWithD)){
let hasAnyD=false;
let elistMatched=!conds.elist;
let onlyMatched=!conds.onlyMon;
let specialFloorCount=0;
let currentMapSpecials=[]
for(let f=0; f<searchEngine.floorCount; f++){
let info=getFloorElistInfo(searchEngine, f);
if(!info.state) continue;
if(info.dValue>0) hasAnyD=true;
specialFloorCount++;
currentMapSpecials.push({f:f, state:info.state, dValue:info.dValue});
let dBadge=info.dValue>0?` <span style="background:#ffaa00; color:#000; padding:1px 4px; border-radius:3px; font-size:10px;">${info.dValue}</span>`:'';
if(conds.elist&&conds.elist!=='MULTI_SPECIAL'&&!elistMatched){
let isElistHit=false;
if(conds.elist==='PARTIAL_NONE'&&info.state.includes(EL_P)) isElistHit=true;
else if(conds.elist==='4'&&info.state.includes(EL_4)) isElistHit=true;
else if(conds.elist==='3'&&info.state.includes(EL_3)) isElistHit=true;
else if(conds.elist==='2'&&info.state.includes(EL_2)) isElistHit=true;
else if(conds.elist==='ONLY'&&(info.state.includes('only')||info.state.includes('オンリー'))) isElistHit=true;
else if(conds.elist==='NONE'&&info.state.includes(EL_0)&&!info.state.includes(EL_P)) isElistHit=true;
if(isElistHit){
elistMatched=true; 
specialHitDetails.push(`B${f+1}F: ${info.state}${dBadge}`);
if(jumpToFloor===-1) jumpToFloor=f; 
if(info.dValue>0) hasMatchedD=true; 
}
}
if(conds.onlyMon&&!onlyMatched){
if(info.state.includes(_onlyMonExpectedStr)){
onlyMatched=true; 
let text=`B${f+1}F: ${info.state}${dBadge}`;
if(!specialHitDetails.includes(text)) specialHitDetails.push(text);
if(jumpToFloor===-1) jumpToFloor=f; 
if(info.dValue>0) hasMatchedD=true; 
}
}
}
if(conds.elist==='MULTI_SPECIAL'){
if(specialFloorCount>=2){
elistMatched=true;
currentMapSpecials.forEach(s=>{
let dBadge=s.dValue>0?` <span style="background:#ffaa00; color:#000; padding:1px 4px; border-radius:3px; font-size:10px;">${s.dValue}</span>`:'';
let text=`B${s.f+1}F: ${s.state}${dBadge}`;
if(!specialHitDetails.includes(text)) specialHitDetails.push(text);
if(s.dValue>0) hasMatchedD=true; 
});
if(jumpToFloor===-1&&currentMapSpecials.length>0){jumpToFloor=currentMapSpecials[0].f;}
}else{elistMatched=false;}
}
if(searchOnlyWithD&&!hasAnyD) match=false;
if(!elistMatched||!onlyMatched) match=false;
if(searchOnlyWithD&&hasAnyD) hasMatchedD=true;
}
if(match&&(targetLocNum!==null||targetBqNum!==null||searchFilterLoc)){
_cachedLocData=calcLocations(seed, targetRankKey);
let locData=_cachedLocData;
if(locData.outputOrder.length===0){match=false;}
else {
if(targetLocNum!==null){
if(!locData.seenLocations[targetLocNum]) match=false;
else if(targetBqNum!==null&&!locData.seenLocations[targetLocNum].has(targetBqNum)) match=false;
} else if(targetBqNum!==null){
let bqFound=false;
for(let loc in locData.seenLocations){
if(locData.seenLocations[loc].has(targetBqNum)){bqFound=true; break;}
}
if(!bqFound) match=false;
}
}
}
let anomalyDetails=[];
if(match&&conds.anomaly!==""){
let hasAnyChestAnomaly=false;
let hasAnyCorridorAnomaly=false;
let hasAnyStairAnomaly=false;
let hasAnyNoChestAnomaly=false;
let hasAnyMultiRegionAnomaly=false;
let hasAnyChestCorridorCombo=false;
let hasAnyGhostAnomaly=false;
let hasAnyAllInvalidAnomaly=false;
let corridorFloorCount=0;
let firstChestFloor=-1;
let firstCorridorFloor=-1;
let firstStairFloor=-1;
let firstNoChestFloor=-1;
let firstMultiRegionFloor=-1;
let firstGhostFloor=-1;
let firstAllInvalidFloor=-1;
let isSearchingGhostStair=(conds.anomaly==='ghost');
for(let f=0; f<searchEngine.floorCount; f++){
let anom=getFloorAnomalies(searchEngine,f,isSearchingGhostStair);
let txtChest=TKB1_1;
let txtStair=TKB3_0;
let txtCorridor=TKB2_1;
let txtNoChest=TKB1_3;
let txtGhost=TKB3_1;
let txtAllInvalid=TKB3_2;
if(anom.isAllInvalidStair){
hasAnyAllInvalidAnomaly=true;
anomalyDetails.push(`<span style="color:#ffffff; font-size:11px; font-weight:bold; background:#cc0000; padding:1px 4px; border-radius:3px; border:1px solid #ff4444; box-shadow: 1px 1px 2px rgba(0,0,0,0.5);">B${f+1}F ${txtAllInvalid}</span>`);
if(firstAllInvalidFloor===-1) firstAllInvalidFloor=f;
}
if(anom.hasInaccessibleStair){
hasAnyStairAnomaly=true;
anomalyDetails.push(`<span style="color:#ff0000; font-size:11px; font-weight:bold; background:#550000; padding:1px 4px; border-radius:3px;">B${f+1}F ${txtStair}</span>`);
if(firstStairFloor===-1)firstStairFloor=f; 
} if(anom.hasInaccessibleChest){
hasAnyChestAnomaly=true;
if(anom.totalChests===1){
hasAnyNoChestAnomaly=true;
anomalyDetails.push(`<span style="color:#00ffff; font-size:11px; font-weight:bold; background:#004466; padding:1px 4px; border-radius:3px; border:1px solid #0088aa;">B${f+1}F ${txtNoChest}</span>`);
if(firstNoChestFloor===-1)firstNoChestFloor=f;
}else{anomalyDetails.push(`<span style="color:#ff69b4; font-size:11px; font-weight:bold;">B${f+1}F ${txtChest}</span>`);
}if(firstChestFloor===-1)firstChestFloor=f;
} if(anom.hasIsolatedCorridor){
hasAnyCorridorAnomaly=true;
corridorFloorCount++;
if(anom.isolatedRegions.length>=2){
hasAnyMultiRegionAnomaly=true;
if(firstMultiRegionFloor===-1)firstMultiRegionFloor=f;
}
let countBadges=anom.isolatedRegions.map(size=>`<span style="background:#ff6ec7; color:#fff; padding:1px 4px; border-radius:3px; font-size:10px; margin-left:4px; box-shadow: 1px 1px 2px rgba(0,0,0,0.5);">${size}</span>`).join('');
anomalyDetails.push(`<span style="color:#ffaa00; font-size:11px;">B${f+1}F ${txtCorridor} ${countBadges}</span>`);
if(firstCorridorFloor===-1)firstCorridorFloor=f;
}if(anom.hasGhostStair){
hasAnyGhostAnomaly=true;
anomalyDetails.push(`<span style="color:#ffffff; font-size:11px; font-weight:bold; background:#555577; padding:1px 4px; border-radius:3px; border:1px solid #8888aa; box-shadow: 1px 1px 2px rgba(0,0,0,0.5);">B${f+1}F ${txtGhost}: ${anom.GhostStairs.join(', ')}</span>`);
if(firstGhostFloor===-1)firstGhostFloor=f;
}
if(anom.hasInaccessibleChest&&anom.hasIsolatedCorridor){hasAnyChestCorridorCombo=true;}
}
if(conds.anomaly==='chest'&&!hasAnyChestAnomaly) match=false;
else if(conds.anomaly==='nochest'&&!hasAnyNoChestAnomaly) match=false;
else if(conds.anomaly==='corridor'&&!hasAnyCorridorAnomaly) match=false; 
else if(conds.anomaly==='stair'&&!hasAnyStairAnomaly) match=false;
else if(conds.anomaly==='ghost'&&!hasAnyGhostAnomaly) match=false;
else if(conds.anomaly==='all_invalid'&&!hasAnyAllInvalidAnomaly) match=false;
else if(conds.anomaly==='chest_corridor'&&!hasAnyChestCorridorCombo) match=false;
else if(conds.anomaly==='multi_corridor'&&corridorFloorCount<2) match=false;
else if(conds.anomaly==='multi_region'&&!hasAnyMultiRegionAnomaly) match=false;
if(match){
if(conds.anomaly==='chest') jumpToFloor=firstChestFloor;
else if(conds.anomaly==='nochest') jumpToFloor=firstNoChestFloor;
else if(conds.anomaly==='corridor'||conds.anomaly==='multi_corridor') jumpToFloor=firstCorridorFloor;
else if(conds.anomaly==='multi_region') jumpToFloor=firstMultiRegionFloor;
else if(conds.anomaly==='stair') jumpToFloor=firstStairFloor;
else if(conds.anomaly==='ghost') jumpToFloor=firstGhostFloor;
else if(conds.anomaly==='all_invalid') jumpToFloor=firstAllInvalidFloor;
else if(conds.anomaly==='chest_corridor') jumpToFloor=(firstChestFloor!==-1)?firstChestFloor:firstCorridorFloor;
if(jumpToFloor===-1){
if(firstStairFloor!==-1) jumpToFloor=firstStairFloor;
else if(firstNoChestFloor!==-1) jumpToFloor=firstNoChestFloor;
else if(firstGhostFloor!==-1) jumpToFloor=firstGhostFloor;
else if(firstAllInvalidFloor!==-1) jumpToFloor=firstAllInvalidFloor;
else if(firstChestFloor!==-1) jumpToFloor=firstChestFloor;
else if(firstMultiRegionFloor!==-1) jumpToFloor=firstMultiRegionFloor;
else if(firstCorridorFloor!==-1) jumpToFloor=firstCorridorFloor;
}
}
}
if(match){
hitCount++;
let itemNode=document.createElement('div');
itemNode.className='search-result-item';
if(hasMatchedD) itemNode.dataset.hasD="true";
if(!_cachedLocData&&seed<=0x7FFF&&targetRankKey!==null){
_cachedLocData=calcLocations(seed, targetRankKey);
}
let locHtml=_cachedLocData?LocaHtmlFromData(_cachedLocData, conds):"";
let specialHtml=specialHitDetails.length>0?`<div style="margin-top:4px;">${specialHitDetails.map(s=>`<span style="color:#ffccff;font-size:11px">${s}</span>`).join('<br>')}</div>`:'';
let anomalyHtml=anomalyDetails.length>0?`<div style="margin-top:6px; display:flex; flex-direction:column; align-items:flex-start;">${anomalyDetails.map(html=>html.replace('<span style="', '<span style="display:inline-block; line-height:1.4; margin-top:4px; ')).join('')}</div>`:'';
let mapNameDisp=DISPLAY_LANG!=='EN'?searchEngine.mapNameJP:searchEngine.mapName;
itemNode.innerHTML=`
<span style="color:#ffd700; font-weight:bold">${seed.toString(16).toUpperCase().padStart(4,'0')}</span> 
<span style="color:#888">(Rank ${rStr})</span><br>
<span style="color:#00ffff; font-size:11px">${mapNameDisp}</span>${locHtml}
<div style="margin-top:4px;">${boxHtml}</div>
${specialHtml}
${anomalyHtml}
`;
itemNode.onclick=()=>{
document.getElementById('seed').value=seed.toString(16).toUpperCase().padStart(4,'0');
document.getElementById('rank').value="0x"+rStr;
calculate();
document.getElementById('result').scrollIntoView({behavior:'smooth'});
if(jumpToFloor!==-1){
setTimeout(()=>{
const tab=document.querySelectorAll('.floor-tab')[jumpToFloor];
if(tab) tab.click();
},50);
}
};
fragment.appendChild(itemNode);
}
processed++;
}
}
if(fragment.children.length>0)grid.appendChild(fragment);
}catch(error){
console.error("E R R O R : ", error);
alert(A03);
searchCancel=true;
}finally{
isSearching=false;
if(btn){btn.textContent='🎯 Search'; btn.style.background='linear-gradient(135deg, #00ffff, #0088aa)'; btn.style.color='#000'; }
progressSpan.textContent=searchCancel?`${B06} (${B04}${hitCount} ${B03})`:`100% (${B09?B09+' ':''}${hitCount} ${B03})`;
}
}
function clearUltimateSearch(){
const inputIds=['cond_prefix','cond_suffix','cond_locale','cond_lv','cond_location',
'cond_bq','cond_env','cond_monster','cond_depth','cond_boss',
'cond_seed_min','cond_seed_max','cond_elist','cond_only_mon','cond_anomaly',
'cond_box_S', 'cond_box_A', 'cond_box_B', 'cond_box_C', 'cond_box_D',
'cond_box_E', 'cond_box_F', 'cond_box_G', 'cond_box_H', 'cond_box_I',];
inputIds.forEach(id=>{
let el=document.getElementById(id);
if(el){el.value='';}
});
const checkboxIds=['searchAllRanks','searchOnlyWithD'];
checkboxIds.forEach(id=>{
let el=document.getElementById(id);
if(el){el.checked=false;}
});
if(typeof checkBQStatus==='function'){checkBQStatus();}
}