import { useState } from 'react';
import { sopLibrary } from '../data/content';
import Card from '../components/Card';
import Button from '../components/Button';

export default function SOPLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedDoc, setSelectedDoc] = useState<typeof sopLibrary[0] | null>(null);

  const categories = ['全部', 'AT设备', 'DF设备', 'BTS项目', 'SW设备', 'ST设备', 'ST项目', '通用'];

  const filteredDocs = sopLibrary.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="text-xl mr-2">📚</span>
            SOP资料库
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">SOP运维资料库</h1>
          <p className="text-gray-600 text-lg">整合4份文档全部操作规范，可搜索、分页查看，支持本地打印导出</p>
        </div>

        <Card className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="搜索SOP文档..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
              />
            </div>
            <div className="flex gap-2 flex-wrap justify-center md:justify-start">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDocs.map(doc => (
            <Card key={doc.id} title={doc.title} className="cursor-pointer hover:-translate-y-1 transition-all" onClick={() => setSelectedDoc(doc)}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                  {doc.category}
                </span>
                <button onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDoc(doc);
                }} className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                  查看详情 <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                {doc.content.substring(0, 100)}...
              </p>
            </Card>
          ))}
        </div>

        {filteredDocs.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg">没有找到匹配的文档</p>
            <p className="text-gray-400 text-sm mt-2">请尝试其他搜索关键词或选择其他分类</p>
          </div>
        )}

        {selectedDoc && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">{selectedDoc.title}</h2>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="text-white hover:text-green-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                    {selectedDoc.category}
                  </span>
                </div>
                <div className="space-y-4">
                  {selectedDoc.content.split('\n').map((line, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={handlePrint}>
                    🖨️ 打印文档
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
