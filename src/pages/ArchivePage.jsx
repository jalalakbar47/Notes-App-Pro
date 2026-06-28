import { useNotes } from '../context/NotesContext';
import NoteCard from '../components/NoteCard';
import { Archive, FileX } from 'lucide-react';

export default function ArchivePage() {
  const { archivedNotes, getFilteredAndSortedNotes } = useNotes();
  const filteredNotes = getFilteredAndSortedNotes(archivedNotes);

  return (
    <div className="page archive-page">
      {filteredNotes.length > 0 ? (
        <div className="notes-grid">
          {filteredNotes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon-container archive">
            <Archive size={48} />
          </div>
          <h3>Archive is empty</h3>
          <p>Archived notes stay here safe and out of your active list.</p>
        </div>
      )}
    </div>
  );
}
