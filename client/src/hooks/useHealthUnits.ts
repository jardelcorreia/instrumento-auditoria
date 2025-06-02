import { useState, useEffect } from 'react';

interface HealthUnit {
  id: number;
  name: string;
  type: string;
  address: string;
  cnes_code: string | null;
  manager_name: string | null;
  phone: string | null;
  email: string | null;
}

export function useHealthUnits() {
  const [healthUnits, setHealthUnits] = useState<HealthUnit[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchHealthUnits() {
    try {
      console.log('Fetching health units...');
      const response = await fetch('/api/health-units');
      const data = await response.json();
      console.log('Health units received:', data);
      setHealthUnits(data);
    } catch (error) {
      console.error('Error fetching health units:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHealthUnits();
  }, []);

  return {
    healthUnits,
    loading,
    refetch: fetchHealthUnits,
  };
}
