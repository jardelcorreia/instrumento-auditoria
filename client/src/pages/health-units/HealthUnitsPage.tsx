import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreateHealthUnitDialog } from './CreateHealthUnitDialog';
import { HealthUnitsList } from './HealthUnitsList';
import { SeedDataButton } from '@/components/SeedDataButton';
import { useHealthUnits } from '@/hooks/useHealthUnits';

export function HealthUnitsPage() {
  const { healthUnits, loading, refetch } = useHealthUnits();
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);

  function handleUnitCreated() {
    setShowCreateDialog(false);
    refetch();
  }

  function handleSeedComplete() {
    refetch();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Unidades de Saúde</h1>
          <p className="text-lg text-slate-600 mt-2">Gerencie todas as unidades de saúde do município</p>
        </div>
        <div className="flex space-x-3">
          {healthUnits.length === 0 && !loading && (
            <SeedDataButton onSeedComplete={handleSeedComplete} />
          )}
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Nova Unidade
          </Button>
        </div>
      </div>

      <Card className="border border-slate-200 shadow-sm bg-white">
        <CardHeader className="bg-slate-50 border-b">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div>
              <CardTitle className="text-xl font-bold text-slate-800">Lista de Unidades</CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                {healthUnits.length} unidade{healthUnits.length !== 1 ? 's' : ''} cadastrada{healthUnits.length !== 1 ? 's' : ''}
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
          <HealthUnitsList healthUnits={healthUnits} loading={loading} />
        </CardContent>
      </Card>

      <CreateHealthUnitDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onUnitCreated={handleUnitCreated}
      />
    </div>
  );
}
