import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import { useNotes } from '../context/NotesContext';
import { Menu, Plus } from 'lucide-react';

const pageTitles = {
  dashboard: 'Dashboard',
  notes: 'All Notes',
  favorites: 'Favorites',
  archived: 'Archived',
  categories: 'Categories',
};

export default function Header({ onMenuToggle }) {
  const { currentPage, openEditor } = useNotes();

  return (
    <header className="header" id="header">
      <div className="header-left">
        <button className="header-menu-btn" onClick={onMenuToggle} id="menu-toggle-btn">
          <Menu size={22} />
        </button>
        <h1 className="header-title">{pageTitles[currentPage] || 'Notes Pro'}</h1>
      </div>
      <div className="header-center">
        <SearchBar />
      </div>
      <div className="header-right">
        <button className="btn btn-primary" onClick={() => openEditor()} id="new-note-btn">
          <Plus size={18} />
          <span className="btn-label">New Note</span>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
