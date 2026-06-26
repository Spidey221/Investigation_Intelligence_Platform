import React from 'react';
import { X, Network, FileText, Database } from 'lucide-react';

const GraphSidebar = ({ node, edges, onClose }) => {
  if (!node) return null;

  // Calculate connections
  const connectedEdges = edges.filter(e => e.source === node.id || e.target === node.id);
  const connectedNodes = connectedEdges.map(e => e.source === node.id ? e.target : e.source);

  return (
    <div className="absolute top-4 right-4 w-80 glass-card bg-cyber-darker/95 border-cyber-accent p-6 flex flex-col gap-6 shadow-2xl z-10 max-h-[90%] overflow-y-auto">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-cyber-text">Entity Details</h3>
        <button onClick={onClose} className="text-cyber-textMuted hover:text-red-400 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-cyber-textMuted uppercase tracking-wider">Type</span>
        <span className="px-3 py-1 bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30 rounded-full w-fit text-sm font-bold">
          {node.data.type}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-cyber-textMuted uppercase tracking-wider">Value</span>
        <span className="font-mono text-cyber-text break-all bg-cyber-dark p-2 rounded border border-cyber-accent/30">
          {node.data.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-cyber-accent/30 pt-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-cyber-textMuted text-xs">
            <Network size={14} /> Connections
          </div>
          <span className="text-xl font-bold text-cyber-text">{connectedEdges.length}</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-cyber-textMuted text-xs">
            <Database size={14} /> Evidence Items
          </div>
          <span className="text-xl font-bold text-cyber-text">{node.data.evidenceCount || 1}</span>
        </div>
      </div>

      {connectedNodes.length > 0 && (
        <div className="border-t border-cyber-accent/30 pt-4">
          <span className="text-xs text-cyber-textMuted uppercase tracking-wider mb-2 block">Direct Connections</span>
          <ul className="flex flex-col gap-2">
            {connectedNodes.map((n, i) => (
              <li key={i} className="text-xs text-cyber-text font-mono bg-cyber-dark p-1.5 rounded truncate" title={n.replace('node-', '')}>
                {n.replace('node-', '')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GraphSidebar;
