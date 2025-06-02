import { useState, useEffect } from 'react';

interface Audit {
  id: number;
  health_unit_name: string;
  auditor_name: string;
  audit_date: string;
  status: string;
  percentage: number | null;
  created_at: string;
}

export function useAudits() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchAudits() {
    try {
      console.log('Fetching audits...');
      const response = await fetch('/api/audits');
      const data = await response.json();
      console.log('Audits received:', data);
      setAudits(data);
    } catch (error) {
      console.error('Error fetching audits:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAudits();
  }, []);

  return {
    audits,
    loading,
    refetch: fetchAudits,
  };
}
