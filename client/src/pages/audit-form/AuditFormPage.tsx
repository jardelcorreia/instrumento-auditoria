import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreateAuditForm } from './CreateAuditForm';
import { AuditForm } from './AuditForm';
import { useAuditDetails } from '@/hooks/useAuditDetails';

export function AuditFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const [auditId, setAuditId] = React.useState<number | null>(id ? parseInt(id) : null);
  
  const { audit, responses, loading, refetch } = useAuditDetails(auditId);

  function handleAuditCreated(newAuditId: number) {
    setAuditId(newAuditId);
    navigate(`/audits/${newAuditId}`, { replace: true });
  }

  function handleAuditCompleted() {
    navigate('/audits');
  }

  if (isNew) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/audits')}>
            ← Voltar
          </Button>
          <h1 className="text-3xl font-bold">Nova Auditoria</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Auditoria</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateAuditForm onAuditCreated={handleAuditCreated} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-8">Carregando auditoria...</div>;
  }

  if (!audit) {
    return (
      <div className="text-center py-8">
        <p>Auditoria não encontrada.</p>
        <Button onClick={() => navigate('/audits')} className="mt-4">
          Voltar para Auditorias
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/audits')}>
          ← Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Auditoria - {audit.health_unit_name}</h1>
          <p className="text-gray-600">
            Auditor: {audit.auditor_name} | Data: {new Date(audit.audit_date).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>

      <AuditForm 
        audit={audit}
        responses={responses}
        onAuditCompleted={handleAuditCompleted}
        onRefresh={refetch}
      />
    </div>
  );
}
