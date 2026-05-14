const _anom_visited=new Uint8Array(256);
const _anom_queue=new Uint16Array(256);
const _DX=[0,0,-1,1];
const _DY=[-1,1,0,0];
const isMainWalkable=(tile)=>tile!==1&&tile!==3;
const isIsoWalkable=(tile)=>tile===0||tile===2||tile===8;
function runBFS(startX,startY,width,height,di,isValidTile){
let qHead=0,qTail=0;
const startIdx=(startY<<4)|startX;
_anom_visited[startIdx]=1;
_anom_queue[qTail++]=startIdx;
let regionSize=0;
while (qHead<qTail){
const curr=_anom_queue[qHead++];
regionSize++;
const cx=curr&0xF;
const cy=curr>>4;
for(let i=0;i<4;i++){
const nx=cx+_DX[i];
const ny=cy+_DY[i];
if(nx>=0&&nx<width&&ny>=0&&ny<height){
const nIdx=(ny<<4)|nx;
if(!_anom_visited[nIdx]){
const tile=di[nIdx+792];
if(isValidTile(tile)){
_anom_visited[nIdx]=1;
_anom_queue[qTail++]=nIdx;
}
}
}
}
}
return regionSize;
}
function getFloorAnomalies(engine,f,checkGhostStair=false){
const di=engine.di[f];
const width=di[2];
const height=di[3];
const upX=di[4],upY=di[5];
const downX=di[6],downY=di[7];
const boxes=di[8];
_anom_visited.fill(0,0,height<<4);
runBFS(upX,upY,width,height,di,isMainWalkable);
let hasInaccessibleChest=false;
for(let b=0;b<boxes;b++){
if(!_anom_visited[(di[b*2+14]<<4)|di[b*2+13]]){
hasInaccessibleChest=true;
break;
}
}
const hasInaccessibleStair=!_anom_visited[(downY<<4)|downX];
const isolatedRegions=[];
for(let y=0;y<height;y++){
const yShift=y<<4;
for(let x=0;x<width;x++){
const idx=yShift|x;
if(!_anom_visited[idx]){
const tile=di[idx+792];
if(tile===0||tile===2||tile===8){
const regionSize=runBFS(x,y,width,height,di,isIsoWalkable);
isolatedRegions.push(regionSize);
}
}
}
}
const hasIsolatedCorridor=isolatedRegions.length>0;
let GhostStairs=[];
let hasGhostStair=false;
if(checkGhostStair){
for(let y=0;y<height;y++){
const yOfs=(y<<4)+792;
for(let x=0;x<width;x++){
const tile=di[yOfs+x];
if(tile===4||tile===5){
if(!((x===upX&&y===upY)||(x===downX&&y===downY))){
GhostStairs.push(`(${x},${y})`);
}
}
}
}
hasGhostStair=GhostStairs.length>0;
}
const isAllInvalidStair=engine.isStairOverflow[f];
return{hasIsolatedCorridor,hasInaccessibleChest,hasInaccessibleStair,isolatedRegions,totalChests:boxes,hasGhostStair,GhostStairs,isAllInvalidStair};
}
const RANKS={
"02":{fqMin:2,fqMax:55},
"38":{fqMin:56,fqMax:60},
"3D":{fqMin:61,fqMax:75},
"4C":{fqMin:76,fqMax:80},
"51":{fqMin:81,fqMax:100},
"65":{fqMin:101,fqMax:120},
"79":{fqMin:121,fqMax:140},
"8D":{fqMin:141,fqMax:160},
"A1":{fqMin:161,fqMax:180},
"B5":{fqMin:181,fqMax:200},
"C9":{fqMin:201,fqMax:220},
"DD":{fqMin:221,fqMax:248}
};
function getLocationMax(finalQuality){
if(finalQuality<=50)return 47;
if(finalQuality<=80)return 131;
return 150;
}
function calcFinalQuality(baseQ,r1){
const modulo=Math.floor(baseQ/10)*2+1;
const offset=Math.trunc(r1%modulo-baseQ/10);
let final=baseQ+offset;
if(final<2)final=2;
if(final>248)final=248;
return final;
}
function formatRanges(nums){
if(nums.length===0)return C16;
const sorted=[...nums].sort((a,b)=>a-b);
const ranges=[];
let start=sorted[0],end=sorted[0];
for(let i=1;i<sorted.length;i++){
if(sorted[i]===end+1){
end=sorted[i];
}else{
ranges.push(start===end?`${start}`:`${start}-${end}`);
start=end=sorted[i];
}
}
ranges.push(start===end?`${start}`:`${start}-${end}`);
return ranges.join(',');
}
let SEED_TO_TIMERS_CACHE=null;
function calcLocations(seed,rStr){
const {fqMin,fqMax}=RANKS[rStr]||{fqMin:2,fqMax:248};
const seenLocations={};
const outputOrder=[];
if(!SEED_TO_TIMERS_CACHE){
SEED_TO_TIMERS_CACHE={};
for(let t=0;t<65536;t++){
const x1=lcg(t);
const x2=lcg(x1);
const s=(x2>>>16)&0x7FFF;
if(!SEED_TO_TIMERS_CACHE[s])SEED_TO_TIMERS_CACHE[s]=[];
SEED_TO_TIMERS_CACHE[s].push(t);
}
}
const timers=SEED_TO_TIMERS_CACHE[seed]||[];
for(const timer of timers){
const x1=lcg(timer);
const x2=lcg(x1);
const x3=lcg(x2);
const r1=(x1>>>16)&0x7FFF;
const r3=(x3>>>16)&0x7FFF;
const locToBq={};
for(let baseQ=2;baseQ<=248;baseQ++){
const finalQ=calcFinalQuality(baseQ,r1);
if(finalQ<fqMin||finalQ>fqMax)continue;
const locMax=getLocationMax(finalQ);
const calcLoc=(r3%locMax)+1;
if(!locToBq[calcLoc]) locToBq[calcLoc]=new Set();
locToBq[calcLoc].add(baseQ);
}
for(const loc of Object.keys(locToBq).map(Number)){
let minBq=255;
for(const bq of locToBq[loc]){
if(bq<minBq) minBq=bq;
}
if(!seenLocations[loc]){
seenLocations[loc]=new Set();
outputOrder.push({ timer,location: loc,minBq });
}
for(const bq of locToBq[loc]){
seenLocations[loc].add(bq);
}
}
}
if(rStr==="02"&&seed===0x0032){
if(2>=fqMin&&2<=fqMax){
if(!seenLocations[5]){
seenLocations[5]=new Set();
outputOrder.push({timer:"Quest 015",location:5,minBq:2});
}
seenLocations[5].add(2);
}
}
outputOrder.sort((a,b)=>{
if(a.timer==="Quest 015")return 1;
if(b.timer==="Quest 015")return -1;
if(a.timer!==b.timer)return a.timer-b.timer;
return a.minBq-b.minBq;
});
return{outputOrder,seenLocations};
}
function getValidatedSeedRange(){
let minStr=document.getElementById('cond_seed_min')?document.getElementById('cond_seed_min').value.trim():"";
let maxStr=document.getElementById('cond_seed_max')?document.getElementById('cond_seed_max').value.trim():"";
let customMin=minStr?parseInt(minStr,16):0;
let customMax=maxStr?parseInt(maxStr,16):0x7FFF;
if(isNaN(customMin)||customMin<0) customMin=0;
if(isNaN(customMax)||customMax>0x7FFF) customMax=0x7FFF;
if(customMin>customMax){return {error: A08};}
const searchFilterLoc=true;
const startSeed=customMin;
const endSeed=searchFilterLoc?Math.min(customMax,0x7FFF):customMax;
if(startSeed>endSeed){return {error: A09};}
return {startSeed,endSeed,searchFilterLoc};
}
function getUltimateConds(){
const getV=(id) =>{const el=document.getElementById(id);return el?el.value.trim():"";};
const reqBox={};
['I','H','G','F','E','D','C','B','A','S'].forEach((ch,i)=>{
reqBox[i+1]=parseInt(getV('cond_box_'+ch))||0;
});
return{
prefix:getV('cond_prefix'),suffix:getV('cond_suffix'),locale:getV('cond_locale'),
lv:getV('cond_lv'),location:getV('cond_location'),bq:getV('cond_bq'),bqCount:getV('cond_bq_count'),
env:getV('cond_env'),monster:getV('cond_monster'),depth:getV('cond_depth'),boss:getV('cond_boss'),
seedMin:getV('cond_seed_min'),seedMax:getV('cond_seed_max'),elist:getV('cond_elist'),
onlyMon:getV('cond_only_mon'),anomaly:getV('cond_anomaly'),
reqBox: reqBox,hasBoxCond: Object.values(reqBox).some(v=>v>0)
};
}
function checkUltimateCondsMatch(engine,seed,targetRankKey,conds,searchFilterLoc){
_cachedLocData=null;
if(conds.prefix&&engine._details[5] != conds.prefix)return false;
if(conds.suffix&&engine._details[6] != conds.suffix)return false;
if(conds.locale&&(engine.MapLocale) != conds.locale)return false;
if(conds.lv&&engine._details[4] != conds.lv)return false;
if(conds.env&&engine._details[3] != conds.env)return false;
if(conds.monster&&engine._details[2] != conds.monster)return false;
if(conds.depth&&engine._details[1] != conds.depth)return false;
if(conds.boss&&engine._details[0] != conds.boss)return false;
let targetLocNum=conds.location?parseInt(conds.location,16):null;
let targetBqNum=conds.bq?parseInt(conds.bq):null;
let bqCountFilter=conds.bqCount||"";
if(targetLocNum!==null||targetBqNum!==null||searchFilterLoc||bqCountFilter){
if(targetRankKey!==null&&typeof calcLocations==='function'){
let locData=calcLocations(seed,targetRankKey);
_cachedLocData=locData;
if(locData.outputOrder.length===0)return false;
if(targetLocNum!==null){
if(!locData.seenLocations[targetLocNum])return false;
if(targetBqNum!==null&&!locData.seenLocations[targetLocNum].has(targetBqNum))return false;
}else if(targetBqNum!==null){
let bqFound=false;
for(let loc in locData.seenLocations){
if(locData.seenLocations[loc].has(targetBqNum)){bqFound=true;break;}
}
if(!bqFound)return false;
}
if(bqCountFilter==="1"){
let allBqs=new Set();
for(let loc in locData.seenLocations){
for(let bq of locData.seenLocations[loc]) allBqs.add(bq);
}
if(allBqs.size!==1)return false;
}else if(bqCountFilter==="1p"){
let found=false;
for(let loc in locData.seenLocations){
if(locData.seenLocations[loc].size===1){found=true;break;}
}
if(!found)return false;
}
}else if(bqCountFilter){
return false;
}
}
return true;
}
function ChestHtml(engine,conds){
if(!conds.hasBoxCond)return {isMatch:true,html:""};
let boxStr=[];
for(let r=10;r>=1;r--){
if(conds.reqBox[r]>0){
if(engine._details2[r-1]!==conds.reqBox[r])return {isMatch:false,html:""};
boxStr.push(`${CHEST_RANK[r]}${conds.reqBox[r]}`);
}
}return{
isMatch:true,
html:`<span style="color:#ffcc00;font-size:11px;background:#420;padding:2px 4px;border-radius:3px;">${boxStr.join(' ')}</span>`
};
}
function LocaHtmlFromData(locData,conds){
if(!locData||locData.outputOrder.length===0)return "";
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
function getLocHtmlCached(seed,targetRankKey,conds){
if(!_cachedLocData&&seed<=0x7FFF&&targetRankKey!==null){
_cachedLocData=calcLocations(seed,targetRankKey);
}
return _cachedLocData?LocaHtmlFromData(_cachedLocData,conds):"";
}
function checkBasicConds(searchEngine,conds){
if(conds.prefix&&searchEngine._details[5] != conds.prefix)return false;
if(conds.suffix&&searchEngine._details[6] != conds.suffix)return false;
if(conds.locale&&searchEngine.MapLocale != conds.locale)return false;
if(conds.lv&&searchEngine._details[4] != conds.lv)return false;
if(conds.env&&searchEngine._details[3] != conds.env)return false;
if(conds.monster&&searchEngine._details[2] != conds.monster)return false;
if(conds.depth&&searchEngine._details[1] != conds.depth)return false;
if(conds.boss&&searchEngine._details[0] != conds.boss)return false;
return true;
}
function checkOnlyMonPossible(searchEngine,conds){
if(!conds.onlyMon)return true;
let baseMR=searchEngine.monsterRank;
let maxFloorMR=Math.min(12,baseMR+Math.floor((searchEngine.floorCount-1) / 4));
let envMonsters=ONLY_MONSTERS[searchEngine._details[3]];
if(envMonsters){
for(let fMR=baseMR;fMR<=maxFloorMR;fMR++){
let mId=envMonsters[fMR];
if(mId&&MONSTER_DATA[mId]&&MONSTER_DATA[mId].en===conds.onlyMon)return true;
}
}
return false;
}
function getElistMonsterBadge(envType,floorMR,targetCount,onlyMonNameStr){
let result={badge:'',isCombinedHit:false};
let spawnDb=SPAWN_DB[envType][floorMR];
if(!spawnDb)return result;
let survivingNames=[];
let survivingNamesEn=[];
let isJP=(DISPLAY_LANG!=='EN');
let limit=targetCount>0?targetCount:spawnDb.length;
for(let i=0;i<spawnDb.length;i++){
if(spawnDb[i].length>1){
let mData=MONSTER_DATA[spawnDb[i][0]];
if(mData){
survivingNames.push(isJP?mData.jp:mData.en);
survivingNamesEn.push(mData.en);
}
if(survivingNames.length===limit) break;
}
}
if(onlyMonNameStr&&survivingNamesEn.includes(onlyMonNameStr)){
result.isCombinedHit=true;
}
if(targetCount>0&&survivingNames.length>0){
result.badge=`<br><span style="display:inline-block;color:#aaa;font-size:11px;">${survivingNames.join('+')}</span>`;
}
return result;
}
function checkElistAndD(searchEngine,conds,searchOnlyWithD,_onlyMonExpectedStr){
let result={ match: true,specialHitDetails: [],jumpToFloor: -1,hasMatchedD: false };
if(!(conds.elist||conds.onlyMon||searchOnlyWithD))return result;
const isCombinedSearch=(['2','3','4','PARTIAL_NONE'].includes(conds.elist))&&!!conds.onlyMon;
let hasAnyD=false;
let elistMatched=!conds.elist;
let onlyMatched=!conds.onlyMon;
if(isCombinedSearch){
elistMatched=false;
onlyMatched=false;
}
let specialFloorCount=0,currentMapSpecials=[];
const envType=searchEngine._details[3];
const baseMR=searchEngine._details[2];
const isJP=(DISPLAY_LANG!=='EN');
for(let f=0;f<searchEngine.floorCount;f++){
let info=getFloorElistInfo(searchEngine,f);
if(!info.state) continue;
if(info.dValue>0) hasAnyD=true;
let targetCount=0;
let isElistHit=false;
if(info.state.includes(EL_4)){targetCount=4;if(conds.elist==='4') isElistHit=true;}
else if(info.state.includes(EL_3)){targetCount=3;if(conds.elist==='3') isElistHit=true;}
else if(info.state.includes(EL_2)){targetCount=2;if(conds.elist==='2') isElistHit=true;}
if(!isElistHit&&conds.elist){
if(conds.elist==='PARTIAL_NONE'&&info.state.includes(EL_P)) isElistHit=true;
else if(conds.elist==='ONLY'&&(info.state.includes('only')||info.state.includes('オンリー'))) isElistHit=true;
else if(conds.elist==='NONE'&&info.state.includes(EL_0)&&!info.state.includes(EL_P)) isElistHit=true;
}
let monBadge='';
let isCombinedMatchedThisFloor=false;
let needSpawnDb=(targetCount>0&&conds.elist===targetCount.toString())||(isCombinedSearch&&isElistHit);
if(needSpawnDb){
let floorMR=Math.min(12,baseMR+(f >> 2));
let badgeData=getElistMonsterBadge(envType,floorMR,targetCount,isCombinedSearch?conds.onlyMon:null);
monBadge=badgeData.badge;
isCombinedMatchedThisFloor=badgeData.isCombinedHit;
}
specialFloorCount++;
let dBadge=info.dValue>0?` <span style="background:#fa0;color:#000;padding:1px 4px;border-radius:3px;font-size:10px;">${info.dValue}</span>`:'';
let displayText=`B${f+1}F: ${info.state}${dBadge}${monBadge}`;
currentMapSpecials.push({f,state:info.state,dValue:info.dValue,monBadge});
if(isCombinedSearch){
if(isCombinedMatchedThisFloor&&!elistMatched){
elistMatched=true;
onlyMatched=true;
result.specialHitDetails.push(displayText);
if(result.jumpToFloor===-1) result.jumpToFloor=f;
if(info.dValue>0) result.hasMatchedD=true;
}
}else{
if(conds.elist&&conds.elist!=='MULTI_SPECIAL'&&!elistMatched&&isElistHit){
elistMatched=true;
result.specialHitDetails.push(displayText);
if(result.jumpToFloor===-1) result.jumpToFloor=f;
if(info.dValue>0) result.hasMatchedD=true;
}
if(conds.onlyMon&&!onlyMatched&&info.state.includes(_onlyMonExpectedStr)){
onlyMatched=true;
if(!result.specialHitDetails.includes(displayText)) result.specialHitDetails.push(displayText);
if(result.jumpToFloor===-1) result.jumpToFloor=f;
if(info.dValue>0) result.hasMatchedD=true;
}
}
}
if(conds.elist==='MULTI_SPECIAL'){
if(specialFloorCount>=2){
elistMatched=true;
currentMapSpecials.forEach(s=>{
let dBadge=s.dValue>0?` <span style="background:#fa0;color:#000;padding:1px 4px;border-radius:3px;font-size:10px;">${s.dValue}</span>`:'';
let text=`B${s.f+1}F: ${s.state}${dBadge}${s.monBadge}`;
if(!result.specialHitDetails.includes(text)) result.specialHitDetails.push(text);
if(s.dValue>0) result.hasMatchedD=true;
});
if(result.jumpToFloor===-1&&currentMapSpecials.length>0) result.jumpToFloor=currentMapSpecials[0].f;
}else{ elistMatched=false;}
}
if(searchOnlyWithD&&!hasAnyD) result.match=false;
if(!elistMatched||!onlyMatched) result.match=false;
if(searchOnlyWithD&&result.match){
if((conds.elist||conds.onlyMon)&&conds.elist!=='MULTI_SPECIAL'){
if(!result.hasMatchedD) result.match=false;
}
}
return result;
}
function checkLocationBQ(seed,conds,searchFilterLoc,targetRankKey){
let targetLocNum=conds.location?parseInt(conds.location,16):null;
let targetBqNum=conds.bq?parseInt(conds.bq):null;
if(targetLocNum===null&&targetBqNum===null&&!searchFilterLoc)return{match:true};
if(seed>0x7FFF||targetRankKey===null)return{match:false};
_cachedLocData=calcLocations(seed,targetRankKey);
let locData=_cachedLocData;
if(locData.outputOrder.length===0)return{match:false};
if(targetLocNum!==null){
if(!locData.seenLocations[targetLocNum])return{match:false};
if(targetBqNum!==null&&!locData.seenLocations[targetLocNum].has(targetBqNum))return{match:false};
}else if(targetBqNum!==null){
let bqFound=false;
for(let loc in locData.seenLocations){if(locData.seenLocations[loc].has(targetBqNum)){bqFound=true;break;}}
if(!bqFound)return{match:false};
}
return{match:true};
}
function checkAnomalies(searchEngine,conds){
let result ={match: true,anomalyDetails: [],jumpToFloor: -1 };
if(conds.anomaly==="")return result;
let hasAnyChestAnomaly=false,hasAnyCorridorAnomaly=false,hasAnyStairAnomaly=false;
let hasAnyNoChestAnomaly=false,hasAnyMultiRegionAnomaly=false,hasAnyChestCorridorCombo=false;
let hasAnyGhostAnomaly=false,hasAnyAllInvalidAnomaly=false,corridorFloorCount=0;
let firstChestFloor=-1,firstCorridorFloor=-1,firstStairFloor=-1;
let firstNoChestFloor=-1,firstMultiRegionFloor=-1,firstGhostFloor=-1,firstAllInvalidFloor=-1;
for(let f=0;f<searchEngine.floorCount;f++){
let anom=getFloorAnomalies(searchEngine,f,conds.anomaly==='ghost');
if(anom.isAllInvalidStair){hasAnyAllInvalidAnomaly=true;result.anomalyDetails.push(`<span style="color:#fff;font-size:11px;font-weight:bold;background:#cc0000;padding:1px 4px;border-radius:3px;border:1px solid #f44;box-shadow:1px 1px 2px rgba(0,0,0,0.5);">B${f+1}F ${TKB3_2}</span>`);if(firstAllInvalidFloor===-1)firstAllInvalidFloor=f;}
if(anom.hasInaccessibleStair){hasAnyStairAnomaly=true;result.anomalyDetails.push(`<span style="color:#ff0000;font-size:11px;font-weight:bold;background:#550000;padding:1px 4px;border-radius:3px;">B${f+1}F ${TKB3_0}</span>`);if(firstStairFloor===-1)firstStairFloor=f;}
if(anom.hasInaccessibleChest){hasAnyChestAnomaly=true;if(anom.totalChests===1){hasAnyNoChestAnomaly=true;result.anomalyDetails.push(`<span style="color:#0ff;font-size:11px;font-weight:bold;background:#004466;padding:1px 4px;border-radius:3px;border:1px solid #08a;">B${f+1}F ${TKB1_3}</span>`);if(firstNoChestFloor===-1)firstNoChestFloor=f;}else{result.anomalyDetails.push(`<span style="color:#ff69b4;font-size:11px;font-weight:bold;">B${f+1}F ${TKB1_1}</span>`);} if(firstChestFloor===-1)firstChestFloor=f;}
if(anom.hasIsolatedCorridor){hasAnyCorridorAnomaly=true;corridorFloorCount++;if(anom.isolatedRegions.length>=2){hasAnyMultiRegionAnomaly=true;if(firstMultiRegionFloor===-1)firstMultiRegionFloor=f;} let countBadges=anom.isolatedRegions.map(size=>`<span style="background:#ff6ec7;color:#fff;padding:1px 4px;border-radius:3px;font-size:10px;margin-left:4px;box-shadow:1px 1px 2px rgba(0,0,0,0.5);">${size}</span>`).join('');result.anomalyDetails.push(`<span style="color:#fa0;font-size:11px;">B${f+1}F ${TKB2_1} ${countBadges}</span>`);if(firstCorridorFloor===-1)firstCorridorFloor=f;}
if(anom.hasGhostStair){hasAnyGhostAnomaly=true;result.anomalyDetails.push(`<span style="color:#fff;font-size:11px;font-weight:bold;background:#555577;padding:1px 4px;border-radius:3px;border:1px solid #8888aa;box-shadow:1px 1px 2px rgba(0,0,0,0.5);">B${f+1}F ${TKB3_1}: ${anom.GhostStairs.join(',')}</span>`);if(firstGhostFloor===-1)firstGhostFloor=f;}
if(anom.hasInaccessibleChest&&anom.hasIsolatedCorridor) hasAnyChestCorridorCombo=true;
}
if(conds.anomaly==='chest'&&!hasAnyChestAnomaly) result.match=false;
else if(conds.anomaly==='nochest'&&!hasAnyNoChestAnomaly) result.match=false;
else if(conds.anomaly==='corridor'&&!hasAnyCorridorAnomaly) result.match=false;
else if(conds.anomaly==='stair'&&!hasAnyStairAnomaly) result.match=false;
else if(conds.anomaly==='ghost'&&!hasAnyGhostAnomaly) result.match=false;
else if(conds.anomaly==='all_invalid'&&!hasAnyAllInvalidAnomaly) result.match=false;
else if(conds.anomaly==='chest_corridor'&&!hasAnyChestCorridorCombo) result.match=false;
else if(conds.anomaly==='multi_corridor'&&corridorFloorCount<2) result.match=false;
else if(conds.anomaly==='multi_region'&&!hasAnyMultiRegionAnomaly) result.match=false;
if(result.match){
if(conds.anomaly==='chest') result.jumpToFloor=firstChestFloor;
else if(conds.anomaly==='nochest') result.jumpToFloor=firstNoChestFloor;
else if(conds.anomaly==='corridor'||conds.anomaly==='multi_corridor') result.jumpToFloor=firstCorridorFloor;
else if(conds.anomaly==='multi_region') result.jumpToFloor=firstMultiRegionFloor;
else if(conds.anomaly==='stair') result.jumpToFloor=firstStairFloor;
else if(conds.anomaly==='ghost') result.jumpToFloor=firstGhostFloor;
else if(conds.anomaly==='all_invalid') result.jumpToFloor=firstAllInvalidFloor;
else if(conds.anomaly==='chest_corridor') result.jumpToFloor=(firstChestFloor!==-1)?firstChestFloor:firstCorridorFloor;
}
return result;
}
function buildOnlyMonExpectedStr(conds){
if(!conds.onlyMon)return '';
let targetJpName=conds.onlyMon;
for(let id in MONSTER_DATA){
if(MONSTER_DATA[id].en===conds.onlyMon){targetJpName=MONSTER_DATA[id].jp;break;}
}
return(DISPLAY_LANG!=='EN'?targetJpName:conds.onlyMon)+(DISPLAY_LANG!=='EN'?"オンリー":" only");
}
function makeResultClickHandler(seed,rStr,jumpFloor){
return()=>{
document.getElementById('seed').value=seed.toString(16).toUpperCase().padStart(4,'0');
if(rStr) document.getElementById('rank').value="0x"+rStr;
calculate();
document.getElementById('result').scrollIntoView({behavior:'smooth'});
if(jumpFloor!==undefined&&jumpFloor!==null&&jumpFloor!==-1){
setTimeout(()=>{
const tab=document.querySelectorAll('.floor-tab')[jumpFloor];
if(tab) tab.click();
},50);
}
};
}
async function executeSharedSearch(config){
if(isSearching){searchCancel=true;return;}
const conds=getUltimateConds();
const searchFilterLoc=true;
if(config.validateConds&&!config.validateConds(conds,searchFilterLoc)){return;}
const rangeData=getValidatedSeedRange();
if(rangeData.error){alert(rangeData.error);return;}
const {startSeed,endSeed}=rangeData;
isSearching=true;searchCancel=false;
const btn=document.getElementById(config.btnId);
if(btn){
btn.textContent=config.stopText||'🛑 STOP';
btn.style.background='#f44';
btn.style.color='#fff';
}
const searchAllRanks=document.getElementById('searchAllRanks').checked;
const baseRankStr=document.getElementById('rank').value;
let ranksToSearch=searchAllRanks?MAP_RANK:[parseInt(baseRankStr)];
if(config.filterRanks){ranksToSearch=config.filterRanks(ranksToSearch,conds);}
const resultDiv=document.getElementById('searchResults');
resultDiv.innerHTML='<div style="color:#aaa;font-size:13px;margin-bottom:8px">'+B01+' <span id="searchProgress" style="color:#fff;font-weight:bold">0%</span></div><div id="searchGrid" class="search-grid"></div>';
const grid=document.getElementById('searchGrid');
const progressSpan=document.getElementById('searchProgress');
if(ranksToSearch.length===0){
progressSpan.textContent="100% ("+(config.emptyRankMsg||B08)+")";
isSearching=false;
if(btn){btn.textContent=config.btnText;btn.style.background=config.btnBg;btn.style.color=config.btnColor||'#fff';}
return;
}
let totalCombos=ranksToSearch.length*(endSeed-startSeed+1);
let processed=0;
let hitCount=0;
let searchEngine=new GrottoDetail();
if(config.setupEngine) config.setupEngine(searchEngine,conds);
let fragment=document.createDocumentFragment();
try{
for(let rank of ranksToSearch){
if(searchCancel)break;
let rStr=rank.toString(16).toUpperCase().padStart(2,'0');
let targetRankKey=RANKS[rStr]?rStr:(RANKS["0x"+rStr]?"0x"+rStr :(RANKS[rank]?rank:null));
for(let seed=startSeed;seed<=endSeed;seed++){
if(searchCancel) break;
if(seed%250===0){
progressSpan.textContent=Math.floor((processed/totalCombos)*100)+'% ('+B02+' '+rStr+',Seed '+seed.toString(16).toUpperCase().padStart(4,'0')+') ['+B04+''+hitCount+' '+B03+']';
if(fragment.children.length>0)grid.appendChild(fragment);
await new Promise(r=>setTimeout(r,0));
}
searchEngine.MapSeed=seed;
searchEngine.MapRank=rank;
_cachedLocData=null;
let itemNode=config.processSeed(searchEngine,seed,rStr,targetRankKey,conds,searchFilterLoc);
if(itemNode){
hitCount++;
fragment.appendChild(itemNode);
}
processed++;
}
}
if(fragment.children.length>0)grid.appendChild(fragment);
}catch(error){
console.error("搜尋過程發生錯誤：",error);
alert(A03);
searchCancel=true;
}finally{
isSearching=false;
if(btn){btn.textContent=config.btnText;btn.style.background=config.btnBg;btn.style.color=config.btnColor||'#000';}
progressSpan.textContent=searchCancel?`${B05} (${B04}${hitCount} ${B03})`:`100% (${B06?B06+' ':''}${hitCount} ${B03})`;
}
}
function getRankSMRInfo(rank,conds){
let rStr=rank.toString(16).toUpperCase().padStart(2,'0');
if(conds&&conds.bq){
let baseQ=parseInt(conds.bq);
let modulo=Math.floor(baseQ/10)*2+1;
let minOffset=Math.trunc(0-baseQ/10);
let maxOffset=Math.trunc((modulo-1)-baseQ/10);
let minFinalQ=Math.max(2,baseQ+minOffset);
let maxFinalQ=Math.min(248,baseQ+maxOffset);
let rankInfo=RANKS[rStr];
if(rankInfo&&(maxFinalQ<rankInfo.fqMin||minFinalQ>rankInfo.fqMax))return null;
}
let minSMR=1,maxSMR=9;
for(let i=0;i<8;i++){
if(rank>=TableC[i*4]&&rank<=TableC[i*4+1]){
minSMR=TableC[i*4+2];
maxSMR=TableC[i*4+3];
break;
}
}
if(conds&&conds.monster){
let targetSMR=parseInt(conds.monster);
if(targetSMR<minSMR||targetSMR>maxSMR)return null;
}
let maxFloorCount=16;
for(let i=0;i<9;i++){
if(rank>=TableB[i*4]&&rank<=TableB[i*4+1]){
maxFloorCount=TableB[i*4+3];
break;
}
}
if(conds&&conds.depth)maxFloorCount=parseInt(conds.depth);
return {minSMR,maxSMR,maxFloorCount};
}
function sharedRankFilter(ranksToSearch,conds,isBugSearch=false){
if(!conds.onlyMon&&!conds.monster&&!conds.bq&&!conds.hasBoxCond&&!conds.prefix){
return ranksToSearch;
}
return ranksToSearch.filter(rank=>{
const info=getRankSMRInfo(rank,conds);
if(!info)return false;
const {minSMR,maxSMR,maxFloorCount}=info;
if(conds.prefix){
const p=parseInt(conds.prefix);
let prefixPossible=false;
for(let smr=minSMR;smr<=maxSMR&&!prefixPossible;smr++){
for(let j=0;j<5;j++){
if(smr>=TableH[j*4]&&smr<=TableH[j*4+1]){
if(p>=TableH[j*4+2]&&p<=TableH[j*4+3])prefixPossible=true;
break;
}
}
}
if(!prefixPossible)return false;
}
let maxOffset=isBugSearch?3:Math.floor((maxFloorCount-1)/4);
if(conds.hasBoxCond){
let maxPossibleNum=Math.min(12,maxSMR+maxOffset);
for(let r=10;r>=1;r--){
if(conds.reqBox[r]>0){
let canDrop=false;
for(let num=minSMR;num<=maxPossibleNum;num++){
let cMin=TableF[(num-1)*4+1];
let cMax=TableF[(num-1)*4+2];
if(r>=cMin&&r<=cMax){
canDrop=true;
break;
}
}
if(!canDrop)return false;
}
}
}
if(conds.onlyMon){
let targetEnv=conds.env?parseInt(conds.env):0;
let isPossible=false;
for(let env=1;env<=5;env++){
if(targetEnv&&env!==targetEnv) continue;
for(let fMR=1;fMR<=12;fMR++){
let mId=ONLY_MONSTERS[env][fMR];
if(mId&&MONSTER_DATA[mId]&&MONSTER_DATA[mId].en===conds.onlyMon){
let smrStart=conds.monster?parseInt(conds.monster):minSMR;
let smrEnd=conds.monster?parseInt(conds.monster):maxSMR;
for(let smr=smrStart;smr<=smrEnd;smr++){
if(fMR>=smr&&fMR<=smr+maxOffset){
isPossible=true;
break;
}
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
}
function startUltimateSearch(){
const conds=getUltimateConds();
let _onlyMonExpectedStr='';
if(conds.onlyMon){
let targetJpName=conds.onlyMon;
for(let id in MONSTER_DATA){
if(MONSTER_DATA[id].en===conds.onlyMon){
targetJpName=MONSTER_DATA[id].jp;
break;
}
}
let expectedName=(DISPLAY_LANG!=='EN')?targetJpName:conds.onlyMon;
let expectedSuffix=(DISPLAY_LANG!=='EN')?"オンリー":" only";
_onlyMonExpectedStr=expectedName+expectedSuffix;
}
executeSharedSearch({
btnId:'searchBtnSpecific',
btnText:'🎯 Search',
btnBg:'linear-gradient(135deg,#0ff,#08a)',
btnColor:'#000',
stopText:'🛑 STOP',
emptyRankMsg: B07,
validateConds:(conds,searchFilterLoc)=>{
const hasBasicCond=Object.keys(conds).some(k=>k!=='reqBox'&&k!=='hasBoxCond'&&conds[k]!=="");
if(!hasBasicCond&&!conds.hasBoxCond&&!searchFilterLoc){alert(A01);return false;}
return true;
},
filterRanks:(ranksToSearch,conds)=>sharedRankFilter(ranksToSearch,conds,false),
setupEngine:(eng,conds)=>{
eng.trackOverflow=(conds.anomaly==='all_invalid'||conds.anomaly==='ghost');
},
processSeed:(searchEngine,seed,rStr,targetRankKey,conds,searchFilterLoc)=>{
const searchOnlyWithD=document.getElementById('searchOnlyWithD').checked;
const needMapGeneration=conds.hasBoxCond||conds.elist||conds.onlyMon||searchOnlyWithD||conds.anomaly!=="";
searchEngine.calculateDetail(true);
if(!checkUltimateCondsMatch(searchEngine,seed,targetRankKey,conds,searchFilterLoc))return null;
if(conds.onlyMon){
let isCombinedSearch=['2','3','4','PARTIAL_NONE'].includes(conds.elist);
if(!isCombinedSearch){
let possible=false;
let baseMR=searchEngine.monsterRank;
let maxFloorMR=Math.min(12,baseMR+Math.floor((searchEngine.floorCount-1)/4));
let envMonsters=ONLY_MONSTERS[searchEngine._details[3]];
if(envMonsters){
for(let fMR=baseMR;fMR<=maxFloorMR;fMR++){
let mId=envMonsters[fMR];
if(mId&&MONSTER_DATA[mId]&&MONSTER_DATA[mId].en===conds.onlyMon){possible=true;break;}
}
}
if(!possible)return null;
}
}
if(needMapGeneration) searchEngine.createDungeonDetail();
let boxHtml="";
if(conds.hasBoxCond){
let chestResult=ChestHtml(searchEngine,conds);
if(!chestResult.isMatch)return null;
boxHtml=chestResult.html;
}
let elistResult=checkElistAndD(searchEngine,conds,searchOnlyWithD,_onlyMonExpectedStr);
if(!elistResult.match)return null;
let anomResult=checkAnomalies(searchEngine,conds);
if(!anomResult.match)return null;
let specialHitDetails=elistResult.specialHitDetails;
let anomalyDetails=anomResult.anomalyDetails;
let hasMatchedD=elistResult.hasMatchedD;
let jumpToFloor=elistResult.jumpToFloor!==-1?elistResult.jumpToFloor:anomResult.jumpToFloor;
let itemNode=document.createElement('div');
itemNode.className='search-result-item';
if(hasMatchedD) itemNode.dataset.hasD="true";
let locHtml=getLocHtmlCached(seed,targetRankKey,conds);
let specialHtml=specialHitDetails.length>0?`<div style="margin-top:4px;">${specialHitDetails.map(s=>`<span style="color:#ffccff;font-size:11px">${s}</span>`).join('<br>')}</div>`:'';
let anomalyHtml=anomalyDetails.length>0?`<div style="margin-top:6px;display:flex;flex-direction:column;align-items:flex-start;">${anomalyDetails.map(html=>html.replace('<span style="','<span style="display:inline-block;line-height:1.4;margin-top:4px;')).join('')}</div>`:'';
let mapNameDisp=DISPLAY_LANG!=='EN'?searchEngine.mapNameJP:searchEngine.mapName;
itemNode.innerHTML=`
<span style="color:#ffd700;font-weight:bold">${seed.toString(16).toUpperCase().padStart(4,'0')}</span>
<span style="color:#888">(Rank ${rStr})</span><br>
<span style="color:#0ff;font-size:11px">${mapNameDisp}</span>${locHtml}
<div style="margin-top:4px;">${boxHtml}</div>
${specialHtml}
${anomalyHtml}
`;
itemNode.onclick=makeResultClickHandler(seed,rStr,jumpToFloor);
return itemNode;
}
});
}
async function MultibugSearch(){
const conds=getUltimateConds();
const cond_elist=conds.elist;
const cond_only_mon=conds.onlyMon;
const _onlyMonExpectedStr=buildOnlyMonExpectedStr(conds);
const isCombinedSearch=(['2','3','4','PARTIAL_NONE'].includes(cond_elist))&&!!cond_only_mon;
let effectiveElistCond=cond_elist;
const searchOnlyWithDNode=document.getElementById('searchOnlyWithD');
const searchOnlyWithD=searchOnlyWithDNode?searchOnlyWithDNode.checked:false;
if(!cond_elist&&!cond_only_mon&&!searchOnlyWithD&&!conds.hasBoxCond){
effectiveElistCond='ONLY';
}
executeSharedSearch({
btnId:'searchBtnBug',
btnText: H05,
btnBg:'linear-gradient(135deg,#c0c,#606)',
btnColor:'#fff',
stopText:'STOP',
emptyRankMsg: B07,
filterRanks:(ranksToSearch,conds)=>{
return sharedRankFilter(ranksToSearch,conds,true);
},
processSeed:(searchEngine,seed,rStr,targetRankKey,conds,searchFilterLoc)=>{
const requireFloorIncrease=document.getElementById('requireFloorIncrease').checked;
const requireBugFloorHitNode=document.getElementById('requireBugFloorHit');
const requireBugFloorHit=requireBugFloorHitNode?requireBugFloorHitNode.checked:false;
searchEngine._at_offset=0;
searchEngine._force_16_floors=false;
searchEngine.calculateDetail(true);
if(!checkUltimateCondsMatch(searchEngine,seed,targetRankKey,conds,searchFilterLoc))return null;
let origFloors=searchEngine.floorCount;
let origBoss=DISPLAY_LANG!=='EN'?searchEngine.bossNameJP:searchEngine.bossName;
let origName=DISPLAY_LANG!=='EN'?searchEngine.mapNameJP:searchEngine.mapName;
searchEngine._at_offset=1;
searchEngine._force_16_floors=false;
searchEngine.calculateDetail();
let bugFloors=searchEngine.floorCount;
let bugBoss=DISPLAY_LANG!=='EN'?searchEngine.bossNameJP:searchEngine.bossName;
let bugName=DISPLAY_LANG!=='EN'?searchEngine.mapNameJP:searchEngine.mapName;
let isFloorIncreased=bugFloors>origFloors;
if(requireFloorIncrease&&!isFloorIncreased)return null;
searchEngine._at_offset=0;
searchEngine._force_16_floors=true;
searchEngine.calculateDetail();
let boxHtml="";
if(conds.hasBoxCond){
let actualBoxCounts={10:0,9:0,8:0,7:0,6:0,5:0,4:0,3:0,2:0,1:0};
for(let f=2;f<bugFloors;f++){
let boxes=searchEngine.di[f][8];
for(let b=0;b<boxes;b++){
actualBoxCounts[searchEngine.di[f][9+b]]++;
}
}
let boxMatch=true;
let boxStr=[];
for(let r=10;r>=1;r--){
if(conds.reqBox[r]>0){
if(actualBoxCounts[r]!==conds.reqBox[r]){boxMatch=false;break;}
boxStr.push(`${CHEST_RANK[r]}${conds.reqBox[r]}`);
}
}
if(!boxMatch){
searchEngine._force_16_floors=false;
return null;
}
boxHtml=`<div style="margin-top:4px;"><span style="color:#ffcc00;font-size:11px;background:#420;padding:2px 4px;border-radius:3px;">${boxStr.join(' ')}</span></div>`;
}
let foundSpecialFloors=[];
let specialHitCount=0;
let hasAnyD=false;
for(let f=2;f<16;f++){
let elistInfo=getFloorElistInfo(searchEngine,f);
let val=parseInt(elistInfo.hex,16);
if(elistInfo.dValue>0) hasAnyD=true;
let isElistHit=false;
let isOnlyHit=false;
if(val>=0x2B00&&elistInfo.state){
if(!effectiveElistCond){isElistHit=true;}
else if(effectiveElistCond==='PARTIAL_NONE'&&elistInfo.state.includes(EL_P)) isElistHit=true;
else if(effectiveElistCond==='4'&&elistInfo.state.includes(EL_4)) isElistHit=true;
else if(effectiveElistCond==='3'&&elistInfo.state.includes(EL_3)) isElistHit=true;
else if(effectiveElistCond==='2'&&elistInfo.state.includes(EL_2)) isElistHit=true;
else if(effectiveElistCond==='ONLY'&&(elistInfo.state.includes('only')||elistInfo.state.includes('オンリー'))) isElistHit=true;
else if(effectiveElistCond==='NONE'&&elistInfo.state.includes(EL_0)&&!elistInfo.state.includes(EL_P)) isElistHit=true;
else if(effectiveElistCond==='MULTI_SPECIAL') isElistHit=true;
if(isCombinedSearch){
if(isElistHit){
let tgtCount=0;
if(elistInfo.state.includes(EL_4)) tgtCount=4;
else if(elistInfo.state.includes(EL_3)) tgtCount=3;
else if(elistInfo.state.includes(EL_2)) tgtCount=2;
let fMR=searchEngine._details[2]+(f >> 2);
if(fMR>12) fMR=12;
let spList=(SPAWN_DB[searchEngine._details[3]]&&SPAWN_DB[searchEngine._details[3]][fMR])||[];
let norms=spList.filter(e=>e.length===3);
let limit=tgtCount>0?tgtCount:norms.length;
let survivingNamesEn=norms.slice(0,limit).map(e=>MONSTER_DATA[e[0]]?MONSTER_DATA[e[0]].en:'');
if(survivingNamesEn.includes(cond_only_mon)){
isOnlyHit=true;
}
}
}else{
if(!cond_only_mon){
isOnlyHit=true;
}else if(elistInfo.state.includes(_onlyMonExpectedStr)){
isOnlyHit=true;
}
}
}
let isSpecialMatch=(isElistHit&&isOnlyHit&&val>=0x2B00&&val<=0x2BBC&&elistInfo.state);
if(isSpecialMatch){specialHitCount++;}
if((val>=0x2B00&&elistInfo.state)||(searchOnlyWithD&&elistInfo.dValue>0)){
if(!foundSpecialFloors.some(x=>x.floor===f+1)){
let fMR=searchEngine._details[2]+(f >> 2);
if(fMR>12) fMR=12;
foundSpecialFloors.push({
floor: f+1,
hex: elistInfo.hex,
state: elistInfo.state||EL_NORMAL,
dValue: elistInfo.dValue,
envType: searchEngine._details[3],
floorMR: fMR,
isSpecialMatch: !!isSpecialMatch
});
}
}
}
if(requireBugFloorHit){
foundSpecialFloors=foundSpecialFloors.filter(info=>info.floor>origFloors&&info.floor<=bugFloors);
hasAnyD=foundSpecialFloors.some(info=>info.dValue>0);
specialHitCount=foundSpecialFloors.filter(info=>info.state!==EL_NORMAL).length;
if(foundSpecialFloors.length===0){
searchEngine._force_16_floors=false;
return null;
}
}
if(searchOnlyWithD&&!hasAnyD){
searchEngine._force_16_floors=false;
return null;
}
if(searchOnlyWithD&&(effectiveElistCond||cond_only_mon)&&effectiveElistCond!=='MULTI_SPECIAL'){
let hasMatchedD_mb=foundSpecialFloors.some(info=>info.dValue>0&&info.isSpecialMatch);
if(!hasMatchedD_mb){
searchEngine._force_16_floors=false;
return null;
}
}
if(effectiveElistCond==='MULTI_SPECIAL'&&specialHitCount<2){
searchEngine._force_16_floors=false;
return null;
}
if((effectiveElistCond||cond_only_mon)&&specialHitCount===0){
searchEngine._force_16_floors=false;
return null;
}
const isJP_mb=(DISPLAY_LANG!=='EN');
let elistHtmlStr=foundSpecialFloors.map(info=>{
let stateColor="#888";
if(info.state!==EL_NORMAL){
if(info.floor<=origFloors){
stateColor="#4f4";
}else if(info.floor<=bugFloors){
stateColor="#fa0";
}else{
stateColor="#f8f";
}
}
let dHtml=info.dValue>0?` <span style="background:#fa0;color:#000;padding:1px 5px;border-radius:3px;font-size:10px;margin-left:4px;white-space:nowrap;">${info.dValue}</span>`:'';
let line=`<span style="color:#0ff;font-size:12px;">B${info.floor}F: [${info.hex}] <strong style="color:${stateColor};">${info.state}</strong>${dHtml}</span>`;
const st=info.state;
let surviveCount=0;
if(st.includes(EL_4)) surviveCount=4;
else if(st.includes(EL_3)) surviveCount=3;
else if(st.includes(EL_2)) surviveCount=2;
let shouldShowMonBadge=(surviveCount>0&&cond_elist===surviveCount.toString())||(isCombinedSearch&&surviveCount>0);
if(shouldShowMonBadge){
const spList=(SPAWN_DB[info.envType]&&SPAWN_DB[info.envType][info.floorMR])||[];
const norms=spList.filter(e=>e.length===3);
const names=norms.slice(0,surviveCount).map(e=>{
const md=MONSTER_DATA[e[0]];
return md?(isJP_mb?md.jp:md.en):'?';
});
line+=`<br><span style="color:#aaa;font-size:10px;">${names.join('+')}</span>`;
}
return line;
}).join('<br>');
let itemNode=document.createElement('div');
itemNode.className='search-result-item';
if(hasAnyD) itemNode.dataset.hasD="true";
let bugIcon=isFloorIncreased?'📈':'';
itemNode.innerHTML=`
<span style="color:#ffd700;font-weight:bold;font-size:15px;">${seed.toString(16).toUpperCase().padStart(4,'0')}</span>
<span style="color:#888">(Rank ${rStr})</span><br>
<div style="background:#111;padding:4px 8px;border-radius:4px;margin:4px 0;border:1px solid #333;">
<span style="color:#aaa;font-size:11px">[Source] ${origName}|B${origFloors}F|${origBoss}</span><br>
<span style="color:#f8f;font-size:12px">[Bug] ${bugName}|B${bugFloors}F|${bugBoss} ${bugIcon}</span>
</div>${boxHtml}
<div style="padding-top:2px;">${elistHtmlStr}</div>
`;
itemNode.onclick=makeResultClickHandler(seed,rStr);
searchEngine._force_16_floors=false;
return itemNode;
}
});
}
function clearUltimateSearch(){
const inputIds=[
'cond_prefix','cond_suffix','cond_locale','cond_lv','cond_location',
'cond_bq','cond_bq_count','cond_env','cond_monster','cond_depth','cond_boss',
'cond_seed_min','cond_seed_max','cond_elist','cond_only_mon','cond_anomaly',
'cond_box_S','cond_box_A','cond_box_B','cond_box_C','cond_box_D',
'cond_box_E','cond_box_F','cond_box_G','cond_box_H','cond_box_I'
];
inputIds.forEach(id=>{
let el=document.getElementById(id);
if(el){el.value='';}
});
let bqEl=document.getElementById('cond_bq');
if(bqEl){bqEl.disabled=false;bqEl.style.opacity='1';}
const checkboxIds=['searchAllRanks','searchOnlyWithD','requireFloorIncrease','requireBugFloorHit'];
checkboxIds.forEach(id=>{
let el=document.getElementById(id);
if(el){el.checked=false;}
});
}