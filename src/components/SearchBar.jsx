import { useNotes } from '../context/NotesContext';
import { Search, X } from 'lucide-react';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useNotes();
  return (
    <div className="search-bar" id="search-bar">
      <Search size={18} className="search-icon" />
      <input
        type="text"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
        id="search-input"
      />
      {searchQuery && (
        <button className="search-clear" onClick={() => setSearchQuery('')}>
          <X size={16} />
        </button>
      )}
    </div>
  );
}
