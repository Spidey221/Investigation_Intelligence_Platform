import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CaseModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Active'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        status: initialData.status
      });
    } else {
      setFormData({ title: '', description: '', status: 'Active' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-cyber-darker border border-cyber-accent rounded-lg w-full max-w-md shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between p-5 border-b border-cyber-accent">
          <h2 className="text-xl font-bold text-cyber-text">
            {initialData ? 'Edit Case' : 'Create New Case'}
          </h2>
          <button onClick={onClose} className="text-cyber-textMuted hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-cyber-textMuted mb-1">Title</label>
            <input 
              type="text"
              required
              className="input-field"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Operation Shadow"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-cyber-textMuted mb-1">Description</label>
            <textarea 
              required
              rows={4}
              className="input-field resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Case details and objectives..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-cyber-textMuted mb-1">Status</label>
            <select 
              className="input-field bg-cyber-dark text-cyber-text"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {initialData ? 'Save Changes' : 'Create Case'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CaseModal;
