import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { HealthUnitsPage } from '@/pages/health-units/HealthUnitsPage';
import { AuditsPage } from '@/pages/audits/AuditsPage';
import { AuditFormPage } from '@/pages/audit-form/AuditFormPage';
import { Layout } from '@/components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/health-units" element={<HealthUnitsPage />} />
          <Route path="/audits" element={<AuditsPage />} />
          <Route path="/audits/new" element={<AuditFormPage />} />
          <Route path="/audits/:id" element={<AuditFormPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
