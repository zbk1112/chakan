import { qualityCenter } from '../data/content';
import Card from '../components/Card';
import dfCase1 from '../assets/images/df_case_1.jpeg';
import dfCase2 from '../assets/images/df_case_2.jpeg';
import dfCase3 from '../assets/images/df_case_3.jpeg';
import dfCase4 from '../assets/images/df_case_4.jpeg';

const caseImages = [dfCase1, dfCase2, dfCase3, dfCase4];

export default function QualityCenter() {
  const { principles, tier1, tier2, caseStudies } = qualityCenter;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="text-xl mr-2">🎯</span>
            质量判定
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">质量判定中心</h1>
          <p className="text-gray-600 text-lg">图文可视化质量标准，合格画面VS不合格画面对比展示</p>
        </div>

        <Card title="📌 采集核心五原则" className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {principles.map((principle, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl shadow-md mb-3">
                  {index + 1}
                </div>
                <h4 className="font-bold text-gray-800 text-sm">{principle}</h4>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card title={`🚫 ${tier1.title}`}>
            <div className="bg-red-50 rounded-xl p-4 border border-red-200">
              <p className="text-gray-600 mb-4">{tier1.description}</p>
              {tier1.items.map((item, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <h4 className="font-bold text-red-600 mb-2 flex items-center">
                    <span className="text-lg mr-2">❌</span>
                    {item.type}
                  </h4>
                  <ul className="space-y-2">
                    {item.issues.map((issue, i) => (
                      <li key={i} className="flex items-start text-sm text-gray-700 bg-white p-2 rounded-lg">
                        <span className="text-red-500 mr-2 mt-0.5">✕</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>

          <Card title={`⚠️ ${tier2.title}`}>
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
              <p className="text-gray-600 mb-4">{tier2.description}</p>
              {tier2.items.map((item, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <h4 className="font-bold text-orange-600 mb-2 flex items-center">
                    <span className="text-lg mr-2">⚠️</span>
                    {item.type}
                  </h4>
                  <ul className="space-y-2">
                    {item.issues.map((issue, i) => (
                      <li key={i} className="flex items-start text-sm text-gray-700 bg-white p-2 rounded-lg">
                        <span className="text-orange-500 mr-2 mt-0.5">⚠</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card title="🖼️ 实拍案例对照" className="mb-8">
          <div className="space-y-8">
            {caseStudies.map((study, index) => (
              <div key={index}>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-xl mr-2">📸</span>
                  {study.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-2">✅</span>
                      <h4 className="font-bold text-green-700">合格画面标准</h4>
                    </div>
                    <div className="bg-white rounded-xl h-56 flex items-center justify-center mb-4 border-2 border-green-200 shadow-sm">
                      <div className="text-center p-4">
                        <div className="text-5xl mb-3">📸</div>
                        <p className="text-gray-600 text-sm font-medium">合格画面示例</p>
                        <p className="text-gray-500 text-xs mt-1">双手和操作物体清楚在画面内</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2"><strong className="text-green-600">标准：</strong>{study.qualified.desc}</p>
                    <p className="text-sm text-green-600"><strong>要求：</strong>{study.qualified.tips}</p>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-5 border border-red-200">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-2">❌</span>
                      <h4 className="font-bold text-red-700">不合格画面案例</h4>
                    </div>
                    <div className="bg-white rounded-xl mb-4 border-2 border-red-200 overflow-hidden shadow-sm">
                      <img 
                        src={caseImages[index]} 
                        alt={`${study.title} - 问题示例`}
                        className="w-full h-56 object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-700 mb-2"><strong className="text-red-600">问题：</strong>{study.unqualified.desc}</p>
                    <p className="text-sm text-red-600"><strong>整改方法：</strong>{study.unqualified.tips}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="📊 废片分级判定对照表">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <th className="px-5 py-3 text-left font-bold">问题分类</th>
                  <th className="px-5 py-3 text-left font-bold">Tier1 直接作废</th>
                  <th className="px-5 py-3 text-left font-bold">Tier2 风险片</th>
                  <th className="px-5 py-3 text-left font-bold">处理方式</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">操作问题</td>
                  <td className="px-5 py-3 text-red-600">手部离开画面超30秒、50%以上动作过快、超过1分钟无意义动作</td>
                  <td className="px-5 py-3 text-orange-600">重复同一动作超1分钟、工具过长导致一只手长期出镜</td>
                  <td className="px-5 py-3 text-gray-700">重新采集 / 人工审核</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">设备问题</td>
                  <td className="px-5 py-3 text-red-600">未选超广角、镜头脏污遮挡、视频模糊不清</td>
                  <td className="px-5 py-3 text-orange-600">充电线干扰、视角歪斜、镜头大幅晃动</td>
                  <td className="px-5 py-3 text-gray-700">维修设备 / 清洁镜头</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">环境问题</td>
                  <td className="px-5 py-3 text-red-600">环境过暗、面部清晰入镜</td>
                  <td className="px-5 py-3 text-orange-600">背景干扰、光线稍暗</td>
                  <td className="px-5 py-3 text-gray-700">改善环境 / 调整角度</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
