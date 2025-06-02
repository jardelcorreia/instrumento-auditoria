import { useState, useEffect } from 'react';

export function useAuditDetails(auditId: number | null) {
  const [audit, setAudit] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchAuditDetails() {
    if (!auditId) return;
    
    setLoading(true);
    try {
      console.log('Fetching audit details for ID:', auditId);
      const response = await fetch(`/api/audits/${auditId}`);
      const data = await response.json();
      console.log('Audit details received:', data);
      
      setAudit(data.audit);
      setResponses(data.responses);
    } catch (error) {
      console.error('Error fetching audit details:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAuditDetails();
  }, [auditId]);

  return {
    audit,
    responses,
    loading,
    refetch: fetchAuditDetails,
  };
}
