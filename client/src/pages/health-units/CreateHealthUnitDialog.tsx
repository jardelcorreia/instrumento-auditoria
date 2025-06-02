import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreateHealthUnitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnitCreated: () => void;
}

export function CreateHealthUnitDialog({ open, onOpenChange, onUnitCreated }: CreateHealthUnitDialogProps) {
  const [formData, setFormData] = React.useState({
    name: '',
    type: '',
    address: '',
    cnes_code: '',
    manager_name: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Creating health unit:', formData);
      const response = await fetch('/api/health-units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Health unit created successfully');
        setFormData({
          name: '',
          type: '',
          address: '',
          cnes_code: '',
          manager_name: '',
          phone: '',
          email: '',
        });
        onUnitCreated();
      } else {
        console.error('Failed to create health unit');
      }
    } catch (error) {
      console.error('Error creating health unit:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Unidade de Saúde</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome da Unidade</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Tipo</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ubs">UBS - Unidade Básica de Saúde</SelectItem>
                <SelectItem value="esf">ESF - Estratégia Saúde da Família</SelectItem>
                <SelectItem value="upa">UPA - Unidade de Pronto Atendimento</SelectItem>
                <SelectItem value="caps">CAPS - Centro de Atenção Psicossocial</SelectItem>
                <SelectItem value="ceo">CEO - Centro de Especialidades Odontológicas</SelectItem>
                <SelectItem value="nasf">NASF - Núcleo de Apoio à Saúde da Família</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="cnes_code">Código CNES</Label>
            <Input
              id="cnes_code"
              value={formData.cnes_code}
              onChange={(e) => handleInputChange('cnes_code', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="manager_name">Nome do Gestor</Label>
            <Input
              id="manager_name"
              value={formData.manager_name}
              onChange={(e) => handleInputChange('manager_name', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Unidade'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
