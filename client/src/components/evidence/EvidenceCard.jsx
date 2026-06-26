import React from 'react';
import { FileText, Image as ImageIcon, Link as LinkIcon, FileCheck, StickyNote, Trash2, Download } from 'lucide-react';
import api from '../../api/axios'; // if we need base url, but actually we can just point to /uploads since vite proxies it.

const EvidenceCard = ({ evidence, onDelete }) => {
  const typeConfig = {
    Image: { color: 'text-blue-400 border-blue-400/30 bg-blue-400/10', icon: ImageIcon },
    PDF: { color: 'text-red-400 border-red-400/30 bg-red-400/10', icon: FileCheck },
    URL: { color: 'text-green-400 border-green-400/30 bg-green-400/10', icon: LinkIcon },
    Note: { color: 'text-purple-400 border-purple-400/30 bg-purple-400/10', icon: StickyNote },
    Text: { color: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10', icon: FileText }
  };

  const config = typeConfig[evidence.type] || typeConfig['Text'];
  const Icon = config.icon;

  const renderContent = () => {
    switch(evidence.type) {
      case 'Image':
        return (
          <div className="mt-3 rounded-lg overflow-hidden border border-cyber-accent">
            <img src={`http://localhost:5000/uploads/${evidence.file_path}`} alt={evidence.title} className="w-full max-h-64 object-cover" />
          </div>
        );
      case 'PDF':
        return (
          <div className="mt-3">
            <a 
              href={`http://localhost:5000/uploads/${evidence.file_path}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-accent hover:bg-gray-700 text-cyber-text rounded-md transition-colors text-sm font-medium"
            >
              <Download size={16} />
              View / Download PDF
            </a>
            <p className="text-xs text-cyber-textMuted mt-2">{evidence.original_filename}</p>
          </div>
        );
      case 'URL':
        return (
          <div className="mt-3">
            <a 
              href={evidence.content} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyber-blue hover:underline break-all"
            >
              {evidence.content}
            </a>
          </div>
        );
      case 'Note':
      case 'Text':
      default:
        return (
          <div className="mt-3 bg-cyber-darker p-3 rounded-md border border-gray-800">
            <p className="text-cyber-textMuted text-sm whitespace-pre-wrap">{evidence.content}</p>
          </div>
        );
    }
  };

  return (
    <div className="glass-card p-5 relative group transition-all hover:border-cyber-blue/30">
      <button 
        onClick={() => onDelete(evidence.id)}
        className="absolute top-4 right-4 p-1.5 text-cyber-textMuted hover:text-red-400 rounded hover:bg-cyber-accent opacity-0 group-hover:opacity-100 transition-opacity"
        title="Delete Evidence"
      >
        <Trash2 size={16} />
      </button>
      
      <div className="flex items-center gap-3 mb-3">
        <span className={`flex items-center justify-center w-8 h-8 rounded border ${config.color}`}>
          <Icon size={16} />
        </span>
        <div>
          <h4 className="text-md font-semibold text-cyber-text">{evidence.title}</h4>
          <span className="text-xs text-cyber-textMuted">
            {new Date(evidence.created_at).toLocaleString()}
          </span>
        </div>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default EvidenceCard;
