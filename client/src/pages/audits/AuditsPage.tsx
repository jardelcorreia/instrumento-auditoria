import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AuditsList } from './AuditsList';
import { useAudits } from '@/hooks/useAudits';

export function AuditsPage() {
  const { audits, loading, refetch } = useAudits();

  const completedAudits = audits.filter(audit => audit.status === 'concluida').length;
  const inProgressAudits = audits.filter(audit => audit.status === 'em_andamento').length;
  const averageScore = audits.length > 0 && completedAudits > 0
    ? audits
        .filter(audit => audit.percentage !== null)
        .reduce((sum, audit) => sum + audit.percentage!, 0) / completedAudits
    : 0;

  function handleAuditDeleted() {
    refetch();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Auditorias</h1>
          <p className="text-lg text-slate-600 mt-2">Gerencie e acompanhe todas as auditorias realizadas</p>
        </div>
        <Link to="/audits/new">
          <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
            Nova Auditoria
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Total de Auditorias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{audits.length}</div>
            <p className="text-sm text-slate-500 mt-1">realizadas</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Em Andamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{inProgressAudits}</div>
            <p className="text-sm text-slate-500 mt-1">pendentes</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Média Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${
              averageScore >= 80 ? 'text-emerald-600' : 
              averageScore >= 60 ? 'text-amber-600' : 'text-red-500'
            }`}>
              {averageScore > 0 ? averageScore.toFixed(1) : '0'}%
            </div>
            <p className="text-sm text-slate-500 mt-1">pontuação</p>
          </CardContent>
        </Card>
      </div>

      {/* Audits List */}
      <Card className="border border-slate-200 shadow-sm bg-white">
        <CardHeader className="bg-slate-50 border-b">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div>
              <CardTitle className="text-xl font-bold text-slate-800">Lista de Auditorias</CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                {audits.length} auditoria{audits.length !== 1 ? 's' : ''} encontrada{audits.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button 
                variant="outline" 
                onClick={refetch}
                disabled={loading}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                {loading ? 'Atualizando...' : 'Atualizar Lista'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <AuditsList audits={audits} loading={loading} onAuditDeleted={handleAuditDeleted} />
        </CardContent>
      </Card>
    </div>
  );
}
