import React, { useState, useEffect } from 'react';
import { Topbar } from '../components/layout';
import { CaseCard, CaseModal } from '../components/cases';
import { getCases, createCase, updateCase, deleteCase } from '../api/cases';
import { Loader, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState(null);

  const fetchCases = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCases();
      setCases(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch cases. Ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleOpenCreate = () => {
    setEditingCase(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (caseItem) => {
    setEditingCase(caseItem);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      try {
        await deleteCase(id);
        setCases(cases.filter(c => c.id !== id));
      } catch (err) {
        console.error(err);
        alert('Failed to delete case.');
      }
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (editingCase) {
        const res = await updateCase(editingCase.id, formData);
        setCases(cases.map(c => c.id === editingCase.id ? res.data : c));
      } else {
        const res = await createCase(formData);
        setCases([res.data, ...cases]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert(`Failed to ${editingCase ? 'update' : 'create'} case.`);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Topbar onCreateClick={handleOpenCreate} />
      
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-cyber-text">Active Investigations</h2>
          <p className="text-cyber-textMuted text-sm mt-1">Manage and monitor all ongoing cases across the platform.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400">
            <AlertTriangle size={20} />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-cyber-blue">
            <Loader size={40} className="animate-spin mb-4" />
            <p className="text-cyber-textMuted font-medium animate-pulse">Loading intelligence files...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cases.length === 0 && !error ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-cyber-textMuted glass-card">
                <p className="text-lg mb-4">No active cases found.</p>
                <button onClick={handleOpenCreate} className="btn-secondary">
                  Initialize First Case
                </button>
              </div>
            ) : (
              cases.map(caseItem => (
                <CaseCard 
                  key={caseItem.id} 
                  caseItem={caseItem} 
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        )}
      </div>

      <CaseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingCase}
      />
    </div>
  );
};

export default Dashboard;
