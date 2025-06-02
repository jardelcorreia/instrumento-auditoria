import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHealthUnits } from '@/hooks/useHealthUnits';

interface CreateAuditFormProps {
  onAuditCreated: (auditId: number) => void;
}

export function CreateAuditForm({ onAuditCreated }: CreateAuditFormProps) {
  const { healthUnits, loading: loadingUnits } = useHealthUnits();
  const [formData, setFormData] = React.useState({
    health_unit_id: '',
    auditor_name: '',
    audit_date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Creating audit:', formData);
      const response = await fetch('/api/audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          health_unit_id: parseInt(formData.health_unit_id),
          auditor_name: formData.auditor_name,
          audit_date: formData.audit_date,
        }),
      });

      if (response.ok) {
        const audit = await response.json();
        console.log('Audit created:', audit);
        onAuditCreated(audit.id);
      } else {
        console.error('Failed to create audit');
      }
    } catch (error) {
      console.error('Error creating audit:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  if (loadingUnits) {
    return <div>Carregando unidades...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="health_unit_id">Unidade de Saúde</Label>
        <Select value={formData.health_unit_id} onValueChange={(value) => handleInputChange('health_unit_id', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma unidade" />
          </SelectTrigger>
          <SelectContent>
            {healthUnits.map((unit) => (
              <SelectItem key={unit.id} value={unit.id.toString()}>
                {unit.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="auditor_name">Nome do Auditor</Label>
        <Input
          id="auditor_name"
          value={formData.auditor_name}
          onChange={(e) => handleInputChange('auditor_name', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="audit_date">Data da Auditoria</Label>
        <Input
          id="audit_date"
          type="date"
          value={formData.audit_date}
          onChange={(e) => handleInputChange('audit_date', e.target.value)}
          required
        />
      </div>

      <Button type="submit" disabled={loading || !formData.health_unit_id}>
        {loading ? 'Criando...' : 'Iniciar Auditoria'}
      </Button>
    </form>
  );
}
