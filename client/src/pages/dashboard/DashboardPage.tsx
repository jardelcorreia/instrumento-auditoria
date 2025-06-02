import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { SeedDataButton } from '@/components/SeedDataButton';
import { useAuditsStats } from '@/hooks/useAuditsStats';
import { useHealthUnits } from '@/hooks/useHealthUnits';

export function DashboardPage() {
  const { stats, loading } = useAuditsStats();
  const { healthUnits, refetch } = useHealthUnits();

  function handleSeedComplete() {
    refetch();
  }

  if (loading) {
    return <div className="text-center py-8 text-slate-600">Carregando...</div>;
  }

  function getScoreColor(percentage: number) {
    if (percentage >= 80) return 'text-emerald-600 font-bold';
    if (percentage >= 60) return 'text-amber-600 font-bold';
    return 'text-red-500 font-bold';
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Dashboard de Auditorias</h1>
          <p className="text-lg text-slate-600 mt-2">São Gonçalo do Amarante, Ceará</p>
        </div>
        <div className="flex space-x-3">
          {healthUnits.length === 0 && (
            <SeedDataButton onSeedComplete={handleSeedComplete} />
          )}
          <Link to="/audits/new">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
              Nova Auditoria
            </Button>
          </Link>
        </div>
      </div>

      {healthUnits.length === 0 ? (
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-blue-800 mb-3">
                Bem-vindo ao Sistema de Auditoria!
              </h3>
              <p className="text-blue-700 mb-6 text-lg">
                Para começar, carregue as unidades de saúde reais de São Gonçalo do Amarante, CE.
              </p>
              <SeedDataButton onSeedComplete={handleSeedComplete} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  Unidades Cadastradas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{healthUnits.length}</div>
                <p className="text-sm text-slate-500 mt-1">unidades ativas</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  Total de Auditorias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{stats.totalAudits}</div>
                <p className="text-sm text-slate-500 mt-1">realizadas</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  Auditorias Concluídas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">{stats.completedAudits}</div>
                <p className="text-sm text-slate-500 mt-1">finalizadas</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  Média de Pontuação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${getScoreColor(stats.averageScore || 0)}`}>
                  {stats.averageScore ? stats.averageScore.toFixed(1) : '0'}%
                </div>
                <p className="text-sm text-slate-500 mt-1">desempenho geral</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border border-slate-200 shadow-sm bg-white">
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-xl font-bold text-slate-800">Auditorias Recentes</CardTitle>
                <p className="text-sm text-slate-600 mt-1">Últimas auditorias realizadas</p>
              </CardHeader>
              <CardContent className="p-6">
                {stats.recentAudits.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-600 mb-4">Nenhuma auditoria realizada ainda.</p>
                    <Link to="/audits/new">
                      <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">Realizar primeira auditoria</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats.recentAudits.map((audit) => (
                      <div key={audit.id} className="flex justify-between items-center p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 text-lg">{audit.health_unit_name}</p>
                          <p className="text-sm text-slate-600 mt-1">
                            <span className="font-medium">Auditor:</span> {audit.auditor_name}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(audit.audit_date).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          {audit.percentage ? (
                            <div className={`text-xl font-bold ${getScoreColor(audit.percentage)}`}>
                              {audit.percentage.toFixed(1)}%
                            </div>
                          ) : (
                            <div className="text-amber-600 font-semibold">
                              Em andamento
                            </div>
                          )}
                          <Link to={`/audits/${audit.id}`}>
                            <Button variant="outline" size="sm" className="mt-2 border-slate-300 text-slate-700 hover:bg-slate-50">
                              Ver detalhes
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm bg-white">
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-xl font-bold text-slate-800">Ranking por Desempenho</CardTitle>
                <p className="text-sm text-slate-600 mt-1">Unidades com melhor pontuação média</p>
              </CardHeader>
              <CardContent className="p-6">
                {stats.unitsByPerformance.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-600 mb-4">Dados insuficientes para análise.</p>
                    <p className="text-sm text-slate-500">Complete algumas auditorias para ver o ranking.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats.unitsByPerformance.map((unit, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            index === 0 ? 'bg-amber-500' : 
                            index === 1 ? 'bg-slate-400' : 
                            index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{unit.health_unit_name}</p>
                            <p className="text-sm text-slate-600">
                              {unit.audit_count} auditoria{unit.audit_count !== 1 ? 's' : ''} realizada{unit.audit_count !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xl font-bold ${getScoreColor(unit.avg_percentage || 0)}`}>
                            {unit.avg_percentage?.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="border border-slate-200 shadow-sm bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-sky-50 border-b">
              <CardTitle className="text-xl font-bold text-slate-800">Ações Rápidas</CardTitle>
              <p className="text-sm text-slate-600 mt-1">Acesse as principais funcionalidades do sistema</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/audits/new" className="block">
                  <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                    <h3 className="font-semibold text-blue-800 mb-2">Nova Auditoria</h3>
                    <p className="text-sm text-blue-700">Iniciar uma nova auditoria em uma unidade de saúde</p>
                  </div>
                </Link>
                
                <Link to="/health-units" className="block">
                  <div className="p-4 border border-emerald-200 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer">
                    <h3 className="font-semibold text-emerald-800 mb-2">Gerenciar Unidades</h3>
                    <p className="text-sm text-emerald-700">Visualizar e cadastrar unidades de saúde</p>
                  </div>
                </Link>
                
                <Link to="/audits" className="block">
                  <div className="p-4 border border-purple-200 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
                    <h3 className="font-semibold text-purple-800 mb-2">Histórico</h3>
                    <p className="text-sm text-purple-700">Ver todas as auditorias realizadas</p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
