import React from 'react';
import { User, Mail, Building2, MapPin, Phone, ShieldCheck, Edit3, Globe, Briefcase, CreditCard, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirebase } from '@/FirebaseProvider';

export default function ProfileView() {
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
      <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200">
        <User className="w-16 h-16 text-neutral-200 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-neutral-900">Profile not found</h2>
        <p className="text-neutral-500 text-sm mt-2">Please sign in to view your profile.</p>
      </div>
    );
  }

  const isExporter = profile.role === 'exporter';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-emerald-900 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 bg-white rounded-2xl border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <User className="w-12 h-12" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 right-8">
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg backdrop-blur-md border border-white/20 transition-all flex items-center gap-2">
              <Edit3 className="w-3 h-3" />
              Edit Profile
            </button>
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-neutral-900">{profile.displayName}</h1>
                {profile.verified && (
                  <div className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    VERIFIED {profile.role.toUpperCase()}
                  </div>
                )}
              </div>
              <p className="text-neutral-500 text-sm mt-1 flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5" />
                {profile.companyName}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center px-4 border-r border-neutral-100">
                <p className="text-xl font-bold text-neutral-900">12</p>
                <p className="text-[10px] text-neutral-400 uppercase font-bold">Products</p>
              </div>
              <div className="text-center px-4">
                <p className="text-xl font-bold text-neutral-900">4.8</p>
                <p className="text-[10px] text-neutral-400 uppercase font-bold">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
            <h3 className="font-bold text-neutral-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase">Email</p>
                  <p className="text-sm text-neutral-900">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase">Phone</p>
                  <p className="text-sm text-neutral-900">{profile.phoneNumber || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase">Location</p>
                  <p className="text-sm text-neutral-900">{profile.location || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
            <h3 className="font-bold text-neutral-900 mb-4">{isExporter ? 'Export Details' : 'Import Details'}</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Briefcase className="w-4 h-4 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase">Experience</p>
                  <p className="text-sm text-neutral-900">{isExporter ? profile.exportExperience : profile.importExperience} years</p>
                </div>
              </div>
              {isExporter ? (
                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase">Company Size</p>
                    <p className="text-sm text-neutral-900 capitalize">{profile.companySize}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <CreditCard className="w-4 h-4 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase">Payment Methods</p>
                    <p className="text-sm text-neutral-900">{profile.preferredPaymentMethods?.join(', ') || 'Not specified'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
            <h3 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Export Readiness
            </h3>
            <p className="text-emerald-700 text-xs mb-4">
              Your profile is 85% complete. Add more certifications to increase your trust score.
            </p>
            <div className="h-2 w-full bg-emerald-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 w-[85%]" />
            </div>
          </div>
        </div>

        {/* About / Certifications */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
            <h3 className="font-bold text-neutral-900 mb-4">About the Company</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              Adebayo Agricultural Exports Nigeria Ltd is a leading supplier of high-quality agricultural commodities 
              from Northern Nigeria. We specialize in dried hibiscus flowers, soybeans, and ginger. 
              With over 10 years of experience in the export market, we ensure that all our products 
              meet international quality standards and are delivered on time.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
            <h3 className="font-bold text-neutral-900 mb-4">Certifications & Licenses</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.certifications && profile.certifications.length > 0 ? (
                profile.certifications.map((cert, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">{cert}</p>
                      <p className="text-[10px] text-neutral-500">Verified Certification</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-neutral-500 italic">No certifications listed.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
