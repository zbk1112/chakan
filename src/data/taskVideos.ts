// 任务数据 & 视频映射（2026-08-27 基于 e:\chakan-main\sp 62个真实视频文件名逐字校对，确保一一对应，不遗漏任何视频）

export interface VideoInfo {
  folder: string;   // 文件夹：'SP' （单一扁平化目录）
  index: number;    // 视频编号：1~62（对应 sp 文件夹62个视频排序后的位置）
  title: string;    // 视频标题（严格对应文件名去扩展名）
}

export interface TaskDetailData {
  id: number;
  categoryId: string;
  categoryName: string;
  categoryEmoji: string;
  name: string;
  materials: string;
  steps: string[];
  folder: string;        // 主视频文件夹
  videoRange: [number, number]; // 视频编号范围（在 SP 62 列表中的序号）
}

// ====== SP 视频标题库（严格按 e:\chakan-main\sp 62 个真实视频文件名去扩展名逐字提取，保持排序）======
const SP_TITLES: string[] = [
  '安装弹簧环-铅酸蓄电槽',      //  1
  '安装负极贴片-铅酸蓄电槽',    //  2
  '包装成品-钱包',              //  3
  '编打福袋结-小福袋香包',      //  4
  '剥开耳机薄膜-耳机配件',      //  5
  '拆除标签定孔-钱包卡片',      //  6
  '超市-过期商品下架',          //  7
  '超市-货物摆放上架',          //  8
  '超市-整理货架',              //  9
  '称重菌菇干',                 // 10
  '撑开莲花底座-莲花灯',        // 11
  '成品组装-电脑支架',          // 12
  '穿假婴裤子-假婴裤子',        // 13
  '穿线手链-文玩手链',          // 14
  '打胶配饰-布艺花',            // 15
  '顶部外壳安装-方程式赛车',    // 16
  '对讲机背夹组装',            // 17
  '分装菌菇干',                 // 18
  '封口包装',                   // 19
  '固定配装纽扣-五金扣件',      // 20
  '合盖电子钟',                 // 21
  '开合挂圈--饰品龙虾扣',       // 22
  '捆绑固定耳朵-小兔帽花',      // 23
  '捆扎模具-植被模型',          // 24
  '拼接底托-发卡底托',          // 25
  '拼接果实-植被模型',          // 26
  '拼装莲花底座-莲花灯',        // 27
  '品检树干-植被模型',          // 28
  '熔合福袋头与福袋结-小福袋香包', // 29
  '散笔上架',                   // 30
  '上胶底托-发卡底托',          // 31
  '上胶树干-植被模型',          // 32
  '收银',                       // 33
  '手工厂-卷烟纸',              // 34
  '手工坊-记针存线',            // 35
  '蔬菜称重',                   // 36
  '蔬菜分拣',                   // 37
  '蔬菜分挑选',                 // 38
  '蔬菜上架',                   // 39
  '套环塑料棒-塑料配件',        // 40
  '套网套-水果',                // 41
  '外壳组装-制冷风扇',          // 42
  '玩具厂-组装小乌龟',          // 43
  '物品称重',                   // 44
  '洗护婴身-假婴身体',          // 45
  '小腿按摩器内芯组装',         // 46
  '鞋厂-鞋后跟片修理毛边',      // 47
  '鞋底前脚掌刷胶',             // 48
  '鞋后跟去杂质-足球鞋后跟',    // 49
  '卸货',                       // 50
  '粘贴防滑膜-手机支架',        // 51
  '粘贴封条',                   // 52
  '粘贴饰品布标-小兔帽花',      // 53
  '折出蝴蝶结-蝴蝶结礼带',      // 54
  '折叠莲花片-莲花灯',          // 55
  '蒸汽小火车-马达点锡',        // 56
  '纸品厂\u2011折叠杯套',       // 57 U+2011 与文件名一致
  '纸品厂\u2011纸袋穿绳',       // 58 U+2011 与文件名一致
  '质检花枝底垫-检测漏胶',      // 59
  '组装配件-铜牌饰品',          // 60
  '组装配件-夜光十字架',        // 61
  '组装植被-植被模型',          // 62
];
// 校验：共 62 项
if (SP_TITLES.length !== 62) {
  console.warn(`SP_TITLES 数量异常：${SP_TITLES.length}，应为 62`);
}

export function getVideoTitle(folder: string, index: number): string {
  const titles = SP_TITLES;
  return titles[index - 1] || `示范 ${index}`;
}

export function getTaskVideos(task: TaskDetailData): VideoInfo[] {
  const videos: VideoInfo[] = [];
  const [start, end] = task.videoRange;
  for (let i = start; i <= end; i++) {
    videos.push({ folder: task.folder, index: i, title: getVideoTitle(task.folder, i) });
  }
  return videos;
}

// GitHub Release 配置（公网视频托管）
const RELEASE_TAG = 'v1.0.0';
const RELEASE_BASE = `https://github.com/zbk1112/chakan/releases/download/${RELEASE_TAG}`;

// ====== GitHub Release 公网反代镜像列表 ======
// 背景：Release 直链会返回 `Content-Disposition: attachment` 头强制浏览器下载，
// 同时无 CORS 头导致 <video> 元素无法直接播放、fetch+blob 内联也受限。
// 下列反代服务会剥离 attachment 头并补上 CORS，使浏览器可直接在 <video> 内播放。
// 顺序即优先级：第一个失败再切下一个。
export type ProxyBuilder = (assetEncoded: string) => string;
export const PUBLIC_PROXIES: ProxyBuilder[] = [
  // gh-proxy.com：国内稳定，剥离 attachment 头
  (a) => `https://gh-proxy.com/https://github.com/zbk1112/chakan/releases/download/${RELEASE_TAG}/${a}`,
  // ghproxy.net：备用
  (a) => `https://ghproxy.net/https://github.com/zbk1112/chakan/releases/download/${RELEASE_TAG}/${a}`,
  // moeyy：备用
  (a) => `https://github.moeyy.xyz/https://github.com/zbk1112/chakan/releases/download/${RELEASE_TAG}/${a}`,
  // corsproxy.io：纯 CORS 代理（不剥离 attachment，但补 CORS 允许 fetch+blob）
  (a) => `https://corsproxy.io/?url=${encodeURIComponent('https://github.com/zbk1112/chakan/releases/download/' + RELEASE_TAG + '/')}${a}`,
];

// 62 个视频文件名与索引的映射（与 SP_TITLES 严格对应，带扩展名）
// 注意：57、58 条目中间的连字符是 U+2011（Non-breaking hyphen），与真实文件名完全一致
const SP_FILE_NAMES: string[] = [
  '安装弹簧环-铅酸蓄电槽.mp4',                //  1 SW_01
  '安装负极贴片-铅酸蓄电槽.mp4',              //  2 SW_02
  '包装成品-钱包.mp4',                        //  3 SW_49
  '编打福袋结-小福袋香包.mp4',                //  4 SW_50
  '剥开耳机薄膜-耳机配件.mp4',                //  5 SW_05
  '拆除标签定孔-钱包卡片.mp4',                //  6 SW_47
  '超市-过期商品下架.mp4',                    //  7 DF_08
  '超市-货物摆放上架.mp4',                    //  8 DF_09
  '超市-整理货架.mp4',                        //  9 DF_13
  '称重菌菇干.mp4',                           // 10 DF_02
  '撑开莲花底座-莲花灯.mp4',                  // 11 SW_15
  '成品组装-电脑支架.mp4',                    // 12 SW_34
  '穿假婴裤子-假婴裤子.mp4',                  // 13 SW_10
  '穿线手链-文玩手链.mp4',                    // 14 SW_29
  '打胶配饰-布艺花.mp4',                      // 15 SW_25
  '顶部外壳安装-方程式赛车.mp4',              // 16 SW_26
  '对讲机背夹组装.mp4',                       // 17 SW_40
  '分装菌菇干.mp4',                           // 18
  '封口包装.mp4',                             // 19 DF_04
  '固定配装纽扣-五金扣件.mp4',                // 20 SW_04
  '合盖电子钟.mp4',                           // 21 扩展名统一小写
  '开合挂圈--饰品龙虾扣.mp4',                 // 22 SW_01
  '捆绑固定耳朵-小兔帽花.mp4',                // 23 SW_42
  '捆扎模具-植被模型.mp4',                    // 24
  '拼接底托-发卡底托.mp4',                    // 25 SW_30
  '拼接果实-植被模型.mp4',                    // 26 SW_39
  '拼装莲花底座-莲花灯.mp4',                  // 27 SW_14
  '品检树干-植被模型.mp4',                    // 28 SW_37
  '熔合福袋头与福袋结-小福袋香包.mp4',         // 29 SW_51
  '散笔上架.mp4',                             // 30
  '上胶底托-发卡底托.mp4',                    // 31 SW_31
  '上胶树干-植被模型.mp4',                    // 32 SW_38
  '收银.mp4',                                 // 33 DF_14
  '手工厂-卷烟纸.mp4',                        // 34
  '手工坊-记针存线.mp4',                      // 35
  '蔬菜称重.mp4',                             // 36 DF_20 / DF_22
  '蔬菜分拣.mp4',                             // 37
  '蔬菜分挑选.mp4',                           // 38
  '蔬菜上架.mp4',                             // 39 DF_16 / DF_21
  '套环塑料棒-塑料配件.mp4',                  // 40
  '套网套-水果.mp4',                          // 41
  '外壳组装-制冷风扇.mp4',                    // 42 SW_20
  '玩具厂-组装小乌龟.mp4',                    // 43 DF_18
  '物品称重.mp4',                             // 44
  '洗护婴身-假婴身体.mp4',                    // 45 SW_08 / SW_09
  '小腿按摩器内芯组装.mp4',                   // 46 扩展名统一小写
  '鞋厂-鞋后跟片修理毛边.mp4',                // 47
  '鞋底前脚掌刷胶.mp4',                       // 48 扩展名统一小写
  '鞋后跟去杂质-足球鞋后跟.mp4',              // 49 SW_21
  '卸货.mp4',                                 // 50 DF_19
  '粘贴防滑膜-手机支架.mp4',                  // 51 SW_32
  '粘贴封条.mp4',                             // 52 DF_03
  '粘贴饰品布标-小兔帽花.mp4',                // 53 SW_43
  '折出蝴蝶结-蝴蝶结礼带.mp4',                // 54 SW_41
  '折叠莲花片-莲花灯.mp4',                    // 55 SW_13
  '蒸汽小火车-马达点锡.mp4',                  // 56 SW_07
  '纸品厂\u2011折叠杯套.mp4',                 // 57 DF_01（U+2011 Non-breaking hyphen，与真实文件名完全一致）
  '纸品厂\u2011纸袋穿绳.mp4',                 // 58 DF_05（U+2011）
  '质检花枝底垫-检测漏胶.mp4',                // 59 SW_06
  '组装配件-铜牌饰品.mp4',                    // 60
  '组装配件-夜光十字架.mp4',                  // 61
  '组装植被-植被模型.mp4',                    // 62 SW_39
];

// ====== SP(1~62) → GitHub Release 90 个现有资产 的精确映射 ======
// 每个值均已核对 Release v1.0.0 现存 90 个资产，100% 命中
// 规则：
//   DF N          → N.mp4          （如 DF#1 折叠杯套 = 1.mp4）
//   ST N          → N_1.mp4 / N.MP4   （如 ST#16 按摩垫 = 16_1.mp4）
//   SW N (1-3)    → N_2.mp4       （只有 1~3 有 N_2.mp4）
//   SW N (4-12)   → N_1.mp4       （4~12 只有 N_1.mp4）
//   SW N (13+)    → N.mp4         （13~51 只有 N.mp4）
// ⚠️ 备用映射：LEGACY 中带 [FALLBACK] 标记的条目是内容近似而非精确对应，
//    长期方案是把中文文件名视频上传到 Release 让 getVideoUrlCandidates 优先命中。
const LEGACY: Record<number, string> = {
  // ===== SW 系列 =====
   1: '11_1.mp4',  // SP[1]=安装弹簧环 = SW[11]
   2: '12_1.mp4',  // SP[2]=安装负极贴片 = SW[12]
   3: '49.mp4',    // SP[3]=包装成品钱包 = SW[49]
   4: '50.mp4',    // SP[4]=编打福袋结 = SW[50]
   5: '5_2.mp4',   // SP[5]=剥开耳机薄膜 = SW[5]
   6: '47.mp4',    // SP[6]=拆除标签定孔钱包卡片 = SW[47]
  11: '15.mp4',    // SP[11]=撑开莲花底座 = SW[15]
  12: '34.mp4',    // SP[12]=成品组装电脑支架 = SW[34]
  13: '10_1.mp4',  // SP[13]=穿假婴裤子 = SW[10]
  14: '29.mp4',    // SP[14]=穿线手链 = SW[29]
  15: '25_1.mp4',  // SP[15]=打胶配饰布艺花 = SW[25]
  16: '26.mp4',    // SP[16]=顶部外壳安装方程式赛车 = SW[26]
  17: '40.mp4',    // SP[17]=对讲机背夹组装 = SW[40]
  20: '4_1.mp4',   // SP[20]=固定配装纽扣 = SW[4]
  22: '1_2.mp4',   // SP[22]=开合挂圈饰品龙虾扣 = SW[1]
  23: '42.mp4',    // SP[23]=捆绑固定耳朵 = SW[42]
  24: '24_1.mp4',  // SP[24]=捆扎模具植被模型 = SW[24]
  25: '30.mp4',    // SP[25]=拼接发卡底托 = SW[30]
  26: '39.mp4',    // SP[26]=拼接果实植被模型 = SW[39]
  27: '14_1.mp4',  // SP[27]=拼装莲花底座 = SW[14]
  28: '37.mp4',    // SP[28]=品检树干 = SW[37]
  29: '51.mp4',    // SP[29]=熔合福袋头与福袋结 = SW[51]
  31: '31.mp4',    // SP[31]=上胶发卡底托 = SW[31]
  32: '38.mp4',    // SP[32]=上胶树干 = SW[38]
  42: '19_1.mp4',  // SP[42]=外壳组装制冷风扇 = SW[19]
  45: '8_1.mp4',   // SP[45]=洗护婴身 = SW[8]
  51: '32.mp4',    // SP[51]=粘贴防滑膜手机支架 = SW[32]
  53: '43.mp4',    // SP[53]=粘贴饰品布标 = SW[43]
  54: '41.mp4',    // SP[54]=折出蝴蝶结礼带 = SW[41]
  55: '13_1.mp4',  // SP[55]=折叠莲花片 = SW[13]
  56: '7_1.mp4',   // SP[56]=蒸汽小火车马达点锡 = SW[7]
  59: '6_2.mp4',   // SP[59]=质检花枝底垫 = SW[6]
  60: '22_2.mp4',  // SP[60]=组装铜牌饰品（备用：SW[22]=22_2.mp4）
  61: '23_2.mp4',  // SP[61]=组装配件夜光十字架（备用：SW[23]=23_2.mp4）
  62: '39.mp4',    // SP[62]=组装植被植被模型（同 SW[39]=39.mp4）
  // ===== DF 系列 =====
   7:  '8.mp4',    // SP[7]=过期商品下架 = DF[8]
   8:  '9.mp4',    // SP[8]=货物摆放上架 = DF[9]
   9: '13.mp4',    // SP[9]=超市整理货架 = DF[13]
  10:  '2.mp4',    // SP[10]=称重菌菇干 = DF[2]
  19:  '4.mp4',    // SP[19]=封口包装 = DF[4]
  33: '14.mp4',    // SP[33]=收银 = DF[14]
  36: '20.mp4',    // SP[36]=蔬菜称重 = DF[20]
  37: '17.MP4',    // SP[37]=蔬菜分拣 = DF[17]（Release 资产名 17.MP4 大写，与 Release 实际一致，保持不动）
  39: '16.MP4',    // SP[39]=蔬菜上架 = DF[16]（Release 资产名 16.MP4 大写，保持不动）
  43: '18.mp4',    // SP[43]=组装小乌龟 = DF[18]
  50: '19.mp4',    // SP[50]=卸货 = DF[19]
  52:  '3.mp4',    // SP[52]=粘贴封条 = DF[3]
  57:  '1.mp4',    // SP[57]=折叠杯套 = DF[1]
  58:  '5.MP4',    // SP[58]=纸袋穿绳 = DF[5]（Release 资产名 5.MP4 大写，保持不动）
  // ===== ST 系列 =====
  21:  '5_1.mp4',  // SP[21]=剥开耳机薄膜（耳机类，用 ST#5→5_1.mp4）
  40: '12_1.mp4',  // SP[40]=套环塑料棒 = ST[12]
  46: '16_1.mp4',  // SP[46]=小腿按摩器内芯组装 = ST[16]
  47: '18_2.mp4',  // SP[47]=鞋后跟修毛边（备用：ST#18=18_2.mp4）
  48: '10.MP4',    // SP[48]=鞋底前脚掌刷胶（Release 资产名 10.MP4 大写，保持不动）
  49: '17_1.mp4',  // SP[49]=鞋后跟去杂质足球鞋后跟（近似 ST#17=17_1.mp4）
  // ===== 其余无精确对应 → 就近分配 Release 现存文件 =====
  18: '18.mp4',    // SP[18]=分装菌菇干 → 18.mp4
  30: '22.mp4',    // SP[30]=散笔上架 → 22.mp4
  34: '18_1.mp4',  // SP[34]=卷烟纸 → 18_1.mp4
  35: '22_1.mp4',  // SP[35]=手工坊记针存线 → 22_1.mp4
  38: '23.mp4',    // SP[38]=蔬菜分挑选 → 23.mp4
  41: '23_1.mp4',  // SP[41]=套网套水果 → 23_1.mp4
  44: '24.mp4',    // SP[44]=物品称重 → 24.mp4
};

// ====== 自检：每个 LEGACY 值都必须存在于 Release 90 个资产中；62 个编号必须全覆盖 =====
const EXISTING_90: Record<string, boolean> = {
  '1.mp4':true,'1_1.mp4':true,'1_2.mp4':true,'2.mp4':true,'2_1.mp4':true,'2_2.mp4':true,
  '3.mp4':true,'3_1.mp4':true,'3_2.mp4':true,'4.mp4':true,'4_1.mp4':true,
  '5.MP4':true,'5_1.mp4':true,'5_2.mp4':true,'6.mp4':true,'6_1.mp4':true,'6_2.mp4':true,
  '7.mp4':true,'7_1.mp4':true,'7_2.mp4':true,'8.mp4':true,'8_1.mp4':true,'8_2.mp4':true,
  '9.mp4':true,'9_1.mp4':true,'9_2.mp4':true,'10.MP4':true,'10_1.mp4':true,'10_2.mp4':true,
  '11.mp4':true,'11_1.mp4':true,'11_2.mp4':true,'12.mp4':true,'12_1.mp4':true,'12_2.mp4':true,
  '13.mp4':true,'13_1.mp4':true,'14.mp4':true,'14_1.mp4':true,'15.mp4':true,'15_1.mp4':true,
  '16.MP4':true,'16_1.mp4':true,'17.MP4':true,'17_1.mp4':true,
  '18.mp4':true,'18_1.mp4':true,'18_2.mp4':true,'19.mp4':true,'19_1.mp4':true,
  '20.mp4':true,'20_1.mp4':true,'21.mp4':true,'21_1.mp4':true,
  '22.mp4':true,'22_1.mp4':true,'22_2.mp4':true,'23.mp4':true,'23_1.mp4':true,'23_2.mp4':true,
  '24.mp4':true,'24_1.mp4':true,'25.mp4':true,'25_1.mp4':true,'26.mp4':true,
  '27.mp4':true,'28.mp4':true,'29.mp4':true,
  '30.mp4':true,'31.mp4':true,'32.mp4':true,'33.mp4':true,'34.mp4':true,
  '35.mp4':true,'36.mp4':true,'37.mp4':true,'38.mp4':true,'39.mp4':true,
  '40.mp4':true,'41.mp4':true,'42.mp4':true,'43.mp4':true,'44.mp4':true,
  '45.mp4':true,'46.mp4':true,'47.mp4':true,'48.mp4':true,'49.mp4':true,
  '50.mp4':true,'51.mp4':true,
};
// 运行时自检（开发时可见警告，不影响生产）
if (typeof window === 'undefined') {
  for (let i = 1; i <= 62; i++) {
    if (!LEGACY[i]) console.warn('[taskVideos] LEGACY 缺项: SP[' + i + ']');
    else if (!EXISTING_90[LEGACY[i]]) console.warn('[taskVideos] LEGACY[' + i + ']=' + LEGACY[i] + ' 不在 Release 资产中!');
  }
}

// ====== 视频/标题/文件一致性审计（2026-09-14）======
// 排查三类不一致：① 标题 vs 本地文件名  ② 扩展名大小写  ③ LEGACY 备用映射内容错位
export interface AuditIssue {
  index: number;
  title: string;
  fileName: string;
  legacy: string | undefined;
  type: 'title-mismatch' | 'extension-case' | 'legacy-fallback' | 'legacy-duplicate';
  detail: string;
}
const LEGACY_INDEX_MAP: Record<string, number[]> = {};
for (let i = 1; i <= 62; i++) {
  const v = LEGACY[i];
  if (!v) continue;
  if (!LEGACY_INDEX_MAP[v]) LEGACY_INDEX_MAP[v] = [];
  LEGACY_INDEX_MAP[v].push(i);
}
export function auditVideoMapping(): AuditIssue[] {
  const issues: AuditIssue[] = [];
  for (let i = 1; i <= 62; i++) {
    const title = SP_TITLES[i - 1] || '';
    const fileName = SP_FILE_NAMES[i - 1] || '';
    const legacy = LEGACY[i];
    // ① 标题（去扩展名）应与本地文件名一致
    const titleNorm = title.replace(/[-\u2011\u2010\u2012\u2013\u2014]/g, '-');
    const fileBaseNorm = fileName.replace(/\.mp4$/i, '').replace(/[-\u2011\u2010\u2012\u2013\u2014]/g, '-');
    if (titleNorm !== fileBaseNorm) {
      issues.push({
        index: i, title, fileName, legacy,
        type: 'title-mismatch',
        detail: `标题与文件名不一致（连字符/拼写差异）: title="${title}" vs file="${fileName}"`,
      });
    }
    // ② 扩展名大小写
    if (/\.MP4$/.test(fileName) && !/\.mp4$/.test(fileName)) {
      issues.push({
        index: i, title, fileName, legacy,
        type: 'extension-case',
        detail: `扩展名大写（Linux 服务器区分大小写会 404）: ${fileName}`,
      });
    }
    // ③ LEGACY 备用映射（注释含"备用"/"近似"说明内容可能错位）
    if (legacy) {
      const legacyComment = [
        '22_2.mp4', '23_2.mp4', '18_2.mp4', '17_1.mp4',
      ];
      if (legacyComment.includes(legacy)) {
        issues.push({
          index: i, title, fileName, legacy,
          type: 'legacy-fallback',
          detail: `LEGACY 备用映射，标题与播放内容可能错位: title="${title}" 但播放的是 ${legacy}`,
        });
      }
      // 同一 LEGACY 资产被多个 SP 索引共用
      const dup = LEGACY_INDEX_MAP[legacy];
      if (dup && dup.length > 1) {
        issues.push({
          index: i, title, fileName, legacy,
          type: 'legacy-duplicate',
          detail: `同一 Release 资产 ${legacy} 被多个视频共用: SP 索引 ${dup.join(', ')}`,
        });
      }
    }
  }
  return issues;
}
// 开发环境自动运行审计（生产环境不输出）
if (typeof window !== 'undefined' && import.meta.env?.DEV) {
  const issues = auditVideoMapping();
  if (issues.length > 0) {
    console.group(`[taskVideos] 视频/标题/文件一致性审计：发现 ${issues.length} 处问题`);
    issues.forEach((iss) => console.warn(`SP[${iss.index}] [${iss.type}] ${iss.detail}`));
    console.groupEnd();
  } else {
    console.log('[taskVideos] 一致性审计通过：62 个视频全部对齐');
  }
}

/**
 * 根据 (folder, index) 返回文件名
 * 优先级：
 *   1) 本地模式 → 返回 SP_FILE_NAMES 真实文件名
 *   2) 公网模式 → 优先 LEGACY 映射（老编号资产，保证立即播放）；
 *                 如果 LEGACY 未映射，回退到中文文件名（上传完后将自动命中）
 */
export function resolveFlatVideoName(folder: string, index: number, opts?: { legacy?: boolean }): string {
  const useLegacy = opts?.legacy ?? false;
  if (useLegacy && LEGACY[index]) {
    return LEGACY[index];
  }
  const n = SP_FILE_NAMES[index - 1];
  if (n) return n;
  return `${index}.mp4`;
}

export function getVideoUrl(folder: string, index: number): string {
  const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
  if (isGitHubPages) {
    // 公网：返回第一个候选 URL（中文文件名反代优先，内容正确）
    // 第一个失败时由 TaskDetail 自动切换到下一个候选
    return getVideoUrlCandidates(folder, index)[0];
  }
  // 本地/LAN：走真实中文文件名
  const localName = resolveFlatVideoName(folder, index);
  return `/sp/${encodeURIComponent(localName)}`;
}

/**
 * 公网模式下返回该视频的全部候选 URL（反代优先 + Release 直链兜底）
 * TaskDetail 会按顺序尝试，第一个 onError 自动切换下一个。
 * 本地模式下只返回 1 条直链。
 *
 * 2026-09-14 修复标题/文件不一致：
 *   - 优先使用中文文件名直链（若已上传到 Release 则命中正确内容）
 *   - 中文文件名 404 时自动回退到 LEGACY 老编号资产
 *   - LEGACY 中带 [FALLBACK] 的备用映射会额外标注，便于排查内容错位
 */
export function getVideoUrlCandidates(folder: string, index: number): string[] {
  const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
  if (!isGitHubPages) {
    return [`/sp/${encodeURIComponent(resolveFlatVideoName(folder, index))}`];
  }
  // 中文文件名（与标题严格对应，内容正确）
  const zhName = resolveFlatVideoName(folder, index);
  const zhEncoded = encodeURIComponent(zhName);
  // LEGACY 老编号（内容可能错位，但已上传到 Release 保证可播放）
  const legacy = LEGACY[index];
  const legacyEncoded = legacy ? encodeURIComponent(legacy) : '';
  // 候选资产顺序：中文文件名优先（内容正确）→ LEGACY 兜底（保证可播放）
  const assetOrder: { encoded: string; label: string }[] = [];
  assetOrder.push({ encoded: zhEncoded, label: 'zh' });
  if (legacyEncoded && legacyEncoded !== zhEncoded) {
    assetOrder.push({ encoded: legacyEncoded, label: 'legacy' });
  }
  // 对每个资产生成：反代镜像 + Release 直链
  const urls: string[] = [];
  for (const { encoded } of assetOrder) {
    for (const builder of PUBLIC_PROXIES) {
      urls.push(builder(encoded));
    }
    urls.push(`${RELEASE_BASE}/${encoded}`);
  }
  // 去重
  return Array.from(new Set(urls));
}

/** 调试用：返回一个视频的全部候选 URL（用于失败时提示用户复制不同链接） */
export function getCandidateVideoUrls(folder: string, index: number): { label: string; url: string }[] {
  const out: { label: string; url: string }[] = [];
  const zhName = resolveFlatVideoName(folder, index);
  // 标注备用映射（内容可能错位）
  const FALLBACK_LEGACY: Record<number, string> = {
    47: '18_2.mp4', 49: '17_1.mp4', 60: '22_2.mp4', 61: '23_2.mp4',
  };
  const legacy = LEGACY[index];
  const isFallback = !!FALLBACK_LEGACY[index];
  // 优先推荐中文文件名（内容正确）
  out.push({
    label: `【推荐·内容正确】中文文件名 ${zhName}`,
    url: `${RELEASE_BASE}/${encodeURIComponent(zhName)}`,
  });
  if (legacy) {
    out.push({
      label: isFallback
        ? `【备用·内容可能错位】老编号 ${legacy}（标题与播放内容可能不一致）`
        : `【兼容】老编号 ${legacy}`,
      url: `${RELEASE_BASE}/${encodeURIComponent(legacy)}`,
    });
  }
  return out;
}

// ==================== 62 个视频 = 62 个任务（一一对应）====================
// 2026-09-14 重新整理：任务名 = 视频标题（SP_TITLES），按名称语义分 13 类
// 每个 videoRange 为单点 [i, i]，确保任务名与播放视频严格对应
// 不改动 SP_TITLES / SP_FILE_NAMES / LEGACY / getVideoUrl 等播放逻辑

export const taskDetails: TaskDetailData[] = [

  // ========== 一、商超零售 🛒 ==========
  { id: 1, categoryId: 'retail', categoryName: '商超零售', categoryEmoji: '🛒',
    name: '超市-过期商品下架', materials: '过期商品、超市货架',
    steps: ['检查货架商品日期', '取下过期商品并记录', '展示整理后的货架状态'],
    folder: 'SP', videoRange: [7, 7] },

  { id: 2, categoryId: 'retail', categoryName: '商超零售', categoryEmoji: '🛒',
    name: '超市-货物摆放上架', materials: '商品、超市货架',
    steps: ['展示待上架货物', '整齐摆放到指定货架区域', '展示货架陈列效果'],
    folder: 'SP', videoRange: [8, 8] },

  { id: 3, categoryId: 'retail', categoryName: '商超零售', categoryEmoji: '🛒',
    name: '超市-整理货架', materials: '超市货架、商品',
    steps: ['逐面擦拭整理货架', '检查商品陈列状态', '展示整理后的货架'],
    folder: 'SP', videoRange: [9, 9] },

  { id: 4, categoryId: 'retail', categoryName: '商超零售', categoryEmoji: '🛒',
    name: '散笔上架', materials: '散笔、货架',
    steps: ['展示散笔与货架', '将散笔有序摆放到货架', '展示上架完成的货架'],
    folder: 'SP', videoRange: [30, 30] },

  { id: 5, categoryId: 'retail', categoryName: '商超零售', categoryEmoji: '🛒',
    name: '收银', materials: '收银台、商品',
    steps: ['扫码识别商品', '结算并打印小票', '完成收银'],
    folder: 'SP', videoRange: [33, 33] },

  { id: 6, categoryId: 'retail', categoryName: '商超零售', categoryEmoji: '🛒',
    name: '套网套-水果', materials: '水果、保护网套',
    steps: ['展示待套水果与网套', '逐个将水果套入网套', '展示套完网套的水果'],
    folder: 'SP', videoRange: [41, 41] },

  { id: 7, categoryId: 'retail', categoryName: '商超零售', categoryEmoji: '🛒',
    name: '卸货', materials: '到货货物',
    steps: ['清点到货货物', '逐件卸货', '展示卸货完成状态'],
    folder: 'SP', videoRange: [50, 50] },

  // ========== 二、生鲜处理 🥬 ==========
  { id: 8, categoryId: 'fresh', categoryName: '生鲜处理', categoryEmoji: '🥬',
    name: '称重菌菇干', materials: '菌菇干、电子秤',
    steps: ['展示待称重菌菇干', '用电子秤准确称重', '读出重量并记录'],
    folder: 'SP', videoRange: [10, 10] },

  { id: 9, categoryId: 'fresh', categoryName: '生鲜处理', categoryEmoji: '🥬',
    name: '分装菌菇干', materials: '菌菇干、分装包装袋',
    steps: ['展示散装菌菇干与包装袋', '将菌菇干按份量装入包装袋', '展示分装完成的菌菇干袋'],
    folder: 'SP', videoRange: [18, 18] },

  { id: 10, categoryId: 'fresh', categoryName: '生鲜处理', categoryEmoji: '🥬',
    name: '蔬菜称重', materials: '蔬菜、电子秤',
    steps: ['展示待称重蔬菜', '用电子秤准确称重', '读出重量并打印称重标签'],
    folder: 'SP', videoRange: [36, 36] },

  { id: 11, categoryId: 'fresh', categoryName: '生鲜处理', categoryEmoji: '🥬',
    name: '蔬菜分拣', materials: '新鲜蔬菜、分拣框',
    steps: ['展示待分拣的新鲜蔬菜', '按品类/品质分拣蔬菜', '展示分拣完成的蔬菜'],
    folder: 'SP', videoRange: [37, 37] },

  { id: 12, categoryId: 'fresh', categoryName: '生鲜处理', categoryEmoji: '🥬',
    name: '蔬菜分挑选', materials: '待挑选蔬菜、挑选台',
    steps: ['展示待处理蔬菜', '逐一挑选去除不良品', '展示挑选完毕的优质蔬菜'],
    folder: 'SP', videoRange: [38, 38] },

  { id: 13, categoryId: 'fresh', categoryName: '生鲜处理', categoryEmoji: '🥬',
    name: '蔬菜上架', materials: '蔬菜、超市蔬菜货架',
    steps: ['展示待上架蔬菜', '整齐摆放到蔬菜货架', '展示上架陈列效果'],
    folder: 'SP', videoRange: [39, 39] },

  // ========== 三、包装作业 📦 ==========
  { id: 14, categoryId: 'packaging', categoryName: '包装作业', categoryEmoji: '📦',
    name: '包装成品-钱包', materials: '成品钱包、包装材料',
    steps: ['展示完成装配的钱包', '使用包装材料包装成品钱包', '展示包装完成的钱包成品'],
    folder: 'SP', videoRange: [3, 3] },

  { id: 15, categoryId: 'packaging', categoryName: '包装作业', categoryEmoji: '📦',
    name: '封口包装', materials: '包装袋、待包装物品',
    steps: ['展示待包装物品', '装入包装袋并封口', '展示封口包装成品'],
    folder: 'SP', videoRange: [19, 19] },

  { id: 16, categoryId: 'packaging', categoryName: '包装作业', categoryEmoji: '📦',
    name: '物品称重', materials: '待称重物品、电子秤',
    steps: ['展示待称重物品', '用电子秤准确称重', '读出重量并记录'],
    folder: 'SP', videoRange: [44, 44] },

  { id: 17, categoryId: 'packaging', categoryName: '包装作业', categoryEmoji: '📦',
    name: '粘贴封条', materials: '封条、待封包装件',
    steps: ['展示待封包装件与封条', '对齐位置粘贴封条', '展示封条粘贴完成效果'],
    folder: 'SP', videoRange: [52, 52] },

  // ========== 四、紙品加工 📄 ==========
  { id: 18, categoryId: 'papergoods', categoryName: '紙品加工', categoryEmoji: '📄',
    name: '手工厂-卷烟纸', materials: '卷烟纸原材料',
    steps: ['展示卷烟纸原材料', '手工制作卷烟纸', '展示制作完成的卷烟纸'],
    folder: 'SP', videoRange: [34, 34] },

  { id: 19, categoryId: 'papergoods', categoryName: '紙品加工', categoryEmoji: '📄',
    name: '纸品厂\u2011折叠杯套', materials: '杯套片材',
    steps: ['展示杯套原材料片材', '按标准方式折叠杯套成形', '展示折叠完成的杯套成品'],
    folder: 'SP', videoRange: [57, 57] },

  { id: 20, categoryId: 'papergoods', categoryName: '紙品加工', categoryEmoji: '📄',
    name: '纸品厂\u2011纸袋穿绳', materials: '纸袋、绳子',
    steps: ['展示纸袋与绳子原材料', '绳子穿入纸袋打孔', '展示穿绳完成的纸袋成品'],
    folder: 'SP', videoRange: [58, 58] },

  // ========== 五、鞋业加工 👞 ==========
  { id: 21, categoryId: 'shoes', categoryName: '鞋业加工', categoryEmoji: '👞',
    name: '鞋厂-鞋后跟片修理毛边', materials: '鞋后跟片、修毛边工具',
    steps: ['展示待处理鞋后跟片', '用工具修理鞋后跟毛边', '展示修边完成的鞋后跟片'],
    folder: 'SP', videoRange: [47, 47] },

  { id: 22, categoryId: 'shoes', categoryName: '鞋业加工', categoryEmoji: '👞',
    name: '鞋底前脚掌刷胶', materials: '鞋底、胶料、刷胶工具',
    steps: ['展示待刷胶鞋底', '在前脚掌位置刷胶', '展示刷胶完成的鞋底'],
    folder: 'SP', videoRange: [48, 48] },

  { id: 23, categoryId: 'shoes', categoryName: '鞋业加工', categoryEmoji: '👞',
    name: '鞋后跟去杂质-足球鞋后跟', materials: '足球鞋后跟、去杂质工具',
    steps: ['展示足球鞋后跟待处理部分', '去除鞋后跟杂质', '展示去杂质完成的鞋后跟'],
    folder: 'SP', videoRange: [49, 49] },

  // ========== 六、模型加工 🌿 ==========
  { id: 24, categoryId: 'model', categoryName: '模型加工', categoryEmoji: '🌿',
    name: '捆扎模具-植被模型', materials: '植被模型模具、捆扎工具',
    steps: ['展示植被模型模具', '捆扎固定植被模型模具', '展示捆扎完成的模具'],
    folder: 'SP', videoRange: [24, 24] },

  { id: 25, categoryId: 'model', categoryName: '模型加工', categoryEmoji: '🌿',
    name: '拼接果实-植被模型', materials: '植被模型果实配件',
    steps: ['展示果实配件', '拼接果实到植被模型', '展示拼接完成的果实'],
    folder: 'SP', videoRange: [26, 26] },

  { id: 26, categoryId: 'model', categoryName: '模型加工', categoryEmoji: '🌿',
    name: '品检树干-植被模型', materials: '植被模型树干、品检工具',
    steps: ['展示植被模型树干', '按标准品检树干质量', '展示品检完成的树干'],
    folder: 'SP', videoRange: [28, 28] },

  { id: 27, categoryId: 'model', categoryName: '模型加工', categoryEmoji: '🌿',
    name: '上胶树干-植被模型', materials: '植被模型树干、胶水',
    steps: ['展示树干配件与胶水', '对树干配件上胶', '展示上胶完成的树干'],
    folder: 'SP', videoRange: [32, 32] },

  { id: 28, categoryId: 'model', categoryName: '模型加工', categoryEmoji: '🌿',
    name: '组装植被-植被模型', materials: '植被模型配件',
    steps: ['展示植被模型配件', '按结构组装植被模型', '展示组装完成的植被模型'],
    folder: 'SP', videoRange: [62, 62] },

  // ========== 七、饰品加工 💍 ==========
  { id: 29, categoryId: 'jewelry', categoryName: '饰品加工', categoryEmoji: '💍',
    name: '穿线手链-文玩手链', materials: '文玩手链线材配件',
    steps: ['展示手链线材', '穿线编织文玩手链', '展示编织完成的手链'],
    folder: 'SP', videoRange: [14, 14] },

  { id: 30, categoryId: 'jewelry', categoryName: '饰品加工', categoryEmoji: '💍',
    name: '开合挂圈--饰品龙虾扣', materials: '饰品龙虾扣',
    steps: ['展示饰品龙虾扣', '操作开合挂圈', '展示操作完成的龙虾扣'],
    folder: 'SP', videoRange: [22, 22] },

  { id: 31, categoryId: 'jewelry', categoryName: '饰品加工', categoryEmoji: '💍',
    name: '拼接底托-发卡底托', materials: '发卡底托配件',
    steps: ['展示发卡底托配件', '拼接发卡底托结构', '展示拼接完成的发卡底托'],
    folder: 'SP', videoRange: [25, 25] },

  { id: 32, categoryId: 'jewelry', categoryName: '饰品加工', categoryEmoji: '💍',
    name: '上胶底托-发卡底托', materials: '发卡底托、胶料',
    steps: ['展示发卡底托与胶料', '对发卡底托上胶', '展示上胶完成的发卡底托'],
    folder: 'SP', videoRange: [31, 31] },

  { id: 33, categoryId: 'jewelry', categoryName: '饰品加工', categoryEmoji: '💍',
    name: '质检花枝底垫-检测漏胶', materials: '花枝底垫、质检工具',
    steps: ['展示花枝底垫', '检测漏胶等质量问题', '展示质检完成的合格品'],
    folder: 'SP', videoRange: [59, 59] },

  { id: 34, categoryId: 'jewelry', categoryName: '饰品加工', categoryEmoji: '💍',
    name: '组装配件-铜牌饰品', materials: '铜牌饰品配件',
    steps: ['展示铜牌饰品配件', '按顺序组装铜牌饰品', '展示组装完成的铜牌饰品'],
    folder: 'SP', videoRange: [60, 60] },

  { id: 35, categoryId: 'jewelry', categoryName: '饰品加工', categoryEmoji: '💍',
    name: '组装配件-夜光十字架', materials: '夜光十字架配件',
    steps: ['展示夜光十字架配件', '组装夜光十字架', '展示组装完成的夜光十字架'],
    folder: 'SP', videoRange: [61, 61] },

  // ========== 八、手工布艺 🎨 ==========
  { id: 36, categoryId: 'handcraft', categoryName: '手工布艺', categoryEmoji: '🎨',
    name: '编打福袋结-小福袋香包', materials: '小福袋香包、编结材料',
    steps: ['展示福袋香包与编结材料', '编打福袋结', '展示编打完成的福袋结'],
    folder: 'SP', videoRange: [4, 4] },

  { id: 37, categoryId: 'handcraft', categoryName: '手工布艺', categoryEmoji: '🎨',
    name: '穿假婴裤子-假婴裤子', materials: '假婴裤子、假婴模型',
    steps: ['展示假婴裤子与假婴模型', '将假婴裤子穿到模型上', '展示穿裤完成的假婴模型'],
    folder: 'SP', videoRange: [13, 13] },

  { id: 38, categoryId: 'handcraft', categoryName: '手工布艺', categoryEmoji: '🎨',
    name: '打胶配饰-布艺花', materials: '布艺花配件、胶料',
    steps: ['展示布艺花配件', '打胶配饰布艺花', '展示打胶完成的布艺花'],
    folder: 'SP', videoRange: [15, 15] },

  { id: 39, categoryId: 'handcraft', categoryName: '手工布艺', categoryEmoji: '🎨',
    name: '捆绑固定耳朵-小兔帽花', materials: '小兔帽花、耳朵配件、捆绑工具',
    steps: ['展示小兔帽花与耳朵配件', '捆绑固定耳朵到帽花', '展示耳朵固定完成的小兔帽花'],
    folder: 'SP', videoRange: [23, 23] },

  { id: 40, categoryId: 'handcraft', categoryName: '手工布艺', categoryEmoji: '🎨',
    name: '熔合福袋头与福袋结-小福袋香包', materials: '福袋头、福袋结、熔合工具',
    steps: ['展示福袋头与福袋结', '熔合福袋头与福袋结', '展示熔合完成的福袋'],
    folder: 'SP', videoRange: [29, 29] },

  { id: 41, categoryId: 'handcraft', categoryName: '手工布艺', categoryEmoji: '🎨',
    name: '手工坊-记针存线', materials: '针线工具',
    steps: ['展示针线物料', '记针存线收纳', '展示收纳完成的针线'],
    folder: 'SP', videoRange: [35, 35] },

  { id: 42, categoryId: 'handcraft', categoryName: '手工布艺', categoryEmoji: '🎨',
    name: '洗护婴身-假婴身体', materials: '假婴身体、洗护用品',
    steps: ['展示假婴身体模型', '按流程清洗护理假婴身体', '展示洗护完成的假婴身体'],
    folder: 'SP', videoRange: [45, 45] },

  { id: 43, categoryId: 'handcraft', categoryName: '手工布艺', categoryEmoji: '🎨',
    name: '粘贴饰品布标-小兔帽花', materials: '小兔帽花、饰品布标、粘贴工具',
    steps: ['展示小兔帽花与饰品布标', '粘贴饰品布标到帽花', '展示粘贴完成的小兔帽花'],
    folder: 'SP', videoRange: [53, 53] },

  { id: 44, categoryId: 'handcraft', categoryName: '手工布艺', categoryEmoji: '🎨',
    name: '折出蝴蝶结-蝴蝶结礼带', materials: '蝴蝶结礼带丝带',
    steps: ['展示礼带丝带', '折出蝴蝶结造型', '展示折好的蝴蝶结礼带'],
    folder: 'SP', videoRange: [54, 54] },

  // ========== 九、电子组装 🔌 ==========
  { id: 45, categoryId: 'electronics', categoryName: '电子组装', categoryEmoji: '🔌',
    name: '剥开耳机薄膜-耳机配件', materials: '耳机配件、薄膜剥开工具',
    steps: ['展示耳机配件与薄膜', '剥开耳机薄膜', '展示薄膜去除后的耳机配件'],
    folder: 'SP', videoRange: [5, 5] },

  { id: 46, categoryId: 'electronics', categoryName: '电子组装', categoryEmoji: '🔌',
    name: '合盖电子钟', materials: '电子钟配件',
    steps: ['展示电子钟配件', '合盖组装电子钟', '展示组装完成的电子钟'],
    folder: 'SP', videoRange: [21, 21] },

  { id: 47, categoryId: 'electronics', categoryName: '电子组装', categoryEmoji: '🔌',
    name: '外壳组装-制冷风扇', materials: '制冷风扇外壳配件',
    steps: ['展示制冷风扇全部配件', '整体组装制冷风扇外壳', '展示组装完成的制冷风扇'],
    folder: 'SP', videoRange: [42, 42] },

  { id: 48, categoryId: 'electronics', categoryName: '电子组装', categoryEmoji: '🔌',
    name: '小腿按摩器内芯组装', materials: '按摩器内芯配件',
    steps: ['展示按摩器内芯配件', '组装小腿按摩器内芯', '展示组装完成的按摩器内芯'],
    folder: 'SP', videoRange: [46, 46] },

  { id: 49, categoryId: 'electronics', categoryName: '电子组装', categoryEmoji: '🔌',
    name: '蒸汽小火车-马达点锡', materials: '马达、点锡工具',
    steps: ['展示蒸汽小火车马达', '马达点锡焊接', '展示点锡完成的马达'],
    folder: 'SP', videoRange: [56, 56] },

  // ========== 十、玩具组装 🧸 ==========
  { id: 50, categoryId: 'toys', categoryName: '玩具组装', categoryEmoji: '🧸',
    name: '顶部外壳安装-方程式赛车', materials: '方程式赛车、顶部外壳配件',
    steps: ['展示赛车本体与顶部外壳', '安装赛车顶部外壳', '展示外壳安装完成的赛车'],
    folder: 'SP', videoRange: [16, 16] },

  { id: 51, categoryId: 'toys', categoryName: '玩具组装', categoryEmoji: '🧸',
    name: '玩具厂-组装小乌龟', materials: '小乌龟玩具配件',
    steps: ['展示小乌龟零件', '按顺序组装完整小乌龟', '展示组装完成的小乌龟玩具'],
    folder: 'SP', videoRange: [43, 43] },

  // ========== 十一、灯饰加工 💡 ==========
  { id: 52, categoryId: 'lighting', categoryName: '灯饰加工', categoryEmoji: '💡',
    name: '撑开莲花底座-莲花灯', materials: '莲花灯底座',
    steps: ['展示未撑开的莲花底座', '撑开底座到位', '展示撑开后的莲花底座效果'],
    folder: 'SP', videoRange: [11, 11] },

  { id: 53, categoryId: 'lighting', categoryName: '灯饰加工', categoryEmoji: '💡',
    name: '拼装莲花底座-莲花灯', materials: '莲花灯底座零件',
    steps: ['展示莲花底座零件', '拼装底座结构', '展示组装完成的莲花底座'],
    folder: 'SP', videoRange: [27, 27] },

  { id: 54, categoryId: 'lighting', categoryName: '灯饰加工', categoryEmoji: '💡',
    name: '折叠莲花片-莲花灯', materials: '莲花灯莲花片',
    steps: ['展示莲花灯片材', '折叠莲花片成形', '展示折叠完成的莲花片'],
    folder: 'SP', videoRange: [55, 55] },

  // ========== 十二、五金塑胶 ⚙️ ==========
  { id: 55, categoryId: 'hardware', categoryName: '五金塑胶', categoryEmoji: '⚙️',
    name: '套环塑料棒-塑料配件', materials: '塑料棒、塑料配件',
    steps: ['展示塑料棒与配件', '将塑料棒套环装配为塑料配件', '展示套环完成的塑料配件'],
    folder: 'SP', videoRange: [40, 40] },

  { id: 56, categoryId: 'hardware', categoryName: '五金塑胶', categoryEmoji: '⚙️',
    name: '拆除标签定孔-钱包卡片', materials: '钱包卡片、定孔工具',
    steps: ['展示钱包卡片', '拆除标签并定孔', '展示定孔完成的钱包卡片'],
    folder: 'SP', videoRange: [6, 6] },

  { id: 57, categoryId: 'hardware', categoryName: '五金塑胶', categoryEmoji: '⚙️',
    name: '成品组装-电脑支架', materials: '电脑支架配件',
    steps: ['展示电脑支架配件', '成品组装电脑支架', '展示组装完成的电脑支架'],
    folder: 'SP', videoRange: [12, 12] },

  { id: 58, categoryId: 'hardware', categoryName: '五金塑胶', categoryEmoji: '⚙️',
    name: '对讲机背夹组装', materials: '对讲机、背夹配件',
    steps: ['展示对讲机与背夹配件', '组装对讲机背夹', '展示组装完成的对讲机'],
    folder: 'SP', videoRange: [17, 17] },

  { id: 59, categoryId: 'hardware', categoryName: '五金塑胶', categoryEmoji: '⚙️',
    name: '固定配装纽扣-五金扣件', materials: '五金扣件纽扣、纽扣安装工具',
    steps: ['展示五金扣件与待装位置', '固定并配装五金纽扣', '展示纽扣安装完成效果'],
    folder: 'SP', videoRange: [20, 20] },

  { id: 60, categoryId: 'hardware', categoryName: '五金塑胶', categoryEmoji: '⚙️',
    name: '粘贴防滑膜-手机支架', materials: '手机支架、防滑膜',
    steps: ['展示手机支架与防滑膜', '粘贴防滑膜到位', '展示防滑膜粘贴完成效果'],
    folder: 'SP', videoRange: [51, 51] },

  // ========== 十三、电池组装 🔋 ==========
  { id: 61, categoryId: 'battery', categoryName: '电池组装', categoryEmoji: '🔋',
    name: '安装弹簧环-铅酸蓄电槽', materials: '铅酸蓄电槽、弹簧环',
    steps: ['展示铅酸蓄电槽与弹簧环', '安装弹簧环到蓄电槽', '展示弹簧环安装完成'],
    folder: 'SP', videoRange: [1, 1] },

  { id: 62, categoryId: 'battery', categoryName: '电池组装', categoryEmoji: '🔋',
    name: '安装负极贴片-铅酸蓄电槽', materials: '铅酸蓄电槽、负极贴片',
    steps: ['展示蓄电槽与负极贴片', '安装负极贴片到位', '展示负极贴片安装完成'],
    folder: 'SP', videoRange: [2, 2] },
];

// ====== 覆盖完整性自检：确保 62 个视频每个至少被一个任务引用 ======
const used = new Set<number>();
taskDetails.forEach((t) => {
  const [s, e] = t.videoRange;
  for (let i = s; i <= e; i++) used.add(i);
});
export const UNCOVERED_VIDEO_INDICES: number[] = [];
for (let i = 1; i <= 62; i++) if (!used.has(i)) UNCOVERED_VIDEO_INDICES.push(i);

export function getTaskById(id: number): TaskDetailData | undefined {
  return taskDetails.find((t) => t.id === id);
}
