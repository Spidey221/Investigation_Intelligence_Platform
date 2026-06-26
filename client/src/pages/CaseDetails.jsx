import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, FolderOpen, Calendar, AlignLeft, Search, Filter, Network, GitGraph, Database, Activity, Share2, Download, Copy } from 'lucide-react';
import { getCaseById, getEvidence, addEvidence, deleteEvidence, getEntitiesByCase, getRelationshipsByCase, getInvestigationGraph, togglePublicAccess, generateReport } from '../api/cases';
import { AddEvidenceModal, EvidenceCard } from '../components/evidence';
import { EntityGroup } from '../components/entities';
import InvestigationGraph from '../components/graph/InvestigationGraph';
import AuditTimeline from '../components/audit/AuditTimeline';
import { toast } from 'react-hot-toast';
import html2canvas from 'html2canvas';

const CaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('EVIDENCE');
  
  const [caseDetails, setCaseDetails] = useState(null);
  const [evidenceList, setEvidenceList] = useState([]);
  const [entities, setEntities] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  
  const [relSearchQuery, setRelSearchQuery] = useState('');
  const [relFilterType, setRelFilterType] = useState('ALL');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [caseRes, evidenceRes, entitiesRes, relRes, graphRes] = await Promise.all([
        getCaseById(id),
        getEvidence(id),
        getEntitiesByCase(id),
        getRelationshipsByCase(id),
        getInvestigationGraph(id)
      ]);
      setCaseDetails(caseRes.data);
      setEvidenceList(evidenceRes.data);
      setEntities(entitiesRes.data);
      setRelationships(relRes.data);
      setGraphData(graphRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load case intelligence.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvidence = async (formData) => {
    try {
      const res = await addEvidence(id, formData);
      setEvidenceList([res.data, ...evidenceList]);
      toast.success('Evidence secured successfully.');
      setIsModalOpen(false);
      
      // Re-fetch everything to ensure relationships and graph are updated
      await fetchData();
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
        await fetchData(); // Refresh all state
        toast.success('Evidence deleted.');
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete evidence.');
      }
    }
  };

  const handleTogglePublic = async () => {
    try {
      toast.loading('Updating access controls...', { id: 'access' });
      const res = await togglePublicAccess(id);
      setCaseDetails(prev => ({ ...prev, is_public: res.data.is_public, share_token: res.data.share_token }));
      toast.success(res.data.is_public ? 'Case is now Public.' : 'Case is now Private.', { id: 'access' });
    } catch(err) {
      toast.error('Failed to modify access.', { id: 'access' });
    }
  };

  const handleCopyLink = () => {
    if (!caseDetails?.share_token) return;
    const link = `${window.location.origin}/shared/${caseDetails.share_token}`;
    navigator.clipboard.writeText(link);
    toast.success('Share link copied to clipboard!');
  };

  const handleGenerateReport = async () => {
    try {
      toast.loading('Preparing report generation...', { id: 'report' });
      let graphImage = null;
      
      // Force switch to graph tab to capture it if not already there
      const wasGraphOpen = activeTab === 'GRAPH';
      if (!wasGraphOpen) {
        setActiveTab('GRAPH');
        // Wait briefly for render
        await new Promise(res => setTimeout(res, 500));
      }

      const flowElement = document.querySelector('.react-flow');
      if (flowElement) {
        toast.loading('Capturing Intelligence Graph...', { id: 'report' });
        const canvas = await html2canvas(flowElement, { useCORS: true, backgroundColor: '#0f172a' });
        graphImage = canvas.toDataURL('image/png');
      }

      if (!wasGraphOpen) {
        setActiveTab(activeTab); // Switch back
      }

      toast.loading('Building PDF Document...', { id: 'report' });
      const res = await generateReport(id, graphImage);
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `IIP_Report_Case_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      toast.success('Report generated successfully!', { id: 'report' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate PDF report.', { id: 'report' });
    }
  };

  // Entities Filtering
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

  const entityTypes = ['ALL', ...new Set(entities.map(e => e.entity_type))];

  // Relationships Filtering
  const filteredRelationships = useMemo(() => {
    return relationships.filter(r => {
      const searchStr = `${r.source_value} ${r.target_value} ${r.evidence_title || ''}`.toLowerCase();
      const matchesSearch = searchStr.includes(relSearchQuery.toLowerCase());
      const matchesType = relFilterType === 'ALL' || r.relationship_type === relFilterType;
      return matchesSearch && matchesType;
    });
  }, [relationships, relSearchQuery, relFilterType]);

  const relationshipTypes = ['ALL', ...new Set(relationships.map(r => r.relationship_type))];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-cyber-blue">
        <div className="animate-pulse flex items-center gap-2"><Activity size={20} /> Accessing Intelligence Matrix...</div>
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
      <div className="p-8 border-b border-cyber-accent bg-cyber-darker relative">
        <button onClick={() => navigate('/cases')} className="flex items-center gap-2 mb-6 text-cyber-textMuted hover:text-cyber-blue transition-colors text-sm w-fit">
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
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2 w-full justify-center">
              <Plus size={18} />
              Add Evidence
            </button>
            
            <button onClick={handleGenerateReport} className="btn-secondary flex items-center gap-2 w-full justify-center">
              <Download size={18} />
              Export Report
            </button>
          </div>

          {/* Audit Timeline */}
          <AuditTimeline caseId={caseDetails.id} />
        </div>

        {/* Sharing Controls */}
        <div className="mt-6 flex items-center gap-4 bg-cyber-dark p-3 rounded border border-cyber-accent/50 w-fit">
          <div className="flex items-center gap-2">
            <Share2 size={16} className={caseDetails.is_public ? 'text-cyber-blue' : 'text-cyber-textMuted'} />
            <span className="text-sm font-semibold text-cyber-text">Public Sharing:</span>
          </div>
          
          <button 
            onClick={handleTogglePublic} 
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${caseDetails.is_public ? 'bg-cyber-blue' : 'bg-cyber-darker border border-cyber-accent'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${caseDetails.is_public ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
          
          {caseDetails.is_public && caseDetails.share_token && (
            <div className="flex items-center gap-2 ml-4">
              <span className="text-xs font-mono text-cyber-textMuted bg-cyber-darker px-2 py-1 rounded border border-cyber-accent/30 select-all">
                {window.location.origin}/shared/{caseDetails.share_token.substring(0,8)}...
              </span>
              <button onClick={handleCopyLink} className="text-cyber-textMuted hover:text-cyber-blue transition-colors p-1" title="Copy Full Link">
                <Copy size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-8 mt-8 border-b border-cyber-accent">
          <button 
            onClick={() => setActiveTab('EVIDENCE')}
            className={`pb-3 flex items-center gap-2 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'EVIDENCE' ? 'border-cyber-blue text-cyber-blue' : 'border-transparent text-cyber-textMuted hover:text-cyber-text'}`}
          >
            <Database size={16} /> Evidence ({evidenceList.length})
          </button>
          <button 
            onClick={() => setActiveTab('ENTITIES')}
            className={`pb-3 flex items-center gap-2 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'ENTITIES' ? 'border-cyber-blue text-cyber-blue' : 'border-transparent text-cyber-textMuted hover:text-cyber-text'}`}
          >
            <Network size={16} /> Entities ({entities.length})
          </button>
          <button 
            onClick={() => setActiveTab('RELATIONSHIPS')}
            className={`pb-3 flex items-center gap-2 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'RELATIONSHIPS' ? 'border-cyber-blue text-cyber-blue' : 'border-transparent text-cyber-textMuted hover:text-cyber-text'}`}
          >
            <GitGraph size={16} /> Relationships ({relationships.length})
          </button>
          <button 
            onClick={() => setActiveTab('GRAPH')}
            className={`pb-3 flex items-center gap-2 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'GRAPH' ? 'border-cyber-blue text-cyber-blue' : 'border-transparent text-cyber-textMuted hover:text-cyber-text'}`}
          >
            <Activity size={16} /> Investigation Graph
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto relative">
        
        {/* EVIDENCE TAB */}
        {activeTab === 'EVIDENCE' && (
          <div>
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
        )}

        {/* ENTITIES TAB */}
        {activeTab === 'ENTITIES' && (
          <div>
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
        )}

        {/* RELATIONSHIPS TAB */}
        {activeTab === 'RELATIONSHIPS' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h3 className="text-lg font-semibold text-cyber-text">Extracted Relationships</h3>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-textMuted" />
                  <input 
                    type="text" 
                    placeholder="Search relationships..." 
                    value={relSearchQuery}
                    onChange={(e) => setRelSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-cyber-dark border border-cyber-accent rounded text-sm text-cyber-text focus:outline-none focus:border-cyber-blue w-64"
                  />
                </div>
                
                <div className="relative flex items-center gap-2">
                  <Filter size={16} className="text-cyber-textMuted" />
                  <select 
                    value={relFilterType}
                    onChange={(e) => setRelFilterType(e.target.value)}
                    className="bg-cyber-dark border border-cyber-accent rounded px-3 py-2 text-sm text-cyber-text focus:outline-none focus:border-cyber-blue"
                  >
                    {relationshipTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {relationships.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-cyber-textMuted glass-card">
                <p className="text-lg">No relationships established yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredRelationships.map(r => (
                  <div key={r.id} className="glass-card p-4 flex items-center justify-between border-l-4 border-cyber-blue">
                    <div className="flex flex-col gap-1 flex-1">
                      <span className="text-xs text-cyber-textMuted">{r.source_type}</span>
                      <span className="font-mono text-cyber-text font-bold break-all">{r.source_value}</span>
                    </div>
                    
                    <div className="flex flex-col items-center flex-1 px-4 text-center">
                      <span className="text-xs text-cyber-blue font-bold px-2 py-1 bg-cyber-blue/10 rounded-full border border-cyber-blue/30 mb-1">
                        {r.relationship_type.replace('_', ' ')}
                      </span>
                      {r.evidence_title && (
                         <span className="text-xs text-cyber-textMuted truncate max-w-full">Via: {r.evidence_title}</span>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-1 flex-1 text-right">
                      <span className="text-xs text-cyber-textMuted">{r.target_type}</span>
                      <span className="font-mono text-cyber-text font-bold break-all">{r.target_value}</span>
                    </div>
                    
                    <div className="flex items-center justify-center w-16 text-xs font-bold text-cyber-accent ml-4 border-l border-cyber-accent/30 pl-4 h-full">
                      {(parseFloat(r.confidence_score) * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* GRAPH TAB */}
        {activeTab === 'GRAPH' && (
          <div className="h-full">
            <InvestigationGraph data={graphData} />
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
