import { useState } from 'react';

interface HeaderProps {
  onNavigate: (path: string) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: '首页', path: '/' },
    { label: '任务广场', path: '/tasksquare' },
    { label: '项目专区', path: '/projects/at' },
    { label: 'SOP库', path: '/sop' },
    { label: '质量判定', path: '/quality' },
    { label: '故障处理', path: '/troubleshooting' }
  ];

  return (
    <header className="bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center space-x-2 hover:text-green-100 transition-colors shrink-0"
          >
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-600 font-bold text-xl shadow-md">
              🎥
            </div>
            <span className="text-xl md:text-2xl font-bold">供应商培训平台</span>
          </button>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-sm font-medium hover:scale-105"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center shrink-0">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden pb-4 space-y-1">
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => {
                  onNavigate(item.path);
                  setMenuOpen(false);
                }}
                className="block w-full px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-left font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
