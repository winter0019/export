import React from 'react';
import { Search, ShoppingBag, Heart, Clock, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useFirebase } from '@/FirebaseProvider';
import { Link } from 'react-router-dom';

export default function BuyerDashboard() {
  const { user } = useFirebase();
  const [requestCount, setRequestCount] = React.useState(0);

  React.useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'sourcing_requests'), where('buyerId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRequestCount(snapshot.size);
    });
    return () => unsubscribe();
  }, [user]);

  const stats = [
    { name: 'Active Requests', value: requestCount.toString(), icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Saved Suppliers', value: '0', icon: Heart, color: 'text-red-600', bg: 'bg-red-50' },
    { name: 'Open Inquiries', value: '0', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const recentActivities = [
    { id: 1, type: 'match', message: 'New supplier found for "100 MT Cocoa"', time: '1 hour ago', status: 'new' },
    { id: 2, type: 'quote', message: 'Quote received from "Northern Soy Connect"', time: '4 hours ago', status: 'pending' },
    { id: 3, type: 'order', message: 'Order #CN-1024 has been shipped', time: '2 days ago', status: 'completed' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Buyer Dashboard</h1>
          <p className="text-neutral-500 text-sm">Track your sourcing requests and manage supplier relationships.</p>
        </div>
        <Link 
          to="/sourcing-requests/new"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-100 transition-all"
        >
          <Plus className="w-5 h-5" />
          Post Sourcing Request
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-xl", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <span className="text-2xl font-bold text-neutral-900">{stat.value}</span>
            </div>
            <p className="text-sm font-medium text-neutral-500">{stat.name}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
            <h3 className="font-bold text-neutral-900">Recent Activity</h3>
            <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700">View All</button>
          </div>
          <div className="divide-y divide-neutral-100">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-6 flex items-start gap-4 hover:bg-neutral-50 transition-colors">
                <div className={cn(
                  "p-2 rounded-full",
                  activity.status === 'new' ? "bg-emerald-100 text-emerald-600" : 
                  activity.status === 'pending' ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                )}>
                  {activity.status === 'new' ? <AlertCircle className="w-4 h-4" /> : 
                   activity.status === 'pending' ? <Clock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-neutral-900">{activity.message}</p>
                  <p className="text-xs text-neutral-500 mt-1">{activity.time}</p>
                </div>
                {activity.status === 'new' && (
                  <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full">NEW</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="space-y-6">
          <div className="bg-amber-500 rounded-2xl p-6 text-emerald-950 shadow-lg shadow-amber-100">
            <h3 className="font-bold mb-2">Verified Suppliers</h3>
            <p className="text-emerald-900/80 text-sm mb-4">
              Look for the gold badge to find suppliers with verified export licenses and quality certifications.
            </p>
            <Link 
              to="/marketplace"
              className="w-full py-2 bg-emerald-950 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center"
            >
              Browse Verified Suppliers
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
            <h3 className="font-bold text-neutral-900 mb-4">Trending Categories</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Cashew Nuts</span>
                <span className="text-xs font-bold text-emerald-600">↑ 18%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Ginger</span>
                <span className="text-xs font-bold text-emerald-600">↑ 9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Sesame Seeds</span>
                <span className="text-xs font-bold text-emerald-600">↑ 4%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
