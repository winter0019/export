import React from 'react';
import { Link } from 'react-router-dom';
import ExporterDashboard from './ExporterDashboard';
import BuyerDashboard from './BuyerDashboard';
import { UserRole } from '@/types';

import { useFirebase } from '@/FirebaseProvider';

export default function DashboardView() {
  const { user, profile, loading } = useFirebase();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-neutral-900">Please sign in</h2>
        <p className="text-neutral-500">You need to be logged in to view the dashboard.</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 shadow-sm">
        <h2 className="text-2xl font-bold text-neutral-900">Complete Your Profile</h2>
        <p className="text-neutral-500 mt-2">We couldn't find your profile. Please complete your registration.</p>
        <div className="mt-6">
          <Link 
            to="/register" 
            className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all"
          >
            Complete Registration
          </Link>
        </div>
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
