import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Mail, Lock, User, Building2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function RegisterView() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [role, setRole] = React.useState<UserRole>('exporter');

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if profile exists
      const profileSnap = await getDoc(doc(db, 'users', user.uid));
      if (!profileSnap.exists()) {
        // Create a default profile if it doesn't exist
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'New User',
          role: role, // Use the currently selected role
          verified: false,
          createdAt: serverTimestamp(),
        });
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      setError(err.message || "Failed to sign in with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    const companyName = formData.get('companyName') as string;
    const companySize = formData.get('companySize') as string;
    const certifications = formData.get('certifications') as string;
    const exportExperience = formData.get('exportExperience') as string;
    const businessLicense = formData.get('businessLicense') as string;
    const annualExportVolume = formData.get('annualExportVolume') as string;
    const preferredPaymentMethods = formData.get('preferredPaymentMethods') as string;
    const importExperience = formData.get('importExperience') as string;
    const targetMarkets = formData.get('targetMarkets') as string;
    const sourcingFrequency = formData.get('sourcingFrequency') as string;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: fullName });

      // Create profile in Firestore
      const profileData: any = {
        uid: user.uid,
        email: user.email,
        displayName: fullName,
        role: role,
        companyName: companyName,
        verified: false,
        createdAt: serverTimestamp(),
      };

      if (role === 'exporter') {
        profileData.companySize = companySize;
        profileData.certifications = certifications ? certifications.split(',').map(s => s.trim()) : [];
        profileData.exportExperience = exportExperience;
        profileData.businessLicense = businessLicense;
        profileData.annualExportVolume = annualExportVolume;
      } else if (role === 'buyer') {
        profileData.preferredPaymentMethods = preferredPaymentMethods ? preferredPaymentMethods.split(',').map(s => s.trim()) : [];
        profileData.importExperience = importExperience;
        profileData.targetMarkets = targetMarkets ? targetMarkets.split(',').map(s => s.trim()) : [];
        profileData.sourcingFrequency = sourcingFrequency;
      }

      await setDoc(doc(db, 'users', user.uid), profileData);

      navigate('/dashboard');
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <Globe className="text-white w-7 h-7" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900 tracking-tight">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-xl shadow-neutral-200/50 sm:rounded-2xl sm:px-10 border border-neutral-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                {error}
              </div>
            )}
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-3">
                I want to join as:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('exporter')}
                  className={cn(
                    "flex flex-col items-center p-4 border-2 rounded-xl transition-all",
                    role === 'exporter' 
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700" 
                      : "border-neutral-100 bg-neutral-50 text-neutral-400 hover:border-neutral-200"
                  )}
                >
                  <Building2 className="w-6 h-6 mb-2" />
                  <span className="text-sm font-bold">Exporter</span>
                  <span className="text-[10px] text-center mt-1 opacity-70">I source and sell products from Nigeria</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={cn(
                    "flex flex-col items-center p-4 border-2 rounded-xl transition-all",
                    role === 'buyer' 
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700" 
                      : "border-neutral-100 bg-neutral-50 text-neutral-400 hover:border-neutral-200"
                  )}
                >
                  <ShoppingBag className="w-6 h-6 mb-2" />
                  <span className="text-sm font-bold">Buyer</span>
                  <span className="text-[10px] text-center mt-1 opacity-70">I source products for the Chinese market</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-bold text-neutral-700">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-neutral-200 rounded-xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="companyName" className="block text-sm font-bold text-neutral-700">
                  Company Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-neutral-200 rounded-xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                    placeholder="Global Trade Ltd"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-neutral-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-neutral-200 rounded-xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-neutral-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-neutral-200 rounded-xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {role === 'exporter' ? (
              <div className="space-y-6 pt-4 border-t border-neutral-100">
                <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider">Exporter Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="companySize" className="block text-sm font-bold text-neutral-700">Company Size</label>
                    <select
                      id="companySize"
                      name="companySize"
                      className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-neutral-200 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-xl"
                    >
                      <option value="small">Small (1-10 employees)</option>
                      <option value="medium">Medium (11-50 employees)</option>
                      <option value="large">Large (50+ employees)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="exportExperience" className="block text-sm font-bold text-neutral-700">Export Experience</label>
                    <select
                      id="exportExperience"
                      name="exportExperience"
                      className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-neutral-200 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-xl"
                    >
                      <option value="0-2">0-2 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5+">5+ years</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="annualExportVolume" className="block text-sm font-bold text-neutral-700">Annual Export Volume</label>
                    <select
                      id="annualExportVolume"
                      name="annualExportVolume"
                      className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-neutral-200 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-xl"
                    >
                      <option value="&lt; $100k">&lt; $100k</option>
                      <option value="$100k - $500k">$100k - $500k</option>
                      <option value="$500k - $1M">$500k - $1M</option>
                      <option value="$1M+">$1M+</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="businessLicense" className="block text-sm font-bold text-neutral-700">Business License Number</label>
                    <input
                      id="businessLicense"
                      name="businessLicense"
                      type="text"
                      className="mt-1 appearance-none block w-full px-3 py-2.5 border border-neutral-200 rounded-xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                      placeholder="RC-1234567"
                    />
                  </div>
                  <div>
                    <label htmlFor="certifications" className="block text-sm font-bold text-neutral-700">Certifications (comma separated)</label>
                    <input
                      id="certifications"
                      name="certifications"
                      type="text"
                      className="mt-1 appearance-none block w-full px-3 py-2.5 border border-neutral-200 rounded-xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                      placeholder="ISO 9001, HACCP, NAFDAC"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 pt-4 border-t border-neutral-100">
                <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider">Buyer Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="importExperience" className="block text-sm font-bold text-neutral-700">Import Experience</label>
                    <select
                      id="importExperience"
                      name="importExperience"
                      className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-neutral-200 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-xl"
                    >
                      <option value="0-2">0-2 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5+">5+ years</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sourcingFrequency" className="block text-sm font-bold text-neutral-700">Sourcing Frequency</label>
                    <select
                      id="sourcingFrequency"
                      name="sourcingFrequency"
                      className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-neutral-200 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-xl"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="as-needed">As Needed</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="targetMarkets" className="block text-sm font-bold text-neutral-700">Target Markets (comma separated)</label>
                    <input
                      id="targetMarkets"
                      name="targetMarkets"
                      type="text"
                      className="mt-1 appearance-none block w-full px-3 py-2.5 border border-neutral-200 rounded-xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                      placeholder="China, EU, USA"
                    />
                  </div>
                  <div>
                    <label htmlFor="preferredPaymentMethods" className="block text-sm font-bold text-neutral-700">Payment Methods (comma separated)</label>
                    <input
                      id="preferredPaymentMethods"
                      name="preferredPaymentMethods"
                      type="text"
                      className="mt-1 appearance-none block w-full px-3 py-2.5 border border-neutral-200 rounded-xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                      placeholder="L/C, T/T, Escrow"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="text-xs text-neutral-500">
              By creating an account, you agree to our{' '}
              <a href="#" className="font-bold text-emerald-600 hover:text-emerald-500">Terms of Service</a> and{' '}
              <a href="#" className="font-bold text-emerald-600 hover:text-emerald-500">Privacy Policy</a>.
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full inline-flex justify-center py-2.5 px-4 border border-neutral-200 rounded-xl bg-white text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition-all shadow-sm disabled:opacity-50"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
                Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShoppingBag(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
