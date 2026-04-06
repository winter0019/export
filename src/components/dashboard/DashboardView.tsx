import React from 'react';
import ExporterDashboard from './ExporterDashboard';
import BuyerDashboard from './BuyerDashboard';
import { UserRole } from '@/types';

import { useFirebase } from '@/FirebaseProvider';

export default function DashboardView() {
  const { profile, loading } = useFirebase();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-neutral-900">Please sign in</h2>
        <p className="text-neutral-500">You need to be logged in to view the dashboard.</p>
      </div>
    );
  }

  if (profile.role === 'exporter') {
    return <ExporterDashboard />;
  }

  if (profile.role === 'buyer') {
    return <BuyerDashboard />;
  }

  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h2>
      <p className="text-neutral-500">Admin features are coming soon.</p>
    </div>
  );
}
