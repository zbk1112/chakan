import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProjectPage from './pages/Projects/ProjectPage';
import SOPLibrary from './pages/SOPLibrary';
import QualityCenter from './pages/QualityCenter';
import Troubleshooting from './pages/Troubleshooting';
import TaskSquare from './pages/TaskSquare';
import TaskDetail from './pages/TaskDetail';

type Page = 'home' | 'at' | 'df' | 'sw' | 'st' | 'sop' | 'quality' | 'troubleshooting' | 'tasksquare' | 'taskdetail';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentTaskId, setCurrentTaskId] = useState<number>(1);

  const handleNavigate = (path: string) => {
    // 匹配 /task/:id
    const taskMatch = path.match(/^\/task\/(\d+)$/);
    if (taskMatch) {
      setCurrentTaskId(parseInt(taskMatch[1], 10));
      setCurrentPage('taskdetail');
      window.scrollTo(0, 0);
      return;
    }

    switch (path) {
      case '/':
        setCurrentPage('home');
        break;
      case '/tasksquare':
        setCurrentPage('tasksquare');
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
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'tasksquare':
        return <TaskSquare onNavigate={handleNavigate} />;
      case 'taskdetail':
        return <TaskDetail taskId={currentTaskId} onNavigate={handleNavigate} />;
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
