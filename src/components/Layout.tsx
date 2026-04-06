import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, Globe, User, LayoutDashboard, ShoppingBag, Search, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirebase } from '@/FirebaseProvider';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, loading } = useFirebase();
  
  const navigation = [
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Matches', href: '/matches', icon: Search },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-md shadow-emerald-200">
                  <Globe className="text-white w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tight text-neutral-900 hidden sm:block">
                  <span className="text-emerald-600">CN</span>-Export
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              <div className="h-6 w-px bg-neutral-200 mx-2" />
              
              <button className="p-2 text-neutral-500 hover:text-emerald-600 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>

              <div className="flex items-center space-x-3 ml-4">
                {user ? (
                  <>
                    <div className="text-right hidden lg:block">
                      <p className="text-xs font-semibold text-neutral-900">{profile?.displayName || user.displayName || user.email}</p>
                      <p className="text-[10px] text-neutral-500 capitalize">{profile?.role || 'User'}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-neutral-500 hover:text-red-600 transition-colors"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-neutral-600 hover:bg-neutral-100"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-neutral-200 py-2 px-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium",
                  location.pathname === item.href
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-neutral-600 hover:bg-neutral-100"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="text-emerald-600 w-6 h-6" />
                <span className="text-xl font-bold tracking-tight text-neutral-900">
                  <span className="text-emerald-600">CN</span>-Export
                </span>
              </div>
              <p className="text-neutral-500 text-sm max-w-md">
                The premier digital bridge connecting Nigerian agricultural excellence with Chinese market demand. 
                Verified exporters, secure transactions, and AI-powered matching.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><Link to="/marketplace" className="hover:text-emerald-600 transition-colors">Marketplace</Link></li>
                <li><Link to="/how-it-works" className="hover:text-emerald-600 transition-colors">How it Works</Link></li>
                <li><Link to="/verification" className="hover:text-emerald-600 transition-colors">Verification Process</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><Link to="/contact" className="hover:text-emerald-600 transition-colors">Contact Us</Link></li>
                <li><Link to="/faq" className="hover:text-emerald-600 transition-colors">FAQ</Link></li>
                <li><Link to="/terms" className="hover:text-emerald-600 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-xs">
              © {new Date().getFullYear()} China-Nigeria Export Connect. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="text-emerald-600 text-xs font-medium flex items-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
                System Online
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
