import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuditCategory } from './AuditCategory';
import { useAuditItems } from '@/hooks/useAuditItems';

interface AuditFormProps {
  audit: any;
  responses: any[];
  onAuditCompleted: () => void;
  onRefresh: () => void;
}

export function AuditForm({ audit, responses, onAuditCompleted, onRefresh }: AuditFormProps) {
  const { auditItems, categories, loading } = useAuditItems();
  const [formResponses, setFormResponses] = React.useState<Record<number, any>>({});
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    // Initialize form responses with existing responses
    const initialResponses: Record<number, any> = {};
    responses.forEach(response => {
      initialResponses[response.audit_item_id] = {
        status: response.status,
        observations: response.observations || '',
      };
    });
    setFormResponses(initialResponses);
  }, [responses]);

  function handleResponseChange(itemId: number, status: string, observations: string) {
    setFormResponses(prev => ({
      ...prev,
      [itemId]: { status, observations }
    }));
  }

  async function handleSave() {
    setSaving(true);
    
    try {
      console.log('Saving audit responses...');
      
      const responsesToSave = auditItems.map(item => {
        const response = formResponses[item.id] || { status: 'nao_avaliado', observations: '' };
        let score = 0;
        
        if (response.status === 'conforme') {
          score = item.points;
        } else if (response.status === 'parcialmente_conforme') {
          score = item.points * 0.5;
        }
        
        return {
          audit_item_id: item.id,
          status: response.status,
          score: score,
          observations: response.observations,
          max_points: item.points,
        };
      });
      
      console.log('Responses to save:', responsesToSave);
      
      const saveResponse = await fetch(`/api/audits/${audit.id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: responsesToSave }),
      });
      
      if (saveResponse.ok) {
        const result = await saveResponse.json();
        console.log('Audit responses saved successfully:', result);
        await onRefresh();
        onAuditCompleted();
      } else {
        const error = await saveResponse.text();
        console.error('Failed to save audit responses:', error);
      }
    } catch (error) {
      console.error('Error saving audit responses:', error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando itens de auditoria...</div>;
  }

  const categorizedItems = categories.map(category => ({
    ...category,
    items: auditItems.filter(item => item.category_id === category.id)
  }));

  const evaluatedItemsCount = Object.values(formResponses).filter(response => 
    response.status && response.status !== 'nao_avaliado'
  ).length;

  const allItemsEvaluated = auditItems.every(item => 
    formResponses[item.id]?.status && formResponses[item.id]?.status !== 'nao_avaliado'
  );

  return (
    <div className="space-y-6">
      {audit.status === 'concluida' && (
        <Card className="border-green-300 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-green-800">Auditoria Concluída</h3>
                <p className="text-green-700">
                  Pontuação: {audit.total_score?.toFixed(1)} de {audit.max_score?.toFixed(1)} 
                  ({audit.percentage?.toFixed(1)}%)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {categorizedItems.map(category => (
        <AuditCategory
          key={category.id}
          category={category}
          items={category.items}
          responses={formResponses}
          onResponseChange={handleResponseChange}
          disabled={audit.status === 'concluida'}
        />
      ))}

      {audit.status !== 'concluida' && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">
                  Progresso: {evaluatedItemsCount} de {auditItems.length} itens avaliados
                </p>
                {!allItemsEvaluated && (
                  <p className="text-xs text-red-600 mt-1">
                    Todos os itens devem ser avaliados para finalizar a auditoria
                  </p>
                )}
              </div>
              <Button 
                onClick={handleSave}
                disabled={saving || !allItemsEvaluated}
                size="lg"
                className={allItemsEvaluated ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                {saving ? 'Salvando...' : 'Finalizar Auditoria'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
