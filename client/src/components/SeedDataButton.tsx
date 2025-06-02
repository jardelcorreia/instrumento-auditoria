import * as React from 'react';
import { Button } from '@/components/ui/button';

interface SeedDataButtonProps {
  onSeedComplete: () => void;
}

export function SeedDataButton({ onSeedComplete }: SeedDataButtonProps) {
  const [loading, setLoading] = React.useState(false);
  const [seeded, setSeeded] = React.useState(false);

  async function handleSeedData() {
    setLoading(true);
    try {
      console.log('Seeding health units data...');
      const response = await fetch('/api/seed-health-units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();
      console.log('Seed result:', result);
      
      if (response.ok) {
        setSeeded(true);
        onSeedComplete();
      }
    } catch (error) {
      console.error('Error seeding data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (seeded) {
    return (
      <Button variant="outline" disabled>
        Dados Carregados ✓
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleSeedData}
      disabled={loading}
      variant="outline"
    >
      {loading ? 'Carregando...' : 'Carregar Unidades Reais de SGA/CE'}
    </Button>
  );
}
