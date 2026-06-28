import StatsCards from '../components/StatsCards';
import NoteCard from '../components/NoteCard';
import { useNotes } from '../context/NotesContext';
import { Plus, ChevronRight, Star, Clock } from 'lucide-react';

export default function DashboardPage() {
  const { recentNotes, favoriteNotes, openEditor, setCurrentPage } = useNotes();

  return (
    <div className="page dashboard-page">
      <div className="page-header">
        <div>
          <h2 className="welcome-text">Welcome back!</h2>
          <p className="subtitle">Here's what's happening with your notes.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openEditor()}>
          <Plus size={18} />
          <span>Quick Note</span>
        </button>
      </div>

      <StatsCards />

      <section className="dashboard-section">
        <div className="section-header">
          <div className="section-title">
            <Clock size={20} className="section-icon" />
            <h3>Recent Notes</h3>
          </div>
          <button className="text-btn" onClick={() => setCurrentPage('notes')}>
            View all <ChevronRight size={16} />
          </button>
        </div>
        
        {recentNotes.length > 0 ? (
          <div className="notes-grid">
            {recentNotes.map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <div className="empty-state-mini">
            <p>No recent notes found.</p>
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <div className="section-title">
            <Star size={20} className="section-icon star" />
            <h3>Favorite Notes</h3>
          </div>
          <button className="text-btn" onClick={() => setCurrentPage('favorites')}>
            View all <ChevronRight size={16} />
          </button>
        </div>

        {favoriteNotes.length > 0 ? (
          <div className="notes-grid">
            {favoriteNotes.slice(0, 4).map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <div className="empty-state-mini">
            <p>No favorite notes yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
