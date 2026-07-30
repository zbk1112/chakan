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
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
              项目专区
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">🚀 四大可接单项目</h2>
            <p className="text-gray-500 mt-2">灵活选择，多场景接单</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {projects.map(project => {
              const isDfProject = project.id === 'df';
              const durationInfo = project.id === 'at' ? '⏱️ 30小时' : project.id === 'df' ? '⏱️ 50小时' : project.id === 'sw' ? '⏱️ 50小时' : '⏱️ 不限制';
              const unitPrice = project.id === 'at' ? '💰 30rmb' : project.id === 'df' ? '💰 25rmb' : project.id === 'sw' ? '💰 25rmb' : '💰 20rmb';
              const limitInfo = project.id === 'at' ? '工序不限' : project.id === 'df' ? '≤15工序/场景' : project.id === 'sw' ? '限产品款式' : '录制上限宽松';
              const settlementMethod = '💳 3周到一个月结算';
              const icon = project.id === 'at' ? '🎩' : project.id === 'df' ? '📱' : project.id === 'sw' ? '🥽' : '🎥';
              const needsPhone = project.id === 'df';
              const sceneTag = project.id === 'at' ? '🏷️ 农业·家居·商超' : project.id === 'df' ? '🏷️ 居家+制造业' : project.id === 'sw' ? '🏷️ 制造业' : project.id === 'st' ? '🏷️ 真实场景·人手操作' : '';
              const equipmentTag = project.id === 'at' ? '✅ 我方提供全部硬件' : project.id === 'df' ? '⚠️ 需客户自备iPhone' : project.id === 'sw' ? '✅ 我方提供全部硬件' : project.id === 'st' ? '✅ 我方提供全部硬件' : '';
              const features = project.id === 'at' 
                ? [{ icon: '🎬', text: '腕部镜头同步' }, { icon: '🔋', text: '充电宝续航' }, { icon: '📦', text: '邮寄内存卡' }] 
                : project.id === 'sw' 
                ? [{ icon: '🔆', text: '配套灯光' }, { icon: '💻', text: '网页配对' }, { icon: '📡', text: '10M上行带宽' }] 
                : project.id === 'st' 
                ? [{ icon: '⌚', text: '品牌手环' }, { icon: '📶', text: '10M上行带宽' }, { icon: '✅', text: 'T+1审核' }] 
                : [];
              const gradientClass = project.id === 'at' 
                ? 'bg-gradient-to-br from-green-600 via-emerald-600 to-green-500' 
                : project.id === 'df' 
                ? 'bg-gradient-to-br from-teal-600 via-cyan-600 to-teal-500' 
                : project.id === 'sw' 
                ? 'bg-gradient-to-br from-emerald-600 via-green-500 to-teal-500' 
                : 'bg-gradient-to-br from-green-700 via-teal-600 to-emerald-500';
              return (
                <button
                key={project.id}
                onClick={() => onNavigate(`/projects/${project.id}`)}
                className={`${gradientClass} text-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-left relative overflow-hidden group flex flex-col h-full border border-white/20`}
              >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative z-10 flex flex-col h-full flex-1">
                    <div>
                      <div className="text-3xl mb-2">{icon}</div>
                      <h3 className="text-xl font-bold mb-1">{project.name}</h3>
                      <p className="text-white/90 text-xs mb-2 leading-snug">{project.description}</p>
                      {needsPhone && (
                        <div className="inline-block bg-amber-400/90 backdrop-blur-sm text-amber-900 text-xs px-2.5 py-0.5 rounded-full font-semibold mb-2 border border-amber-300/50 shadow-sm">
                          ⚠️ iPhone需客户自租
                        </div>
                      )}
                    </div>
                    {isDfProject ? (
                      <div className="mb-2 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-xl p-2.5 border border-white/30 shadow-lg backdrop-blur-sm"
                               style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.35) 0%, rgba(5,150,105,0.25) 100%)' }}>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className="text-sm">📱</span>
                              <span className="text-xs font-bold text-white tracking-wide">DF 居家</span>
                            </div>
                            <div className="flex items-center gap-1 mb-0.5">
                              <span className="text-sm">⏱️</span>
                              <span className="text-sm font-extrabold text-white">50h</span>
                            </div>
                            <div className="text-[9px] text-green-50 mb-1 leading-tight">≤15工序/场景</div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs">💰</span>
                              <span className="text-sm font-extrabold text-yellow-300">25</span>
                              <span className="text-[10px] text-green-50">rmb</span>
                            </div>
                          </div>
                          <div className="rounded-xl p-2.5 border border-white/30 shadow-lg backdrop-blur-sm"
                               style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.35) 0%, rgba(6,182,212,0.25) 100%)' }}>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className="text-sm">🏭</span>
                              <span className="text-xs font-bold text-white tracking-wide">BTS 流水线</span>
                            </div>
                            <div className="flex items-center gap-1 mb-0.5">
                              <span className="text-sm">⏱️</span>
                              <span className="text-sm font-extrabold text-white">20h</span>
                            </div>
                            <div className="text-[9px] text-teal-50 mb-1 leading-tight">≤15工序/场景</div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs">💰</span>
                              <span className="text-sm font-extrabold text-yellow-300">35</span>
                              <span className="text-[10px] text-teal-50">rmb</span>
                              <span className="text-[8px] bg-yellow-400/30 text-yellow-200 px-1 py-0.5 rounded ml-0.5 font-medium">自租</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 mb-2 border border-white/20">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-bold">{durationInfo}</span>
                            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">{limitInfo}</span>
                          </div>
                          <div className="flex items-center justify-center">
                            <span className="text-base font-bold">{unitPrice}</span>
                          </div>
                        </div>
                        {features.length > 0 && (
                          <div className="mb-2 grid grid-cols-3 gap-1.5">
                            {features.map((feature, idx) => (
                              <div key={idx} className="bg-white/10 backdrop-blur-md rounded-lg px-1.5 py-1.5 border border-white/10 text-center">
                                <div className="text-sm mb-0.5">{feature.icon}</div>
                                <div className="text-[9px] text-white/90 leading-tight font-medium">{feature.text}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                    <div className="flex-1"></div>
                    <div className="mt-2 space-y-1.5">
                      {sceneTag && (
                        <div className="bg-white/10 backdrop-blur-md rounded-lg px-2.5 py-1 flex items-center gap-2 border border-white/10">
                          <span className="text-[11px] text-white/90">{sceneTag}</span>
                        </div>
                      )}
                      {equipmentTag && (
                        <div className="bg-white/10 backdrop-blur-md rounded-lg px-2.5 py-1 flex items-center gap-2 border border-white/10">
                          <span className="text-[11px] text-white/90">{equipmentTag}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-xl p-2 border border-yellow-200/50 shadow-lg backdrop-blur-sm">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-base">💳</span>
                        <span className="text-xs font-bold text-yellow-900">{settlementMethod}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-xs font-medium mt-2.5">
                      <span>了解详情</span>
                      <svg className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
