import { useNotes } from '../context/NotesContext';
import NoteCard from '../components/NoteCard';
import { Star, FileX } from 'lucide-react';

export default function FavoritesPage() {
  const { favoriteNotes, getFilteredAndSortedNotes } = useNotes();
  const filteredNotes = getFilteredAndSortedNotes(favoriteNotes);

  return (
    <div className="page favorites-page">
      {filteredNotes.length > 0 ? (
        <div className="notes-grid">
          {filteredNotes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon-container star">
            <Star size={48} />
          </div>
          <h3>No favorite notes yet</h3>
          <p>Mark notes as favorites to see them here for quick access.</p>
        </div>
      )}
    </div>
  );
}
