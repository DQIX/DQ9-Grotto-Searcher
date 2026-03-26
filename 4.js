let isSearching=false;
let searchCancel=false;
function getDispItem(enName){let trans=i18nDict['I_'+enName];return trans?trans.split('(')[0]:enName;}
async function executeCustomSearch(config){
if(isSearching){searchCancel=true; return; }
isSearching=true; searchCancel=false;
const btn=document.getElementById(config.btnId);
if(btn){btn.textContent='STOP'; btn.style.background='#ff4444'; btn.style.color='#fff';}
const searchAllRanks=document.getElementById('searchAllRanks').checked;
const baseRankStr=document.getElementById('rank').value;
const searchFilterLoc=true;
const conds=getUltimateConds();
const rangeData=getValidatedSeedRange();
if(rangeData.error){
alert(rangeData.error);
isSearching=false;
if(btn){btn.textContent=config.btnText; btn.style.background=config.btnBg; btn.style.color=config.btnColor||'#fff'; }
return;
}
const {startSeed, endSeed}=rangeData;
const resultDiv=document.getElementById('searchResults');
resultDiv.innerHTML='<div style="color:#aaa; font-size:13px; margin-bottom:8px">'+B01+' <span id="searchProgress" style="color:#fff; font-weight:bold">0%</span></div><div id="searchGrid" class="search-grid"></div>';
const grid=document.getElementById('searchGrid');
const progressSpan=document.getElementById('searchProgress');
let ranksToSearch=searchAllRanks?MAP_RANK:[parseInt(baseRankStr)];
if(config.filterRanks){
ranksToSearch=config.filterRanks(ranksToSearch, conds);
}
if(ranksToSearch.length===0){
progressSpan.textContent="100% ("+B13+")";
isSearching=false;
if(btn){btn.textContent=config.btnText; btn.style.background=config.btnBg; btn.style.color=config.btnColor||'#fff'; }
return;
}
let totalCombos=ranksToSearch.length*(endSeed-startSeed+1);
let processed=0;
let hitCount=0;
let searchEngine=new GrottoDetail();
let fragment=document.createDocumentFragment();
try{
for(let rank of ranksToSearch){
if(searchCancel) break;
let rStr=rank.toString(16).toUpperCase().padStart(2, '0');
let targetRankKey=RANKS[rStr]?rStr:(RANKS["0x"+rStr]?"0x"+rStr:(RANKS[rank]?rank:null));
for(let seed=startSeed; seed<=endSeed; seed++){
if(searchCancel) break;
if(seed%250===0){
progressSpan.textContent=Math.floor((processed / totalCombos)*100)+'% ('+B02+' '+rStr+', Seed '+seed.toString(16).toUpperCase().padStart(4,'0')+') ['+B04+''+hitCount+' '+B03+']';
if(fragment.children.length>0) grid.appendChild(fragment);
await new Promise(r=>setTimeout(r, 0));
}
searchEngine.MapSeed=seed;
searchEngine.MapRank=rank;
searchEngine.calculateDetail(true); 
if(config.checkBasicReq&&!config.checkBasicReq(searchEngine, conds)){processed++; continue; }
if(!checkUltimateCondsMatch(searchEngine, seed, targetRankKey, conds, searchFilterLoc)){processed++; continue; }
searchEngine.createDungeonDetail();
let chestResult=ChestHtml(searchEngine, conds);
if(!chestResult.isMatch){processed++; continue;}
let boxHtml=chestResult.html;
let hitResult=config.checkDungeon(searchEngine);
if(hitResult&&hitResult.isHit){
hitCount++; 
if(!_cachedLocData&&seed<=0x7FFF&&targetRankKey!==null){
_cachedLocData=calcLocations(seed, targetRankKey);
}
let locHtml=_cachedLocData?LocaHtmlFromData(_cachedLocData, conds):"";
let itemNode=document.createElement('div');
itemNode.className='search-result-item';
if(hitResult.specialStyle) itemNode.style.border=hitResult.specialStyle;
let mapNameDisp=DISPLAY_LANG!=='EN'?searchEngine.mapNameJP:searchEngine.mapName;
itemNode.innerHTML=`
<span style="color:#ffd700; font-weight:bold">${seed.toString(16).toUpperCase().padStart(4,'0')}</span> 
<span style="color:#888">(Rank ${rStr})</span><br>
<span style="color:#00ffff; font-size:11px; margin-bottom:2px; display:inline-block;">${mapNameDisp}</span>${locHtml}
<div style="margin-top:4px;">${boxHtml}</div>
<div style="margin-top:4px;">${hitResult.displayHtml}</div>
`;
itemNode.title=J01;
itemNode.onclick=()=>{
document.getElementById('seed').value=seed.toString(16).toUpperCase().padStart(4,'0');
document.getElementById('rank').value="0x"+rStr;
calculate();
document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
setTimeout(()=>{
 const tab=document.querySelectorAll('.floor-tab')[hitResult.jumpFloor||0];
 if(tab) tab.click();
},50);
};
fragment.appendChild(itemNode);
}
processed++;
}
}
if(fragment.children.length>0)grid.appendChild(fragment);
}catch(error){
console.error("E R R O R : ", error);
searchCancel=true;
}finally{
isSearching=false;
if(btn){btn.textContent=config.btnText; btn.style.background=config.btnBg; btn.style.color=config.btnColor||'#fff'; }
progressSpan.textContent=searchCancel?`${B06} (${B04}${hitCount} ${B03})`:`100% (${B09?B09+' ':''}${hitCount} ${B03})`;
}
}
function getChestRanksForItems(itemNames){
const ranks=[];
for(let r=1; r<=10; r++){
let startIdx=TableO[r-1], endIdx=TableO[r];
for(let i=startIdx; i<endIdx; i++){
if(itemNames.includes(TableR[TableQ[i]][0])&&!ranks.includes(r)) ranks.push(r);
}
}
return ranks;
}
function filterMapRanksBySMRAndChest(ranksToSearch,conds,chestRankGroups,targetFloorOffset){
return ranksToSearch.filter(rank=>{
if(conds&&conds.bq){
let baseQ=parseInt(conds.bq);
let modulo=Math.floor(baseQ/10)*2+1;
let minOffset=Math.trunc(0-baseQ/10);
let maxOffset=Math.trunc((modulo-1)-baseQ/10);
let minFinalQ=Math.max(2,baseQ+minOffset);
let maxFinalQ=Math.min(248,baseQ+maxOffset);
let rStr=rank.toString(16).toUpperCase().padStart(2,'0');
let rankInfo=RANKS[rStr];
if(rankInfo&&(maxFinalQ<rankInfo.fqMin||minFinalQ>rankInfo.fqMax)){return false;}
}
let minSMR=1,maxSMR=9;
for(let i=0;i<8;i++){
if(rank>=TableC[i*4]&&rank<=TableC[i*4+1]){minSMR=TableC[i*4+2];maxSMR=TableC[i*4+3];break;}
}
if(conds&&conds.monster){
let targetSMR=parseInt(conds.monster);
if(targetSMR<minSMR||targetSMR>maxSMR)return false;
}
if(!chestRankGroups||chestRankGroups.length===0)return true;
let maxFloorCount=16;
for(let i=0;i<9;i++){
if(rank>=TableB[i*4]&&rank<=TableB[i*4+1]){maxFloorCount=TableB[i*4+3];break;}
}
if(conds&&conds.depth)maxFloorCount=parseInt(conds.depth);
let minOffset=0;
let maxOffset=Math.floor((maxFloorCount-1)/4);
if(targetFloorOffset!==undefined&&targetFloorOffset!==null){
let requiredFloors=(targetFloorOffset*4)+1;
if(maxFloorCount<requiredFloors)return false;
minOffset=targetFloorOffset;
maxOffset=targetFloorOffset;
}
let minPossibleNum=minSMR+minOffset;
let maxPossibleNum=Math.min(12,maxSMR+maxOffset);
return chestRankGroups.every(group=>{
return group.some(r=>{
for(let num=minPossibleNum;num<=maxPossibleNum;num++){
let cMin=TableN[(num-1)*4+1];
let cMax=TableN[(num-1)*4+2];
if(r>=cMin&&r<=cMax)return true;
}
return false;
});
});
});
}
function QuickloadSearch(isB9F){
const targetItem=document.getElementById(isB9F?'searchItemB9F':'searchItem').value;
if(["Cannibox","Mimic","Pandora's box"].includes(targetItem)){alert(A04);return;}
const millionaireItems=["Hero spear","Pruning knife","Wyrmwand","Wizardly whip","Beast claws","Attribeauty","Heavy hatchet","Megaton hammer","Pentarang","Metal slime sword","Metal slime spear"];
const sWeapons=["Stardust sword","Poker","Deft dagger","Bright staff","Gringham whip","Knockout rod","Dragonlord claws","Critical fan","Bad axe","Groundbreaker","Meteorang","Angel's bow"];
let reqCount,targetFloors,checkItems,btnConfig;
if(isB9F){
reqCount=2;
targetFloors=[8];
checkItems=(targetItem==='S weapon')?sWeapons:[targetItem];
btnConfig={id:'searchBtnB9F',text:H05,bg:'linear-gradient(135deg,#4488ff,#0044aa)'};
}else{
reqCount=b3fThreeItems.includes(targetItem)?3:2;
targetFloors=b3fThreeItems.includes(targetItem)?[2]:[2, 3];
checkItems=(targetItem==='Millionaire')?millionaireItems:[targetItem];
btnConfig={id:'searchBtn',text:H01,bg:'linear-gradient(135deg,#44cc44,#008800)'};
}
const chestRanks=getChestRanksForItems(checkItems);
const checkSet=new Set(checkItems);
executeCustomSearch({
btnId:btnConfig.id,btnText:btnConfig.text,btnBg:btnConfig.bg,
filterRanks:(ranks,conds)=>filterMapRanksBySMRAndChest(ranks,conds,[chestRanks],isB9F?2:0),
checkBasicReq:(eng,conds)=>eng.floorCount>=(isB9F?9:3)&&filterMapRanksBySMRAndChest([eng.MapRank],conds,[chestRanks],isB9F?2:0).length>0,
checkDungeon:(eng)=>{
let hitTypes=[];
let firstHitFloor=-1;
for(let f of targetFloors){
if(f>=eng.floorCount) continue;
const soloNames=eng.getFloorItemNames(f, 1);
const partyNames=eng.getFloorItemNames(f, 2);
let soloC=0, partyC=0;
for(let b=0;b<soloNames.length;b++){
if(checkSet.has(soloNames[b]))soloC++;
if(checkSet.has(partyNames[b]))partyC++;
}
if(soloC>=reqCount||partyC>=reqCount){if(firstHitFloor===-1) firstHitFloor=f; }
let prefixStr=isB9F?'B9F ':`B${f+1}F `;
if(soloC>=reqCount){
hitTypes.push(`<span style="color:#ff99bb; font-size:11px">${prefixStr}${STR_SOLO} x${soloC}</span>`);
}
if(partyC>=reqCount){
hitTypes.push(`<span style="color:#ffd700; font-size:11px">${prefixStr}${STR_PARTY} x${partyC}</span>`);
}
}
if(hitTypes.length>0){
return {isHit: true, jumpFloor: firstHitFloor, displayHtml: hitTypes.join('<br>')};
}
return {isHit:false};
}
});
}
function startSearch(){QuickloadSearch(false);}
function startSearchB9F(){QuickloadSearch(true);}
function ThirdChestSearch(isS3){
let checkItems, btnConfig, targetFloors, colorStyle;
if(isS3){
checkItems=["Sage's elixir","Sainted soma"];
targetFloors=[12,13];
btnConfig={id:'searchBtnBox3_S',text:H04,bg:'linear-gradient(135deg,#ffaa00,#cc6600)'};
colorStyle='#F0F0aa';
}else{
const targetItem=document.getElementById('searchItemBox3').value;
const millionaireItems=["Hero spear","Pruning knife","Wyrmwand","Wizardly whip","Beast claws","Attribeauty","Heavy hatchet"];
checkItems=(targetItem==='Millionaire2')?millionaireItems:[targetItem];
targetFloors=[2,3];
btnConfig={id:'searchBtnBox3',text:H03,bg:'linear-gradient(135deg,#cc44cc,#880088)'};
colorStyle='#11F514';
}
const chestRanks=isS3?[10]:getChestRanksForItems(checkItems);
executeCustomSearch({
btnId:btnConfig.id,btnText:btnConfig.text,btnBg:btnConfig.bg,
filterRanks:(ranks,conds)=>filterMapRanksBySMRAndChest(ranks,conds,[chestRanks],isS3?3:0),
checkBasicReq:(eng,conds)=>eng.floorCount>=(isS3?14:4)&&filterMapRanksBySMRAndChest([eng.MapRank],conds,[chestRanks],isS3?3:0).length>0,
checkDungeon:(eng)=>{
let f1=targetFloors[0],f2=targetFloors[1];
if(eng.getBoxCount(f1)>=3&&eng.getBoxCount(f2)>=3){
if(isS3&&(eng.getBoxInfo(f1, 2).rank!==10||eng.getBoxInfo(f2, 2).rank!==10)){
return{isHit:false};
}
let p1=eng.getBoxItem(f1,2,2)[0];
let p2=eng.getBoxItem(f2,2,2)[0];
let r1=CHEST_RANK[eng.getBoxInfo(f1, 2).rank]||'?';
let r2=CHEST_RANK[eng.getBoxInfo(f2, 2).rank]||'?';
if(checkItems.includes(p1)&&checkItems.includes(p2)){
return{
isHit:true,jumpFloor:f1,
displayHtml:`<span style="color:${colorStyle};font-size:11px">B${f1+1}F ${r1}3: ${getDispItem(p1)}<br>B${f2+1}F ${r2}3: ${getDispItem(p2)}</span>`
};
}
}
return{isHit: false};
}
});
}
function Box3Search(){ThirdChestSearch(false);}
function Box3Search_S(){ThirdChestSearch(true);}
function TKSearch(){
const targetItem=document.getElementById('searchItem').value;
let wpTargets=[];
let strictMatTargets=[]; 
let broadMatTargets=[];
let isMillionaire=false;
let isMonsterBox=false;
let minSec=0,maxSec=0;
if(targetItem==='Millionaire'){
isMillionaire=true;
wpTargets=["Hero spear","Pruning knife","Wyrmwand","Wizardly whip","Beast claws","Attribeauty","Heavy hatchet","Megaton hammer","Pentarang","Metal slime sword","Metal slime spear"];
strictMatTargets=["Gold bar","Orichalcum"];
broadMatTargets=["Hero spear","Pruning knife","Wyrmwand","Wizardly whip","Beast claws","Attribeauty","Heavy hatchet","Gold bar","Orichalcum"];
}else if(["Cannibox","Mimic","Pandora's box"].includes(targetItem)){
isMonsterBox=true;
wpTargets=[targetItem];
strictMatTargets=[targetItem];
if(targetItem==="Pandora's box"){
minSec=25;
maxSec=35;
}else{
minSec=20;
maxSec=30;
}
}else if(targetItem==='Dangerous bustier'){
wpTargets=["Dangerous bustier"];
strictMatTargets=["Aggressence"];
}else if(targetItem==='Fuddle bow'){
wpTargets=["Fuddle bow"];
strictMatTargets=["Mirrorstone"];
}else if(targetItem==='Slime shield'){
wpTargets=["Slime shield"];
strictMatTargets=["Iron ore"];
}else if(targetItem==="Sorcerer's stone"){
wpTargets=["Sorcerer's stone"];
strictMatTargets=["670G"];
}else{
alert(A05);
return;
}
let allMatTargets=isMillionaire?broadMatTargets:strictMatTargets;
const wpSet=new Set(wpTargets);
executeCustomSearch({
btnId:'BtnTK',btnText:H02,btnBg:'linear-gradient(135deg,#ff8800,#cc4400)',
filterRanks:(ranks,conds)=>filterMapRanksBySMRAndChest(ranks,conds,[getChestRanksForItems(wpTargets),getChestRanksForItems(allMatTargets)],0),
checkBasicReq:(eng,conds)=>eng.floorCount>=3,
checkDungeon:(eng)=>{
let wpMet=false,wpFloor=2;
let wpHits=[];
let checkWp=(fIdx)=>{
if(fIdx>=eng.floorCount)return false;
const soloNames=eng.getFloorItemNames(fIdx,1);
const partyNames=eng.getFloorItemNames(fIdx,2);
let foundAny=false;
const limit=Math.min(2,soloNames.length);
for(let b=0; b<limit; b++){
const s=soloNames[b],p=partyNames[b];
if(wpSet.has(s)||wpSet.has(p)){
let t=(wpSet.has(s)&&wpSet.has(p))?STR_BOTH:(wpSet.has(p)?STR_PARTY:STR_SOLO);
let hitItem=wpSet.has(p)?p:s;
let hitItemStr=getDispItem(hitItem);
let rName=CHEST_RANK[eng.getBoxInfo(fIdx,b).rank]||'?';
let color="#ff99bb";
if(t===STR_PARTY) color="#ffd700";
wpHits.push(`<span style="color:${color}; font-size:11px">B${fIdx+1}F ${rName}${b+1}: ${hitItemStr} (${t})</span>`);
wpMet=true; 
wpFloor=fIdx; 
foundAny=true; 
}
}
return foundAny;
};
if(isMonsterBox){
if(!checkWp(2))return{isHit:false};
let c1Met=false,matDet="",b3Rank="";
if(eng.floorCount>2&&eng.getBoxCount(2)>=3){
b3Rank=CHEST_RANK[eng.getBoxInfo(2,2).rank]||'?';
let foundSec=-1;
for(let s=minSec;s<=maxSec;s++){
if(eng.getBoxItem(2,2,s)[0]===targetItem){
foundSec=s;
break; 
}
}
if(foundSec!==-1){
c1Met=true;
matDet=`B3F ${b3Rank}3 (${foundSec+5}s): ${getDispItem(targetItem)}`;
}
}
if(c1Met){
let html=`${wpHits.join('<br>')}<br><span style="color:#ff6666;font-size:11px;font-weight:bold;">${matDet}</span>`;
return{isHit:true,jumpFloor:2,displayHtml:html,specialStyle:"1px solid #ff6666" };
}
return{isHit:false};
}
if(!checkWp(2))checkWp(3);
if(!wpMet)return{isHit: false};
let c1Met=false,c2Met=false,matDet="";
let b3V=false,pB3="",b3Rank="";
let b4V=false,pB4="",b4Rank="";
let currentB3Targets=isMillionaire?(wpFloor===2?strictMatTargets:broadMatTargets):strictMatTargets;
let currentB4Targets=isMillionaire?(wpFloor===3?strictMatTargets:broadMatTargets):strictMatTargets;
let checkSec=isMillionaire?2:8;
let labelText=isMillionaire?"":"(13s)";
if(eng.floorCount>2&&eng.getBoxCount(2)>=3){
pB3=eng.getBoxItem(2,2,checkSec)[0]; 
b3Rank=CHEST_RANK[eng.getBoxInfo(2, 2).rank]||'?';
if(currentB3Targets.includes(pB3)){
let pB3_25s=eng.getBoxItem(2,2,20)[0]; 
if(!isMillionaire){
if(!currentB3Targets.includes(pB3_25s)) b3V=true;
}else{
if(!strictMatTargets.includes(pB3_25s)) b3V=true;
}
}
}
if(eng.floorCount>3&&eng.getBoxCount(3)>=3){
pB4=eng.getBoxItem(3,2,checkSec)[0]; 
b4Rank=CHEST_RANK[eng.getBoxInfo(3, 2).rank]||'?';
if(currentB4Targets.includes(pB4)){
let pB4_25s=eng.getBoxItem(3,2,20)[0]; 
if(!isMillionaire){
if(!currentB4Targets.includes(pB4_25s))b4V=true;
}else{
if(!strictMatTargets.includes(pB4_25s))b4V=true;
}
}
}
if(b3V&&b4V){c2Met=true; matDet=`B3F ${b3Rank}3 ${labelText}: ${getDispItem(pB3)}<br>B4F ${b4Rank}3 ${labelText}: ${getDispItem(pB4)}`; }
else if(b3V){c1Met=true; matDet=`B3F ${b3Rank}3 ${labelText}: ${getDispItem(pB3)}`; }
else if(b4V){c1Met=true; matDet=`B4F ${b4Rank}3 ${labelText}: ${getDispItem(pB4)}`; }
if(c1Met||c2Met){
let html=`${wpHits.join('<br>')}<br><span style="color:#11F514; font-size:11px">${matDet}</span>`;
return{isHit: true, jumpFloor: wpFloor, displayHtml: html, specialStyle: c2Met?"1px solid #ffaa00":"" };
}
return {isHit: false};
}
});
}
function JFireSearch(){
executeCustomSearch({
btnId: 'BtnJFire', btnText: H06, btnBg:'linear-gradient(135deg, #77aacc, #cc00aa)',
filterRanks: (ranks)=>ranks.filter(rank=>{
for(let i=0; i<8; i++){
if(rank>=TableC[i*4]&&rank<=TableC[i*4+1]) return TableC[i*4+3]>=9;
}
return false;
}),
checkBasicReq: (eng)=>eng.monsterRank===9&&eng.floorCount>=9,
checkDungeon: (eng)=>{
let b9Boxes=eng.getBoxCount(8);
let c1Met=false;
let c1Hits=[];
const soloNames=eng.getFloorItemNames(8, 1);
const partyNames=eng.getFloorItemNames(8, 2);
const limit=Math.min(2, soloNames.length);
for(let b=0; b<limit; b++){
const s=soloNames[b], p=partyNames[b];
if(s==="Sainted soma"||p==="Sainted soma"){
c1Met=true;
let t=(s===p)?STR_BOTH:(p==="Sainted soma"?STR_PARTY:STR_SOLO);
let color="#ff99d7";
if(t===STR_PARTY) color="#ffd700";
c1Hits.push(`<span style="color:${color}; font-size:11px">B9F S${b+1}: ${getDispItem("Sainted soma")} (${t})</span>`);
}
}
if(!c1Met||(b9Boxes>=3&&partyNames[2]==="Sainted soma"))return{isHit:false};
let c2Met=false, c2Det="";
const chk3=(fIdx,n)=>{
if(eng.getBoxCount(fIdx)>=3&&eng.getBoxInfo(fIdx, 2).rank===10){
let pItem=eng.getBoxItem(fIdx,2,2)[0];
if(pItem==="Sainted soma"||pItem==="Sage's elixir"){
let dispItem=pItem==="Sainted soma"?getDispItem("Sainted soma"):getDispItem("Sage's elixir");
return {met:true, det:`${n} S3: ${dispItem}`};
}
}
return {met:false};
};
let b9Res=chk3(8,"B9F");
if(b9Res.met){c2Met=true; c2Det=b9Res.det; }
else if(eng.floorCount>=10){
let b10Res=chk3(9,"B10F");
if(b10Res.met){c2Met=true; c2Det=b10Res.det; }
}
if(c1Met&&c2Met){
let html=`${c1Hits.join('<br>')}<br><span style="color:#11F514; font-size:11px">${c2Det}</span>`;
return {isHit: true, jumpFloor: 8, displayHtml: html};
}
return {isHit:false};
}
});
}
async function startSearchATBug(){
if(isSearching){searchCancel=true; return;}
isSearching=true; searchCancel=false;
const btn=document.getElementById('searchBtnBug');
if(btn){btn.textContent='STOP';btn.style.background='#ff4444';btn.style.color='#fff';}
const searchAllRanks=document.getElementById('searchAllRanks').checked;
const baseRankStr=document.getElementById('rank').value;
const searchFilterLoc=true;
const searchOnlyWithD=document.getElementById('searchOnlyWithD')?document.getElementById('searchOnlyWithD').checked:false;
const requireFloorIncrease=document.getElementById('requireFloorIncrease').checked;
const requireBugFloorHit=document.getElementById('requireBugFloorHit')?document.getElementById('requireBugFloorHit').checked:false;
const conds=getUltimateConds();
const cond_elist=conds.elist;
const cond_only_mon=conds.onlyMon;
let effectiveElistCond=cond_elist;
if(!cond_elist&&!cond_only_mon&&!searchOnlyWithD&&!conds.hasBoxCond){effectiveElistCond='ONLY';}
const resultDiv=document.getElementById('searchResults');
resultDiv.innerHTML='<div style="color:#aaa; font-size:13px; margin-bottom:8px">'+B01+' <span id="searchProgress" style="color:#fff; font-weight:bold">0%</span></div><div id="searchGrid" class="search-grid"></div>';
const grid=document.getElementById('searchGrid');
const progressSpan=document.getElementById('searchProgress');
let ranksToSearch=searchAllRanks?MAP_RANK:[parseInt(baseRankStr)];
if(cond_only_mon||conds.monster||conds.bq||conds.hasBoxCond){
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
if(rankInfo&&(maxFinalQ<rankInfo.fqMin||minFinalQ>rankInfo.fqMax)){
return false;
}
}
let minSMR=1,maxSMR=9;
for(let i=0;i<8;i++){
if(rank>=TableC[i*4]&&rank<=TableC[i*4+1]){
minSMR=TableC[i*4+2];maxSMR=TableC[i*4+3];break;
}
}
if(conds.hasBoxCond){
let maxPossibleNum=Math.min(12,maxSMR+3);
for(let r=10; r>=1; r--){
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
if(!cond_only_mon&&!conds.monster)return true;
if(conds.monster){
let tgt=parseInt(conds.monster);
if(tgt<minSMR||tgt>maxSMR) return false;
}
if(cond_only_mon){
let isPossible=false;
let targetEnv=conds.env?parseInt(conds.env):0;
let maxOffset=3;
for(let env=1; env<=5; env++){
if(targetEnv&&env!==targetEnv) continue;
for(let fMR=1; fMR<=12; fMR++){
let mId=ONLY_MONSTERS[env][fMR];
if(mId&&MONSTER_DATA[mId]&&MONSTER_DATA[mId].en===cond_only_mon){
let smrStart=conds.monster?parseInt(conds.monster):minSMR;
let smrEnd=conds.monster?parseInt(conds.monster):maxSMR;
for(let smr=smrStart; smr<=smrEnd; smr++){
if(fMR>=smr&&fMR<=smr+maxOffset){isPossible=true;break;}
}
}
if(isPossible) break;
}
if(isPossible) break;
}
if(!isPossible) return false;
}
return true;
});
if(ranksToSearch.length===0){
progressSpan.textContent="100% ("+B12+")";
isSearching=false;
if(btn){btn.textContent=H07; btn.style.background='linear-gradient(135deg,#cc00cc,#660066)'; btn.style.color='#fff';}
return;
}
}
const rangeData=getValidatedSeedRange();
if(rangeData.error){
alert(rangeData.error);
isSearching=false;
if(btn){btn.textContent=H07; btn.style.background='linear-gradient(135deg,#cc00cc,#660066)'; btn.style.color='#fff';}
return;
}
const {startSeed,endSeed}=rangeData;
let totalCombos=ranksToSearch.length*(endSeed-startSeed+1);
let processed=0;
let hitCount=0;
let searchEngine=new GrottoDetail();
let fragment=document.createDocumentFragment();
for(let rank of ranksToSearch){
if(searchCancel) break;
let rStr=rank.toString(16).toUpperCase().padStart(2, '0');
let targetRankKey=RANKS[rStr]?rStr:(RANKS["0x"+rStr]?"0x"+rStr:null);
for(let seed=startSeed; seed<=endSeed; seed++){
if(searchCancel) break;
if(processed%200===0){
progressSpan.textContent=Math.floor((processed/totalCombos)*100)+'% ('+B02+' '+rStr+', Seed '+seed.toString(16).toUpperCase().padStart(4,'0')+') ['+B04+''+hitCount+' '+B03+']';
if(fragment.children.length>0) grid.appendChild(fragment);
await new Promise(r=>setTimeout(r, 0));
}
searchEngine.MapSeed=seed;
searchEngine.MapRank=rank;
searchEngine._at_offset=0;
searchEngine._force_16_floors=false;
searchEngine.calculateDetail(true);
if(!checkUltimateCondsMatch(searchEngine, seed, targetRankKey, conds, searchFilterLoc)){processed++;continue;}
let origFloors=searchEngine.floorCount;
let origBoss=DISPLAY_LANG!=='EN'?searchEngine.bossNameJP:searchEngine.bossName;
let origName=DISPLAY_LANG!=='EN'?searchEngine.mapNameJP:searchEngine.mapName;
let origLevel=searchEngine.mapLevel;
searchEngine._at_offset=1;
searchEngine._force_16_floors=false;
searchEngine.calculateDetail();
let bugFloors=searchEngine.floorCount;
let bugBoss=DISPLAY_LANG!=='EN'?searchEngine.bossNameJP:searchEngine.bossName;
let bugName=DISPLAY_LANG!=='EN'?searchEngine.mapNameJP:searchEngine.mapName;
let bugLevel=searchEngine.mapLevel;
let isFloorIncreased=bugFloors>origFloors;
if(requireFloorIncrease&&!isFloorIncreased){processed++;continue;}
searchEngine._at_offset=0;
searchEngine._force_16_floors=true;
searchEngine.calculateDetail();
let boxHtml="";
if(conds.hasBoxCond){
let actualBoxCounts={10:0,9:0,8:0,7:0,6:0,5:0,4:0,3:0,2:0,1:0};
for(let f=2; f<bugFloors; f++){
let boxes=searchEngine.di[f][8];
for(let b=0; b<boxes; b++){
actualBoxCounts[searchEngine.di[f][9+b]]++;
}
}
let boxMatch=true;
let boxStr=[];
for(let r=10; r>=1; r--){
if(conds.reqBox[r]>0){
if(actualBoxCounts[r]!==conds.reqBox[r]){boxMatch=false; break;}
boxStr.push(`${CHEST_RANK[r]}${conds.reqBox[r]}`);
}
}
if(!boxMatch){processed++; continue;}
boxHtml=`<div style="margin-top:4px;"><span style="color:#ffcc00;font-size:11px;background:#442200;padding:2px 4px;border-radius:3px;">${boxStr.join(' ')}</span></div>`;
}
let foundSpecialFloors=[];
let specialHitCount=0;
let hasAnyD=false;
for(let f=2; f<16; f++){
let elistInfo=getFloorElistInfo(searchEngine, f);
let val=parseInt(elistInfo.hex, 16);
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
if(!cond_only_mon) isOnlyHit=true;
else {
let targetJpName=cond_only_mon;
for(let id in MONSTER_DATA){
if(MONSTER_DATA[id].en===cond_only_mon){targetJpName=MONSTER_DATA[id].jp; break;}
}
let expectedName=(DISPLAY_LANG!=='EN')?targetJpName:cond_only_mon;
if(elistInfo.state.includes(expectedName+strOnly)) isOnlyHit=true;
}
}
let isSpecialMatch=(isElistHit&&isOnlyHit&&val>=0x2B00&&val<=0x2BBC&&elistInfo.state);
if(isSpecialMatch){specialHitCount++;}
if(isSpecialMatch||(searchOnlyWithD&&elistInfo.dValue>0)){
if(!foundSpecialFloors.some(x=>x.floor===f+1)){
let fMR=searchEngine._details[2]+(f>>2);
if(fMR>12) fMR=12;
foundSpecialFloors.push({
floor:f+1,
hex:elistInfo.hex,
state:elistInfo.state||EL_NORMAL,
dValue:elistInfo.dValue,
envType:searchEngine._details[3],
floorMR:fMR
});
}
}
}
if(requireBugFloorHit){
foundSpecialFloors=foundSpecialFloors.filter(info=>info.floor>origFloors&&info.floor<=bugFloors);
hasAnyD=foundSpecialFloors.some(info=>info.dValue>0);
specialHitCount=foundSpecialFloors.filter(info=>info.state!==EL_NORMAL).length;
if(foundSpecialFloors.length===0){
processed++;
continue;
}
}
if(searchOnlyWithD&&!hasAnyD){processed++; continue;}
if(effectiveElistCond==='MULTI_SPECIAL'&&specialHitCount<2){processed++; continue;}
if((effectiveElistCond||cond_only_mon)&&specialHitCount===0){processed++; continue;}
hitCount++;
const isJP_mb=(DISPLAY_LANG!=='EN');
let elistHtmlStr=foundSpecialFloors.map(info=>{
let stateColor="#888"; 
if(info.state!==EL_NORMAL){
if(info.floor<=origFloors){
stateColor="#44ff44"; 
} else if(info.floor<=bugFloors){
stateColor="#ffaa00"; 
}else{
stateColor="#ff88ff"; 
}
}
let dHtml=info.dValue>0?` <span style="background:#ffaa00; color:#000; padding:1px 5px; border-radius:3px; font-size:10px; margin-left:4px; white-space:nowrap;">${info.dValue}</span>`:'';
let line=`<span style="color:#00ffff; font-size:12px;">B${info.floor}F: [${info.hex}] <strong style="color:${stateColor};">${info.state}</strong>${dHtml}</span>`;
const st=info.state;
let surviveCount=0;
if(st.includes(EL_4))surviveCount=4;
else if(st.includes(EL_3))surviveCount=3;
else if(st.includes(EL_2))surviveCount=2;
if(surviveCount>0){
const spList=(SPAWN_DB[info.envType]&&SPAWN_DB[info.envType][info.floorMR])||[];
const norms=spList.filter(e=>e.length===3);
const names=norms.slice(0, surviveCount).map(e=>{
const md=MONSTER_DATA[e[0]];
return md?(isJP_mb?md.jp:md.en):'?';
});
line+=`<br><span style="color:#aaa; font-size:10px;">${names.join('+')}</span>`;
}
return line;
}).join('<br>');
let itemNode=document.createElement('div');
itemNode.className='search-result-item';
if(hasAnyD) itemNode.dataset.hasD="true";
let bugIcon=isFloorIncreased?'📈':'';
itemNode.innerHTML=`
<span style="color:#ffd700; font-weight:bold; font-size:15px;">${seed.toString(16).toUpperCase().padStart(4,'0')}</span>
<span style="color:#888">(Rank ${rStr})</span><br>
<div style="background:#111; padding:4px 8px; border-radius:4px; margin:4px 0; border:1px solid #333;">
<span style="color:#aaa; font-size:11px">[Source] ${origName}|B${origFloors}F|${origBoss}</span><br>
<span style="color:#ff88ff; font-size:12px">[Bug] ${bugName}|B${bugFloors}F|${bugBoss} ${bugIcon}</span>
</div>${boxHtml}
<div style="padding-top:2px;">${elistHtmlStr}</div>
`;
itemNode.onclick=()=>{
document.getElementById('seed').value=seed.toString(16).toUpperCase().padStart(4,'0');
document.getElementById('rank').value="0x"+rStr;
calculate();
document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
};
fragment.appendChild(itemNode);
searchEngine._force_16_floors=false;
processed++;
}
}
if(fragment.children.length>0) grid.appendChild(fragment);
isSearching=false;
if(btn){btn.textContent=H07; btn.style.background='linear-gradient(135deg,#cc00cc,#660066)'; btn.style.color='#fff';}
progressSpan.textContent=searchCancel?`${B06} (${B04}${hitCount} ${B03})`:`100% (${B09?B09+' ':''}${hitCount} ${B03})`;
}
async function searchAT(){
if(isSearching){searchCancel=true; return; }
isSearching=true; searchCancel=false;
const btn=document.getElementById('searchBtnConsecutive');
if(btn){btn.textContent='STOP';btn.style.background='#ff4444';}
const threshold=parseInt(document.getElementById('atConsecutiveThreshold').value);
const pattern=document.getElementById('atConsecutiveCount').value;
let maxSteps=parseInt(document.getElementById('atMaxSteps').value);
if(isNaN(maxSteps)||maxSteps<38) maxSteps=400; 
let POPIndex=parseInt(document.getElementById('atPOPIndex').value);
if(isNaN(POPIndex)||POPIndex<1) POPIndex=35;
if(maxSteps<POPIndex) maxSteps=POPIndex;
const sortPOP=document.getElementById('sortPOP')?document.getElementById('sortPOP').checked:false;
const searchFilterLoc=true;
const targetRankKey=document.getElementById('rank').value.replace('0x','');
let minStr=document.getElementById('cond_seed_min')?document.getElementById('cond_seed_min').value.trim():"";
let maxStr=document.getElementById('cond_seed_max')?document.getElementById('cond_seed_max').value.trim():"";
let customMin=minStr?parseInt(minStr, 16):0;
let customMax=maxStr?parseInt(maxStr, 16):0x7FFF;
if(isNaN(customMin)||customMin<0) customMin=0;
if(isNaN(customMax)||customMax>0x7FFF) customMax=0x7FFF;
if(customMin>customMax){
alert(A08);
isSearching=false;
if(btn){btn.textContent=H08; btn.style.background='linear-gradient(135deg, #ff8800, #aa3300)'; }
return;
}
const startSeed=customMin;
const endSeed=searchFilterLoc?Math.min(customMax,0x7FFF):customMax;
if(startSeed>endSeed){
alert(A09);
isSearching=false;
if(btn){btn.textContent=H08; btn.style.background='linear-gradient(135deg, #ff8800, #aa3300)'; }
return;
}
const resultDiv=document.getElementById('searchResults');
resultDiv.innerHTML='<div style="color:#aaa; font-size:13px; margin-bottom:8px">'+B01+' <span id="searchProgress" style="color:#fff; font-weight:bold">0%</span></div><div id="searchGrid" class="search-grid"></div>';
const grid=document.getElementById('searchGrid');
const progressSpan=document.getElementById('searchProgress');
let hitCount=0;
let processed=0;
let totalSeeds=endSeed-startSeed+1;
let fragment=document.createDocumentFragment();
let allResults=[];
let pType=0;
if(pattern==='R2')pType=1;
else if(pattern==='N2')pType=2;
else if(pattern==='R2_3')pType=3;
else if(pattern==='R3')pType=4;
else if(pattern==='R4')pType=5;
else if(pattern==='R5')pType=6;
else if(pattern==='4_in_6')pType=7;
else if(pattern==='3_in_7')pType=8;
else if(pattern==='N3')pType=9;
else if(pattern==='N4')pType=10;
else if(pattern==='N5')pType=11;
else if(pattern==='4_in_10')pType=12;
else if(pattern==='3_in_10')pType=13;
const valsBuffer=new Int32Array(10);
for(let seed=startSeed;seed<=endSeed;seed++){
if(searchCancel)break;
if(searchFilterLoc){
let locData=calcLocations(seed, targetRankKey);
if(locData.outputOrder.length===0){processed++;continue;}
}
if(processed%1000===0){
progressSpan.textContent=Math.floor((processed/totalSeeds)*100)+'% (Seed '+seed.toString(16).toUpperCase().padStart(4,'0')+') ['+B04+''+hitCount+' '+B03+']';
if(fragment.children.length>0) grid.appendChild(fragment);
await new Promise(r=>setTimeout(r, 0));
}
processed++;
let rng=seed;
let historyBits=0;
let validCount=0;
let foundOffsets=[];
let POPValue=null;
for(let step=1; step<=maxSteps; step++){
rng=lcg(rng);
let val=(rng>>>16) & 0x7FFF;
if(step===POPIndex) POPValue=val;
if(step<38) continue; 
let isMatch=(val<=threshold)?1:0;
historyBits=((historyBits<<1)|isMatch) & 1023; 
valsBuffer[step%10]=val;
validCount++;
let matched=false;
let extractLen=0;
let hb=historyBits;
switch (pType){
case 1:if(validCount>=2&&(hb & 3)===3){matched=true; extractLen=2; }break; // 11
case 2:if(validCount>=3&&(hb & 15)===5){matched=true; extractLen=4; }break; // 0101
case 3:if(validCount>=4&&(hb & 9)===9){matched=true; extractLen=4; }break; // 1001
case 4:if(validCount>=3&&(hb & 7)===7){matched=true; extractLen=3; }break; // 111
case 5:if(validCount>=4&&(hb & 15)===15){matched=true; extractLen=4; }break; // 1111
case 6:if(validCount>=5&&(hb & 31)===31){matched=true; extractLen=5; }break; // 11111
case 7:if(validCount>=6){let v=hb & 63;if(v===57||v===51||v===39){matched=true; extractLen=6;}}break;
case 8:if(validCount>=7){let v=hb & 127;if(v===97||v===100||v===76||v===73||v===67){matched=true; extractLen=7;}}break;
case 9:if(validCount>=6&&(hb & 63)===21){matched=true; extractLen=6;}break;
case 10:if(validCount>=8&&(hb & 255)===85){matched=true; extractLen=8;}break;
case 11:if(validCount>=10&&(hb & 1023)===341){matched=true; extractLen=10;}break;
case 12:if(validCount>=10){let v=hb & 1023;if(v===337||v===325||v===277){matched=true; extractLen=10;}}break;
case 13:if(validCount>=10){let v=hb & 1023;if(v===321||v===324||v===276||v===273||v===261){matched=true; extractLen=10;}}break;
}
if(matched){
let startStep=step-extractLen+1;
let formattedVals=[];
for(let i=extractLen-1; i>=0; i--){
let s=step-i;
let v=valsBuffer[s%10];
let m=(hb & (1<<i))!==0;
if(m){
formattedVals.push(`<strong style="color:#ff4444;">${v}</strong>`);
}else{
if(pattern!=='n_n2'&&pattern!=='n_n3'&&pattern!=='normal_3'&&pattern!=='normal_4'&&pattern!=='normal_5'){
formattedVals.push(`<span style="color:#666;">${v}</span>`);
}
}
}
foundOffsets.push({ start: startStep, valsHtml: formattedVals.join(', ') });
historyBits=0; 
validCount=0;
}
}
if(foundOffsets.length>0){
hitCount++;
let seedHex=seed.toString(16).toUpperCase().padStart(4,'0');
let offsetsHtml=foundOffsets.map(o=>
`<span style="color:#00ffff; font-size:12px;">AT +${o.start} <span style="color:#888;">[${o.valsHtml}]</span></span>`
).join('<br>');
let probSel=document.getElementById('atConsecutiveThreshold');
let probText=probSel.options[probSel.selectedIndex].text;
let sel=document.getElementById('atConsecutiveCount');
let patternName=sel.options[sel.selectedIndex].text;
let specificAtHtml='';
if(POPValue!==null){
specificAtHtml=`<div style="margin-top:6px; padding-top:4px; border-top:1px dashed #443322;">
<span style="color:#aaa; font-size:11px;">AT +${POPIndex} (POP): </span>
<strong style="color:#39C5BB; font-size:13px; text-shadow:0 0 2px rgba(57,197,187,0.5);">${POPValue}</strong>
</div>`;
}
let itemNode=document.createElement('div');
itemNode.className='search-result-item';
itemNode.innerHTML=`
<span style="color:#ffd700; font-weight:bold; font-size:15px;">${seedHex}</span><br>
<div style="background:#111; padding:4px 8px; border-radius:4px; margin:4px 0; border:1px solid #333;">
<span style="color:#ffaa00; font-size:12px; font-weight:bold;">${patternName} (${probText})</span>
</div>
<div style="padding-top:2px;">
${offsetsHtml}
</div>
${specificAtHtml}
`;
itemNode.onclick=()=>{
document.getElementById('seed').value=seedHex;
calculate();
document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
};
if(sortPOP){
allResults.push({ node: itemNode, pop: POPValue!==null?POPValue:99999 });
}else{
fragment.appendChild(itemNode);
}
}
}
if(sortPOP){
allResults.sort((a, b)=>a.pop-b.pop);
for(let res of allResults){
fragment.appendChild(res.node);
}
}
if(fragment.children.length>0) grid.appendChild(fragment);
isSearching=false;
if(btn){btn.textContent=H08; btn.style.background='linear-gradient(135deg, #ff8800, #aa3300)'; }
progressSpan.textContent=searchCancel?`${B06} (${B04}${hitCount} ${B03})`:`100% (${B09?B09+' ':''}${hitCount} ${B03})`;
}