import { useNotes, CATEGORIES } from '../context/NotesContext';
import NoteCard from '../components/NoteCard';
import { Filter, SortAsc, FileX } from 'lucide-react';

export default function NotesPage() {
  const { 
    activeNotes, getFilteredAndSortedNotes, 
    sortBy, setSortBy, 
    filterCategory, setFilterCategory 
  } = useNotes();

  const filteredNotes = getFilteredAndSortedNotes(activeNotes);

  return (
    <div className="page notes-page">
      <div className="filters-bar">
        <div className="filter-group">
          <Filter size={18} className="filter-icon" />
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <SortAsc size={18} className="filter-icon" />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="updated">Recently Updated</option>
          </select>
        </div>
      </div>

      {filteredNotes.length > 0 ? (
        <div className="notes-grid">
          {filteredNotes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon-container">
            <FileX size={48} />
          </div>
          <h3>No notes found</h3>
          <p>Try adjusting your filters or search query, or create a new note.</p>
        </div>
      )}
    </div>
  );
}
