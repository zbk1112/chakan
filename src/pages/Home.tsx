import { homeContent } from '../data/content';
import Card from '../components/Card';
import Button from '../components/Button';

interface HomeProps {
  onNavigate: (path: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const { hero, advantages, projects, process } = homeContent;

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 text-white py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></span>
            <span className="text-sm font-medium">局域网离线培训平台</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {hero.title}
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-green-100">{hero.subtitle}</p>
          <p className="text-green-100 text-lg max-w-3xl mx-auto">{hero.description}</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={() => onNavigate('/projects/at')} size="lg">
              🚀 查看项目详情
            </Button>
            <Button onClick={() => onNavigate('/sop')} variant="outline" size="lg">
              📚 学习SOP规范
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
              核心优势
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">🌟 为什么选择我们</h2>
            <p className="text-gray-500 mt-2">一站式全品类采集项目，标准化设备，透明结算</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((adv, index) => (
              <Card key={index} className="hover:-translate-y-1">
                <div className="text-5xl mb-4 text-center">{adv.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">{adv.title}</h3>
                <p className="text-gray-600 text-sm text-center">{adv.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
              项目专区
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">🚀 四大可接单项目</h2>
            <p className="text-gray-500 mt-2">灵活选择，多场景接单</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map(project => {
              const durationInfo = project.id === 'at' ? '⏱️ 30小时' : project.id === 'df' ? '⏱️ 20小时' : project.id === 'sw' ? '⏱️ 26小时' : '⏱️ 不限制';
              const unitPrice = project.id === 'at' ? '💰 30rmb' : project.id === 'df' ? '💰 25rmb' : project.id === 'sw' ? '💰 25rmb' : '💰 20rmb';
              const limitInfo = project.id === 'at' ? '工序不限' : project.id === 'df' ? '≤15工序/场景' : project.id === 'sw' ? '限产品款式' : '录制上限宽松';
              const icon = project.id === 'at' ? '🎩' : project.id === 'df' ? '📱' : project.id === 'sw' ? '🥽' : '🎥';
              const needsPhone = project.id === 'df';
              return (
                <button
                  key={project.id}
                  onClick={() => onNavigate(`/projects/${project.id}`)}
                  className={`${project.color} text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-left relative overflow-hidden group`}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="text-4xl mb-4">{icon}</div>
                    <h3 className="text-2xl font-bold mb-2">{project.name}</h3>
                    <p className="text-green-100 text-sm mb-3">{project.description}</p>
                    {needsPhone && (
                      <div className="inline-block bg-yellow-400 text-yellow-900 text-xs px-3 py-1 rounded-full font-medium mb-3">
                        ⚠️ iPhone需客户自租
                      </div>
                    )}
                    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold">{durationInfo}</span>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{limitInfo}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <span className="text-xl font-bold">{unitPrice}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm font-medium">
                      <span>了解详情</span>
                      <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
              合作流程
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">📋 合作完整流程</h2>
            <p className="text-gray-500 mt-2">简单五步，轻松上手</p>
          </div>
          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-green-200 via-green-400 to-green-200 transform -translate-y-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
              {process.map((step, index) => (
                <div key={step.step} className="flex flex-col items-center text-center">
                  <div className="relative z-10 bg-white border-4 border-green-500 w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl text-green-600 shadow-lg hover:scale-110 transition-transform shrink-0">
                    {step.step}
                  </div>
                  <h4 className="font-bold text-gray-800 mt-4 text-lg h-8">{step.title}</h4>
                  <p className="text-sm text-gray-500 mt-2 max-w-[140px] h-12 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
              平台数据
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">📊 合作成果</h2>
            <p className="text-gray-500 mt-2">累计服务数千家供应商，采集数据覆盖多行业</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:-translate-y-1 transition-transform">
              <div className="text-4xl font-bold text-green-600 mb-2">10K+</div>
              <div className="text-gray-600">合作供应商</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:-translate-y-1 transition-transform">
              <div className="text-4xl font-bold text-blue-600 mb-2">500K+</div>
              <div className="text-gray-600">采集时长(小时)</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:-translate-y-1 transition-transform">
              <div className="text-4xl font-bold text-orange-600 mb-2">100+</div>
              <div className="text-gray-600">覆盖行业</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:-translate-y-1 transition-transform">
              <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-gray-600">客户满意度</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
              客户评价
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">💬 合作伙伴反馈</h2>
            <p className="text-gray-500 mt-2">听听他们怎么说</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl mr-4">🏭</div>
                <div>
                  <h4 className="font-bold text-gray-800">XX电子厂</h4>
                  <p className="text-sm text-gray-500">制造业 | BTS项目</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">平台操作简单，培训内容详细，工人上手快。结算透明，每月准时到账，非常满意！</p>
              <div className="flex text-yellow-400">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl mr-4">🏠</div>
                <div>
                  <h4 className="font-bold text-gray-800">XX家政公司</h4>
                  <p className="text-sm text-gray-500">服务业 | DF项目</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">DF项目非常适合我们，居家场景采集方便，不需要额外设备投入，收益稳定。</p>
              <div className="flex text-yellow-400">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 to-amber-50">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl mr-4">🌾</div>
                <div>
                  <h4 className="font-bold text-gray-800">XX农业合作社</h4>
                  <p className="text-sm text-gray-500">农业 | AT项目</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">AT设备轻便，适合户外作业。技术支持响应快，遇到问题能及时解决，合作很愉快！</p>
              <div className="flex text-yellow-400">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
