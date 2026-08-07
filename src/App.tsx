import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProjectPage from './pages/Projects/ProjectPage';
import SOPLibrary from './pages/SOPLibrary';
import QualityCenter from './pages/QualityCenter';
import Troubleshooting from './pages/Troubleshooting';

type Page = 'home' | 'at' | 'df' | 'sw' | 'st' | 'sop' | 'quality' | 'troubleshooting';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const handleNavigate = (path: string) => {
    switch (path) {
      case '/':
        setCurrentPage('home');
        break;
      case '/projects/at':
        setCurrentPage('at');
        break;
      case '/projects/df':
        setCurrentPage('df');
        break;
      
      case '/projects/sw':
        setCurrentPage('sw');
        break;
      case '/projects/st':
        setCurrentPage('st');
        break;
      case '/sop':
        setCurrentPage('sop');
        break;
      case '/quality':
        setCurrentPage('quality');
        break;
      case '/troubleshooting':
        setCurrentPage('troubleshooting');
        break;
      default:
        setCurrentPage('home');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'at':
      case 'df':
      case 'sw':
      case 'st':
        return <ProjectPage initialProject={currentPage} />;
      case 'sop':
        return <SOPLibrary />;
      case 'quality':
        return <QualityCenter />;
      case 'troubleshooting':
        return <Troubleshooting />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onNavigate={handleNavigate} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}
