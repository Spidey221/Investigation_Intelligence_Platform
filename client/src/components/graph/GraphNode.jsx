import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Mail, Phone, Link, Globe, MapPin, Hash, User, CreditCard, FileText } from 'lucide-react';

const iconMap = {
  EMAIL: Mail,
  PHONE: Phone,
  URL: Link,
  DOMAIN: Globe,
  IP_ADDRESS: MapPin,
  HASHTAG: Hash,
  USERNAME: User,
  UPI_ID: CreditCard,
  DEFAULT: FileText
};

const colorMap = {
  EMAIL: 'bg-blue-500/20 border-blue-500 text-blue-400',
  PHONE: 'bg-green-500/20 border-green-500 text-green-400',
  URL: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
  DOMAIN: 'bg-orange-500/20 border-orange-500 text-orange-400',
  IP_ADDRESS: 'bg-red-500/20 border-red-500 text-red-400',
  HASHTAG: 'bg-purple-500/20 border-purple-500 text-purple-400',
  USERNAME: 'bg-pink-500/20 border-pink-500 text-pink-400',
  UPI_ID: 'bg-teal-500/20 border-teal-500 text-teal-400',
  DEFAULT: 'bg-gray-500/20 border-gray-500 text-gray-400'
};

const GraphNode = ({ data }) => {
  const Icon = iconMap[data.type] || iconMap.DEFAULT;
  const colorClass = colorMap[data.type] || colorMap.DEFAULT;

  return (
    <div className={`px-4 py-2 shadow-lg rounded-md border-2 ${colorClass} min-w-[150px] text-center backdrop-blur-sm`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-cyber-accent border-0" />
      <div className="flex flex-col items-center gap-2">
        <Icon size={18} />
        <span className="text-xs font-bold font-mono break-all max-w-[140px] truncate" title={data.label}>{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-cyber-accent border-0" />
    </div>
  );
};

export default GraphNode;
