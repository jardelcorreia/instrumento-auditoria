import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

interface HealthUnitsListProps {
  healthUnits: HealthUnit[];
  loading: boolean;
}

export function HealthUnitsList({ healthUnits, loading }: HealthUnitsListProps) {
  if (loading) {
    return <div className="text-center py-8 text-slate-600">Carregando unidades...</div>;
  }

  if (healthUnits.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        Nenhuma unidade de saúde cadastrada ainda.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-slate-700 font-semibold">Nome</TableHead>
          <TableHead className="text-slate-700 font-semibold">Endereço</TableHead>
          <TableHead className="text-slate-700 font-semibold">CNES</TableHead>
          <TableHead className="text-slate-700 font-semibold">Gestor</TableHead>
          <TableHead className="text-slate-700 font-semibold">Contato</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {healthUnits.map((unit) => (
          <TableRow key={unit.id}>
            <TableCell className="font-medium text-slate-800">{unit.name}</TableCell>
            <TableCell className="text-slate-700">{unit.address}</TableCell>
            <TableCell className="text-slate-700">{unit.cnes_code || '-'}</TableCell>
            <TableCell className="text-slate-700">{unit.manager_name || '-'}</TableCell>
            <TableCell className="text-slate-700">
              {unit.phone && (
                <div>{unit.phone}</div>
              )}
              {unit.email && (
                <div className="text-sm text-slate-600">{unit.email}</div>
              )}
              {!unit.phone && !unit.email && '-'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
