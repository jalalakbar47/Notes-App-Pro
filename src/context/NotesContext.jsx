import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { loadNotes, saveNotes } from '../utils/localStorage';

const NotesContext = createContext();

export const CATEGORIES = [
  { id: 'study', name: 'Study', color: '#3b82f6' },
  { id: 'personal', name: 'Personal', color: '#ec4899' },
  { id: 'work', name: 'Work', color: '#f97316' },
  { id: 'ideas', name: 'Ideas', color: '#eab308' },
  { id: 'projects', name: 'Projects', color: '#22c55e' },
  { id: 'other', name: 'Other', color: '#6b7280' },
];

export const COLOR_LABELS = [
  { id: 'blue', name: 'Blue', color: '#3b82f6' },
  { id: 'purple', name: 'Purple', color: '#8b5cf6' },
  { id: 'green', name: 'Green', color: '#22c55e' },
  { id: 'orange', name: 'Orange', color: '#f97316' },
  { id: 'red', name: 'Red', color: '#ef4444' },
  { id: 'yellow', name: 'Yellow', color: '#eab308' },
];

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState(() => loadNotes());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editingNote, setEditingNote] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => { saveNotes(notes); }, [notes]);

  const createNote = useCallback((noteData) => {
    const now = new Date().toISOString();
    const newNote = {
      id: generateId(),
      title: noteData.title || '',
      content: noteData.content || '',
      category: noteData.category || 'other',
      color: noteData.color || 'blue',
      isPinned: false,
      isFavorite: false,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    };
    setNotes(prev => [newNote, ...prev]);
    setEditingNote(newNote);
    return newNote;
  }, []);

  const updateNote = useCallback((id, updates) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
    ));
  }, []);

  const deleteNote = useCallback((id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  const togglePin = useCallback((id) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, isPinned: !n.isPinned, updatedAt: new Date().toISOString() } : n
    ));
  }, []);

  const toggleFavorite = useCallback((id) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, isFavorite: !n.isFavorite, updatedAt: new Date().toISOString() } : n
    ));
  }, []);

  const toggleArchive = useCallback((id) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, isArchived: !n.isArchived, updatedAt: new Date().toISOString() } : n
    ));
  }, []);

  const restoreNote = useCallback((id) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, isArchived: false, updatedAt: new Date().toISOString() } : n
    ));
  }, []);

  const openEditor = useCallback((note = null) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  }, []);

  const closeEditor = useCallback(() => {
    setEditingNote(null);
    setIsEditorOpen(false);
  }, []);

  const activeNotes = useMemo(() => notes.filter(n => !n.isArchived), [notes]);
  const archivedNotes = useMemo(() => notes.filter(n => n.isArchived), [notes]);
  const favoriteNotes = useMemo(() => notes.filter(n => n.isFavorite && !n.isArchived), [notes]);
  const pinnedNotes = useMemo(() => notes.filter(n => n.isPinned && !n.isArchived), [notes]);
  const recentNotes = useMemo(() =>
    [...activeNotes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5),
    [activeNotes]
  );

  const getFilteredAndSortedNotes = useCallback((notesList) => {
    let filtered = [...notesList];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().replace(/<[^>]*>/g, '').includes(q) ||
        n.category.toLowerCase().includes(q)
      );
    }
    if (filterCategory !== 'all') {
      filtered = filtered.filter(n => n.category === filterCategory);
    }
    const pinned = filtered.filter(n => n.isPinned);
    const unpinned = filtered.filter(n => !n.isPinned);
    const sortFn = (a, b) => {
      switch (sortBy) {
        case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
        case 'alphabetical': return a.title.localeCompare(b.title);
        case 'updated': return new Date(b.updatedAt) - new Date(a.updatedAt);
        default: return new Date(b.createdAt) - new Date(a.createdAt);
      }
    };
    pinned.sort(sortFn);
    unpinned.sort(sortFn);
    return [...pinned, ...unpinned];
  }, [searchQuery, filterCategory, sortBy]);

  const stats = useMemo(() => ({
    total: notes.length,
    active: activeNotes.length,
    archived: archivedNotes.length,
    favorites: favoriteNotes.length,
    categoriesUsed: [...new Set(activeNotes.map(n => n.category))].length,
  }), [notes, activeNotes, archivedNotes, favoriteNotes]);

  const value = useMemo(() => ({
    notes, activeNotes, archivedNotes, favoriteNotes, pinnedNotes, recentNotes,
    searchQuery, setSearchQuery, sortBy, setSortBy,
    filterCategory, setFilterCategory, currentPage, setCurrentPage,
    editingNote, isEditorOpen,
    createNote, updateNote, deleteNote,
    togglePin, toggleFavorite, toggleArchive, restoreNote,
    openEditor, closeEditor, getFilteredAndSortedNotes, stats,
  }), [notes, activeNotes, archivedNotes, favoriteNotes, pinnedNotes, recentNotes,
    searchQuery, sortBy, filterCategory, currentPage, editingNote, isEditorOpen,
    createNote, updateNote, deleteNote, togglePin, toggleFavorite, toggleArchive,
    restoreNote, openEditor, closeEditor, getFilteredAndSortedNotes, stats]);

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) throw new Error('useNotes must be used within NotesProvider');
  return context;
};
