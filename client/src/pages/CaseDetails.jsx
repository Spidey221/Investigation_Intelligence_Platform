import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, FolderOpen, Calendar, AlignLeft } from 'lucide-react';
import { getCaseById, getEvidence, addEvidence, deleteEvidence } from '../api/cases';
import AddEvidenceModal from '../components/AddEvidenceModal';
import EvidenceCard from '../components/EvidenceCard';
import { toast } from 'react-hot-toast';

const CaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [caseDetails, setCaseDetails] = useState(null);
  const [evidenceList, setEvidenceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [caseRes, evidenceRes] = await Promise.all([
          getCaseById(id),
          getEvidence(id)
        ]);
        setCaseDetails(caseRes.data);
        setEvidenceList(evidenceRes.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load case details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddEvidence = async (formData) => {
    try {
      const res = await addEvidence(id, formData);
      setEvidenceList([res.data, ...evidenceList]);
      toast.success('Evidence secured successfully.');
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to add evidence.');
      throw err;
    }
  };

  const handleDeleteEvidence = async (evidenceId) => {
    if (window.confirm('Are you sure you want to permanently delete this evidence?')) {
      try {
        await deleteEvidence(evidenceId);
        setEvidenceList(evidenceList.filter(e => e.id !== evidenceId));
        toast.success('Evidence deleted.');
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete evidence.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-cyber-blue">
        <div className="animate-pulse">Accessing Intelligence Files...</div>
      </div>
    );
  }

  if (!caseDetails) {
    return (
      <div className="p-8 text-cyber-text">
        <button onClick={() => navigate('/cases')} className="flex items-center gap-2 mb-6 hover:text-cyber-blue transition-colors">
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        <p className="text-red-400">Case not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-cyber-dark">
      <div className="p-8 border-b border-cyber-accent bg-cyber-darker">
        <button onClick={() => navigate('/cases')} className="flex items-center gap-2 mb-6 text-cyber-textMuted hover:text-cyber-blue transition-colors text-sm">
          <ArrowLeft size={16} /> Back to Active Investigations
        </button>
        
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FolderOpen className="text-cyber-blue" size={28} />
              <h1 className="text-2xl font-bold text-cyber-text">{caseDetails.title}</h1>
              <span className="px-3 py-1 text-xs font-medium rounded-full border border-cyber-accent bg-cyber-accent/30 text-cyber-text">
                {caseDetails.status}
              </span>
            </div>
            
            <div className="flex items-start gap-2 text-cyber-textMuted mt-4 max-w-3xl">
              <AlignLeft size={18} className="mt-1 flex-shrink-0" />
              <p className="leading-relaxed">{caseDetails.description}</p>
            </div>
            
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-sm text-cyber-textMuted">
                <Calendar size={16} />
                <span>Opened: {new Date(caseDetails.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-cyber-textMuted">
                <FolderOpen size={16} />
                <span>{evidenceList.length} Items</span>
              </div>
            </div>
          </div>
          
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Add Evidence
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <h3 className="text-lg font-semibold text-cyber-text mb-6">Evidence Timeline</h3>
        
        {evidenceList.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-cyber-textMuted glass-card">
            <p className="text-lg mb-4">No evidence collected yet.</p>
            <button onClick={() => setIsModalOpen(true)} className="btn-secondary">
              Initialize Evidence Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {evidenceList.map(evidence => (
              <EvidenceCard 
                key={evidence.id} 
                evidence={evidence} 
                onDelete={handleDeleteEvidence} 
              />
            ))}
          </div>
        )}
      </div>

      <AddEvidenceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddEvidence} 
      />
    </div>
  );
};

export default CaseDetails;
