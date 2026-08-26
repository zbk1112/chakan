import { useState } from 'react';
import { projectContent } from '../../data/content';
import swImage1 from '../../assets/images/sw_image_1.png';
import swImage2 from '../../assets/images/sw_image_2.png';
import swImage3 from '../../assets/images/sw_image_3.png';
import swImage4 from '../../assets/images/sw_image_4.png';
import swImage5 from '../../assets/images/sw_image_5.png';
import swImage6 from '../../assets/images/sw_image_6.png';

const swImages = [swImage1, swImage2, swImage3, swImage4, swImage5, swImage6];

interface ProjectPageProps {
  initialProject: 'at' | 'df' | 'sw' | 'st';
}

/* 紧凑卡片：手机端极简、桌面端保留完整样式 */
function Section({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`bg-white rounded-lg md:rounded-xl shadow-sm ring-1 ring-gray-100 ${className}`}
    >
      <div className="px-3 md:px-5 py-2 md:py-3 border-b border-gray-100 flex items-center">
        <h3 className="text-sm md:text-base font-bold text-gray-800">{title}</h3>
      </div>
      <div className="p-3 md:p-5">{children}</div>
    </section>
  );
}

export default function ProjectPage({ initialProject }: ProjectPageProps) {
  const [activeTab, setActiveTab] =
    useState<typeof initialProject>(initialProject);

  const projects = ['at', 'df', 'sw', 'st'] as const;
  const projectLabels = {
    at: 'AT头戴采集',
    df: 'iPhone采集',
    sw: 'SW头戴设备',
    st: 'ST头戴式GoPro',
  };
  const projectIcons = { at: '🎩', df: '📱', sw: '🥽', st: '🎥' };

  const currentProject = projectContent[activeTab];

  return (
    <div className="min-h-screen bg-gray-50 py-3 md:py-10 px-2 md:px-4">
      <div className="max-w-6xl mx-auto">
        {/* ===== 头部 ===== */}
        <div className="mb-4 md:mb-8">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center bg-green-100 text-green-700 px-2.5 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium mb-2">
              <span className="mr-1">{projectIcons[activeTab]}</span>
              项目专区
            </div>
            <h1 className="text-lg md:text-3xl font-bold text-gray-800 mb-1">
              {currentProject.title}
            </h1>
            <p className="text-gray-500 text-xs md:text-base">
              {currentProject.description}
            </p>
          </div>
        </div>

        {/* ===== Tab 切换 ===== */}
        <div className="flex gap-1.5 md:gap-2 mb-4 md:mb-6 overflow-x-auto pb-0.5 md:overflow-visible md:flex-wrap md:justify-center scrollbar-thin">
          {projects.map((id) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`shrink-0 px-3 md:px-5 py-1.5 md:py-2 rounded-md md:rounded-lg text-xs md:text-sm font-medium transition-all flex items-center gap-1 ${
                activeTab === id
                  ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow'
                  : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>{projectIcons[id]}</span>
              {projectLabels[id]}
            </button>
          ))}
        </div>

        {/* ===== 主内容：手机端极紧凑，桌面端宽松 ===== */}
        <div className="flex flex-col gap-2 md:grid md:grid-cols-2 md:gap-5">
          {/* 设备清单 */}
          <Section title="📦 全套设备清单">
            <ul className="space-y-1 md:space-y-2">
              {currentProject.equipment.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center p-1.5 md:p-2 bg-gray-50 rounded text-xs md:text-sm"
                >
                  <span className="w-4 h-4 md:w-5 md:h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold mr-2 shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 truncate">{item}</span>
                </li>
              ))}
            </ul>
            {activeTab !== 'df' ? (
              <div className="mt-2 md:mt-3 bg-green-50 rounded p-1.5 md:p-2 border border-green-200">
                <p className="text-green-700 text-[11px] md:text-xs font-medium flex items-center">
                  <span className="mr-1">✅</span>
                  我方提供全部硬件
                </p>
              </div>
            ) : (
              <div className="mt-2 md:mt-3 bg-yellow-50 rounded p-1.5 md:p-2 border border-yellow-200">
                <p className="text-yellow-800 text-[11px] md:text-xs font-medium flex items-center">
                  <span className="mr-1">⚠️</span>
                  iPhone需自备/自租
                </p>
              </div>
            )}
          </Section>

          {/* 采集时效说明 — 手机端紧凑2列 */}
          <Section title="⌛ 采集时效说明">
            <div className="grid grid-cols-3 md:grid-cols-2 gap-1.5 md:gap-3">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded p-2 md:p-3 border border-blue-200">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <span className="text-base md:text-xl">⏱️</span>
                  <div className="min-w-0">
                    <p className="text-[9px] md:text-xs text-gray-500">有效时长</p>
                    <p className="text-xs md:text-sm font-bold text-blue-700 truncate">
                      {currentProject.validDuration}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded p-2 md:p-3 border border-purple-200">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <span className="text-base md:text-xl">📊</span>
                  <div className="min-w-0">
                    <p className="text-[9px] md:text-xs text-gray-500">工序限制</p>
                    <p className="text-[11px] md:text-sm font-medium text-gray-700 truncate">
                      {currentProject.processLimit}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded p-2 md:p-3 border border-green-200">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <span className="text-base md:text-xl">📤</span>
                  <div className="min-w-0">
                    <p className="text-[9px] md:text-xs text-gray-500">上传方式</p>
                    <p className="text-[11px] md:text-sm font-medium text-gray-700 truncate">
                      {currentProject.uploadMethod}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded p-2 md:p-3 border border-orange-200">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <span className="text-base md:text-xl">🎯</span>
                  <div className="min-w-0">
                    <p className="text-[9px] md:text-xs text-gray-500">场景需求</p>
                    <p className="text-[11px] md:text-sm font-medium text-gray-700 truncate">
                      {currentProject.sceneRequirements}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded p-2 md:p-3 border border-red-200">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <span className="text-base md:text-xl">💰</span>
                  <div className="min-w-0">
                    <p className="text-[9px] md:text-xs text-gray-500">时长单价</p>
                    <p className="text-xs md:text-sm font-bold text-red-600 truncate">
                      {currentProject.unitPrice}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded p-2 md:p-3 border-2 border-amber-300">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-base md:text-xl shrink-0">💳</span>
                    <div className="min-w-0">
                      <p className="text-[9px] md:text-xs text-gray-500">结算</p>
                      <p className="text-[11px] md:text-sm font-bold text-amber-800 truncate">
                        {(currentProject as any).settlementMethod || '3周到一个月'}
                      </p>
                    </div>
                  </div>
                  <span className="bg-amber-500 text-white text-[8px] md:text-[10px] px-1.5 py-0.5 md:px-2 md:py-1 rounded-full font-bold shrink-0">
                    准时
                  </span>
                </div>
              </div>
            </div>
          </Section>

          {/* 开工前置准备 */}
          <Section title="📋 开工前置准备">
            <ul className="space-y-1 md:space-y-1.5">
              {currentProject.preparation.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start p-1 md:p-1.5 bg-blue-50 rounded text-xs md:text-sm"
                >
                  <span className="text-green-500 mr-1.5 mt-0 shrink-0">✓</span>
                  <span className="text-gray-700 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* 标准化操作步骤 — 手机端单列紧凑 */}
          <Section title="📝 标准化操作步骤">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 md:gap-3">
              {currentProject.steps.map((step) => (
                <div
                  key={step.num}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded p-2.5 md:p-3 border border-green-100"
                >
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold mb-1.5 md:mb-2">
                    {step.num}
                  </div>
                  <h4 className="text-xs md:text-sm font-bold text-gray-800 mb-0.5">
                    {step.title}
                  </h4>
                  <p className="text-[11px] md:text-xs text-gray-600 leading-snug">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* SW设备图示 */}
          {activeTab === 'sw' && (
            <Section title="🖼️ SW设备图示说明">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 md:gap-3">
                {swImages.map((img, index) => (
                  <div
                    key={index}
                    className="bg-white rounded p-1.5 md:p-2 border border-gray-200"
                  >
                    <img
                      src={img}
                      alt={`SW设备图示${index + 1}`}
                      className="w-full h-16 md:h-24 object-contain rounded"
                    />
                    <p className="text-center text-[9px] md:text-xs text-gray-500 mt-1 font-medium">
                      图示{index + 1}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-2 md:mt-3 bg-blue-50 rounded p-2 md:p-3 border border-blue-200">
                <p className="text-gray-700 text-xs md:text-sm font-medium mb-1">
                  设备灯光说明：
                </p>
                <div className="flex flex-wrap gap-x-2 md:gap-x-3 gap-y-1 text-[10px] md:text-xs">
                  <span className="flex items-center">
                    <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-blue-500 rounded-full mr-1"></span>
                    蓝灯：20-90%
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-green-500 rounded-full mr-1"></span>
                    绿灯：90%+
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-red-500 rounded-full mr-1"></span>
                    红灯：20%-
                  </span>
                </div>
              </div>
            </Section>
          )}

          {/* 现场巡检 + 午休 手机端并排 */}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-2 md:gap-5">
            <Section title="🔍 现场巡检">
              <ul className="space-y-1">
                {currentProject.patrol.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start p-1 md:p-1.5 rounded text-[11px] md:text-xs"
                  >
                    <span className="mr-1 mt-0 shrink-0">🔵</span>
                    <span className="text-gray-700 leading-snug">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="😴 午休/临时离岗">
              <ul className="space-y-1">
                {currentProject.lunchBreak.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start p-1 md:p-1.5 rounded text-[11px] md:text-xs"
                  >
                    <span className="mr-1 mt-0 shrink-0">🟠</span>
                    <span className="text-gray-700 leading-snug">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          </div>

          {/* 完工数据处理 */}
          <Section title="📤 完工数据处理">
            <ul className="space-y-1 md:space-y-1.5">
              {currentProject.finish.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center p-1.5 md:p-2 bg-green-50 rounded text-xs md:text-sm"
                >
                  <span className="w-4 h-4 md:w-5 md:h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold mr-2 shrink-0">
                    ✓
                  </span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* 红线禁令 */}
          <Section title="🚫 红线禁令">
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded p-2 md:p-4 border border-red-200">
              <p className="text-red-700 font-bold mb-1.5 md:mb-2 text-xs md:text-sm flex items-center">
                <span className="mr-1">🚨</span>
                违反将影响结算
              </p>
              <ul className="space-y-1 md:space-y-1.5">
                {currentProject.prohibitions.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center p-1.5 md:p-2 bg-white rounded text-[11px] md:text-xs font-medium text-red-800"
                  >
                    <span className="mr-1.5 shrink-0">❌</span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Section>

          {/* 每日自检表 */}
          {currentProject.selfCheck && currentProject.selfCheck.length > 0 && (
            <Section title="📋 每日自检表">
              <div className="bg-blue-50 rounded p-2 md:p-3 border border-blue-200">
                <p className="text-blue-700 font-bold mb-1.5 md:mb-2 text-xs md:text-sm flex items-center">
                  <span className="mr-1">✅</span>
                  采集前请完成以下检查
                </p>
                <ul className="space-y-1 md:space-y-1.5">
                  {currentProject.selfCheck.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center p-1.5 md:p-2 bg-white rounded text-[11px] md:text-xs"
                    >
                      <span className="w-4 h-4 md:w-5 md:h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-[9px] md:text-[10px] font-bold mr-2 shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Section>
          )}

          {/* 专项规则 */}
          {currentProject.specialRules &&
            currentProject.specialRules.length > 0 && (
              <Section title="📌 专项规则">
                <div className="bg-purple-50 rounded p-2 md:p-3 border border-purple-200">
                  <p className="text-purple-700 font-bold mb-1.5 md:mb-2 text-xs md:text-sm flex items-center">
                    <span className="mr-1">📌</span>
                    本项目注意事项
                  </p>
                  <ul className="space-y-1 md:space-y-1.5">
                    {currentProject.specialRules.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center p-1.5 md:p-2 bg-white rounded text-[11px] md:text-xs"
                      >
                        <span className="w-4 h-4 md:w-5 md:h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-[9px] md:text-[10px] font-bold mr-2 shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Section>
            )}
        </div>
      </div>
    </div>
  );
}
