import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  function isActive(path: string) {
    return location.pathname === path;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-blue-800">
                Auditoria de Saúde - São Gonçalo do Amarante/CE
              </h1>
              <nav className="flex space-x-2">
                <Link to="/dashboard">
                  <Button 
                    variant={isActive('/dashboard') ? 'default' : 'outline'}
                    size="sm"
                    className={isActive('/dashboard') 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900'
                    }
                  >
                    Dashboard
                  </Button>
                </Link>
                <Link to="/health-units">
                  <Button 
                    variant={isActive('/health-units') ? 'default' : 'outline'}
                    size="sm"
                    className={isActive('/health-units') 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900'
                    }
                  >
                    Unidades
                  </Button>
                </Link>
                <Link to="/audits">
                  <Button 
                    variant={isActive('/audits') ? 'default' : 'outline'}
                    size="sm"
                    className={isActive('/audits') 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900'
                    }
                  >
                    Auditorias
                  </Button>
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
