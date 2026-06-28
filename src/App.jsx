import { useState, useEffect } from 'react';
import { NotesProvider, useNotes } from './context/NotesContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NoteEditor from './components/NoteEditor';
import Toast from './components/Toast';
import DashboardPage from './pages/DashboardPage';
import NotesPage from './pages/NotesPage';
import FavoritesPage from './pages/FavoritesPage';
import ArchivePage from './pages/ArchivePage';
import CategoriesPage from './pages/CategoriesPage';
import { Code, Heart } from 'lucide-react';

function AppContent() {
  const { currentPage } = useNotes();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage />;
      case 'notes': return <NotesPage />;
      case 'favorites': return <FavoritesPage />;
      case 'archived': return <ArchivePage />;
      case 'categories': return <CategoriesPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className={`main-content ${!isSidebarOpen ? 'main-content-shifted' : ''}`}>
        <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <div className="page-content">
          {renderPage()}
        </div>

        <footer className="footer">
          <div className="footer-content">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="github-link">
              <Code size={20} />
            </a>
            <p className="dedication">
              Created with <Heart size={14} fill="#ef4444" color="#ef4444" /> by Jalal Akbar
            </p>
            <p className="special-dedication">Dedicated To My ❤️ J/S — My Inspiration.</p>
            <span className="version">v1.0.0</span>
          </div>
        </footer>
      </main>

      <NoteEditor />
      <Toast />

      <style>{`
        .page-content {
          flex: 1;
        }
        .footer {
          padding: 40px 32px;
          border-top: 1px solid var(--border-color);
          margin-top: auto;
          text-align: center;
        }
        .footer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .github-link {
          color: var(--text-muted);
          transition: var(--transition);
        }
        .github-link:hover {
          color: var(--text-primary);
          transform: scale(1.1);
        }
        .dedication {
          font-weight: 600;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .special-dedication {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-style: italic;
        }
        .version {
          font-size: 0.75rem;
          color: var(--text-muted);
          background-color: var(--bg-tertiary);
          padding: 2px 8px;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <NotesProvider>
          <AppContent />
        </NotesProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
