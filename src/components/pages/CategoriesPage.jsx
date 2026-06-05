import { useNotes, CATEGORIES } from '../context/NotesContext';
import NoteCard from '../components/NoteCard';
import { FolderOpen } from 'lucide-react';
import { useState } from 'react';

export default function CategoriesPage() {
  const { activeNotes } = useNotes();
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);

  const filteredNotes = activeNotes.filter(n => n.category === selectedCategory);

  return (
    <div className="page categories-page">
      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id}
            className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
            style={{ '--cat-color': cat.color }}
          >
            {cat.name}
            <span className="tab-count">
              {activeNotes.filter(n => n.category === cat.id).length}
            </span>
          </button>
        ))}
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
            <FolderOpen size={48} />
          </div>
          <h3>No notes in this category</h3>
          <p>Create a note and assign it to this category to see it here.</p>
        </div>
      )}
    </div>
  );
}
