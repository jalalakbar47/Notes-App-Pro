import { useNotes } from '../context/NotesContext';
import {
  LayoutDashboard, FileText, Star, Archive, FolderOpen,
  PanelLeftClose, PanelLeftOpen, Sparkles
} from 'lucide-react';

export default function Sidebar({ isOpen, onToggle }) {
  const { currentPage, setCurrentPage, stats } = useNotes();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'notes', label: 'All Notes', icon: FileText, count: stats.active },
    { id: 'favorites', label: 'Favorites', icon: Star, count: stats.favorites },
    { id: 'archived', label: 'Archived', icon: Archive, count: stats.archived },
    { id: 'categories', label: 'Categories', icon: FolderOpen },
  ];

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`} id="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <Sparkles size={22} />
            </div>
            {isOpen && <span className="logo-text">Notes Pro</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`sidebar-item ${currentPage === item.id ? 'sidebar-item-active' : ''}`}
                onClick={() => setCurrentPage(item.id)}
                title={item.label}
                id={`nav-${item.id}`}
              >
                <Icon size={20} />
                {isOpen && (
                  <>
                    <span className="sidebar-item-label">{item.label}</span>
                    {item.count !== undefined && item.count > 0 && (
                      <span className="sidebar-item-count">{item.count}</span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-toggle" onClick={onToggle} id="sidebar-toggle-btn">
            {isOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            {isOpen && <span>Collapse</span>}
          </button>
        </div>
      </aside>
      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}
    </>
  );
}
