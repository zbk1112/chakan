import { useState } from 'react';
import { troubleshooting } from '../data/content';
import Card from '../components/Card';

export default function Troubleshooting() {
  const [activeTab, setActiveTab] = useState<'at' | 'df' | 'sw' | 'st'>('at');
  const tabs = [
    { id: 'at' as const, label: 'AT设备故障', color: 'bg-green-500' },
    { id: 'df' as const, label: 'DF手机故障', color: 'bg-blue-500' },
    { id: 'sw' as const, label: 'SW头戴故障', color: 'bg-orange-500' },
    { id: 'st' as const, label: 'ST头戴故障', color: 'bg-red-500' }
  ];

  const currentIssues = troubleshooting[activeTab];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">🔧 异常故障速查手册</h1>
        <p className="text-center text-gray-600 mb-8">按设备分类的故障速查指南，快速解决采集过程中的问题</p>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-lg font-medium text-white transition-all ${tab.color} ${
                activeTab === tab.id ? 'shadow-lg scale-105' : 'opacity-70 hover:opacity-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {currentIssues.map((issue, index) => (
            <Card key={index} title={`❌ ${issue.symptom}`}>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-700 mb-1">停机原因</h4>
                  <p className="text-gray-600">{issue.cause}</p>
                </div>
                <div>
                  <h4 className="font-bold text-green-700 mb-1">即时处理方案</h4>
                  <p className="text-gray-600">{issue.solution}</p>
                </div>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    issue.needReport ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {issue.needReport ? '⚠️ 需要报备' : '✅ 无需报备'}
                  </span>
                </div>
                {issue.needReport && issue.reportMaterials.length > 0 && (
                  <div>
                    <h4 className="font-bold text-red-600 mb-1">报备所需材料</h4>
                    <ul className="flex flex-wrap gap-2">
                      {issue.reportMaterials.map((material, i) => (
                        <li key={i} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm">
                          {material}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <Card title="📋 故障处理流程" className="mt-8">
          <div className="flex flex-wrap justify-center items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">1</div>
              <h4 className="font-medium mt-2">发现异常</h4>
            </div>
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="flex flex-col items-center">
              <div className="bg-yellow-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">2</div>
              <h4 className="font-medium mt-2">对照手册</h4>
            </div>
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="flex flex-col items-center">
              <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">3</div>
              <h4 className="font-medium mt-2">处理解决</h4>
            </div>
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="flex flex-col items-center">
              <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">4</div>
              <h4 className="font-medium mt-2">确认恢复</h4>
            </div>
          </div>
          <p className="text-center text-gray-500 mt-6 text-sm">
            若无法解决，请立即联系对接人报备，并提供设备编号和故障截图/照片
          </p>
        </Card>
      </div>
    </div>
  );
}
