import { useState } from 'react';
import { taskDetails } from '../data/taskVideos';

interface Task {
  id: number;
  name: string;
  materials: string;
}

interface Category {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  gradient: string;
  badgeBg: string;
  badgeText: string;
  tasks: Task[];
}

// 从 taskVideos 任务详情中抽取 Category + Task
function buildCategories(): Category[] {
  const gradientMap: Record<string, string> = {
    retail: 'from-blue-500 to-indigo-500',
    fresh: 'from-green-500 to-emerald-500',
    packaging: 'from-amber-500 to-orange-500',
    papergoods: 'from-yellow-500 to-amber-500',
    shoes: 'from-orange-500 to-red-500',
    model: 'from-lime-500 to-green-600',
    jewelry: 'from-rose-500 to-pink-500',
    handcraft: 'from-fuchsia-500 to-pink-500',
    electronics: 'from-sky-500 to-blue-500',
    toys: 'from-yellow-500 to-amber-500',
    lighting: 'from-amber-400 to-yellow-500',
    hardware: 'from-slate-500 to-gray-600',
    battery: 'from-emerald-500 to-teal-600',
  };
  const taglineMap: Record<string, string> = {
    retail: '超市-过期商品下架、超市-货物摆放上架、超市-整理货架、散笔上架、收银、套网套-水果、卸货',
    fresh: '称重菌菇干、分装菌菇干、蔬菜称重、蔬菜分拣、蔬菜分挑选、蔬菜上架',
    packaging: '包装成品-钱包、封口包装、物品称重、粘贴封条',
    papergoods: '手工厂-卷烟纸、纸品厂-折叠杯套、纸品厂-纸袋穿绳',
    shoes: '鞋厂-鞋后跟片修理毛边、鞋底前脚掌刷胶、鞋后跟去杂质-足球鞋后跟',
    model: '捆扎模具-植被模型、拼接果实-植被模型、品检树干-植被模型、上胶树干-植被模型、组装植被-植被模型',
    jewelry: '穿线手链-文玩手链、开合挂圈-饰品龙虾扣、拼接底托-发卡底托、上胶底托-发卡底托、质检花枝底垫、组装配件-铜牌饰品、组装配件-夜光十字架',
    handcraft: '编打福袋结、穿假婴裤子、打胶配饰-布艺花、捆绑固定耳朵、熔合福袋头、手工坊-记针存线、洗护婴身、粘贴饰品布标、折出蝴蝶结',
    electronics: '剥开耳机薄膜、合盖电子钟、外壳组装-制冷风扇、小腿按摩器内芯组装、蒸汽小火车-马达点锡',
    toys: '顶部外壳安装-方程式赛车、玩具厂-组装小乌龟',
    lighting: '撑开莲花底座-莲花灯、拼装莲花底座-莲花灯、折叠莲花片-莲花灯',
    hardware: '套环塑料棒、拆除标签定孔、成品组装-电脑支架、对讲机背夹组装、固定配装纽扣、粘贴防滑膜-手机支架',
    battery: '安装弹簧环-铅酸蓄电槽、安装负极贴片-铅酸蓄电槽',
  };
  const badgeMap: Record<string, [string, string]> = {
    retail: ['bg-blue-50', 'text-blue-600'],
    fresh: ['bg-green-50', 'text-green-600'],
    packaging: ['bg-amber-50', 'text-amber-600'],
    papergoods: ['bg-yellow-50', 'text-yellow-700'],
    shoes: ['bg-orange-50', 'text-orange-600'],
    model: ['bg-lime-50', 'text-lime-700'],
    jewelry: ['bg-rose-50', 'text-rose-600'],
    handcraft: ['bg-fuchsia-50', 'text-fuchsia-600'],
    electronics: ['bg-sky-50', 'text-sky-600'],
    toys: ['bg-amber-50', 'text-amber-700'],
    lighting: ['bg-yellow-50', 'text-yellow-600'],
    hardware: ['bg-slate-50', 'text-slate-600'],
    battery: ['bg-emerald-50', 'text-emerald-600'],
  };
  const order = [
    'retail', 'fresh', 'packaging', 'papergoods',
    'shoes', 'model', 'jewelry', 'handcraft',
    'electronics', 'toys', 'lighting', 'hardware', 'battery',
  ];
  const emojiMap: Record<string, string> = {
    retail: '🛒', fresh: '🥬', packaging: '📦', papergoods: '📄',
    shoes: '👞', model: '🌿', jewelry: '💍', handcraft: '🎨',
    electronics: '🔌', toys: '🧸', lighting: '💡', hardware: '⚙️', battery: '🔋',
  };
  const byCat = new Map<string, Task[]>();
  taskDetails.forEach((t) => {
    if (!byCat.has(t.categoryId)) byCat.set(t.categoryId, []);
    byCat.get(t.categoryId)!.push({ id: t.id, name: t.name, materials: t.materials });
  });
  return order
    .filter((id) => byCat.has(id))
    .map((cid) => {
      const [badgeBg, badgeText] = badgeMap[cid] || ['bg-gray-50', 'text-gray-600'];
      return {
        id: cid,
        name: taskDetails.find((t) => t.categoryId === cid)!.categoryName,
        emoji: emojiMap[cid] || '📋',
        tagline: taglineMap[cid] || '',
        gradient: gradientMap[cid] || 'from-gray-500 to-gray-600',
        badgeBg,
        badgeText,
        tasks: byCat.get(cid)!,
      } as Category;
    });
}

const categories: Category[] = buildCategories();

export default function TaskSquare({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [filterText, setFilterText] = useState('');

  const filteredCategories = categories.filter((cat) => {
    if (activeCategory !== 'all' && cat.id !== activeCategory) return false;
    if (filterText) {
      return (
        cat.name.includes(filterText) ||
        cat.tasks.some((t) => t.name.includes(filterText) || t.materials.includes(filterText))
      );
    }
    return true;
  });

  const totalTasks = categories.reduce((sum, cat) => sum + cat.tasks.length, 0);
  const videoCount = 62; // 2026-08-27 基于 sp 文件夹真实 62 个视频文件全部纳入覆盖

  return (
    <div className="bg-gray-50">
      {/* ===== Hero 介绍区 ===== */}
      <section className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 text-white py-5 md:py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 left-6 w-24 h-24 bg-white rounded-full blur-3xl md:w-32 md:h-32"></div>
          <div className="absolute bottom-4 right-6 w-28 h-28 bg-white rounded-full blur-3xl md:w-40 md:h-40"></div>
          <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-yellow-200 rounded-full blur-2xl md:w-24 md:h-24"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-5 gap-6 md:gap-8 items-center">
            <div className="md:col-span-3">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 mb-3 md:mb-4">
                <span className="w-1.5 h-1.5 bg-green-200 rounded-full mr-1.5 animate-pulse"></span>
                <span className="text-xs md:text-sm font-medium">全行业随手拍 · 真实场景可拍</span>
              </div>
              <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-3 leading-tight">快速开拍</h1>
              <p className="text-base md:text-2xl font-semibold text-green-100 mb-0.5">手边有什么，就选什么任务</p>
              <p className="text-green-100 text-sm md:text-lg mb-4 md:mb-6">多拍任务，多赚收益</p>
              <div className="bg-white/15 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-5 ring-1 ring-white/20">
                <div className="flex items-start gap-2 mb-1.5">
                  <span className="mt-0.5 text-base md:text-lg">💡</span>
                  <p className="text-sm md:text-base font-semibold">真实场景视频 · 看完即可开拍</p>
                </div>
                <p className="pl-6 md:pl-7 text-xs md:text-base text-white/90 leading-relaxed">
                  涵盖商超零售、生鲜处理、包装作业、紙品加工、鞋业加工、模型加工、饰品加工、手工布艺、电子组装、玩具组装、灯饰加工、五金塑胶、电池组装共 13 大行业分类，每个任务均提供真实示范视频。复制任务名后立即开始，完成并通过审核后，按平台规则获得相应收益。
                </p>
              </div>
            </div>
            <div className="md:col-span-2 hidden md:grid grid-cols-2 gap-3">
              {[
                { emoji: '🎬', n: categories.length.toString(), unit: '类', label: '行业场景' },
                { emoji: '📋', n: totalTasks.toString(), unit: '个', label: '可拍任务' },
                { emoji: '🎥', n: videoCount.toString(), unit: '个', label: '示范视频' },
                { emoji: '💰', n: '审核', unit: '即赚', label: '收益透明' },
              ].map((s, i) => (
                <div key={i} className="bg-white/15 backdrop-blur-md rounded-2xl p-4 ring-1 ring-white/20">
                  <div className="text-3xl mb-1">{s.emoji}</div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-3xl font-extrabold text-white">{s.n}</span>
                    <span className="text-sm text-green-100">{s.unit}</span>
                  </div>
                  <div className="mt-1 text-xs text-green-100">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 数据背书区 ===== */}
      <section className="px-4 -mt-3 md:-mt-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-3 md:p-8 grid grid-cols-4 md:grid-cols-4 gap-2 md:gap-6 ring-1 ring-gray-100">
            {[
              { icon: '🎬', value: categories.length.toString(), unit: '类', label: '场景分类', accent: 'text-green-600' },
              { icon: '📋', value: totalTasks.toString(), unit: '个', label: '可拍任务', accent: 'text-blue-600' },
              { icon: '🎥', value: '62', unit: '个', label: '示范视频', accent: 'text-orange-600' },
              { icon: '💰', value: '审核', unit: '即赚', label: '收益透明', accent: 'text-amber-600' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="text-xl md:text-4xl mb-0.5 md:mb-2">{s.icon}</div>
                <div className="flex items-baseline gap-0.5">
                  <span className={`text-base md:text-3xl font-extrabold ${s.accent}`}>{s.value}</span>
                  <span className="text-[10px] md:text-sm font-medium text-gray-500">{s.unit}</span>
                </div>
                <div className="text-[10px] md:text-xs mt-0.5 text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 搜索 ===== */}
      <section className="px-4 mt-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-gray-100">
            <span className="text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="搜索任务或物料，如：折叠、包装、风扇、耳机..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 sm:text-base"
            />
            {filterText && (
              <button onClick={() => setFilterText('')} className="text-xs text-gray-400 hover:text-gray-600">清除</button>
            )}
          </div>
        </div>
      </section>

      {/* ===== 场景分类 ===== */}
      <section className="px-4 mt-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-1.5 md:gap-3 mb-2 md:mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block bg-green-100 text-green-700 px-2.5 md:px-4 py-0.5 md:py-1 rounded-full text-[11px] md:text-sm font-medium">场景分类</span>
                <span className="text-gray-500 text-[11px] md:hidden">点击筛选</span>
              </div>
              <h2 className="text-lg md:text-3xl font-bold text-gray-800 mt-1">我手边有这些</h2>
            </div>
            {activeCategory !== 'all' && (
              <button
                onClick={() => setActiveCategory('all')}
                className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 md:px-4 py-1 md:py-2 text-[11px] md:text-sm font-medium text-green-600 hover:bg-green-100 transition self-start md:self-auto"
              >← 全部分类</button>
            )}
          </div>
          {/* 13 分类：手机端 4 列，桌面端 13 列 */}
          <div className="grid grid-cols-4 gap-1.5 md:grid-cols-7 lg:grid-cols-13 md:gap-3">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(isActive ? 'all' : cat.id)}
                  className={`flex flex-col items-center gap-0.5 rounded-lg md:rounded-2xl p-1.5 md:p-3 transition-all ${
                    isActive
                      ? `bg-gradient-to-br ${cat.gradient} text-white shadow-md scale-[1.03]`
                      : 'bg-white text-gray-700 shadow-sm ring-1 ring-gray-100 hover:shadow-md hover:-translate-y-0.5'
                  }`}
                >
                  <span className="text-lg md:text-2xl">{cat.emoji}</span>
                  <span className="text-[10px] md:text-xs font-medium text-center leading-tight">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== 任务列表 ===== */}
      <section className="px-4 py-5 md:py-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-3 md:mb-8">
            <span className="inline-block bg-blue-100 text-blue-700 px-3 md:px-4 py-0.5 md:py-1 rounded-full text-[11px] md:text-sm font-medium mb-1.5 md:mb-3">全部任务</span>
            <h2 className="text-lg md:text-3xl font-bold text-gray-800">全部 {totalTasks} 个可拍任务</h2>
            <p className="text-gray-500 mt-0.5 text-[11px] md:text-sm">点击任务卡片查看示例视频</p>
          </div>

          <div className="space-y-4 md:space-y-8">
            {filteredCategories.length === 0 ? (
              <div className="rounded-2xl bg-white py-10 text-center shadow-sm ring-1 ring-gray-100">
                <div className="text-4xl md:text-5xl mb-2">🔍</div>
                <p className="text-sm text-gray-500">未找到匹配的任务</p>
                <button
                  onClick={() => { setActiveCategory('all'); setFilterText(''); }}
                  className="mt-3 rounded-full bg-green-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-green-600"
                >查看全部任务</button>
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div key={category.id}>
                  <div className="mb-2 md:mb-4 flex items-center gap-2 md:gap-3">
                    <div className={`flex h-7 w-7 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-br ${category.gradient} text-sm md:text-xl shadow-sm shrink-0`}>
                      {category.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm md:text-lg font-bold text-gray-800 truncate">{category.name}</h3>
                      <p className="text-[10px] md:text-xs text-gray-500 truncate">{category.tagline}，等其他任务</p>
                    </div>
                    <div className="hidden md:block h-1 w-16 rounded-full bg-gradient-to-r from-green-400 to-green-200" />
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 md:grid-cols-3 lg:grid-cols-4 md:gap-4">
                    {category.tasks.map((task, idx) => (
                      <div
                        key={task.id}
                        onClick={() => onNavigate(`/task/${task.id}`)}
                        className="group relative overflow-hidden rounded-lg md:rounded-2xl bg-white p-2 md:p-5 shadow-sm ring-1 ring-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
                      >
                        <div className={`absolute left-0 top-0 h-full w-0.5 md:w-1 bg-gradient-to-b ${category.gradient}`} />
                        <div className="flex items-start gap-1.5 md:gap-3 pl-1">
                          <div className={`flex h-5 w-5 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-md md:rounded-xl bg-gradient-to-br ${category.gradient} text-[10px] md:text-sm font-bold text-white shadow-sm`}>
                            {idx + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                              <h4 className="text-[13px] md:text-base font-bold text-gray-800 truncate group-hover:text-green-600 transition">{task.name}</h4>
                              <span className={`inline-flex items-center rounded-md ${category.badgeBg} ${category.badgeText} px-1 py-0.5 text-[8px] md:text-[10px] font-medium shrink-0`}>可开拍</span>
                            </div>
                            <div className={`mt-1 md:mt-2.5 flex items-start gap-1 md:gap-2 rounded ${category.badgeBg} p-1 md:p-2.5`}>
                              <span className="text-[9px] md:text-xs mt-0.5 shrink-0">📦</span>
                              <div className="min-w-0">
                                <div className="text-[8px] md:text-[10px] font-medium text-gray-500 uppercase tracking-wide">所需物料</div>
                                <div className="mt-0.5 text-[10px] md:text-[13px] text-gray-700 leading-snug md:leading-relaxed">{task.materials}</div>
                              </div>
                            </div>
                            <div className="mt-1 md:mt-2 flex items-center gap-1 text-[9px] md:text-xs text-green-600 opacity-0 group-hover:opacity-100 transition">
                              <span>▶ 查看示例视频</span>
                              <span className="group-hover:translate-x-0.5 transition">→</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ===== 底部指引 ===== */}
          <div className="mt-4 md:mt-10 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl md:rounded-2xl p-3 md:p-5 border border-amber-200">
              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                <span className="text-xl md:text-2xl">🎯</span>
                <h4 className="font-bold text-amber-800 text-sm md:text-base">开拍指引</h4>
              </div>
              <ul className="space-y-1.5 md:space-y-2 text-amber-900 text-xs md:text-sm leading-relaxed">
                <li className="flex items-start gap-1.5 md:gap-2"><span className="text-amber-500 font-bold shrink-0">•</span><span>找到手边物品 → 选择匹配任务</span></li>
                <li className="flex items-start gap-1.5 md:gap-2"><span className="text-amber-500 font-bold shrink-0">•</span><span>点击任务 → 查看真实示范视频</span></li>
                <li className="flex items-start gap-1.5 md:gap-2"><span className="text-amber-500 font-bold shrink-0">•</span><span>复制任务名 → 开拍提交 → 结算收益</span></li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl md:rounded-2xl p-3 md:p-5 border border-green-200">
              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                <span className="text-xl md:text-2xl">💡</span>
                <h4 className="font-bold text-green-800 text-sm md:text-base">温馨提示</h4>
              </div>
              <ul className="space-y-1.5 md:space-y-2 text-green-900 text-xs md:text-sm leading-relaxed">
                <li className="flex items-start gap-1.5 md:gap-2"><span className="text-green-500 font-bold shrink-0">•</span><span>涵盖 13 类行业场景，62 条真实示范视频</span></li>
                <li className="flex items-start gap-1.5 md:gap-2"><span className="text-green-500 font-bold shrink-0">•</span><span>多拍多赚，完成越多收益越高</span></li>
                <li className="flex items-start gap-1.5 md:gap-2"><span className="text-green-500 font-bold shrink-0">•</span><span>审核通过后及时结算收益</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
