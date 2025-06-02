import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Audit {
  id: number;
  health_unit_name: string;
  auditor_name: string;
  audit_date: string;
  status: string;
  percentage: number | null;
  created_at: string;
}

interface AuditsListProps {
  audits: Audit[];
  loading: boolean;
  onAuditDeleted: () => void;
}

export function AuditsList({ audits, loading, onAuditDeleted }: AuditsListProps) {
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  async function handleDeleteAudit(auditId: number) {
    setDeletingId(auditId);
    try {
      console.log('Deleting audit:', auditId);
      const response = await fetch(`/api/audits/${auditId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Audit deleted successfully');
        onAuditDeleted();
      } else {
        console.error('Failed to delete audit');
      }
    } catch (error) {
      console.error('Error deleting audit:', error);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-600 text-lg">Carregando auditorias...</div>
      </div>
    );
  }

  if (audits.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-slate-500 text-lg mb-4">
          Nenhuma auditoria realizada ainda.
        </div>
        <Link to="/audits/new">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">Realizar primeira auditoria</Button>
        </Link>
      </div>
    );
  }

  function getStatusLabel(status: string) {
    const statuses: Record<string, string> = {
      em_andamento: 'Em Andamento',
      concluida: 'Concluída',
    };
    return statuses[status] || status;
  }

  function getStatusColor(status: string) {
    const colors: Record<string, string> = {
      em_andamento: 'bg-amber-100 text-amber-700 border-amber-200',
      concluida: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };
    return colors[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  }

  function getScoreColor(percentage: number) {
    if (percentage >= 80) return 'text-emerald-600 font-bold';
    if (percentage >= 60) return 'text-amber-600 font-bold';
    return 'text-red-500 font-bold';
  }

  return (
    <div className="space-y-4">
      {audits.map((audit) => (
        <Card key={audit.id} className="border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
              {/* Main Info */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-xl font-bold text-slate-800 mb-2 sm:mb-0">
                    {audit.health_unit_name}
                  </h3>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(audit.status)}`}>
                    {getStatusLabel(audit.status)}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-slate-600">Auditor:</span>
                    <span className="text-slate-800">{audit.auditor_name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-slate-600">Data:</span>
                    <span className="text-slate-800">
                      {new Date(audit.audit_date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-400">
                  Criada em {new Date(audit.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {/* Score and Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 lg:ml-6">
                {/* Score */}
                <div className="text-center">
                  <div className="text-sm font-medium text-slate-500 mb-1">Pontuação</div>
                  {audit.percentage !== null ? (
                    <div className={`text-3xl font-bold ${getScoreColor(audit.percentage)}`}>
                      {audit.percentage.toFixed(1)}%
                    </div>
                  ) : (
                    <div className="text-2xl font-semibold text-slate-400">
                      -
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2 min-w-[120px]">
                  <Link to={`/audits/${audit.id}`}>
                    <Button 
                      className={`w-full ${
                        audit.status === 'em_andamento' 
                          ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                          : 'bg-slate-500 hover:bg-slate-600 text-white'
                      }`}
                      size="sm"
                    >
                      {audit.status === 'em_andamento' ? 'Continuar' : 'Ver Detalhes'}
                    </Button>
                  </Link>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                        disabled={deletingId === audit.id}
                      >
                        {deletingId === audit.id ? (
                          'Excluindo...'
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-1" />
                            Excluir
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir a auditoria da unidade "{audit.health_unit_name}"? 
                          Esta ação não pode ser desfeita e todos os dados da auditoria serão perdidos.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteAudit(audit.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Excluir Auditoria
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
