import { useState, useEffect, useRef, useCallback } from 'react';
import { useNotes, CATEGORIES, COLOR_LABELS } from '../context/NotesContext';
import { useToast } from '../context/ToastContext';
import { 
  Bold, Italic, Underline, List, ListOrdered, 
  Trash2, Archive, Star, Pin, X, Save, Check
} from 'lucide-react';

export default function NoteEditor() {
  const { 
    editingNote, isEditorOpen, closeEditor, 
    createNote, updateNote, deleteNote, 
    togglePin, toggleFavorite, toggleArchive 
  } = useNotes();
  const { addToast } = useToast();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('other');
  const [color, setColor] = useState('blue');
  const [charCount, setCharCount] = useState(0);
  const [saveIndicator, setSaveIndicator] = useState('idle'); // 'idle' | 'saving' | 'saved'
  
  const contentRef = useRef(null);
  const autoSaveTimer = useRef(null);
  const currentNoteIdRef = useRef(null);
  const isInitializingRef = useRef(false);

  const stripHtml = useCallback((html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }, []);

  // Initialize editor when opened or editingNote changes
  useEffect(() => {
    if (!isEditorOpen) {
      currentNoteIdRef.current = null;
      return;
    }

    if (editingNote && editingNote.id !== currentNoteIdRef.current) {
      isInitializingRef.current = true;
      currentNoteIdRef.current = editingNote.id;
      setTitle(editingNote.title);
      setContent(editingNote.content);
      setCategory(editingNote.category);
      setColor(editingNote.color);
      setCharCount(stripHtml(editingNote.content).length);
      if (contentRef.current) contentRef.current.innerHTML = editingNote.content;
      setSaveIndicator('idle');
      // Allow a tick before clearing the flag
      setTimeout(() => { isInitializingRef.current = false; }, 50);
    } else if (!editingNote) {
      currentNoteIdRef.current = null;
      setTitle('');
      setContent('');
      setCategory('other');
      setColor('blue');
      setCharCount(0);
      setSaveIndicator('idle');
      if (contentRef.current) contentRef.current.innerHTML = '';
    }
  }, [editingNote, isEditorOpen, stripHtml]);

  // Cleanup auto-save timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, []);

  const handleContentChange = () => {
    if (isInitializingRef.current) return;
    const html = contentRef.current.innerHTML;
    setContent(html);
    setCharCount(stripHtml(html).length);
    triggerAutoSave(title, html, category, color);
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    triggerAutoSave(val, content, category, color);
  };

  const triggerAutoSave = (t, c, cat, col) => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    setSaveIndicator('saving');
    
    autoSaveTimer.current = setTimeout(() => {
      if (currentNoteIdRef.current) {
        // Update existing note
        updateNote(currentNoteIdRef.current, { title: t, content: c, category: cat, color: col });
      } else if (t.trim() || stripHtml(c).trim()) {
        // Create new note — createNote will set editingNote in context
        const newNote = createNote({ title: t, content: c, category: cat, color: col });
        currentNoteIdRef.current = newNote.id;
      }
      setSaveIndicator('saved');
      setTimeout(() => setSaveIndicator('idle'), 2000);
    }, 800);
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    contentRef.current.focus();
    handleContentChange();
  };

  const handleClose = () => {
    // Flush pending auto-save
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
      if (currentNoteIdRef.current) {
        updateNote(currentNoteIdRef.current, { title, content, category, color });
      } else if (title.trim() || stripHtml(content).trim()) {
        createNote({ title, content, category, color });
      }
    }
    closeEditor();
  };

  if (!isEditorOpen) return null;

  return (
    <div className="editor-overlay" onClick={handleClose}>
      <div className="editor-container" onClick={e => e.stopPropagation()} style={{ '--editor-color': COLOR_LABELS.find(cl => cl.id === color)?.color }}>
        <div className="editor-header">
          <div className="editor-header-left">
            <button 
              className={`editor-action ${editingNote?.isPinned ? 'active' : ''}`}
              onClick={() => currentNoteIdRef.current && togglePin(currentNoteIdRef.current)}
              disabled={!currentNoteIdRef.current}
            >
              <Pin size={18} />
            </button>
            <button 
              className={`editor-action ${editingNote?.isFavorite ? 'active' : ''}`}
              onClick={() => currentNoteIdRef.current && toggleFavorite(currentNoteIdRef.current)}
              disabled={!currentNoteIdRef.current}
            >
              <Star size={18} />
            </button>
          </div>
          <div className="editor-header-right">
             <button className="editor-close" onClick={handleClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <input 
          type="text" 
          placeholder="Note Title" 
          className="editor-title-input"
          value={title}
          onChange={handleTitleChange}
        />

        <div className="editor-toolbar">
          <button onClick={() => execCommand('bold')} title="Bold"><Bold size={16} /></button>
          <button onClick={() => execCommand('italic')} title="Italic"><Italic size={16} /></button>
          <button onClick={() => execCommand('underline')} title="Underline"><Underline size={16} /></button>
          <div className="toolbar-divider"></div>
          <button onClick={() => execCommand('insertUnorderedList')} title="Bullet List"><List size={16} /></button>
          <button onClick={() => execCommand('insertOrderedList')} title="Numbered List"><ListOrdered size={16} /></button>
        </div>

        <div 
          className="editor-content-area"
          contentEditable
          ref={contentRef}
          onInput={handleContentChange}
          data-placeholder="Start typing your note..."
        ></div>

        <div className="editor-footer">
          <div className="editor-settings">
            <select 
              value={category} 
              onChange={(e) => { 
                setCategory(e.target.value); 
                triggerAutoSave(title, content, e.target.value, color); 
              }}
              className="editor-select"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <div className="editor-color-picker">
              {COLOR_LABELS.map(cl => (
                <button 
                  key={cl.id}
                  className={`color-option ${color === cl.id ? 'active' : ''}`}
                  style={{ backgroundColor: cl.color }}
                  onClick={() => { setColor(cl.id); triggerAutoSave(title, content, category, cl.id); }}
                  title={cl.name}
                />
              ))}
            </div>
          </div>
          
          <div className="editor-info">
            <span className="char-count">{charCount} / 5000</span>
            <div className={`save-status ${saveIndicator}`}>
              {saveIndicator === 'saving' ? (
                <><Save size={14} className="saving-spin" /> <span>Saving...</span></>
              ) : saveIndicator === 'saved' ? (
                <><Check size={14} /> <span>Saved</span></>
              ) : (
                <><Save size={14} /> <span>Autosave</span></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
