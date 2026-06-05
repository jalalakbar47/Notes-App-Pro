import { useNotes, CATEGORIES, COLOR_LABELS } from '../context/NotesContext';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/dateFormatter';
import { Pin, Star, Archive, Trash2, Edit3, RotateCcw, MoreVertical, AlertTriangle, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function NoteCard({ note }) {
  const { togglePin, toggleFavorite, toggleArchive, deleteNote, openEditor, restoreNote } = useNotes();
  const { addToast } = useToast();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef(null);

  const category = CATEGORIES.find(c => c.id === note.category) || CATEGORIES[CATEGORIES.length - 1];
  const colorLabel = COLOR_LABELS.find(cl => cl.id === note.color) || COLOR_LABELS[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (e, action, message) => {
    e.stopPropagation();
    action(note.id);
    if (message) addToast(message, 'info');
    setShowMenu(false);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    setShowDeleteModal(true);
  };

  const confirmDelete = (e) => {
    e.stopPropagation();
    deleteNote(note.id);
    addToast('Note deleted successfully', 'error');
    setShowDeleteModal(false);
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setShowDeleteModal(false);
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <>
      <div 
        className={`note-card ${note.isPinned ? 'pinned' : ''}`} 
        style={{ '--note-accent': colorLabel.color }}
        onClick={() => openEditor(note)}
      >
        {note.isPinned && <div className="pin-badge"><Pin size={12} fill="currentColor" /></div>}
        
        <div className="note-card-header">
          <span className="note-category" style={{ backgroundColor: `${category.color}20`, color: category.color }}>
            {category.name}
          </span>
          <div className="note-card-actions">
             <button 
              className={`action-btn ${note.isFavorite ? 'active' : ''}`} 
              onClick={(e) => handleAction(e, toggleFavorite)}
              title={note.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star size={16} fill={note.isFavorite ? "currentColor" : "none"} />
            </button>
            
            <div className="more-menu-container" ref={menuRef}>
              <button className="action-btn" onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}>
                <MoreVertical size={16} />
              </button>
              
              {showMenu && (
                <div className="floating-menu">
                  <button onClick={(e) => handleAction(e, togglePin)}>
                    <Pin size={14} /> {note.isPinned ? 'Unpin' : 'Pin'}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); openEditor(note); setShowMenu(false); }}>
                    <Edit3 size={14} /> Edit
                  </button>
                  {note.isArchived ? (
                     <button onClick={(e) => handleAction(e, restoreNote, 'Note restored')}>
                      <RotateCcw size={14} /> Restore
                    </button>
                  ) : (
                    <button onClick={(e) => handleAction(e, toggleArchive, 'Note archived')}>
                      <Archive size={14} /> Archive
                    </button>
                  )}
                  <button className="delete" onClick={handleDeleteClick}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="note-card-content">
          <h3 className="note-title">{note.title || 'Untitled Note'}</h3>
          <p className="note-preview">
            {stripHtml(note.content).substring(0, 120)}
            {stripHtml(note.content).length > 120 ? '...' : ''}
          </p>
        </div>

        <div className="note-card-footer">
          <span className="note-date">{formatDate(note.updatedAt)}</span>
          <div className="note-color-dots">
            <div className="color-dot" style={{ backgroundColor: colorLabel.color }}></div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="delete-modal-overlay" onClick={cancelDelete}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-icon">
              <AlertTriangle size={32} />
            </div>
            <h3 className="delete-modal-title">Delete Note</h3>
            <p className="delete-modal-text">
              Are you sure you want to delete "<strong>{note.title || 'Untitled Note'}</strong>"? This action cannot be undone.
            </p>
            <div className="delete-modal-actions">
              <button className="delete-modal-btn cancel" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="delete-modal-btn confirm" onClick={confirmDelete}>
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
