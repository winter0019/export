import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

import MarketplaceView from './components/marketplace/MarketplaceView';
import DashboardView from './components/dashboard/DashboardView';
import MatchesView from './components/matches/MatchesView';
import LoginView from './components/auth/LoginView';
import RegisterView from './components/auth/RegisterView';
import ProfileView from './components/ProfileView';
import ErrorBoundary from './components/ErrorBoundary';

// Pages (to be created)
const Landing = () => (
  <div className="space-y-12">
    <section className="relative py-20 overflow-hidden rounded-3xl bg-emerald-900">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-400 via-transparent to-transparent" />
      </div>
      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
          Connecting Nigerian Exporters <br /> with <span className="text-amber-400">Chinese Buyers</span>
        </h1>
        <p className="text-xl text-emerald-100 max-w-2xl mx-auto mb-10">
          The most efficient AI-powered marketplace for agricultural trade between Nigeria and China. 
          Verified suppliers, high-quality products, and seamless matching.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold rounded-xl shadow-lg transition-all transform hover:scale-105">
            I am an Exporter
          </button>
          <button className="px-8 py-4 bg-white hover:bg-neutral-100 text-emerald-900 font-bold rounded-xl shadow-lg transition-all transform hover:scale-105">
            I am a Buyer
          </button>
        </div>
      </div>
    </section>

    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { title: "Verified Suppliers", desc: "Rigorous vetting process for all Nigerian exporters to ensure quality and reliability.", icon: "✅" },
        { title: "AI Matching", desc: "Our algorithm connects buyer requirements with the most suitable suppliers automatically.", icon: "🤖" },
        { title: "Secure Trade", desc: "End-to-end support for logistics, documentation, and secure payment structures.", icon: "🛡️" }
      ].map((feature, i) => (
        <div key={i} className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-4xl mb-4">{feature.icon}</div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">{feature.title}</h3>
          <p className="text-neutral-600">{feature.desc}</p>
        </div>
      ))}
    </section>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Landing /></Layout>} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/marketplace" element={<Layout><MarketplaceView /></Layout>} />
          <Route path="/dashboard" element={<Layout><DashboardView /></Layout>} />
          <Route path="/matches" element={<Layout><MatchesView /></Layout>} />
          <Route path="/profile" element={<Layout><ProfileView /></Layout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
