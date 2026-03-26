const DISPLAY_LANG='EN';
const _L=(DISPLAY_LANG==='EN')?0:(DISPLAY_LANG==='JP')?2:1;
function T(en,tw,jp){return _L===0?en:(_L===2?jp:tw);}
const A01=T('Please choose at least one condition.','請至少輸入一個搜尋條件！','少なくとも1つの条件を入力してください。');
const A02=T('Sorry! Unable to search any result from these conditions.','條件衝突！您選擇的 Map Rank 無法產出符合條件的 BQ、SMR、寶箱 或 ONLY 怪物。','条件が矛盾しています！選択した Map Rank では該当する結果が存在しません。');
const A03=T('Unexpected error during search. See Console for details.','搜尋過程中發生意外錯誤，已安全中斷。詳情請見 Console。','検索中にエラーが発生しました。詳細は Console を確認してください。');
const A04=T('Sorry! Quickload search is not available for chest monsters.','非常抱歉！寶箱怪只能搜体感。','宝箱モンスターは体感検索のみ対応しています。');
const A05=T('Sorry! Searching for this item is currently unavailable.','非常抱歉！這個物品的組合搜尋功能暫未開通。','このアイテムの検索機能は現在未実装です。');
const A06=T('No output! Please perform a search first.','目前沒有搜尋結果可以匯出！請先執行一次搜索。','出力する結果がありません！先に検索を実行してください。');
const A07=T('❌ Output error!\\n\\nReason:','❌ 匯出失敗！\\n\\n錯誤原因：','❌ 出力に失敗しました！\\n\\n原因：');
const A08=T('Seed range error: Min cannot be greater than Max!','Seed 範圍錯誤：左側 (Min) 不能大於右側 (Max)！','Seed 範囲エラー：Min が Max より大きくなっています！');
const A09=T('No valid maps in this Seed range when filtering by location.','在勾選「排除無位置地圖」的情況下，您輸入的 Seed 範圍內沒有合法地圖！','場所候補フィルター有効時、この Seed 範囲に該当する地図はありません！');
const B01=T('Progress:','搜尋進度:','Progress:');
const B02=T('Rank','掃描 Rank','Rank');
const B03=T('Found','個','個');
const B04=T('','找到 ','');
const B06=T('Stopped','已停止','STOP');
const B09=T('','掃描完成，共找到','合計');
const B12=T('Conditions conflict. All searches skipped.','因條件衝突，已略過所有搜尋','条件が矛盾しているため、全ての検索をスキップしました。');
const B13=T('Unable to match this Rank. Skipped.','此條件組合不可能在所選 Rank 出現，已略過','この条件は選択した Rank では不可能です。スキップしました。');
const C01=T('Name','地圖名稱','地図名');
const C02=T('Type','地形','地形');
const C03=T('SMR','怪物等級','敵ランク');
const C04=T('Depth','樓層數','深さ');
const C05=T('Location&BQ','位置與 BQ','場所&Base値');
const C06=T('AT value','AT 判定值','AT 判定値');
const C07=T('📦 Total Chests:','📦 全圖寶箱分佈:','📦 宝箱:');
const C08=T('Chests','箱','箱');
const C09=T('No Chest','無寶箱','箱無し');
const C10=T('Size','地圖大小','サイズ');
const C11=T('Stairs','樓梯','階段');
const C12=T('Monster','怪物','モンスター');
const C14=T('Chests','寶箱數','宝箱の数');
const C15=T('(Tap to see Chest Timer)','(點圖看 Chest Timer)','(クリックで中断技の秒数を見る)');
const C16=T('Chest','寶箱','宝箱');
const C18=T('None','無','なし');
const C19=T('Seed must be a hex value from 0000 to 7FFF','Seed 必須是 0000~7FFF 的十六進位值','Seed は 0000～7FFF の16進数で入力してください');
const C20=T('Invalid Seed/Rank','無效的 Seed/Rank 組合','無効な Seed/Rank の組み合わせ');
const C21=T('No Location','無符合條件的位置','場所候補なし');
const D01=T('Floor','地板','床');
const D02=T('Wall','牆壁','壁');
const D03=T('Corridor','走廊','通路');
const D04=T('Door','門','門');
const D05=T('Upstairs','上樓梯','上り階段');
const D06=T('Downstairs','下樓梯','下り階段');
const D07=T('Chest','寶箱','宝箱');
const F01=T('Search all Ranks','掃描所有 Rank','全てのRankを検索');
const F03=T('Maps with Flag0','僅搜含 Flag0 的地圖','「敵無・無無無判定→有」のみ');
const F04=T('Depth↑','樓層↑','深さ↑');
const G00=T('🚀 Control Panel','🚀 控制台','🚀 コントロール パネル');
const G01=T('Ultimate Search','Ultimate Search (留空代表不限)','Ultimate Search');
const G02=T('------','-- 不限 --','------');
const G03=T('Prefix','Prefix (前綴)','地図名1');
const G04=T('Suffix','Suffix (後綴)','地図名2');
const G05=T('Locale','Locale (中間名)','地図名3');
const G06=T('Location','Location (位置)','場所');
const G07=T('Type','Environment (地形)','地形');
const G08=T('SMR','SMR (怪物等級)','敵ランク');
const G09=T('Depth','Depth (樓層深度)','深さ');
const G10=T('Anomalies','Anomalies (Bug地形)','Bug地形');
const G11=T('Special (ElistOfs)','特殊樓層 (ElistOfs)','特殊フロア (ElistOfs)');
const G12=T('ONLY Monster','指定 ONLY 怪物','オンリーモンスター');
const G13=T('Chests','Chest Count (寶箱個數)','宝箱の数');
const G14=T('B3/B4 Solo/Party x2~3 / Combo','B3/B4 同種2~3個 (Solo/Party) / 1個+体感','B3/B4 即開/一人旅 2~3 個 / 1個+体感');
const G15=T('B3/B4 3rd Chest / B13/B14 S-3rd','B3/B4 整列箱 (S箱為 B13/B14)','B3/B4 整列箱 (B13/B14 S整列)');
const G16=T('B9 Solo/Party x2 / J-Fire','B9 同種2個 / J火山 Soma','B9 即開/一人旅 2 個 / J火山ソーマ');
const G17=T('4-player multiplay bug (AT+1)','4人連線異變 (AT+1)','4人マルチプレイによるバグ');
const G18=T('Map Method Maps','地圖法 (AT)','地図法地図');
const G19=T('Seed Range (Hex)','Seed 範圍 (Hex)','Seed 範囲 (Hex)');
const GBQ=T('Base Quality','BQ (Base Quality)','Base値');
const H00=T('Quickload / Multibug / Map Method (AT) Search','中斷即開 / 特定寶箱 / AT 判定','中断即開 / マルチバグ / 地図法 (AT) 地図検索');
const H01=T('QL','搜 B3/B4','即一人旅');
const H02=T('Combo','搜 体感','体感');
const H03=T('3rd','搜 整列箱','整列箱');
const H04=T('S3','搜 S整列','S整列');
const H05=T('B9F','搜 B9F','B9F');
const H06=T('J-Fire','搜 J火山','J火山');
const H07=T('Multibug','搜 Multibug','マルチバグ');
const H08=T('AT','搜 AT','地図法');
const H09=T('📥 TXT Output','📥 匯出 TXT','📥 TXT 出力');
const J01=T('Click to preview','點擊直接預覽此地圖','クリックでプレビュー');
const J02=T('Waiting for searching...','等待執行搜尋...','検索待ち...');
const J03=T('Item Table','寶箱內容物','アイテムテーブル');
const K01=T('Help','說明','使い方');
const STR_SOLO=T('Solo','一人旅','一人旅');
const STR_PARTY=T('Party','即開','即開');
const STR_BOTH=T('Solo+Party','即+一人旅','即+一人旅');
const TKB1_1=T('Nipple','乳首','乳首');
const TKB2_1=T('Chamber','イケない通路','イケない通路');
const TKB2_2=T('Chamber (Multi-floor)','イケない通路 (多層樓)','イケない通路 (複数階層)');
const TKB2_3=T('Chamber (Same floor,multiple)','イケない通路 (同層多個)','イケない通路 (同じフロアに複数)');
const TKB1_2=T('Nipple+Chamber','チラリズム','チラリズム');
const TKB1_3=T('Chestless','無寶箱樓層','箱無しフロア');
const TKB3_0=T('Hidden Stair','被牆壁封死的樓梯','隠し階段');
const TKB3_1=T('Ghost Stair','幽靈樓梯','ゴースト階段');
const TKB3_2=T('Softlock','危険？ハマるフロア','危険？ハマるフロア');
const EL_M=T('Multi-Special-Floor','複數特殊層','複数の特殊フロア');
const EL_P=T('Partially No-enemy','部分敵無','部分敵無');
const EL_4=T('4-enemy','敵減 4 種','敵減 4 種');
const EL_3=T('3-enemy','敵減 3 種','敵減 3 種');
const EL_2=T('2-enemy','敵減 2 種','敵減 2 種');
const EL_1=T('ONLY (1-enemy)','ONLY (任何怪)','オンリー');
const EL_0=T('No-enemy','敵無','敵無');
const EL_NP=T(" (No Pandora's Box)"," (Pandora's Box 消失)"," (パンドラボックス消失)");
const EL_NM=T(" (No Mimic)"," (Mimic 消失)"," (ミミック消失)");
const EL_NC=T(" (No Cannibox)"," (Cannibox 消失)"," (ひとくいばこ消失)");
const EL_NORMAL=T('Normal','一般','通常');
const AT_O=[['R2',T('2 Rare','連續 2 個稀有','レア×2')],['R2_3',T('2 Rare (N/N+3)','連續 2 個稀有 (N/N+3)','レア×2 (チカラめし)')],['R3',T('3 Rare','連續 3 個稀有','レア×3')],['R4',T('4 Rare','連續 4 個稀有','レア×4')],['R5',T('5 Rare','連續 5 個稀有','レア×5')],['4_in_6',T('4 in 6 Rare','6 個中 4 個稀有','レア×4 (6連続)')],['3_in_7',T('3 in 7 Rare','7 個中 3 個稀有','レア×3 (7連続)')],['N2',T('2 Normal','連續 2 個通常','通常×2')],['N3',T('3 Normal','連續 3 個通常','通常×3')],['N4',T('4 Normal','連續 4 個通常','通常×4')],['N5',T('5 Normal','連續 5 個通常','通常×5')],['4_in_10',T('4 in 10 Normal','10 個中 4 個通常','通常×4 (10連続)')],['3_in_10',T('3 in 10 Normal','10 個中 3 個通常','通常×3 (10連続)')]];
const i18nDict={'F01':F01,'F03':F03,'F04':F04,'G00':G00,'G01':G01,'G02':G02,'G03':G03,'G04':G04,'G05':G05,'G06':G06,'G07':G07,'G08':G08,'G09':G09,'G10':G10,'G11':G11,'G12':G12,'G13':G13,'G14':G14,'G15':G15,'G16':G16,'G17':G17,'G18':G18,'G19':G19,'GBQ':GBQ,'H00':H00,'H01':H01,'H02':H02,'H03':H03,'H04':H04,'H05':H05,'H06':H06,'H07':H07,'H08':H08,'H09':H09,'J02':J02,'J03':J03,'K01':K01,'TKB1_1':TKB1_1,'TKB1_2':TKB1_2,'TKB1_3':TKB1_3,'TKB2_1':TKB2_1,'TKB2_2':TKB2_2,'TKB2_3':TKB2_3,'TKB3_0':TKB3_0,'TKB3_1':TKB3_1,'TKB3_2':TKB3_2,'EL_M':EL_M,'EL_P':EL_P,'EL_4':EL_4,'EL_3':EL_3,'EL_2':EL_2,'EL_1':EL_1,'EL_0':EL_0,};
const MAP_RANK=[0x02,0x38,0x3D,0x4C,0x51,0x65,0x79,0x8D,0xA1,0xB5,0xC9,0xDD];
const CHEST_RANK={10:'S',9:'A',8:'B',7:'C',6:'D',5:'E',4:'F',3:'G',2:'H',1:'I'};
const ENV_NAMES={1:['Caves','洞窟'],2:['Ruins','遺跡'],3:['Ice','氷'],4:['Water','水'],5:['Fire','火山']};
const BOSS_NAMES={1:['Equinox','馬','黒竜丸'],2:['Nemean','爪','ハヌマーン'],3:['Shogum','髭','スライムジェネラル'],4:['Trauminator','機','Sキラーマシン'],5:['Elusid','教','イデアラゴン'],6:['Sir Sanguinus','血','ブラッドナイト'],7:['Atlas','巨','アトラス'],8:['Hammibal','猪','怪力軍曹イボイノス'],9:['Fowleye','鳥','邪眼皇帝アウルート'],10:['Excalipurr','猫','魔剣神レパルド'],11:['Tyrannosaurus Wrecks','滅','破壊神フォロボス'],12:['Greygnarl','竜','グレイナル']};
const PREFIX_NAMES={1:['Clay','はかなき'],2:['Rock','ちいさな'],3:['Granite','うす暗き'],4:['Basalt','ゆらめく'],5:['Graphite','ざわめく'],6:['Iron','ねむれる'],7:['Copper','怒れる'],8:['Bronze','呪われし'],9:['Steel','放たれし'],10:['Silver','けだかき'],11:['Gold','わななく'],12:['Platinum','残された'],13:['Ruby','見えざる'],14:['Emerald','あらぶる'],15:['Sapphire','とどろく'],16:['Diamond','大いなる']};
const SUFFIX_NAMES={1:['Joy','花'],2:['Bliss','岩'],3:['Glee','風'],4:['Doubt','空'],5:['Woe','獣'],6:['Dolour','夢'],7:['Regret','影'],8:['Bane','大地'],9:['Fear','運命'],10:['Dread','魂'],11:['Hurt','闇'],12:['Gloom','光'],13:['Doom','魔神'],14:['Evil','星々'],15:['Ruin','悪霊'],16:['Death','神々']};
const LOCALE_NAMES={1:['Cave','洞くつ'],2:['Tunnel','地下道'],3:['Mine','坑道'],4:['Crevasse','雪道'],5:['Marsh','沼地'],6:['Lair','アジト'],7:['Icepit','氷穴'],8:['Lake','地底湖'],9:['Crater','火口'],10:['Path','道'],11:['Snowhall','雪原'],12:['Moor','湿原'],13:['Dungeon','牢ごく'],14:['Crypt','墓場'],15:['Nest','巣'],16:['Ruins','遺跡'],17:['Tundra','凍土'],18:['Waterway','水脈'],19:['World','世界'],20:['Abyss','奈落'],21:['Maze','迷宮'],22:['Glacier','氷河'],23:['Chasm','眠る地'],24:['Void','じごく']};
const LOCALE_INDEX=new Uint8Array([1,2,1,1,1,3,3,4,5,3,6,6,7,8,9,10,10,11,12,13,14,14,14,14,14,15,16,17,18,15,19,19,19,19,19,20,21,22,23,24]);
const TableA=new Uint8Array([1,30,0,0,2,40,0,0,3,10,0,0,4,10,0,0,5,10,0,0]);
const TableB=new Uint8Array([2,55,2,4,56,75,4,6,76,100,6,10,101,120,8,12,121,140,10,14,141,180,10,16,181,200,11,16,201,220,12,16,221,248,14,16]);
const TableC=new Uint8Array([2,55,1,3,56,75,2,4,76,100,3,5,101,140,4,6,141,180,5,7,181,200,6,9,201,220,8,9,221,248,9,9]);
const TableD=new Uint8Array([2,60,1,3,61,80,2,5,81,100,3,7,101,120,4,7,121,140,5,9,141,160,6,9,161,180,7,10,181,200,8,12,201,248,1,12]);
const TableE=new Uint8Array([1,100,2,100,3,75,4,75,5,50,6,50,7,30,8,20,9,20,10,20,11,10,12,10]);
const TableF=new Uint8Array([1,1,2,0,2,1,2,0,3,1,3,0,4,1,4,0,5,2,5,0,6,2,6,0,7,3,7,0,8,3,8,0,9,4,9,0,10,5,9,0,11,1,10,0,12,4,10,0]);
const TableG=new Uint8Array([2,3,1,2,4,5,1,3,6,7,1,4,8,9,2,5,10,11,2,6,12,13,3,7,14,15,4,8,16,16,6,8]);
const TableH=new Uint8Array([1,2,1,5,3,4,4,8,5,6,7,12,7,8,7,16,9,9,12,16]);
const TableI=new Uint8Array([1,3,1,6,4,6,4,9,7,9,7,12,10,12,10,16]);
const TableN=new Uint8Array([1,1,2,0,2,1,2,0,3,1,3,0,4,1,4,0,5,2,5,0,6,2,6,0,7,3,7,0,8,3,8,0,9,4,9,0,10,5,9,0,11,1,10,0,12,4,10,0]);
const TableO=new Uint8Array([0,14,28,41,55,71,88,108,125,141,162]);
const TableP=new Uint8Array([10,10,5,10,10,8,5,8,10,10,2,8,2,2,8,8,10,2,10,10,10,10,8,8,10,2,2,2,10,10,10,10,10,10,10,1,10,10,5,2,2,5,15,15,12,10,15,12,2,5,5,1,1,1,1,5,15,10,15,1,1,1,1,1,1,10,10,1,12,1,15,10,15,15,15,10,6,1,1,10,1,10,1,1,1,1,1,1,10,10,10,10,10,15,6,2,2,15,1,1,1,1,1,1,1,1,1,1,5,13,13,10,15,15,15,5,1,1,1,1,1,1,1,1,1,10,10,10,10,10,15,10,10,8,1,1,1,1,1,1,1,15,10,10,10,15,10,8,5,5,1,1,1,1,1,1,1,1,1,1,1,1]);
const TableQ=new Uint8Array([12,14,16,15,7,18,28,23,27,0,29,13,30,31,32,33,34,35,36,22,19,1,7,46,37,38,39,40,140,41,11,42,7,2,43,44,45,49,8,50,51,139,52,53,11,8,16,3,54,47,48,76,55,56,57,139,24,58,16,59,60,61,62,63,64,65,66,67,11,68,20,139,21,69,8,70,71,72,73,74,75,11,77,78,79,80,81,82,139,83,84,85,17,4,25,86,87,11,88,89,90,91,92,93,94,95,96,97,98,99,100,17,5,11,9,10,101,102,103,104,105,106,107,108,109,110,111,112,6,17,11,9,113,114,115,116,117,118,119,120,121,122,123,9,124,17,125,26,10,126,127,128,129,130,131,132,133,134,135,136,137,138]);
const TableR=[["125G","125G"],["268G","268G"],["450G","450G"],["670G","670G"],["880G","880G"],["1500G","1500G"],["3000G","3000G"],["Gleeban groat","グビアナどうか"],["Gleeban guinea","グビアナぎんか"],["Gleeban gold piece","グビアナきんか"],["Gold bar","きんかい"],["Mini medal","ちいさなメダル"],["Medicinal herb","やくそう"],["Strong medicine","上やくそう"],["Evac-u-bell","おもいでのすず"],["Holy water","せいすい"],["Magic water","まほうのせいすい"],["Sage's elixir","けんじゃのせいすい"],["Antidotal herb","どくけしそう"],["Strong antidote","上どくけしそう"],["Narspicious","あやかしそう"],["Mystifying mixture","おかしなくすり"],["Superior medicine","いやしそう"],["Moonwort bulb","まんげつそう"],["Panacea","ばんのうくすり"],["Perfect panacea","超ばんのうくすり"],["Yggdrasil leaf","せかいじゅのは"],["Chimaera wing","キメラのつばさ"],["Oaken club","こんぼう"],["Pop socks","ニーソックス"],["Silver bracelets","ぎんのリスト"],["Bunny tail","うさぎのおまもり"],["Royal soil","まりょくの土"],["Lava lump","ようがんのカケラ"],["Angel bell","天使のすず"],["Silver platter","シルバートレイ"],["Fisticup","げんこつダケ"],["Iron nails","てつのクギ"],["Gold ring","きんのゆびわ"],["Gold bracer","きんのプレスレット"],["Iron mask","てっかめん"],["Toad oil","ガマのあぶら"],["Fisticup","げんこつダケ"],["Iron ore","てっこうせき"],["Slime shield","スライムトレイ"],["Corundum","ルビーのげんせき"],["Rockbomb shard","ばくだん石"],["Flintstone","つけもの石"],["Mirrorstone","かがみ石"],["Resurrock","命の石"],["Strength ring","ちからのゆびわ"],["Agility ring","はやてのリング"],["Manky mud","どくどくヘドロ"],["Nectar","花のみつ"],["Sorcerer's stone","ひらめきのジュエル"],["Glombolero","ふしぎなボレロ"],["Saint's ashes","せいじゃのはい"],["Malicite","うらみのほうじゅ"],["Hephaestus' flame","ヘパイトスのひだね"],["Muscle belt","あらくれベルト"],["Maid outfit","メイド服"],["Thug boots","あらくれブーツ"],["Thug's mug","あらくれマスク"],["Maid's mop","ヘッドドレス"],["Toughie trousers","あらくれズボン"],["Finessence","ぶどうエキス"],["Aggressence","とうこんエキス"],["Dangerous bustier","あぶないビスチェ"],["Brouhaha boomstick","まてきの杖"],["Hephaestus' flame","ヘパイトスのひだね"],["Astral plume","天使のはね"],["Densinium","ヘビーメタル"],["Riotous wristbands","ぶしんのリスト"],["Fingerless gloves","オープンフィンガー"],["Mythril ore","ミスリルこうせき"],["Veteran's gloves","古強者のグローブ"],["Fuddle bow","ゆうわくの弓"],["Oh-no bow","じごくの弓"],["Blessed boots","しんかんのブーツ"],["Skull ring","ドクロのゆびわ"],["Hela's hammer","まじんのかなづち"],["Hades' helm","サタンヘルム"],["Demon whip","あくまのムチ"],["Saint's ashes","せいじゃのはい"],["Densinium","ヘビーメタル"],["Lucida shard","ほしのカケラ"],["Depressing shoes","しわよせのくつ"],["Unhappy hat","しわよせのぼうし"],["Veteran's armour","古強者のよろい"],["Spellspadrilles","だいまどうシューズ"],["Veteran's boots","古強者のブーツ"],["Combat boots","ぶしんのブーツ"],["She-mage shoes","まじょのブーツ"],["Trinity tights","しんかんのタイツ"],["Ruinous shield","はめつの盾"],["Divine dress","さとりのワンピース"],["Skull helm","ドクロのかぶと"],["Matador's gloves","マタドールグラブ"],["Pandora's box","パンドラボックス"],["Enchanted stone","せいれいせき"],["Mythril ore","ミスリルこうせき"],["Hero spear","えいゆうのやり"],["Pruning knife","こがらしのダガー"],["Wyrmwand","ドラゴンの杖"],["Wizardly whip","カルベロビュート"],["Beast claws","まじゅうのツメ"],["Attribeauty","風林火山"],["Heavy hatchet","ふんさいのおおなた"],["Megaton hammer","メガトンハンマー"],["Pentarang","ペンタグラム"],["Pandora's box","パンドラボックス"],["Astral plume","天使のはね"],["Ethereal stone","げんませき"],["Reckless necklace","しにがみの首かざり"],["Orichalcum","オリハルコン"],["Metal slime sword","メタスラの剣"],["Metal slime spear","メタスラのやり"],["Metal slime shield","メタスラの盾"],["Metal slime armour","メタスラよろい"],["Metal slime helm","メタスラヘルム"],["Metal slime gauntlets","メタスラのこて"],["Metal slime sollerets","メタスラブーツ"],["Pandora's box","パンドラボックス"],["Reset stone","リサイクルストーン"],["Evac-u-bell","おもいでのすず"],["Sainted soma","天使のソーマ"],["Orichalcum","オリハルコン"],["Stardust sword","ほしくずのつるぎ"],["Poker","きしんのまそう"],["Deft dagger","サウザンドダガー"],["Bright staff","ひかりの杖"],["Gringham whip","グリンガムのムチ"],["Knockout rod","しゅらのこん"],["Dragonlord claws","竜王のツメ"],["Critical fan","ひっさつのおうぎ"],["Bad axe","グレートアックス"],["Groundbreaker","大地くだき"],["Meteorang","メテオエッジ"],["Angel's bow","天使の弓"],["Mimic","ミミック"],["Cannibox","ひとくいばこ"]];
const b3fThreeItems=["Mini medal","Sage's elixir","Iron nails","Hephaestus' flame"];
function lcg(seed){return (Math.imul(seed,1103515245)+12345)>>>0;}
class GrottoDetail{
constructor(){
this.di=[];
for(let i=0;i<16;i++) this.di[i]=new Uint8Array(1336);
this._details=new Uint8Array(20);
this._details2=new Uint8Array(20);
this._seed=0;
this.MapSeed=0;
this.MapRank=0;
this.MapLocale=0;
this.isStairOverflow=new Array(16).fill(false);
this.trackOverflow=false;
}
_readI32(floor,offset){
const d=this.di[floor];
return d[offset]|(d[offset+1]<<8)|(d[offset+2]<<16)|(d[offset+3]<<24);
}
_writeI32(floor,offset,val){
const d=this.di[floor];
d[offset]=val&0xFF;
d[offset+1]=(val>>>8)&0xFF;
d[offset+2]=(val>>>16)&0xFF;
d[offset+3]=(val>>>24)&0xFF;
}
gRNG(){
this._seed=lcg(this._seed);
return (this._seed>>>16)&0x7FFF;
}
gRNGDiv(div){
return this.gRNG()%div;
}
gRNGRange(v1,v2){
if(v1===v2) return v1;
const r=this.gRNG();
const num=(v2|0)-(v1|0)+1;
return num===0?v1:((v1+r%num)>>>0);
}
getItemRank(value1,value2){
const num=Math.fround(this.gRNG()-1);
return (Math.fround(((value2|0)-(value1|0)+1)*num/32767)>>>0)+value1;
}
seek1(table,tableSize){
const random=this.gRNGDiv(100);
let num=0;
for(let i=0;i<tableSize;i++){
num+=table[i*4+1];
if(random<num) return table[i*4];
}
return 0;
}
seek2(table,value,tableSize){
for(let i=0;i<tableSize;i++)
if(value>=table[i*4]&&value<=table[i*4+1])
return this.seek3(table[i*4+2],table[i*4+3]);
return 0;
}
seek3(val1,val2){
const r=this.gRNG();
const num=val2-val1+1;
return num===0?val1:(val1+r%num);
}
seek4(table1,table2,roopCount){
for(let i1=0;i1<roopCount;i1++){
if(this.MapRank>=table1[i1*4]&&this.MapRank<=table1[i1*4+1]){
let num1=0;
for(let i2=table1[i1*4+2];i2<=table1[i1*4+3];i2++)
num1+=table2[(i2-1)*2+1];
const num2=this.gRNG()%num1;
let num3=0;
for(let i3=table1[i1*4+2];i3<=table1[i1*4+3];i3++){
num3+=table2[(i3-1)*2+1];
if(num2<num3) return i3;
}
break;
}
}
return 0;
}
rRandom(value){
return (Math.fround(this.gRNG()-1)*value / 32767)>>>0;
}
r1(floor,address,value1,value2){
for(let i=0;i<value2;i++)
this.di[floor][address+i]=value1&0xFF;
}
setValue(floor,address,v1,v2,v3,v4){
const d=this.di[floor];
d[address]=v1;d[address+1]=v2;d[address+2]=v3;d[address+3]=v4;
}
rA(floor,address,value1,value2){
const d=this.di[floor];
const num1=d[address+3]+1-d[address+1];
if(num1<7||d[address+4]!==0) return false;
const random=this.gRNGRange(0,num1-7);
const num2=d[address+1]+random+3;
for(let i=d[address];i<d[address+2]+1;i++)
d[(num2<<4)+i+792]=3;
this.setValue(floor,value2,d[address],num2,d[address+2],num2);
this.setValue(floor,value1,d[address],num2+1,d[address+2],d[address+3]);
d[value1+4]=0;d[value1+5]=0;
d[address+3]=num2-1;
d[address+4]=1;
this._writeI32(floor,value2+4,address);
this._writeI32(floor,value2+8,value1);
d[value2+12]=1;
return true;
}
rE(floor,address,value1,value2){
const d=this.di[floor];
const num1=d[address+2]+1-d[address];
if(num1<7||d[address+5]!==0) return false;
const random=this.gRNGRange(0,num1-7);
const num2=d[address]+random+3;
for(let i=d[address+1];i<d[address+3]+1;i++)
d[(i<<4)+num2+792]=3;
this.setValue(floor,value2,num2,d[address+1],num2,d[address+3]);
this.setValue(floor,value1,num2+1,d[address+1],d[address+2],d[address+3]);
d[value1+4]=0;d[value1+5]=0;
d[address+2]=num2-1;
d[address+5]=1;
this._writeI32(floor,value2+4,address);
this._writeI32(floor,value2+8,value1);
d[value2+12]=2;
return true;
}
rB(floor,address){
const d=this.di[floor];
const num=d[21];
d[21]++;d[22]++;
if((this.gRNG()&1)!==0){
this.rF(floor,address);
this.rF(floor,num*12+24);
}else{
this.rF(floor,num*12+24);
this.rF(floor,address);
}
}
rF(floor,address){
const d=this.di[floor];
if(d[21]>=15) return;
if(d[address+5]!==0){
if(!this.rA(floor,address,d[21]*12+24,(d[22]<<4)+216))return;
this.rB(floor,address);
}else if(d[address+4]!==0){
if(!this.rE(floor,address,d[21]*12+24,(d[22]<<4)+216))return;
this.rB(floor,address);
}else if((this.gRNG()&1)!==0){
if(!this.rE(floor,address,d[21]*12+24,(d[22]<<4)+216))return;
this.rB(floor,address);
}else{
if(!this.rA(floor,address,d[21]*12+24,(d[22]<<4)+216))return;
this.rB(floor,address);
}
}
rC(floor,address1,address2){
const d=this.di[floor];
if(d[address1+2]+1-d[address1]<3||d[address1+3]+1-d[address1+1]<3)
return false;
const num1=d[address1],num2=d[address1+1],num3=d[address1+2],num4=d[address1+3];
let random1,random2,random3,random4;
if(this.gRNGRange(0,1)!==0){
random1=this.gRNGRange(num1,num1+((num3-num1+1)/3|0));
random2=this.gRNGRange(num2,num2+((num4-num2+1)/3|0));
}else{
random1=this.gRNGRange(num1+1,num1+((num3-num1+1)/3|0));
random2=this.gRNGRange(num2+1,num2+((num4-num2+1)/3|0));
}
if(this.gRNGRange(0,1)!==0){
random3=this.gRNGRange(num1+((num3-num1+1)/3|0)*2,num3);
random4=this.gRNGRange(num2+((num4-num2+1)/3|0)*2,num4);
}else{
random3=this.gRNGRange(num1+((num3-num1+1)/3|0)*2,num3-1);
random4=this.gRNGRange(num2+((num4-num2+1)/3|0)*2,num4-1);
}
this.setValue(floor,address2,random1,random2,random3,random4);
for(let i=4;i<20;i++) d[address2+i]=0;
this._writeI32(floor,address1+8,address2);
for(let y=random2;y<=random4;y++)
for(let x=random1;x<=random3;x++)
d[x+(y<<4)+792]=0;
this.rD(floor,address2);
return true;
}
rD(floor,address){
const d=this.di[floor];
const num1=d[address],num2=d[address+2];
if(num1===0||d[address+1]===0) return false;
if(num2===0||d[address+3]===0) return false;
if(num2-num1+1<5){
d[address+12]=this.gRNGRange(num1,num2);
d[address+13]=d[address+1];
d[address+16]=this.gRNGRange(d[address],d[address+2]);
d[address+17]=d[address+3];
d[(d[address+13]<<4)+792+d[address+12]]=8;
d[(d[address+17]<<4)+792+d[address+16]]=8;
}else{
const num3=num1+((num2-num1+1)/2|0)-1;
d[address+12]=this.gRNGRange(num1,num3);
d[address+13]=d[address+1];
d[address+14]=this.gRNGRange(num3+1,d[address+2]);
d[address+15]=d[address+1];
d[address+16]=this.gRNGRange(d[address],num3);
d[address+17]=d[address+3];
d[address+18]=this.gRNGRange(num3+1,d[address+2]);
d[address+19]=d[address+3];
d[(d[address+13]<<4)+792+d[address+12]]=8;
d[(d[address+15]<<4)+792+d[address+14]]=8;
d[(d[address+17]<<4)+792+d[address+16]]=8;
d[(d[address+19]<<4)+792+d[address+18]]=8;
}
if(d[address+3]-d[address+1]+1<5){
d[address+4]=d[address];
d[address+5]=this.gRNGRange(d[address+1],d[address+3]);
d[address+8]=d[address+2];
d[address+9]=this.gRNGRange(d[address+1],d[address+3]);
d[(d[address+5]<<4)+792+d[address+4]]=8;
d[(d[address+9]<<4)+792+d[address+8]]=8;
}else{
const num4=d[address+1];
const num5=num4+((d[address+3]+1-num4)/2|0)-1;
d[address+4]=d[address];
d[address+5]=this.gRNGRange(d[address+1],num5);
d[address+6]=d[address];
d[address+7]=this.gRNGRange(num5+1,d[address+3]);
d[address+8]=d[address+2];
d[address+9]=this.gRNGRange(d[address+1],num5);
d[address+10]=d[address+2];
d[address+11]=this.gRNGRange(num5+1,d[address+3]);
d[(d[address+5]<<4)+792+d[address+4]]=8;
d[(d[address+7]<<4)+792+d[address+6]]=8;
d[(d[address+9]<<4)+792+d[address+8]]=8;
d[(d[address+11]<<4)+792+d[address+10]]=8;
}
return true;
}
generateFloorMap(floor,address){
const d=this.di[floor];
const index1=this._readI32(floor,address+8);
const num1=((d[index1+2]-d[index1]+1)/2)|0;
const num2=((d[index1+3]-d[index1+1]+1)/2)|0;
let num3=0;
if(d[1]===0&&this.gRNGRange(0,15)===0)
num3=1;
let num4,num5,num6,num7;
if(num3===0){
num4=d[address+3]-d[index1+3];
num5=d[index1]-d[address];
num6=d[address+2]-d[index1+2];
num7=d[index1+1]-d[address+1];
}else{
num4=d[3]-d[index1+3]-1;
num5=d[index1]-1;
num6=d[2]-d[index1+2]-1;
num7=d[index1+1]-1;
d[1]=1;
}
for(let i3=d[index1];i3<=d[index1+2];i3++){
const num8=d[i3+(d[index1+1]<<4)+792];
if(num8===1||num8===3) continue;
if(this.gRNGRange(0,1)===0){
if(num8!==8){
const above=d[i3+((d[index1+1]-1)<<4)+792];
if(above===1||above===8) continue;
const random1=this.gRNGRange(0,num2);
const num9=i3-1;
for(let i4=0;
i4<random1&&
d[i3+((d[index1+1]+i4)<<4)+792]!==8&&
d[i3+((d[index1+1]+i4+1)<<4)+792]!==1&&
(d[((d[index1+1]+i4)<<4)+i3+1+792]===1 ||
d[((d[index1+1]+i4+1)<<4)+i3+1+792]!==1)&&
(d[((d[index1+1]+i4)<<4)+num9+792]===1 ||
d[num9+((d[index1+1]+i4+1)<<4)+792]!==1);
i4++)
d[i3+((d[index1+1]+i4)<<4)+792]=1;
}
}else{
const random2=this.gRNGRange(0,num7);
for(let i5=0;i5<random2;i5++){
const idx=i3+((d[index1+1]-1-i5)<<4)+792;
if(d[idx]!==8) d[idx]=0;
}
}
}
for(let i7=d[index1];i7<=d[index1+2];i7++){
const num10=d[i7+(d[index1+3]<<4)+792];
if(num10===1||num10===3) continue;
if(this.gRNGRange(0,1)!==0){
const random=this.gRNGRange(0,num4);
for(let i8=0;i8<random;i8++)
if(d[i7+((d[index1+3]+i8+1)<<4)+792]!==8)
d[i7+((d[index1+3]+i8+1)<<4)+792]=0;
}else{
if(num10!==8){
const below=d[i7+((d[index1+3]+1)<<4)+792];
if(below===1||below===8) continue;
const random3=this.gRNGRange(0,num2);
const num11=i7-1;
for(let i9=0;
i9<random3&&
d[i7+((d[index1+3]-i9)<<4)+792]!==8&&
d[i7+((d[index1+3]-i9-1)<<4)+792]!==1&&
(d[((d[index1+3]-i9)<<4)+i7+1+792]===1 ||
d[((d[index1+3]-i9-1)<<4)+i7+1+792]!==1)&&
(d[num11+((d[index1+3]-i9)<<4)+792]===1 ||
d[num11+((d[index1+3]-i9-1)<<4)+792]!==1);
i9++)
d[i7+((d[index1+3]-i9)<<4)+792]=1;
}
}
}
for(let i10=d[index1+1];i10<=d[index1+3];i10++){
const num12=d[(i10<<4)+792+d[index1]];
if(num12===1||num12===3) continue;
if(this.gRNGRange(0,1)!==0){
const random=this.gRNGRange(0,num5);
for(let i11=0;i11<random;i11++)
if(d[(i10<<4)+792+d[index1]-1-i11]!==8)
d[(i10<<4)+792+d[index1]-1-i11]=0;
}else{
if(num12!==8){
const left=d[(i10<<4)+792+d[index1]-1];
if(left===1||left===8) continue;
const random4=this.gRNGRange(0,num1);
const num13=i10-1;
for(let i12=0;
i12<random4&&
d[i12+(i10<<4)+d[index1]+792]!==8&&
d[i12+(i10<<4)+d[index1]+792+1]!==1&&
(d[i12+((i10+1)<<4)+d[index1]+792]===1 ||
d[i12+((i10+1)<<4)+d[index1]+792+1]!==1)&&
(d[i12+(num13<<4)+d[index1]+792]===1 ||
d[i12+(num13<<4)+d[index1]+792+1]!==1);
i12++)
d[i12+(i10<<4)+d[index1]+792]=1;
}
}
}
for(let i13=d[index1+1];i13<=d[index1+3];i13++){
const num14=d[(i13<<4)+792+d[index1+2]];
if(num14===1||num14===3) continue;
if(this.gRNGRange(0,1)!==0){
const random=this.gRNGRange(0,num6);
for(let i14=0;i14<random;i14++)
if(d[i14+(i13<<4)+d[index1+2]+792+1]!==8)
d[i14+(i13<<4)+d[index1+2]+792+1]=0;
}else{
if(num14!==8){
const right=d[d[index1+1]+(i13<<4)+792+1];
if(right===1||right===8) continue;
const random5=this.gRNGRange(0,num1);
const num15=i13-1;
for(let i15=0;
i15<random5&&
d[(i13<<4)+792+d[index1+2]-i15]!==8&&
d[(i13<<4)+792+d[index1+2]-i15-1]!==1&&
(d[((i13+1)<<4)+792+d[index1+2]-i15]===1 ||
d[((i13+1)<<4)+792+d[index1+2]-i15-1]!==1)&&
(d[(num15<<4)+792+d[index1+2]-i15]===1 ||
d[(num15<<4)+792+d[index1+2]-i15-1]!==1);
i15++)
d[(i13<<4)+792+d[index1+2]-i15]=1;
}
}
}
}
rI(floor,value1,value2,value3){
const d=this.di[floor];
const num1=d[value1+(value2<<4)+792];
if(num1===1||num1===3) return 255;
const num2=d[value1+((value2-1)<<4)+792];
const num3=d[value1+((value2-1)<<4)+792-1];
const num4=d[value1+((value2-1)<<4)+792+1];
const num5=d[value1+(value2<<4)+792+1];
const num6=d[value1+((value2+1)<<4)+792+1];
const num7=d[value1+((value2+1)<<4)+792];
const num8=d[value1+((value2+1)<<4)+792-1];
const num9=d[value1+(value2<<4)+792-1];
if(num1!==0&&num1!==2&&((num1+252)&255)>4)return value3;
if(num3===1||num3===3)value3|=128;else value3&=127;
if(num4===1||num4===3)value3|=32;else value3&=223;
if(num6===1||num6===3)value3|=8;else value3&=247;
if(num8===1||num8===3)value3|=2;else value3&=253;
if(num2===1||num2===3)value3|=224;else value3&=191;
if(num5===1||num5===3)value3|=56;else value3&=239;
if(num7===1||num7===3)value3|=14;else value3&=251;
if(num9===1||num9===3)value3|=131;else value3&=254;
return value3;
}
rG(floor,address){
const d=this.di[floor];
const address3=address;
if(d[address3+12]===1){
const parentAddr=this._readI32(floor,address3+4);
const address1=this._readI32(floor,parentAddr+8);
const siblingAddr=this._readI32(floor,address3+8);
const address2=this._readI32(floor,siblingAddr+8);
const num1=this.gRNGRange(0,7)===0?1:0;
this.rH(floor,address1,16,address2,12,address3,num1);
const num2=this.gRNGRange(0,7)===0?1:0;
this.rH(floor,address1,18,address2,12,address3,num2);
const num3=this.gRNGRange(0,7)===0?1:0;
this.rH(floor,address1,16,address2,14,address3,num3);
const num4=this.gRNGRange(0,7)===0?1:0;
this.rH(floor,address1,18,address2,14,address3,num4);
}else if(d[address3+12]===2){
const parentAddr=this._readI32(floor,address3+4);
const address1=this._readI32(floor,parentAddr+8);
const siblingAddr=this._readI32(floor,address3+8);
const address2=this._readI32(floor,siblingAddr+8);
const num5=this.gRNGRange(0,7)===0?1:0;
this.rH(floor,address1,8,address2,4,address3,num5);
const num6=this.gRNGRange(0,7)===0?1:0;
this.rH(floor,address1,10,address2,4,address3,num6);
const num7=this.gRNGRange(0,7)===0?1:0;
this.rH(floor,address1,8,address2,6,address3,num7);
const num8=this.gRNGRange(0,7)===0?1:0;
this.rH(floor,address1,10,address2,6,address3,num8);
}
return 1;
}
rH(floor,address1,value1,address2,value2,address3,value3){
const d=this.di[floor];
const index1=address3;
const num1=d[address1+value1];
const num2=d[address1+value1+1];
const num3=d[address2+value2];
const num4=d[address2+value2+1];
if(num1===0||num2===0||num3===0||num4===0)return false;
if(d[address3+12]===1){
for(let i=num2+1;i<d[index1+1]+1;i++)
d[(i<<4)+792+num1]=2;
for(let i=num4-1;i>d[index1+1];i--)
d[(i<<4)+792+num3]=2;
if(num1<num3)
for(let i=num1;i<num3+1;i++)
d[i+(d[index1+1]<<4)+792]=2;
else if(num1>num3)
for(let i=num3;i<num1+1;i++)
d[i+(d[index1+1]<<4)+792]=2;
if(value3===0) return true;
if(num1<num3){
ext1: for(let i=num3+1;i<16;i++){
const v=d[i+(d[index1+1]<<4)+792];
if(v===1||v===3) continue;
for(let j=num3+1;j<i;j++)
d[j+(d[index1+1]<<4)+792]=2;
break ext1;
}
for(let i=num1-1;i>=0;i--){
const v=d[i+(d[index1+1]<<4)+792];
if(v===1||v===3) continue;
for(let j=num1-1;j>i;j--)
d[j+(d[index1+1]<<4)+792]=2;
break;
}
}else if(num1>=num3){
ext2: for(let i=num1+1;i<16;i++){
const v=d[i+(d[index1+1]<<4)+792];
if(v===1||v===3) continue;
for(let j=num1+1;j<i;j++)
d[j+(d[index1+1]<<4)+792]=2;
break ext2;
}
for(let i=num3-1;i>=0;i--){
const v=d[i+(d[index1+1]<<4)+792];
if(v===1||v===3) continue;
for(let j=num3-1;j>i;j--)
d[j+(d[index1+1]<<4)+792]=2;
break;
}
}
}else if(d[address3+12]===2){
for(let i=num1+1;i<d[index1]+1;i++)
d[i+(num2<<4)+792]=2;
for(let i=num3-1;i>d[index1];i--)
d[i+(num4<<4)+792]=2;
if(num2<num4)
for(let i=num2;i<num4+1;i++)
d[(i<<4)+792+d[index1]]=2;
else if(num2>num4)
for(let i=num4;i<num2+1;i++)
d[(i<<4)+792+d[index1]]=2;
if(value3===0) return true;
if(num2<num4){
ext3: for(let i=num4+1;i<16;i++){
const v=d[(i<<4)+792+d[index1]];
if(v===1||v===3) continue;
for(let j=num4+1;j<i;j++)
d[(j<<4)+792+d[index1]]=2;
break ext3;
}
for(let i=num2-1;i>=0;i--){
const v=d[(i<<4)+792+d[index1]];
if(v===1||v===3) continue;
for(let j=num2-1;j>i;j--)
d[(j<<4)+792+d[index1]]=2;
break;
}
}else{
ext4:for(let i=(num2>=num4?num2+1:num2);i<16;i++){
const v=d[(i<<4)+792+d[index1]];
if(v===1||v===3) continue;
for(let j=num2+1;j<i;j++)
d[(j<<4)+792+d[index1]]=2;
break ext4;
}
for(let i=num4-1;i>=0;i--){
const v=d[(i<<4)+792+d[index1]];
if(v===1||v===3) continue;
for(let j=num4-1;j>i;j--)
d[(j<<4)+792+d[index1]]=2;
break;
}
}
}
return true;
}
rJ(floor){
const d=this.di[floor];
let num1=0,num2=0;
let random1=0,random2=0;
let random3,random4,random5;
while (true){
random3=this.gRNGRange(0,d[23]-1);
const idx1=random3*20+472;
random4=this.gRNGRange(d[idx1],d[idx1+2]);
random5=this.gRNGRange(d[idx1+1],d[idx1+3]);
if(num2<100){
const n3=d[((random5-1)<<4)+random4+792];
const n4=d[((random5+1)<<4)+random4+792];
const n5=d[(random5<<4)+792+random4-1];
const n6=d[(random5<<4)+792+random4+1];
const w7=(n3===1||n3===3)?1:0;
const w8=(n4===1||n4===3)?1:0;
const w9=(n5===1||n5===3)?1:0;
const w10=(n6===1||n6===3)?1:0;
if(w7&&w8&&w9&&w10){num2++;continue;}
if(w7&&w10){num2++;continue;}
if(w7&&w9){num2++;continue;}
if(w8&&w10){num2++;continue;}
if(w8&&w9){num2++;continue;}
const ri=this.rI(floor,random4,random5,0)&255;
if([46,58,139,142,163,171,174,184,186,226,232,234].includes(ri)){num2++;continue;}
}
d[random4+(random5<<4)+792]=4;
d[4]=random4;d[5]=random5;
if(num2>=100){num1=0;num2=0;if(this.trackOverflow)this.isStairOverflow[floor]=true;}
random1=random4;random2=random5;let num13=random3;
do{
const random6=this.gRNGRange(0,d[23]-1);
if(random6===(random3&255)&&(num1&255)<25){
num1++;
}else{
const idx2=random6*20+472;
random1=this.gRNGRange(d[idx2],d[idx2+2]);
num13=random6;
random2=this.gRNGRange(d[idx2+1],d[idx2+3]);
}
}while((random3&255)===num13&&random1===(random4&0xFFFF)&&random2===(random5&0xFFFF));
const n14=d[random1+((random2-1)<<4)+792];
const n15=d[random1+((random2+1)<<4)+792];
const n16=d[random1+(random2<<4)+792-1];
const n17=d[random1+(random2<<4)+792+1];
const w18=(n14===1||n14===3)?1:0;
const w19=(n15===1||n15===3)?1:0;
const w20=(n16===1||n16===3)?1:0;
const w21=(n17===1||n17===3)?1:0;
if(w18&&w19&&w20&&w21){num2++;}
else if(w18&&w21){num2++;}
else if(w18&&w20){num2++;}
else if(w19&&w21){num2++;}
else if(w19&&w20){num2++;}
else break;
}
d[random1+(random2<<4)+792]=5;
d[6]=random1;d[7]=random2;
}
rK(floor){
const d=this.di[floor];
const random1=this.gRNGRange(1,3);
d[8]=random1;
let num1=0,num2=0;
do{
const idx=this.gRNGRange(0,d[23]-1)*20+472;
const random2=this.gRNGRange(d[idx],d[idx+2]);
const random3=this.gRNGRange(d[idx+1],d[idx+3]);
const num3=d[random2+((random3&255)<<4)+792];
if(num1<100&&(d[0]===3||d[0]===1)){
num1++;
}else if(num3===6||num3===4||num3===5){
num1++;
}else{
d[random2+((random3&255)<<4)+792]=6;
d[num2*2+13]=random2;
d[num2*2+14]=random3;
num2++;
}
}while(num2<(random1&255));
return 1;
}
calculateDetail(skipMapGen=false){
for(let i=0;i<16;i++){
this.di[i].fill(0);
}
this._details.fill(0);
this._details2.fill(0);
if(this.trackOverflow) this.isStairOverflow.fill(false);
if(this.MapRank<2||this.MapRank>248) return;
this._seed=this.MapSeed;
if(this._at_offset===1){this._seed=lcg(this._seed);}
for(let i=0;i<12;i++) this.gRNGDiv(100);
this._details[3]=this.seek1(TableA,5);
this._details[1]=this.seek2(TableB,this.MapRank,9);
if(this._force_16_floors){
this._details[1]=16;
}
this._details[2]=this.seek2(TableC,this.MapRank,8);
this._details[0]=this.seek4(TableD,TableE,9);
for(let i=0;i<12;i++)
this._details[i+1+7]=this.seek3(TableF[i*4+1],TableF[i*4+2]);
this._details[5]=this.seek2(TableH,this._details[2],5);
this._details[6]=this.seek2(TableI,this._details[0],4);
this._details[7]=this.seek2(TableG,this._details[1],8);
let num1=(this._details[0]+this._details[1]+this._details[2]-4)*3+(this.gRNGDiv(11)-5);
if(num1<1) num1=1;
if(num1>99) num1=99;
this._details[4]=num1;
this.MapLocale=LOCALE_INDEX[(this._details[7]-1)*5+this._details[3]-1];
for(let i=1;i<this._details[1]+1;i++){
let num9;
if(i>12) num9=16;
else if(i>8) num9=(this.MapSeed+i)%3+14;
else if(i>4) num9=(this.MapSeed+i)%4+12;
else num9=(this.MapSeed+i)%5+10;
this.di[i-1][2]=num9;
this.di[i-1][3]=num9;
}
if(!skipMapGen){
this.createDungeonDetail();
}
}
createDungeonDetail(){
for(let index1=1;index1<this._details[1]+1;index1++){
const floor=index1-1;
const d=this.di[floor];
d[0]=index1;
d[8]=0;
this._seed=(this.MapSeed+index1)>>>0;
this.r1(floor,792,1,256);
d[21]=1;d[22]=0;d[23]=0;d[1]=0;
this.setValue(floor,24,1,1,d[2]-2,d[3]-2);
d[28]=0;d[29]=0;
this.rF(floor,24);
for(let i2=0;i2<d[21];i2++)
if(this.rC(floor,i2*12+24,d[23]*20+472))
d[23]++;
for(let i3=0;i3<d[21];i3++)
this.generateFloorMap(floor,i3*12+24);
for(let i4=0;i4<d[22];i4++)
this.rG(floor,(i4<<4)+216);
for(let i5=0;i5<d[2];i5++){
d[i5+792]=1;
d[((d[3]-1)<<4)+i5+792]=1;
}
for(let i6=0;i6<d[3];i6++){
d[(i6<<4)+792]=1;
d[(i6<<4)+792+d[2]-1]=1;
}
this.rJ(floor);
if(d[0]<=2) d[8]=0;
else this.rK(floor);
}
for(let i12=2;i12<this._details[1];i12++){
const d=this.di[i12];
this._seed=(this.MapSeed+i12+1)>>>0;
for(let i13=0;i13<d[8]<<1;i13++) this.gRNG();
const num=this._details[2]+(i12/4|0);
for(let i14=0;i14<d[8];i14++){
d[i14+9]=this.getItemRank(TableN[(num-1)*4+1],TableN[(num-1)*4+2]);
this._details2[d[i14+9]-1]++;
}
}
}
get floorCount(){return this._details[1];}
get monsterRank(){return this._details[2];}
get mapLevel(){return this._details[4];}
get mapTypeName(){return ENV_NAMES[this._details[3]]?ENV_NAMES[this._details[3]][0]:"Unknown";}
get mapTypeNameJP(){return ENV_NAMES[this._details[3]]?ENV_NAMES[this._details[3]][1]:"不明";}
get bossName(){return BOSS_NAMES[this._details[0]]?BOSS_NAMES[this._details[0]][0]:"Unknown";}
get bossNameJP(){return BOSS_NAMES[this._details[0]]?BOSS_NAMES[this._details[0]][2]:"不明";}
get mapName(){
if(this.MapRank<2||this.MapRank>248) return "Unknown";
const p=PREFIX_NAMES[this._details[5]][0];
const s=SUFFIX_NAMES[this._details[6]][0];
const l=LOCALE_NAMES[this.MapLocale][0];
return `${p} ${l} of ${s} Lv.${this._details[4]}`;
}
get mapNameJP(){
if(this.MapRank<2||this.MapRank>248) return "Unknown";
const p=PREFIX_NAMES[this._details[5]][1];
const s=SUFFIX_NAMES[this._details[6]][1];
const l=LOCALE_NAMES[this.MapLocale][1];
return `${p}${s}の${l}Lv${this._details[4]}`;
}
getFloorWidth(f){return this.di[f][2];}
getFloorHeight(f){return this.di[f][3];}
getUpStair(f){return{x: this.di[f][4],y: this.di[f][5] };}
getDownStair(f){return{x: this.di[f][6],y: this.di[f][7] };}
getBoxCount(f){return this.di[f][8];}
getBoxInfo(f,i){
const d=this.di[f];
return{rank:d[9+i],x:d[i*2+13],y:d[i*2+14]};
}
getFloorMap(f){
const w=this.getFloorWidth(f),h=this.getFloorHeight(f);
const map=[];
for(let y=0;y<h;y++){
map[y]=[];
for(let x=0;x<w;x++)
map[y][x]=this.di[f][x+(y<<4)+792];
}
return map;
}
getBoxItem(floor,boxIndex,second){
this._seed=(this.di[floor][0]+this.MapSeed+second)>>>0;
for(let i1=0;i1<this.di[floor][8];i1++){
const num1=this.rRandom(100);
if(i1===boxIndex){
const index2=this.di[floor][i1+9];
const num2=TableO[index2-1],num3=TableO[index2];
let num4=0;
for(let i3=num2;i3<num3;i3++){
num4+=TableP[i3];
if(num1<num4) return [TableR[TableQ[i3]][0],TableR[TableQ[i3]][1]];
}
}
}
return [null,null];
}
getFloorItemNames(floor,second){
const d=this.di[floor];
const boxCount=d[8];
this._seed=(d[0]+this.MapSeed+second)>>>0;
const names=[];
for(let i1=0;i1<boxCount;i1++){
const num1=this.rRandom(100);
const index2=d[i1+9];
const num2=TableO[index2-1],num3=TableO[index2];
let num4=0,name=null;
for(let i3=num2;i3<num3;i3++){
num4+=TableP[i3];
if(num1<num4){name=TableR[TableQ[i3]][0];break;}
}
names.push(name);
}
return names;
}
getMapBoxCounts(){
let counts={
10: this._details2[9],
9: this._details2[8],
8: this._details2[7],
7: this._details2[6],
6: this._details2[5],
5: this._details2[4],
4: this._details2[3],
3: this._details2[2],
2: this._details2[1],
1: this._details2[0]
};
let total=0;
for(let i=0;i<10;i++)total+=this._details2[i];
return{counts,total};
}
}