import { useState } from 'react';
import { projectContent } from '../../data/content';
import Card from '../../components/Card';
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

export default function ProjectPage({ initialProject }: ProjectPageProps) {
  const [activeTab, setActiveTab] = useState<typeof initialProject>(initialProject);
  const [dfSubTab, setDfSubTab] = useState<'df' | 'bts'>('df');
  
  const projects = ['at', 'df', 'sw', 'st'] as const;
  const projectLabels = { 
    at: 'AT头戴采集', 
    df: 'iPhone采集', 
    sw: 'SW头戴设备',
    st: 'ST头戴式GoPro'
  };
  const projectIcons = { at: '🎩', df: '📱', sw: '🥽', st: '🎥' };
  
  const isDfProject = activeTab === 'df';
  const currentProjectKey = isDfProject ? dfSubTab : activeTab;
  const currentProject = projectContent[currentProjectKey];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="text-xl mr-2">{projectIcons[activeTab]}</span>
            项目专区
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{currentProject.title}</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">{currentProject.description}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {projects.map(id => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                setDfSubTab('df');
              }}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === id
                  ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-200 scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-md'
              }`}
            >
              <span>{projectIcons[id]}</span>
              {projectLabels[id]}
            </button>
          ))}
        </div>

        {isDfProject && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button
              onClick={() => setDfSubTab('df')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                dfSubTab === 'df'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-200 scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-md'
              }`}
            >
              <span>📱</span>
              DF
            </button>
            <button
              onClick={() => setDfSubTab('bts')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                dfSubTab === 'bts'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-200 scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-md'
              }`}
            >
              <span>🏭</span>
              BTS
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="📦 全套设备清单">
            <ul className="space-y-3">
              {currentProject.equipment.map((item, index) => (
                <li key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                  <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            {activeTab !== 'df' && dfSubTab !== 'bts' && (
              <div className="mt-4 bg-green-50 rounded-lg p-3 border border-green-200">
                <p className="text-green-700 font-medium flex items-center">
                  <span className="text-xl mr-2">✅</span>
                  我方提供全部硬件，供应商零采购
                </p>
              </div>
            )}
            {(activeTab === 'df' || dfSubTab === 'bts') && (
              <div className="mt-4 bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <p className="text-yellow-800 font-medium flex items-center">
                  <span className="text-xl mr-2">⚠️</span>
                  iPhone手机需客户自备/自租
                </p>
              </div>
            )}
          </Card>

          <Card title="⌛ 采集时效说明">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⏱️</span>
                  <div>
                    <p className="text-sm text-gray-500">有效时长</p>
                    <p className="text-xl font-bold text-blue-700">{currentProject.validDuration}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📊</span>
                  <div>
                    <p className="text-sm text-gray-500">工序限制</p>
                    <p className="text-gray-700 font-medium text-sm">{currentProject.processLimit}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📤</span>
                  <div>
                    <p className="text-sm text-gray-500">上传方式</p>
                    <p className="text-gray-700 font-medium">{currentProject.uploadMethod}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🎯</span>
                  <div>
                    <p className="text-sm text-gray-500">场景需求</p>
                    <p className="text-gray-700 font-medium">{currentProject.sceneRequirements}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-4 border border-red-200 col-span-2">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">💰</span>
                  <div>
                    <p className="text-sm text-gray-500">有效时长单价</p>
                    <p className="text-xl font-bold text-red-600">{currentProject.unitPrice}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-4 border-2 border-amber-300 col-span-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">💳</span>
                    <div>
                      <p className="text-sm text-gray-500">结算方式</p>
                      <p className="text-xl font-bold text-amber-800">{(currentProject as any).settlementMethod || '3周到一个月结算'}</p>
                    </div>
                  </div>
                  <span className="bg-amber-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-sm">准时结算</span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="📋 开工前置准备">
            <ul className="space-y-3">
              {currentProject.preparation.map((item, index) => (
                <li key={index} className="flex items-start p-2 bg-blue-50 rounded-lg">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-gray-700 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="📝 标准化操作步骤" className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentProject.steps.map((step) => (
                <div key={step.num} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 hover:shadow-md transition-shadow">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-3 shadow-md">
                    {step.num}
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </Card>

          {activeTab === 'sw' && (
            <Card title="🖼️ SW设备图示说明" className="lg:col-span-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {swImages.map((img, index) => (
                  <div key={index} className="bg-white rounded-xl p-3 border border-gray-200 hover:shadow-md transition-shadow">
                    <img 
                      src={img} 
                      alt={`SW设备图示${index + 1}`}
                      className="w-full h-36 object-contain rounded-lg"
                    />
                    <p className="text-center text-sm text-gray-500 mt-3 font-medium">图示{index + 1}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-gray-700 font-medium mb-2">设备灯光说明：</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center"><span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>蓝灯：电量20-90%</span>
                  <span className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>绿灯：电量90%以上</span>
                  <span className="flex items-center"><span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>红灯：电量不足20%</span>
                </div>
              </div>
            </Card>
          )}

          <Card title="🔍 现场巡检">
            <ul className="space-y-2">
              {currentProject.patrol.map((item, index) => (
                <li key={index} className="flex items-start p-2 rounded-lg hover:bg-gray-50">
                  <span className="text-blue-500 mr-2 mt-0.5">🔵</span>
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="😴 午休/临时离岗">
            <ul className="space-y-2">
              {currentProject.lunchBreak.map((item, index) => (
                <li key={index} className="flex items-start p-2 rounded-lg hover:bg-gray-50">
                  <span className="text-orange-500 mr-2 mt-0.5">🟠</span>
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="📤 完工数据处理" className="lg:col-span-2">
            <ul className="space-y-3">
              {currentProject.finish.map((item, index) => (
                <li key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                  <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    ✓
                  </span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="🚫 红线禁令" className="lg:col-span-2">
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border border-red-200">
              <p className="text-red-700 font-bold mb-4 flex items-center">
                <span className="text-2xl mr-2">🚨</span>
                以下行为严格禁止，违反将影响结算
              </p>
              <ul className="space-y-3">
                {currentProject.prohibitions.map((item, index) => (
                  <li key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="text-xl mr-3">❌</span>
                    <span className="text-red-800 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {currentProject.selfCheck && currentProject.selfCheck.length > 0 && (
            <Card title="📋 每日自检表" className="lg:col-span-2">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-blue-700 font-bold mb-4 flex items-center">
                  <span className="text-xl mr-2">✅</span>
                  每日采集前请完成以下检查
                </p>
                <ul className="space-y-3">
                  {currentProject.selfCheck.map((item, index) => (
                    <li key={index} className="flex items-center p-3 bg-white rounded-lg">
                      <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          )}

          {currentProject.specialRules && currentProject.specialRules.length > 0 && (
            <Card title="📋 专项规则" className="lg:col-span-2">
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <p className="text-purple-700 font-bold mb-4 flex items-center">
                  <span className="text-xl mr-2">📌</span>
                  本项目特别注意事项
                </p>
                <ul className="space-y-3">
                  {currentProject.specialRules.map((item, index) => (
                    <li key={index} className="flex items-center p-3 bg-white rounded-lg">
                      <span className="w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
