import { useState, useEffect } from 'react';

interface AuditStats {
  totalAudits: number;
  completedAudits: number;
  pendingAudits: number;
  averageScore: number;
  recentAudits: any[];
  unitsByPerformance: any[];
}

export function useAuditsStats() {
  const [stats, setStats] = useState<AuditStats>({
    totalAudits: 0,
    completedAudits: 0,
    pendingAudits: 0,
    averageScore: 0,
    recentAudits: [],
    unitsByPerformance: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        console.log('Fetching audit stats...');
        const response = await fetch('/api/audits');
        const audits = await response.json();
        console.log('Audits received:', audits);

        const totalAudits = audits.length;
        const completedAudits = audits.filter((a: any) => a.status === 'concluida').length;
        const pendingAudits = audits.filter((a: any) => a.status === 'em_andamento').length;
        
        const completedWithScores = audits.filter((a: any) => a.percentage !== null);
        const averageScore = completedWithScores.length > 0
          ? completedWithScores.reduce((sum: number, a: any) => sum + a.percentage, 0) / completedWithScores.length
          : 0;

        const recentAudits = audits.slice(0, 5);

        // Group by health unit for performance analysis
        const unitGroups = audits.reduce((acc: any, audit: any) => {
          if (!acc[audit.health_unit_name]) {
            acc[audit.health_unit_name] = [];
          }
          acc[audit.health_unit_name].push(audit);
          return acc;
        }, {});

        const unitsByPerformance = Object.entries(unitGroups)
          .map(([unitName, unitAudits]: [string, any]) => {
            const completedAudits = unitAudits.filter((a: any) => a.percentage !== null);
            const avgPercentage = completedAudits.length > 0
              ? completedAudits.reduce((sum: number, a: any) => sum + a.percentage, 0) / completedAudits.length
              : null;
            
            return {
              health_unit_name: unitName,
              audit_count: unitAudits.length,
              avg_percentage: avgPercentage,
            };
          })
          .filter(unit => unit.avg_percentage !== null)
          .sort((a, b) => (b.avg_percentage || 0) - (a.avg_percentage || 0))
          .slice(0, 5);

        setStats({
          totalAudits,
          completedAudits,
          pendingAudits,
          averageScore,
          recentAudits,
          unitsByPerformance,
        });
      } catch (error) {
        console.error('Error fetching audit stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading };
}
