import React, { useState } from 'react';
import { X, UploadCloud } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AddEvidenceModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Image',
    content: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const evidenceTypes = ['Image', 'PDF', 'URL', 'Note', 'Text'];

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type) {
      toast.error('Title and Evidence Type are required.');
      return;
    }

    if (['Image', 'PDF'].includes(formData.type) && !file) {
      toast.error(`Please select a file for ${formData.type} upload.`);
      return;
    }

    if (['URL', 'Note', 'Text'].includes(formData.type) && !formData.content) {
      toast.error('Content cannot be empty.');
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('type', formData.type);
    
    if (['Image', 'PDF'].includes(formData.type)) {
      data.append('file', file);
    } else {
      data.append('content', formData.content);
    }

    try {
      await onSubmit(data);
      // Reset state
      setFormData({ title: '', type: 'Image', content: '' });
      setFile(null);
    } catch (err) {
      // Error handled in parent
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Basic validation
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB limit.');
        return;
      }
      setFile(selectedFile);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-cyber-card border border-cyber-accent rounded-lg w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-cyber-accent bg-cyber-darker/50">
          <h2 className="text-lg font-bold text-cyber-text">Add Evidence</h2>
          <button onClick={onClose} className="text-cyber-textMuted hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-cyber-textMuted mb-1">Evidence Title</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="E.g., Suspect Chat Logs" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cyber-textMuted mb-1">Evidence Type</label>
            <select 
              className="input-field bg-cyber-dark"
              value={formData.type}
              onChange={(e) => {
                setFormData({...formData, type: e.target.value, content: ''});
                setFile(null);
              }}
            >
              {evidenceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {['URL'].includes(formData.type) && (
            <div>
              <label className="block text-sm font-medium text-cyber-textMuted mb-1">URL</label>
              <input 
                type="url" 
                className="input-field" 
                placeholder="https://..." 
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                required
              />
            </div>
          )}

          {['Note', 'Text'].includes(formData.type) && (
            <div>
              <label className="block text-sm font-medium text-cyber-textMuted mb-1">Content</label>
              <textarea 
                className="input-field min-h-[120px] resize-y" 
                placeholder="Enter detailed notes..." 
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                required
              />
            </div>
          )}

          {['Image', 'PDF'].includes(formData.type) && (
            <div>
              <label className="block text-sm font-medium text-cyber-textMuted mb-1">Upload File (Max 5MB)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md hover:border-cyber-blue/50 transition-colors bg-cyber-darker">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-cyber-textMuted" />
                  <div className="flex text-sm text-cyber-text">
                    <label className="relative cursor-pointer rounded-md font-medium text-cyber-blue hover:text-cyber-blueHover focus-within:outline-none">
                      <span>Upload a file</span>
                      <input type="file" className="sr-only" onChange={handleFileChange} accept={formData.type === 'Image' ? 'image/jpeg,image/png,image/webp' : 'application/pdf'} />
                    </label>
                    <p className="pl-1 text-cyber-textMuted">or drag and drop</p>
                  </div>
                  <p className="text-xs text-cyber-textMuted">
                    {file ? file.name : (formData.type === 'Image' ? 'PNG, JPG, WEBP up to 5MB' : 'PDF up to 5MB')}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-cyber-accent">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Processing...' : 'Secure Evidence'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvidenceModal;
