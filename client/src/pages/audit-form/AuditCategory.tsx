import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuditItem } from './AuditItem';

interface AuditCategoryProps {
  category: any;
  items: any[];
  responses: Record<number, any>;
  onResponseChange: (itemId: number, status: string, observations: string) => void;
  disabled: boolean;
}

export function AuditCategory({ category, items, responses, onResponseChange, disabled }: AuditCategoryProps) {
  const evaluatedItems = items.filter(item => 
    responses[item.id]?.status && responses[item.id]?.status !== 'nao_avaliado'
  ).length;

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-gray-900">
          <span className="text-lg font-semibold">{category.name}</span>
          <span className="text-sm font-normal text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {evaluatedItems}/{items.length} avaliados
          </span>
        </CardTitle>
        {category.description && (
          <p className="text-sm text-gray-700 mt-2">{category.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map(item => (
            <AuditItem
              key={item.id}
              item={item}
              response={responses[item.id] || { status: 'nao_avaliado', observations: '' }}
              onResponseChange={(status, observations) => onResponseChange(item.id, status, observations)}
              disabled={disabled}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
