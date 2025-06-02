import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface AuditItemProps {
  item: any;
  response: any;
  onResponseChange: (status: string, observations: string) => void;
  disabled: boolean;
}

export function AuditItem({ item, response, onResponseChange, disabled }: AuditItemProps) {
  function handleStatusChange(status: string) {
    onResponseChange(status, response.observations);
  }

  function handleObservationsChange(observations: string) {
    onResponseChange(response.status, observations);
  }

  function getStatusBorderColor(status: string) {
    const colors: Record<string, string> = {
      conforme: 'border-green-500',
      nao_conforme: 'border-red-500',
      parcialmente_conforme: 'border-yellow-500',
      nao_avaliado: 'border-gray-300',
    };
    return colors[status] || 'border-gray-300';
  }

  function getStatusTextColor(status: string) {
    const colors: Record<string, string> = {
      conforme: 'text-green-700',
      nao_conforme: 'text-red-700',
      parcialmente_conforme: 'text-yellow-700',
      nao_avaliado: 'text-gray-700',
    };
    return colors[status] || 'text-gray-700';
  }

  return (
    <div className={`p-4 border-2 rounded-lg bg-white ${getStatusBorderColor(response.status)}`}>
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="font-medium text-gray-900">{item.item_text}</p>
            <div className="flex items-center space-x-4 text-sm mt-1">
              <span className="text-gray-700">Pontos: {item.points}</span>
              {item.is_mandatory === 1 && (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium border border-red-200">
                  Obrigatório
                </span>
              )}
              {response.status !== 'nao_avaliado' && (
                <span className={`font-medium ${getStatusTextColor(response.status)}`}>
                  {response.status === 'conforme' && 'Conforme'}
                  {response.status === 'nao_conforme' && 'Não Conforme'}
                  {response.status === 'parcialmente_conforme' && 'Parcialmente Conforme'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`status-${item.id}`} className="text-gray-900 font-medium">Status</Label>
            <Select
              value={response.status}
              onValueChange={handleStatusChange}
              disabled={disabled}
            >
              <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nao_avaliado">Não Avaliado</SelectItem>
                <SelectItem value="conforme">Conforme</SelectItem>
                <SelectItem value="parcialmente_conforme">Parcialmente Conforme</SelectItem>
                <SelectItem value="nao_conforme">Não Conforme</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor={`observations-${item.id}`} className="text-gray-900 font-medium">Observações</Label>
            <Input
              id={`observations-${item.id}`}
              value={response.observations}
              onChange={(e) => handleObservationsChange(e.target.value)}
              placeholder="Observações sobre o item"
              disabled={disabled}
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
