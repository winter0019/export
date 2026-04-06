import React from 'react';
import ExporterDashboard from './ExporterDashboard';
import BuyerDashboard from './BuyerDashboard';
import { UserRole } from '@/types';

export default function DashboardView() {
  // Mock role for now
  const userRole: UserRole = 'exporter'; 

  if (userRole === 'exporter') {
    return <ExporterDashboard />;
  }

  if (userRole === 'buyer') {
    return <BuyerDashboard />;
  }

  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h2>
      <p className="text-neutral-500">Admin features are coming soon.</p>
    </div>
  );
}
