import React from 'react';
import EntityCard from './EntityCard';

const EntityGroup = ({ type, entities }) => {
  if (!entities || entities.length === 0) return null;
  
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-lg font-bold text-cyber-text tracking-widest">{type}</h3>
        <span className="bg-cyber-blue/20 text-cyber-blue px-2 py-0.5 rounded-full text-xs font-bold border border-cyber-blue/30">
          {entities.length}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entities.map(entity => (
          <EntityCard key={entity.id} entity={entity} />
        ))}
      </div>
    </div>
  );
};

export default EntityGroup;
