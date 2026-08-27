// 任务数据 & 视频映射（2026-08-26 根据 sp/DF、sp/ST、sp/sw 解说文档 + AT.docx + df.docx 全行业场景重新设计）

export interface VideoInfo {
  folder: string;   // 文件夹：'DF' | 'ST' | 'SW' | '1' | '2'
  index: number;    // 视频编号
  title: string;    // 视频标题
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
  videoRange: [number, number]; // 视频编号范围
}

// ====== 视频标题库（从各文件夹解说/说明逐字提取） ======

const DF_TITLES: string[] = [
  '纸品厂-折叠杯套',    // 1
  '称重菌菇干',         // 2
  '粘贴封条',           // 3
  '封口包装',           // 4
  '纸品厂-纸袋穿绳',    // 5
  '眼镜片擦拭清洁',     // 6
  '折毛巾',             // 7
  '过期商品下架',       // 8
  '货物摆放上架',       // 9
  '点锡蒸汽小火车马达', // 10
  '居家洗衣服场景',     // 11
  '组装玩具战锤整体外壳',// 12
  '擦拭货架',           // 13
  '收银',               // 14
  '鞋底分挑(白色鞋底网格架)', // 15 ✓已按实际视频画面校对
  '优选购-蔬菜清理',    // 16
  '优选购-蔬菜清理',    // 17
  '玩具厂-组装小乌龟',  // 18
  '生活超市-卸货',      // 19
  '生活超市-称重',      // 20
  '绿富达-蔬菜上架',    // 21
  '绿富达-蔬菜称重',    // 22
  '桥头手工坊-绑线内笼',// 23
];

const ST_TITLES: string[] = [
  '旋运动服纽扣',        // 1
  '旋包袋纽扣',          // 2
  '箱包纽扣磨边',        // 3
  '塑料玩具组装',        // 4
  '有线耳机插头压制',    // 5
  '玩具模型上色',        // 6
  '玩具模型加工',        // 7
  '玩具组装',            // 8
  '颈挂蓝牙耳机控制壳安装',// 9
  '耳机听筒组装',        // 10
  '蝴蝶结折叠',          // 11
  '塑料安装',            // 12
  '服装出入库扫码',      // 13
  '(空缺14)',            // 14
  '鞋底分拣',            // 15
  '汽车按摩垫振动器安装',// 16
  '擦拭闹钟',            // 17
  '袋子粘合',            // 18
];

const SW_TITLES: string[] = [
  '开合挂圈-饰品龙虾扣','组装配件-钥匙扣','分装饰品-铜铃成品','固定配装纽扣-五金扣件','剥开耳机薄膜-耳机配件',
  '质检花枝底垫-检测漏胶','蒸汽小火车-马达点锡','洗护婴身-假婴身体','护理婴儿-假婴身体','穿假婴裤子-假婴裤子',
  '安装弹簧环-铅酸蓄电槽','安装负极贴片-铅酸蓄电槽','折叠莲花片-莲花灯','拼装莲花底座-莲花灯','撑开莲花底座-莲花灯',
  '整理莲花花片-莲花灯','整体组装-喷雾小风扇','焊接电线-251伏电池','外壳组装-制冷风扇','鞋后跟去杂质-足球鞋后跟',
  '鞋后跟撕胶-足球鞋后跟','鞋后跟贴胶-足球鞋后跟','挑除空洞-PCB板绝缘垫','拆扯PCB垫-PCB板绝缘垫','打胶配饰-布艺花',
  '顶部外壳安装-方程式赛车','成品组装-方程式赛车','宝箱安装-方程式赛车','穿线手链-文玩手链','拼接底托-发卡底托',
  '上胶底托-发卡底托','粘贴防滑膜-手机支架','组装支体-手机支架','成品组装-电脑支架','摘出树干-植被模型',
  '品检树干-植被模型','上胶树干-植被模型','组装植被-植被模型','拼接果实-植被模型','对讲机背夹组装',
  '折出蝴蝶结-蝴蝶结礼带','固定蝴蝶结-蝴蝶结礼带','安装玩具车-车轮','贴标配件-八爪支架','打胶固定领带-小兔帽花',
  '粘贴饰品布标-小兔帽花','拆除标签定孔-钱包卡片','组装卡片-钱包','包装成品-钱包','编打福袋结-小福袋香包',
  '熔合福袋头与福袋结-小福袋香包',
];

export function getVideoTitle(folder: string, index: number): string {
  let titles: string[] = [];
  if (folder === 'DF') titles = DF_TITLES;
  else if (folder === 'ST') titles = ST_TITLES;
  else if (folder === 'SW') titles = SW_TITLES;
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

/**
 * 把 (folder, index) 映射成 sp/ 根目录下的真实扁平文件名
 * （因为目录结构丢失，sp 现在是扁平化的，使用以下优先级匹配：
 *   DF N → N.mp4 → N.MP4
 *   ST N → N.MP4 → N.mp4 → N_1.mp4
 *   sw N → N_2.mp4 → N.mp4
 *  任意查找均不区分扩展名大小写）
 */
export function resolveFlatVideoName(folder: string, index: number): string {
  const f = folder.toUpperCase();
  const n = index.toString();
  const candidates: string[] = [];
  if (f === 'DF' || f === '1') {
    candidates.push(`${n}.mp4`, `${n}.MP4`, `${n}_1.mp4`, `${n}_2.mp4`);
  } else if (f === 'ST' || f === '2') {
    candidates.push(`${n}.MP4`, `${n}.mp4`, `${n}_1.MP4`, `${n}_1.mp4`, `${n}_2.mp4`);
  } else { // SW / sw
    candidates.push(`${n}_2.mp4`, `${n}_2.MP4`, `${n}.mp4`, `${n}.MP4`, `${n}_1.mp4`);
  }
  // 注意：真正的文件存在性由运行时（本地服务器或浏览器加载 Release 时）处理。
  // 这里只返回首选名，GitHub Release 上会上传所有候选名的实际文件。
  return candidates[0];
}

export function getVideoUrl(folder: string, index: number): string {
  const releaseName = resolveFlatVideoName(folder, index);
  const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
  if (isGitHubPages) {
    // 公网：从 GitHub Release 加载
    return `${RELEASE_BASE}/${encodeURIComponent(releaseName)}`;
  }
  // 本地/LAN：走本地 sp 路由（start-server 会按扁平化回退查找）
  return `/sp/${folder.toLowerCase()}/${index}.mp4`;
}

// ==================== 12 分类 × 4 任务 = 48 个任务 ====================
// 每个任务只对应自己的视频编号，严格匹配 sp/*/解说.txt 原文

export const taskDetails: TaskDetailData[] = [

  // ========== 一、食品加工类（DF 1-4）每个任务对应自己的视频 ==========
  { id: 1, categoryId: 'packaging', categoryName: '食品加工', categoryEmoji: '📦', name: '折叠杯套', materials: '杯套片材', steps: ['展示杯套原材料', '按标准方式折叠杯套', '展示折叠完成的杯套'], folder: 'DF', videoRange: [1, 1] },
  { id: 2, categoryId: 'packaging', categoryName: '食品加工', categoryEmoji: '📦', name: '菌菇干称重', materials: '菌菇干、电子秤', steps: ['展示待称重菌菇干', '用电子秤准确称重', '展示称重结果与记录'], folder: 'DF', videoRange: [2, 2] },
  { id: 3, categoryId: 'packaging', categoryName: '食品加工', categoryEmoji: '📦', name: '粘贴封条', materials: '封条、待封包装件', steps: ['展示待封物品', '对齐位置粘贴封条', '展示封条粘贴完成效果'], folder: 'DF', videoRange: [3, 3] },
  { id: 4, categoryId: 'packaging', categoryName: '食品加工', categoryEmoji: '📦', name: '封口包装', materials: '包装袋、待封物品', steps: ['展示待包装物品', '装入包装袋并封口', '展示封口包装成品'], folder: 'DF', videoRange: [4, 4] },

  // ========== 二、零售日用消费品类（DF 8-9, 14-15）==========
  { id: 5, categoryId: 'retail', categoryName: '零售日用消费品', categoryEmoji: '🛒', name: '过期商品下架', materials: '过期商品、货架', steps: ['检查货架商品日期', '取下过期商品记录', '展示整理后的货架'], folder: 'DF', videoRange: [8, 8] },
  { id: 6, categoryId: 'retail', categoryName: '零售日用消费品', categoryEmoji: '🛒', name: '货物摆放上架', materials: '商品、货架', steps: ['展示待上架货物', '整齐摆放到指定货架', '展示货架陈列效果'], folder: 'DF', videoRange: [9, 9] },
  { id: 7, categoryId: 'retail', categoryName: '零售日用消费品', categoryEmoji: '🛒', name: '超市收银', materials: '收银台、商品', steps: ['扫码识别商品', '结算打印小票', '完成收银流程'], folder: 'DF', videoRange: [14, 14] },
  { id: 8, categoryId: 'retail', categoryName: '零售日用消费品', categoryEmoji: '🛒', name: '生活超市卸货', materials: '货物、周转箱、托盘', steps: ['清点到货数量与品类', '逐件卸货并分类码放整齐', '展示卸货完成的备货状态'], folder: 'DF', videoRange: [19, 19] },

  // ========== 三、农贸生鲜处理类（DF 16-17, 21-22）==========
  { id: 9, categoryId: 'vegetables', categoryName: '农贸生鲜处理', categoryEmoji: '🥬', name: '蔬菜清理', materials: '蔬菜、清理工具', steps: ['展示待清理蔬菜', '去除黄叶/根部清理干净', '展示清理好的蔬菜'], folder: 'DF', videoRange: [16, 16] },
  { id: 10, categoryId: 'vegetables', categoryName: '农贸生鲜处理', categoryEmoji: '🥬', name: '蔬菜清理(二)', materials: '蔬菜、清理工具', steps: ['展示待处理蔬菜', '逐一清理蔬菜', '展示清理成果'], folder: 'DF', videoRange: [17, 17] },
  { id: 11, categoryId: 'vegetables', categoryName: '农贸生鲜处理', categoryEmoji: '🥬', name: '蔬菜上架', materials: '蔬菜、货架', steps: ['展示待上架蔬菜', '整齐摆放到蔬菜货架', '展示上架陈列效果'], folder: 'DF', videoRange: [21, 21] },
  { id: 12, categoryId: 'vegetables', categoryName: '农贸生鲜处理', categoryEmoji: '🥬', name: '蔬菜称重', materials: '蔬菜、电子秤', steps: ['展示待称重蔬菜', '用电子秤准确称重', '读出重量/打签'], folder: 'DF', videoRange: [22, 22] },

  // ========== 四、生活清洁服务类（DF 5-7, 13）每个任务对应自己的视频 ==========
  { id: 13, categoryId: 'cleaning', categoryName: '生活清洁服务', categoryEmoji: '🧹', name: '纸袋穿绳', materials: '纸袋、绳子', steps: ['展示纸袋与绳子', '绳子穿入纸袋打孔', '展示穿绳完成的纸袋'], folder: 'DF', videoRange: [5, 5] },
  { id: 14, categoryId: 'cleaning', categoryName: '生活清洁服务', categoryEmoji: '🧹', name: '眼镜片擦拭清洁', materials: '眼镜片、清洁布', steps: ['展示待清洁眼镜片', '用清洁布仔细擦拭镜片', '展示清洁后光亮镜片'], folder: 'DF', videoRange: [6, 6] },
  { id: 15, categoryId: 'cleaning', categoryName: '生活清洁服务', categoryEmoji: '🧹', name: '折叠毛巾', materials: '毛巾', steps: ['展示待折叠毛巾', '按标准方式折叠毛巾', '展示折叠整齐的毛巾'], folder: 'DF', videoRange: [7, 7] },
  { id: 16, categoryId: 'cleaning', categoryName: '生活清洁服务', categoryEmoji: '🧹', name: '擦拭货架', materials: '货架、抹布', steps: ['展示待清洁货架', '用抹布逐面擦拭货架', '展示清洁后的货架'], folder: 'DF', videoRange: [13, 13] },

  // ========== 五、服饰配件加工类（ST 1-3, 15）每个任务对应自己的视频 ==========
  { id: 17, categoryId: 'clothing', categoryName: '服饰配件加工', categoryEmoji: '👕', name: '旋运动服纽扣', materials: '运动服、纽扣', steps: ['展示运动服与纽扣', '逐一旋转拧紧纽扣', '展示所有纽扣就位状态'], folder: 'ST', videoRange: [1, 1] },
  { id: 18, categoryId: 'clothing', categoryName: '服饰配件加工', categoryEmoji: '👕', name: '旋包袋纽扣', materials: '包袋、纽扣', steps: ['展示包袋与待装纽扣', '旋扣安装到位', '展示安装后效果'], folder: 'ST', videoRange: [2, 2] },
  { id: 19, categoryId: 'clothing', categoryName: '服饰配件加工', categoryEmoji: '👕', name: '箱包纽扣磨边', materials: '箱包纽扣、磨边工具', steps: ['展示待磨纽扣', '用工具磨边处理', '展示磨好的纽扣成品'], folder: 'ST', videoRange: [3, 3] },
  { id: 20, categoryId: 'clothing', categoryName: '服饰配件加工', categoryEmoji: '👕', name: '鞋底分挑', materials: '白色鞋底、铁网格架', steps: ['展示待挑拣的混放鞋底', '按尺码/类型挑拣并整齐排列在网格架上', '展示挑拣完成、摆放整齐的鞋底'], folder: 'DF', videoRange: [15, 15] },

  // ========== 六、精密电子组装类（ST 5, 9-10, 16）==========
  { id: 21, categoryId: 'earphone', categoryName: '精密电子组装', categoryEmoji: '🎧', name: '有线耳机插头压制', materials: '有线耳机、插头配件', steps: ['展示线材与插头', '使用设备压制插头', '展示压制完成的插头'], folder: 'ST', videoRange: [5, 5] },
  { id: 22, categoryId: 'earphone', categoryName: '精密电子组装', categoryEmoji: '🎧', name: '颈挂蓝牙耳机控制壳安装', materials: '颈挂蓝牙耳机、控制壳配件', steps: ['展示控制壳配件', '安装控制壳到颈挂', '展示安装完成的耳机'], folder: 'ST', videoRange: [9, 9] },
  { id: 23, categoryId: 'earphone', categoryName: '精密电子组装', categoryEmoji: '🎧', name: '耳机听筒组装', materials: '听筒壳、发声单元', steps: ['展示听筒组件', '组装听筒各部件', '展示组装完成的听筒'], folder: 'ST', videoRange: [10, 10] },
  { id: 24, categoryId: 'earphone', categoryName: '精密电子组装', categoryEmoji: '🎧', name: '汽车按摩垫振动器安装', materials: '按摩垫、振动器配件', steps: ['展示按摩垫与振动器', '安装振动器到指定位置', '展示安装完成的按摩垫'], folder: 'ST', videoRange: [16, 16] },

  // ========== 七、玩具模型加工类（ST 4, 6-8 + DF 18）每个任务对应自己的视频 ==========
  { id: 25, categoryId: 'toy', categoryName: '玩具模型加工', categoryEmoji: '🧸', name: '塑料玩具组装', materials: '塑料玩具配件', steps: ['展示玩具零件', '按顺序组装玩具', '展示组装完成的玩具'], folder: 'ST', videoRange: [4, 4] },
  { id: 26, categoryId: 'toy', categoryName: '玩具模型加工', categoryEmoji: '🧸', name: '玩具模型上色', materials: '模型件、上色颜料', steps: ['展示待上色模型', '仔细均匀上色', '展示上色完成的模型'], folder: 'ST', videoRange: [6, 6] },
  { id: 27, categoryId: 'toy', categoryName: '玩具模型加工', categoryEmoji: '🧸', name: '玩具模型加工', materials: '模型件、加工工具', steps: ['展示待加工模型', '使用工具加工处理', '展示加工完成效果'], folder: 'ST', videoRange: [7, 7] },
  { id: 28, categoryId: 'toy', categoryName: '玩具模型加工', categoryEmoji: '🧸', name: '玩具小乌龟组装', materials: '小乌龟玩具配件', steps: ['展示小乌龟零件', '组装完整小乌龟', '展示组装完成玩具'], folder: 'DF', videoRange: [18, 18] },

  // ========== 八、手工装饰制作类（ST 11-12, 18 + DF 23）每个任务对应自己的视频 ==========
  { id: 29, categoryId: 'handcraft', categoryName: '手工装饰制作', categoryEmoji: '🎨', name: '蝴蝶结折叠', materials: '丝带', steps: ['展示丝带原材料', '折叠成形蝴蝶结', '展示完成的蝴蝶结'], folder: 'ST', videoRange: [11, 11] },
  { id: 30, categoryId: 'handcraft', categoryName: '手工装饰制作', categoryEmoji: '🎨', name: '塑料安装', materials: '塑料件', steps: ['展示待装塑料件', '按结构安装塑料件', '展示安装完成件'], folder: 'ST', videoRange: [12, 12] },
  { id: 31, categoryId: 'handcraft', categoryName: '手工装饰制作', categoryEmoji: '🎨', name: '绑线内笼', materials: '内笼、绑线材料', steps: ['展示内笼与绑线', '按手工坊方式绑线', '展示绑好的内笼成品'], folder: 'DF', videoRange: [23, 23] },
  { id: 32, categoryId: 'handcraft', categoryName: '手工装饰制作', categoryEmoji: '🎨', name: '袋子粘合', materials: '袋子、粘合工具', steps: ['展示待粘合袋子', '按工艺粘合处理', '展示粘合完成袋品'], folder: 'ST', videoRange: [18, 18] },

  // ========== 九、饰品配件组装类（SW 1-2, 29, 41-42）每个任务对应自己的视频 ==========
  { id: 33, categoryId: 'jewelry', categoryName: '饰品配件组装', categoryEmoji: '💍', name: '开合挂圈', materials: '饰品龙虾扣', steps: ['展示龙虾扣饰品', '开合挂圈操作', '展示操作完成状态'], folder: 'sw', videoRange: [1, 1] },
  { id: 34, categoryId: 'jewelry', categoryName: '饰品配件组装', categoryEmoji: '💍', name: '组装钥匙扣', materials: '钥匙扣配件', steps: ['展示钥匙扣配件', '按顺序组装', '展示组装完成的钥匙扣'], folder: 'sw', videoRange: [2, 2] },
  { id: 35, categoryId: 'jewelry', categoryName: '饰品配件组装', categoryEmoji: '💍', name: '穿线手链', materials: '手链线材、配件', steps: ['展示手链线材与配件', '穿线编织手链', '展示完成的手链'], folder: 'sw', videoRange: [29, 29] },
  { id: 36, categoryId: 'jewelry', categoryName: '饰品配件组装', categoryEmoji: '💍', name: '蝴蝶结礼带', materials: '蝴蝶结礼带配件', steps: ['展示礼带配件', '折出+固定蝴蝶结', '展示完成的礼带'], folder: 'sw', videoRange: [41, 42] },

  // ========== 十、工艺品装配类（SW 13-15, 17）每个任务对应自己的视频 ==========
  { id: 37, categoryId: 'lotus', categoryName: '工艺品装配', categoryEmoji: '🪷', name: '折叠莲花片', materials: '莲花片', steps: ['展示莲花灯片材', '折叠莲花片成形', '展示折叠完成的花片'], folder: 'sw', videoRange: [13, 13] },
  { id: 38, categoryId: 'lotus', categoryName: '工艺品装配', categoryEmoji: '🪷', name: '拼装莲花底座', materials: '莲花灯底座零件', steps: ['展示底座零件', '拼装底座结构', '展示组装完成底座'], folder: 'sw', videoRange: [14, 14] },
  { id: 39, categoryId: 'lotus', categoryName: '工艺品装配', categoryEmoji: '🪷', name: '撑开莲花底座', materials: '莲花底座', steps: ['展示未撑开的底座', '撑开到位', '展示撑开后的效果'], folder: 'sw', videoRange: [15, 15] },
  { id: 40, categoryId: 'lotus', categoryName: '工艺品装配', categoryEmoji: '🪷', name: '整体装配风扇', materials: '喷雾小风扇配件', steps: ['展示风扇全部配件', '整体组装风扇', '展示组装完成的风扇'], folder: 'sw', videoRange: [17, 17] },

  // ========== 十一、支架配件组装类（SW 32-34, 40）每个任务对应自己的视频 ==========
  { id: 41, categoryId: 'stand', categoryName: '支架配件组装', categoryEmoji: '📱', name: '粘贴防滑膜', materials: '手机支架、防滑膜', steps: ['展示支架与防滑膜', '粘贴防滑膜到位', '展示粘贴完成效果'], folder: 'sw', videoRange: [32, 32] },
  { id: 42, categoryId: 'stand', categoryName: '支架配件组装', categoryEmoji: '📱', name: '组装支体', materials: '手机支架配件', steps: ['展示支架配件', '组装支架支体', '展示组装完成支架'], folder: 'sw', videoRange: [33, 33] },
  { id: 43, categoryId: 'stand', categoryName: '支架配件组装', categoryEmoji: '📱', name: '成品组装电脑支架', materials: '电脑支架配件', steps: ['展示电脑支架零件', '成品组装电脑支架', '展示组装完成品'], folder: 'sw', videoRange: [34, 34] },
  { id: 44, categoryId: 'stand', categoryName: '支架配件组装', categoryEmoji: '📱', name: '对讲机背夹组装', materials: '对讲机、背夹配件', steps: ['展示对讲机与背夹', '组装背夹到位', '展示组装完成对讲机'], folder: 'sw', videoRange: [40, 40] },

  // ========== 十二、成品整机装配类（SW 20-22, 35-39, 47-49, 26-28）每个任务对应自己的视频 ==========
  { id: 45, categoryId: 'assembly', categoryName: '成品整机装配', categoryEmoji: '🔧', name: '足球鞋后跟处理', materials: '足球鞋后跟、胶料', steps: ['展示鞋后跟待处理部分', '去杂质→撕胶→贴胶', '展示处理完后跟'], folder: 'sw', videoRange: [20, 22] },
  { id: 46, categoryId: 'assembly', categoryName: '成品整机装配', categoryEmoji: '🔧', name: '植被模型组装', materials: '植被模型配件（树干、果实）', steps: ['展示模型配件', '品检→上胶→组装', '展示组装完成的植被模型'], folder: 'sw', videoRange: [35, 39] },
  { id: 47, categoryId: 'assembly', categoryName: '成品整机装配', categoryEmoji: '🔧', name: '钱包成品装配', materials: '钱包卡片、布料配件', steps: ['展示钱包各部件', '拆定孔→装卡片→包装', '展示成品钱包'], folder: 'sw', videoRange: [47, 49] },
  { id: 48, categoryId: 'assembly', categoryName: '成品整机装配', categoryEmoji: '🔧', name: '方程式赛车组装', materials: '方程式赛车配件', steps: ['展示赛车零件', '装外壳/宝箱/整车', '展示组装完成赛车'], folder: 'sw', videoRange: [26, 28] },
];

export function getTaskById(id: number): TaskDetailData | undefined {
  return taskDetails.find((t) => t.id === id);
}
