import React, { useState, useEffect } from 'react';
import { getCaseAudit } from '../../api/audit';
import { Clock, User, FileText, Link as LinkIcon, Shield, AlertTriangle } from 'lucide-react';

const AuditTimeline = ({ caseId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, [caseId]);

  const fetchLogs = async () => {
    try {
      const res = await getCaseAudit(caseId);
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (action) => {
    if (action.includes('CREATED')) return <FileText className="w-4 h-4 text-cyber-blue" />;
    if (action.includes('DELETED')) return <AlertTriangle className="w-4 h-4 text-cyber-red" />;
    if (action.includes('UPLOADED')) return <LinkIcon className="w-4 h-4 text-cyber-blue" />;
    if (action.includes('VERIFICATION')) return <Shield className="w-4 h-4 text-cyber-purple" />;
    return <Clock className="w-4 h-4 text-cyber-muted" />;
  };

  if (loading) return <div className="text-cyber-muted text-sm">Loading audit logs...</div>;
  if (logs.length === 0) return <div className="text-cyber-muted text-sm">No activity recorded.</div>;

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-lg p-6 mt-6">
      <h3 className="text-lg font-bold text-cyber-text mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-cyber-blue" />
        Audit Timeline
      </h3>
      <div className="space-y-6">
        {logs.map((log) => (
          <div key={log.id} className="relative pl-6 border-l-2 border-cyber-border pb-2 last:pb-0">
            <div className="absolute -left-[11px] top-0 bg-cyber-card p-1 rounded-full border border-cyber-border">
              {getIcon(log.action)}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-cyber-text">{log.action}</span>
                <span className="text-xs text-cyber-muted">{new Date(log.created_at).toLocaleString()}</span>
              </div>
              <p className="text-sm text-cyber-muted">{log.details}</p>
              <div className="flex items-center gap-2 mt-1">
                <User className="w-3 h-3 text-cyber-blue" />
                <span className="text-xs text-cyber-blue">{log.user_name} ({log.user_role})</span>
                <span className="text-xs text-cyber-muted">• IP: {log.ip_address}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditTimeline;
