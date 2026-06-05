import { FileText, CheckCircle, Archive, Star, FolderOpen } from 'lucide-react';
import { useNotes } from '../context/NotesContext';

export default function StatsCards() {
  const { stats } = useNotes();

  const cards = [
    { label: 'Total Notes', value: stats.total, icon: FileText, color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
    { label: 'Active Notes', value: stats.active, icon: CheckCircle, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
    { label: 'Archived', value: stats.archived, icon: Archive, color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
    { label: 'Favorites', value: stats.favorites, icon: Star, color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
    { label: 'Categories', value: stats.categoriesUsed, icon: FolderOpen, color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div key={i} className="stat-card" style={{ '--stat-color': card.color, '--stat-bg': card.bg, animationDelay: `${i * 0.1}s` }}>
            <div className="stat-card-icon">
              <Icon size={24} />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-value">{card.value}</span>
              <span className="stat-card-label">{card.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
