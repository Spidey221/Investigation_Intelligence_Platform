import React from 'react';
import { Clock, ShieldAlert, Edit2, Trash2 } from 'lucide-react';

const CaseCard = ({ caseItem, onEdit, onDelete }) => {
  const statusColors = {
    'Active': 'text-green-400 border-green-400/30 bg-green-400/10',
    'Closed': 'text-gray-400 border-gray-400/30 bg-gray-400/10',
    'Archived': 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
  };

  const statusStyle = statusColors[caseItem.status] || statusColors['Active'];

  return (
    <div className="glass-card p-5 flex flex-col hover:border-cyber-blue/50 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-cyber-blue" size={20} />
          <h3 className="text-lg font-semibold text-cyber-text truncate pr-4">{caseItem.title}</h3>
        </div>
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${statusStyle}`}>
          {caseItem.status}
        </span>
      </div>
      
      <p className="text-cyber-textMuted text-sm flex-1 mb-6 line-clamp-3">
        {caseItem.description}
      </p>
      
      <div className="flex items-center justify-between pt-4 border-t border-cyber-accent mt-auto">
        <div className="flex items-center gap-1.5 text-xs text-cyber-textMuted">
          <Clock size={14} />
          <span>{new Date(caseItem.created_at).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(caseItem)} 
            className="p-1.5 text-cyber-textMuted hover:text-cyber-blue rounded hover:bg-cyber-accent transition-colors"
            title="Edit Case"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => onDelete(caseItem.id)} 
            className="p-1.5 text-cyber-textMuted hover:text-red-400 rounded hover:bg-cyber-accent transition-colors"
            title="Delete Case"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaseCard;
