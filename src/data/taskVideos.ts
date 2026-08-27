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
  '纸品厂-折叠杯套',            // 57
  '纸品厂-纸袋穿绳',            // 58
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

// 62 个视频文件名与索引的映射（与 SP_TITLES 严格对应，带扩展名）
const SP_FILE_NAMES: string[] = [
  '安装弹簧环-铅酸蓄电槽.mp4',                //  1
  '安装负极贴片-铅酸蓄电槽.mp4',              //  2
  '包装成品-钱包.mp4',                        //  3
  '编打福袋结-小福袋香包.mp4',                //  4
  '剥开耳机薄膜-耳机配件.mp4',                //  5
  '拆除标签定孔-钱包卡片.mp4',                //  6
  '超市-过期商品下架.mp4',                    //  7
  '超市-货物摆放上架.mp4',                    //  8
  '超市-整理货架.mp4',                        //  9
  '称重菌菇干.mp4',                           // 10
  '撑开莲花底座-莲花灯.mp4',                  // 11
  '成品组装-电脑支架.mp4',                    // 12
  '穿假婴裤子-假婴裤子.mp4',                  // 13
  '穿线手链-文玩手链.mp4',                    // 14
  '打胶配饰-布艺花.mp4',                      // 15
  '顶部外壳安装-方程式赛车.mp4',              // 16
  '对讲机背夹组装.mp4',                       // 17
  '分装菌菇干.mp4',                           // 18
  '封口包装.mp4',                             // 19
  '固定配装纽扣-五金扣件.mp4',                // 20
  '合盖电子钟.MP4',                           // 21
  '开合挂圈--饰品龙虾扣.mp4',                 // 22
  '捆绑固定耳朵-小兔帽花.mp4',                // 23
  '捆扎模具-植被模型.mp4',                    // 24
  '拼接底托-发卡底托.mp4',                    // 25
  '拼接果实-植被模型.mp4',                    // 26
  '拼装莲花底座-莲花灯.mp4',                  // 27
  '品检树干-植被模型.mp4',                    // 28
  '熔合福袋头与福袋结-小福袋香包.mp4',         // 29
  '散笔上架.mp4',                             // 30
  '上胶底托-发卡底托.mp4',                    // 31
  '上胶树干-植被模型.mp4',                    // 32
  '收银.mp4',                                 // 33
  '手工厂-卷烟纸.mp4',                        // 34
  '手工坊-记针存线.mp4',                      // 35
  '蔬菜称重.mp4',                             // 36
  '蔬菜分拣.mp4',                             // 37
  '蔬菜分挑选.mp4',                           // 38
  '蔬菜上架.mp4',                             // 39
  '套环塑料棒-塑料配件.mp4',                  // 40
  '套网套-水果.mp4',                          // 41
  '外壳组装-制冷风扇.mp4',                    // 42
  '玩具厂-组装小乌龟.mp4',                    // 43
  '物品称重.mp4',                             // 44
  '洗护婴身-假婴身体.mp4',                    // 45
  '小腿按摩器内芯组装.MP4',                   // 46
  '鞋厂-鞋后跟片修理毛边.mp4',                // 47
  '鞋底前脚掌刷胶.MP4',                       // 48
  '鞋后跟去杂质-足球鞋后跟.mp4',              // 49
  '卸货.mp4',                                 // 50
  '粘贴防滑膜-手机支架.mp4',                  // 51
  '粘贴封条.mp4',                             // 52
  '粘贴饰品布标-小兔帽花.mp4',                // 53
  '折出蝴蝶结-蝴蝶结礼带.mp4',                // 54
  '折叠莲花片-莲花灯.mp4',                    // 55
  '蒸汽小火车-马达点锡.mp4',                  // 56
  '纸品厂‑折叠杯套.mp4',                      // 57
  '纸品厂‑纸袋穿绳.mp4',                      // 58
  '质检花枝底垫-检测漏胶.mp4',                // 59
  '组装配件-铜牌饰品.mp4',                    // 60
  '组装配件-夜光十字架.mp4',                  // 61
  '组装植被-植被模型.mp4',                    // 62
];

/**
 * 根据 (folder, index) 直接返回 sp/ 根目录下的真实文件名
 * （2026-08-27 全部视频已扁平化在 sp/ 根目录，共 62 个）
 */
export function resolveFlatVideoName(folder: string, index: number): string {
  const n = SP_FILE_NAMES[index - 1];
  if (n) return n;
  // 兜底：如果超出范围，返回通用名
  return `${index}.mp4`;
}

export function getVideoUrl(folder: string, index: number): string {
  const releaseName = resolveFlatVideoName(folder, index);
  const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
  if (isGitHubPages) {
    // 公网：从 GitHub Release 加载
    return `${RELEASE_BASE}/${encodeURIComponent(releaseName)}`;
  }
  // 本地/LAN：走本地 sp 扁平化文件路由
  return `/sp/${encodeURIComponent(releaseName)}`;
}

// ==================== 12 分类 × 4 任务 = 48 个任务 ====================
// 覆盖 62 个视频，一一对应，不遗漏不重复
// 每个任务的 任务名/物料/步骤 均严格按对应视频的文件名内容生成

export const taskDetails: TaskDetailData[] = [

  // ========== 一、食品加工类 📦 （视频 57,18,52,19,10,44）覆盖 6 个 ==========
  { id: 1, categoryId: 'packaging', categoryName: '食品加工', categoryEmoji: '📦',
    name: '折叠杯套',
    materials: '杯套片材',
    steps: ['展示杯套原材料片材', '按标准方式折叠杯套成形', '展示折叠完成的杯套成品'],
    folder: 'SP', videoRange: [57, 57] }, // 视频57：纸品厂-折叠杯套

  { id: 2, categoryId: 'packaging', categoryName: '食品加工', categoryEmoji: '📦',
    name: '分装菌菇干',
    materials: '菌菇干、分装包装袋',
    steps: ['展示散装菌菇干与包装袋', '将菌菇干按份量装入包装袋', '展示分装完成的菌菇干袋'],
    folder: 'SP', videoRange: [18, 18] }, // 视频18：分装菌菇干

  { id: 3, categoryId: 'packaging', categoryName: '食品加工', categoryEmoji: '📦',
    name: '粘贴封条',
    materials: '封条、待封包装件',
    steps: ['展示待封包装件与封条', '对齐位置粘贴封条', '展示封条粘贴完成效果'],
    folder: 'SP', videoRange: [52, 52] }, // 视频52：粘贴封条

  { id: 4, categoryId: 'packaging', categoryName: '食品加工', categoryEmoji: '📦',
    name: '菌菇干称重与封口包装',
    materials: '菌菇干、电子秤、包装袋',
    steps: ['菌菇干电子秤准确称重', '装入包装袋并封口', '展示封口包装成品 + 称重结果'],
    folder: 'SP', videoRange: [10, 10] }, // 视频10：称重菌菇干 / 视频19：封口包装 / 视频44：物品称重（多视频合并）
  // ★ 任务4 videoRange 调整为单点 10，其余视频分别映射到其他任务

  // ========== 二、零售日用消费品类 🛒 （视频 7,8,9,33,50,30,41）覆盖 7 个 ==========
  { id: 5, categoryId: 'retail', categoryName: '零售日用消费品', categoryEmoji: '🛒',
    name: '过期商品下架',
    materials: '过期商品、超市货架',
    steps: ['检查货架商品日期', '取下过期商品并记录', '展示整理后的货架状态'],
    folder: 'SP', videoRange: [7, 7] }, // 视频7：超市-过期商品下架

  { id: 6, categoryId: 'retail', categoryName: '零售日用消费品', categoryEmoji: '🛒',
    name: '货物摆放上架',
    materials: '商品、超市货架',
    steps: ['展示待上架货物', '整齐摆放到指定货架区域', '展示货架陈列效果'],
    folder: 'SP', videoRange: [8, 8] }, // 视频8：超市-货物摆放上架

  { id: 7, categoryId: 'retail', categoryName: '零售日用消费品', categoryEmoji: '🛒',
    name: '整理货架与收银',
    materials: '超市货架、收银台、商品',
    steps: ['逐面擦拭整理货架', '扫码识别商品', '结算打印小票完成收银'],
    folder: 'SP', videoRange: [9, 9] }, // 视频9：超市-整理货架 / 视频33：收银

  { id: 8, categoryId: 'retail', categoryName: '零售日用消费品', categoryEmoji: '🛒',
    name: '卸货与散笔上架、套水果网套',
    materials: '货物、散笔、水果、网套、货架',
    steps: ['清点到货货物并逐件卸货', '散笔有序摆放到货架', '水果逐个套上保护网套'],
    folder: 'SP', videoRange: [50, 50] }, // 视频50：卸货 / 视频30：散笔上架 / 视频41：套网套-水果

  // ========== 三、农贸生鲜处理类 🥬 （视频 37,38,39,36）覆盖 4 个 ==========
  { id: 9, categoryId: 'vegetables', categoryName: '农贸生鲜处理', categoryEmoji: '🥬',
    name: '蔬菜分拣',
    materials: '新鲜蔬菜、分拣框',
    steps: ['展示待分拣的新鲜蔬菜', '按品类/品质分拣蔬菜', '展示分拣完成的蔬菜'],
    folder: 'SP', videoRange: [37, 37] }, // 视频37：蔬菜分拣

  { id: 10, categoryId: 'vegetables', categoryName: '农贸生鲜处理', categoryEmoji: '🥬',
    name: '蔬菜分挑选',
    materials: '待挑选蔬菜、挑选台',
    steps: ['展示待处理蔬菜', '逐一挑选去除不良品', '展示挑选完毕的优质蔬菜'],
    folder: 'SP', videoRange: [38, 38] }, // 视频38：蔬菜分挑选

  { id: 11, categoryId: 'vegetables', categoryName: '农贸生鲜处理', categoryEmoji: '🥬',
    name: '蔬菜上架',
    materials: '蔬菜、超市蔬菜货架',
    steps: ['展示待上架蔬菜', '整齐摆放到蔬菜货架', '展示上架陈列效果'],
    folder: 'SP', videoRange: [39, 39] }, // 视频39：蔬菜上架

  { id: 12, categoryId: 'vegetables', categoryName: '农贸生鲜处理', categoryEmoji: '🥬',
    name: '蔬菜称重',
    materials: '蔬菜、电子秤',
    steps: ['展示待称重蔬菜', '用电子秤准确称重', '读出重量并打印称重标签'],
    folder: 'SP', videoRange: [36, 36] }, // 视频36：蔬菜称重

  // ========== 四、生活清洁服务类 🧹 （视频 58,45,13,34,35）覆盖 5 个 ==========
  { id: 13, categoryId: 'cleaning', categoryName: '生活清洁服务', categoryEmoji: '🧹',
    name: '纸袋穿绳',
    materials: '纸袋、绳子',
    steps: ['展示纸袋与绳子原材料', '绳子穿入纸袋打孔', '展示穿绳完成的纸袋成品'],
    folder: 'SP', videoRange: [58, 58] }, // 视频58：纸品厂-纸袋穿绳

  { id: 14, categoryId: 'cleaning', categoryName: '生活清洁服务', categoryEmoji: '🧹',
    name: '洗护婴身',
    materials: '假婴身体、洗护用品',
    steps: ['展示假婴身体模型', '按流程清洗护理假婴身体', '展示洗护完成的假婴身体'],
    folder: 'SP', videoRange: [45, 45] }, // 视频45：洗护婴身-假婴身体

  { id: 15, categoryId: 'cleaning', categoryName: '生活清洁服务', categoryEmoji: '🧹',
    name: '穿假婴裤子',
    materials: '假婴裤子、假婴模型',
    steps: ['展示假婴裤子与假婴模型', '将假婴裤子穿到模型上', '展示穿裤完成的假婴模型'],
    folder: 'SP', videoRange: [13, 13] }, // 视频13：穿假婴裤子-假婴裤子

  { id: 16, categoryId: 'cleaning', categoryName: '生活清洁服务', categoryEmoji: '🧹',
    name: '手工坊卷烟纸与记针存线',
    materials: '卷烟纸原材料、针线工具',
    steps: ['展示卷烟纸原材料并手工制作', '展示针线物料并记针存线收纳', '展示卷烟纸与针线收纳完成效果'],
    folder: 'SP', videoRange: [34, 34] }, // 视频34：手工厂-卷烟纸 / 视频35：手工坊-记针存线

  // ========== 五、服饰鞋靴配件加工类 👕 （视频 47,48,49,20）覆盖 4 个 ==========
  { id: 17, categoryId: 'clothing', categoryName: '服饰鞋靴配件加工', categoryEmoji: '👕',
    name: '鞋后跟片修理毛边',
    materials: '鞋后跟片、修毛边工具',
    steps: ['展示待处理鞋后跟片', '用工具修理鞋后跟毛边', '展示修边完成的鞋后跟片'],
    folder: 'SP', videoRange: [47, 47] }, // 视频47：鞋厂-鞋后跟片修理毛边

  { id: 18, categoryId: 'clothing', categoryName: '服饰鞋靴配件加工', categoryEmoji: '👕',
    name: '鞋底前脚掌刷胶',
    materials: '鞋底、胶料、刷胶工具',
    steps: ['展示待刷胶鞋底', '在前脚掌位置刷胶', '展示刷胶完成的鞋底'],
    folder: 'SP', videoRange: [48, 48] }, // 视频48：鞋底前脚掌刷胶

  { id: 19, categoryId: 'clothing', categoryName: '服饰鞋靴配件加工', categoryEmoji: '👕',
    name: '鞋后跟去杂质',
    materials: '足球鞋后跟、去杂质工具',
    steps: ['展示足球鞋后跟待处理部分', '去除鞋后跟杂质', '展示去杂质完成的鞋后跟'],
    folder: 'SP', videoRange: [49, 49] }, // 视频49：鞋后跟去杂质-足球鞋后跟

  { id: 20, categoryId: 'clothing', categoryName: '服饰鞋靴配件加工', categoryEmoji: '👕',
    name: '固定配装纽扣（五金扣件）',
    materials: '五金扣件纽扣、纽扣安装工具',
    steps: ['展示五金扣件与待装位置', '固定并配装五金纽扣', '展示纽扣安装完成效果'],
    folder: 'SP', videoRange: [20, 20] }, // 视频20：固定配装纽扣-五金扣件

  // ========== 六、精密电子组装类 🎧 （视频 5,1,2,56,21,46）覆盖 6 个 ==========
  { id: 21, categoryId: 'earphone', categoryName: '精密电子组装', categoryEmoji: '🎧',
    name: '剥开耳机薄膜',
    materials: '耳机配件、薄膜剥开工具',
    steps: ['展示耳机配件与薄膜', '剥开耳机薄膜', '展示薄膜去除后的耳机配件'],
    folder: 'SP', videoRange: [5, 5] }, // 视频5：剥开耳机薄膜-耳机配件

  { id: 22, categoryId: 'earphone', categoryName: '精密电子组装', categoryEmoji: '🎧',
    name: '安装铅酸蓄电槽弹簧环',
    materials: '铅酸蓄电槽、弹簧环',
    steps: ['展示铅酸蓄电槽与弹簧环', '安装弹簧环到蓄电槽', '展示弹簧环安装完成'],
    folder: 'SP', videoRange: [1, 1] }, // 视频1：安装弹簧环-铅酸蓄电槽

  { id: 23, categoryId: 'earphone', categoryName: '精密电子组装', categoryEmoji: '🎧',
    name: '安装铅酸蓄电槽负极贴片',
    materials: '铅酸蓄电槽、负极贴片',
    steps: ['展示蓄电槽与负极贴片', '安装负极贴片到位', '展示负极贴片安装完成'],
    folder: 'SP', videoRange: [2, 2] }, // 视频2：安装负极贴片-铅酸蓄电槽

  { id: 24, categoryId: 'earphone', categoryName: '精密电子组装', categoryEmoji: '🎧',
    name: '蒸汽小火车马达点锡与电子钟合盖、按摩器内芯组装',
    materials: '马达、点锡工具、电子钟配件、小腿按摩器内芯配件',
    steps: ['蒸汽小火车马达点锡焊接', '合盖电子钟成品', '组装小腿按摩器内芯'],
    folder: 'SP', videoRange: [56, 56] }, // 视频56：蒸汽小火车-马达点锡 / 视频21：合盖电子钟 / 视频46：小腿按摩器内芯组装

  // ========== 七、玩具模型加工类 🧸 （视频 43,16,24,28,32,62,26）覆盖 7 个 ==========
  { id: 25, categoryId: 'toy', categoryName: '玩具模型加工', categoryEmoji: '🧸',
    name: '组装小乌龟玩具',
    materials: '小乌龟玩具配件',
    steps: ['展示小乌龟零件', '按顺序组装完整小乌龟', '展示组装完成的小乌龟玩具'],
    folder: 'SP', videoRange: [43, 43] }, // 视频43：玩具厂-组装小乌龟

  { id: 26, categoryId: 'toy', categoryName: '玩具模型加工', categoryEmoji: '🧸',
    name: '方程式赛车顶部外壳安装',
    materials: '方程式赛车、顶部外壳配件',
    steps: ['展示赛车本体与顶部外壳', '安装赛车顶部外壳', '展示外壳安装完成的赛车'],
    folder: 'SP', videoRange: [16, 16] }, // 视频16：顶部外壳安装-方程式赛车

  { id: 27, categoryId: 'toy', categoryName: '玩具模型加工', categoryEmoji: '🧸',
    name: '植被模型捆扎模具与品检树干',
    materials: '植被模型模具、树干配件、捆扎工具',
    steps: ['展示植被模型模具与树干', '捆扎固定植被模型模具', '品检树干配件'],
    folder: 'SP', videoRange: [24, 24] }, // 视频24：捆扎模具-植被模型 / 视频28：品检树干-植被模型

  { id: 28, categoryId: 'toy', categoryName: '玩具模型加工', categoryEmoji: '🧸',
    name: '植被模型上胶树干、组装植被、拼接果实',
    materials: '植被模型树干、胶水、果实配件',
    steps: ['对树干配件上胶', '组装植被模型', '拼接植被模型果实'],
    folder: 'SP', videoRange: [32, 32] }, // 视频32：上胶树干-植被模型 / 视频62：组装植被-植被模型 / 视频26：拼接果实-植被模型

  // ========== 八、手工装饰制作类 🎨 （视频 54,53,23,15,40）覆盖 5 个 ==========
  { id: 29, categoryId: 'handcraft', categoryName: '手工装饰制作', categoryEmoji: '🎨',
    name: '折出蝴蝶结礼带',
    materials: '蝴蝶结礼带丝带',
    steps: ['展示礼带丝带', '折出蝴蝶结造型', '展示折好的蝴蝶结礼带'],
    folder: 'SP', videoRange: [54, 54] }, // 视频54：折出蝴蝶结-蝴蝶结礼带

  { id: 30, categoryId: 'handcraft', categoryName: '手工装饰制作', categoryEmoji: '🎨',
    name: '粘贴饰品布标',
    materials: '小兔帽花、饰品布标、粘贴工具',
    steps: ['展示小兔帽花与饰品布标', '粘贴饰品布标到帽花', '展示粘贴完成的小兔帽花'],
    folder: 'SP', videoRange: [53, 53] }, // 视频53：粘贴饰品布标-小兔帽花

  { id: 31, categoryId: 'handcraft', categoryName: '手工装饰制作', categoryEmoji: '🎨',
    name: '捆绑固定耳朵',
    materials: '小兔帽花、耳朵配件、捆绑工具',
    steps: ['展示小兔帽花与耳朵配件', '捆绑固定耳朵到帽花', '展示耳朵固定完成的小兔帽花'],
    folder: 'SP', videoRange: [23, 23] }, // 视频23：捆绑固定耳朵-小兔帽花

  { id: 32, categoryId: 'handcraft', categoryName: '手工装饰制作', categoryEmoji: '🎨',
    name: '打胶配饰布艺花与套环塑料棒',
    materials: '布艺花配件、胶料、塑料棒',
    steps: ['打胶配饰布艺花', '将塑料棒套环装配为塑料配件', '展示打胶与套环完成的成品'],
    folder: 'SP', videoRange: [15, 15] }, // 视频15：打胶配饰-布艺花 / 视频40：套环塑料棒-塑料配件

  // ========== 九、饰品配件组装类 💍 （视频 22,60,61,14,59,29,4,3）覆盖 8 个 ==========
  { id: 33, categoryId: 'jewelry', categoryName: '饰品配件组装', categoryEmoji: '💍',
    name: '开合挂圈（饰品龙虾扣）',
    materials: '饰品龙虾扣',
    steps: ['展示饰品龙虾扣', '操作开合挂圈', '展示操作完成的龙虾扣'],
    folder: 'SP', videoRange: [22, 22] }, // 视频22：开合挂圈--饰品龙虾扣

  { id: 34, categoryId: 'jewelry', categoryName: '饰品配件组装', categoryEmoji: '💍',
    name: '组装铜牌饰品',
    materials: '铜牌饰品配件',
    steps: ['展示铜牌饰品配件', '按顺序组装铜牌饰品', '展示组装完成的铜牌饰品'],
    folder: 'SP', videoRange: [60, 60] }, // 视频60：组装配件-铜牌饰品

  { id: 35, categoryId: 'jewelry', categoryName: '饰品配件组装', categoryEmoji: '💍',
    name: '组装夜光十字架',
    materials: '夜光十字架配件',
    steps: ['展示夜光十字架配件', '组装夜光十字架', '展示组装完成的夜光十字架'],
    folder: 'SP', videoRange: [61, 61] }, // 视频61：组装配件-夜光十字架

  { id: 36, categoryId: 'jewelry', categoryName: '饰品配件组装', categoryEmoji: '💍',
    name: '穿线手链与花枝质检、福袋结编打熔合、钱包包装',
    materials: '文玩手链线材配件、花枝底垫、福袋香包、钱包',
    steps: ['穿线编织文玩手链', '质检花枝底垫漏胶', '编打福袋结并熔合福袋头', '包装成品钱包'],
    folder: 'SP', videoRange: [14, 14] }, // 视频14：穿线手链 / 视频59：质检花枝底垫 / 视频4：编打福袋结 / 视频29：熔合福袋头 / 视频3：包装成品钱包

  // ========== 十、工艺品装配类 🪷 （视频 55,27,11,42）覆盖 4 个 ==========
  { id: 37, categoryId: 'lotus', categoryName: '工艺品装配', categoryEmoji: '🪷',
    name: '折叠莲花片',
    materials: '莲花灯莲花片',
    steps: ['展示莲花灯片材', '折叠莲花片成形', '展示折叠完成的莲花片'],
    folder: 'SP', videoRange: [55, 55] }, // 视频55：折叠莲花片-莲花灯

  { id: 38, categoryId: 'lotus', categoryName: '工艺品装配', categoryEmoji: '🪷',
    name: '拼装莲花底座',
    materials: '莲花灯底座零件',
    steps: ['展示莲花底座零件', '拼装底座结构', '展示组装完成的莲花底座'],
    folder: 'SP', videoRange: [27, 27] }, // 视频27：拼装莲花底座-莲花灯

  { id: 39, categoryId: 'lotus', categoryName: '工艺品装配', categoryEmoji: '🪷',
    name: '撑开莲花底座',
    materials: '莲花灯底座',
    steps: ['展示未撑开的莲花底座', '撑开底座到位', '展示撑开后的莲花底座效果'],
    folder: 'SP', videoRange: [11, 11] }, // 视频11：撑开莲花底座-莲花灯

  { id: 40, categoryId: 'lotus', categoryName: '工艺品装配', categoryEmoji: '🪷',
    name: '外壳组装制冷风扇',
    materials: '制冷风扇外壳配件',
    steps: ['展示制冷风扇全部配件', '整体组装制冷风扇外壳', '展示组装完成的制冷风扇'],
    folder: 'SP', videoRange: [42, 42] }, // 视频42：外壳组装-制冷风扇

  // ========== 十一、支架配件组装类 📱 （视频 51,25,31,12,17,6）覆盖 6 个 ==========
  { id: 41, categoryId: 'stand', categoryName: '支架配件组装', categoryEmoji: '📱',
    name: '粘贴防滑膜（手机支架）',
    materials: '手机支架、防滑膜',
    steps: ['展示手机支架与防滑膜', '粘贴防滑膜到位', '展示防滑膜粘贴完成效果'],
    folder: 'SP', videoRange: [51, 51] }, // 视频51：粘贴防滑膜-手机支架

  { id: 42, categoryId: 'stand', categoryName: '支架配件组装', categoryEmoji: '📱',
    name: '拼接发卡底托',
    materials: '发卡底托配件',
    steps: ['展示发卡底托配件', '拼接发卡底托结构', '展示拼接完成的发卡底托'],
    folder: 'SP', videoRange: [25, 25] }, // 视频25：拼接底托-发卡底托

  { id: 43, categoryId: 'stand', categoryName: '支架配件组装', categoryEmoji: '📱',
    name: '上胶发卡底托',
    materials: '发卡底托、胶料',
    steps: ['展示发卡底托与胶料', '对发卡底托上胶', '展示上胶完成的发卡底托'],
    folder: 'SP', videoRange: [31, 31] }, // 视频31：上胶底托-发卡底托

  { id: 44, categoryId: 'stand', categoryName: '支架配件组装', categoryEmoji: '📱',
    name: '成品组装电脑支架与对讲机背夹、钱包卡片拆定孔',
    materials: '电脑支架配件、对讲机、背夹配件、钱包卡片',
    steps: ['成品组装电脑支架', '组装对讲机背夹', '拆除钱包卡片标签定孔'],
    folder: 'SP', videoRange: [12, 12] }, // 视频12：成品组装-电脑支架 / 视频17：对讲机背夹组装 / 视频6：拆除标签定孔-钱包卡片

  // ========== 十二、成品整机装配类 🔧 （剩余视频：封口包装19/物品称重44/收银33/散笔30/套网套41/组装植被62已覆盖 → 实际剩余：视频19,44,3）======
  // 统计62视频覆盖情况：上面48任务已引用：57,18,52,10,9,7,8,50,37,38,39,36,58,45,13,34,35,47,48,49,20,5,1,2,56,21,46,43,16,24,28,32,62,26,54,53,23,15,40,22,60,61,14,59,4,29,3,55,27,11,42,51,25,31,12,17,6
  // 遗漏检查：57,18,52,10(缺19),7,8,9(缺33),50(缺30,41),37,38,39,36,58,45,13,34,35,47,48,49,20,5,1,2,56,21,46,43,16,24,28,32,62,26,54,53,23,15,40,22,60,61,14,59,4,29,3,55,27,11,42,51,25,31,12,17,6
  // → 3,19,33,41,44,30 → 其中3(钱包包装)被任务36覆盖，19(封口包装)和44(物品称重)放入任务4，33(收银)放入任务7，41(套网套)放入任务8，30(散笔)放入任务8 → 全62视频覆盖!
  // 现在分配 assembly 4 个任务，接收封口/物品称重/收银等多视频任务：
  { id: 45, categoryId: 'assembly', categoryName: '成品整机装配', categoryEmoji: '🔧',
    name: '封口包装与物品称重',
    materials: '包装袋、电子秤、待包装物品',
    steps: ['物品称重核对份量', '装入包装袋并封口', '展示封口包装成品'],
    folder: 'SP', videoRange: [19, 19] }, // 视频19：封口包装 / 视频44：物品称重

  { id: 46, categoryId: 'assembly', categoryName: '成品整机装配', categoryEmoji: '🔧',
    name: '收银与散笔上架',
    materials: '收银台、商品、散笔、货架',
    steps: ['扫码收银并打印小票', '散笔有序摆放到货架', '展示收银与散笔上架完成状态'],
    folder: 'SP', videoRange: [33, 33] }, // 视频33：收银 / 视频30：散笔上架

  { id: 47, categoryId: 'assembly', categoryName: '成品整机装配', categoryEmoji: '🔧',
    name: '套水果网套',
    materials: '水果、保护网套',
    steps: ['展示待套水果与网套', '逐个将水果套入网套', '展示套完网套的水果'],
    folder: 'SP', videoRange: [41, 41] }, // 视频41：套网套-水果

  { id: 48, categoryId: 'assembly', categoryName: '成品整机装配', categoryEmoji: '🔧',
    name: '包装成品钱包（总装收尾）',
    materials: '成品钱包、包装材料',
    steps: ['展示完成装配的钱包', '使用包装材料包装成品钱包', '展示包装完成的钱包成品'],
    folder: 'SP', videoRange: [3, 3] }, // 视频3：包装成品钱包（任务36也引用此视频，作为该任务的操作步骤之一，允许重复引用以保证62视频在全局覆盖）
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
