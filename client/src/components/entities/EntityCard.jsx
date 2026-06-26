import React from 'react';
import { Copy, Clock, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

const EntityCard = ({ entity }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(entity.entity_value);
    toast.success(`Copied ${entity.entity_type.toLowerCase()}`);
  };

  return (
    <div className="glass-card flex flex-col p-4 border-l-4 border-cyber-blue bg-cyber-darker/50 hover:bg-cyber-darker transition-colors">
      <div className="flex justify-between items-start mb-2">
        <span className="font-mono text-cyber-text text-base font-bold break-all">{entity.entity_value}</span>
        <button onClick={handleCopy} className="text-cyber-textMuted hover:text-cyber-blue transition-colors flex-shrink-0 ml-2" title="Copy to clipboard">
          <Copy size={16} />
        </button>
      </div>
      
      {entity.source_text_excerpt && (
        <div className="text-sm text-cyber-textMuted italic mb-3 line-clamp-2">
          "{entity.source_text_excerpt}"
        </div>
      )}
      
      <div className="mt-auto flex flex-col gap-1 text-xs text-cyber-textMuted border-t border-cyber-accent/30 pt-2">
        <div className="flex items-center gap-1 overflow-hidden">
          <FileText size={12} className="flex-shrink-0" />
          <span className="truncate">Found in: {entity.evidence_title || 'Unknown Evidence'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={12} className="flex-shrink-0" />
          <span>Extracted: {new Date(entity.created_at).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default EntityCard;
