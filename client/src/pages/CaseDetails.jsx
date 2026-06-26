import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, FolderOpen, Calendar, AlignLeft, Search, Filter } from 'lucide-react';
import { getCaseById, getEvidence, addEvidence, deleteEvidence, getEntitiesByCase } from '../api/cases';
import { AddEvidenceModal, EvidenceCard } from '../components/evidence';
import { EntityGroup } from '../components/entities';
import { toast } from 'react-hot-toast';

const CaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [caseDetails, setCaseDetails] = useState(null);
  const [evidenceList, setEvidenceList] = useState([]);
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [caseRes, evidenceRes, entitiesRes] = await Promise.all([
          getCaseById(id),
          getEvidence(id),
          getEntitiesByCase(id)
        ]);
        setCaseDetails(caseRes.data);
        setEvidenceList(evidenceRes.data);
        setEntities(entitiesRes.data);
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
      
      // Re-fetch entities synchronously after new evidence is added
      const entitiesRes = await getEntitiesByCase(id);
      setEntities(entitiesRes.data);
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
        // Remove associated entities from state to avoid extra fetch
        setEntities(entities.filter(e => e.evidence_id !== evidenceId));
        toast.success('Evidence deleted.');
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete evidence.');
      }
    }
  };

  const filteredEntities = useMemo(() => {
    return entities.filter(e => {
      const matchesSearch = e.entity_value.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'ALL' || e.entity_type === filterType;
      return matchesSearch && matchesType;
    });
  }, [entities, searchQuery, filterType]);

  const groupedEntities = useMemo(() => {
    return filteredEntities.reduce((acc, curr) => {
      if (!acc[curr.entity_type]) acc[curr.entity_type] = [];
      acc[curr.entity_type].push(curr);
      return acc;
    }, {});
  }, [filteredEntities]);

  // Derive unique entity types for the filter dropdown
  const entityTypes = ['ALL', ...new Set(entities.map(e => e.entity_type))];

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
        {/* Evidence Section */}
        <div className="mb-12">
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

        {/* Entities Section */}
        <div className="pt-8 border-t border-cyber-accent">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h3 className="text-lg font-semibold text-cyber-text">Detected Entities</h3>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-textMuted" />
                <input 
                  type="text" 
                  placeholder="Search entities..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-cyber-dark border border-cyber-accent rounded text-sm text-cyber-text focus:outline-none focus:border-cyber-blue w-64"
                />
              </div>
              
              <div className="relative flex items-center gap-2">
                <Filter size={16} className="text-cyber-textMuted" />
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-cyber-dark border border-cyber-accent rounded px-3 py-2 text-sm text-cyber-text focus:outline-none focus:border-cyber-blue"
                >
                  {entityTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {entities.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-cyber-textMuted glass-card">
              <p className="text-lg">No intelligence indicators detected.</p>
            </div>
          ) : Object.keys(groupedEntities).length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-cyber-textMuted glass-card">
              <p className="text-lg">No entities match your search criteria.</p>
            </div>
          ) : (
            <div>
              {Object.entries(groupedEntities).map(([type, items]) => (
                <EntityGroup key={type} type={type} entities={items} />
              ))}
            </div>
          )}
        </div>
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
