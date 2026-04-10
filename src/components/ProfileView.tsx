import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Building2, MapPin, Phone, ShieldCheck, Edit3, Globe, Briefcase, CreditCard, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirebase } from '@/FirebaseProvider';

import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Plus, X } from 'lucide-react';

export default function ProfileView() {
  const { user, profile, loading } = useFirebase();
  const [isEditingCerts, setIsEditingCerts] = React.useState(false);
  const [isEditingProfile, setIsEditingProfile] = React.useState(false);
  const [newCert, setNewCert] = React.useState('');
  const [isUpdating, setIsUpdating] = React.useState(false);

  // Form state
  const [formData, setFormData] = React.useState({
    displayName: '',
    companyName: '',
    phoneNumber: '',
    location: '',
    companySize: '',
    exportExperience: '',
    importExperience: '',
    annualExportVolume: '',
    businessLicense: '',
    preferredPaymentMethods: '',
    targetMarkets: '',
    sourcingFrequency: '',
    about: ''
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        companyName: profile.companyName || '',
        phoneNumber: profile.phoneNumber || '',
        location: profile.location || '',
        companySize: profile.companySize || '',
        exportExperience: profile.exportExperience || '',
        importExperience: profile.importExperience || '',
        annualExportVolume: profile.annualExportVolume || '',
        businessLicense: profile.businessLicense || '',
        preferredPaymentMethods: profile.preferredPaymentMethods?.join(', ') || '',
        targetMarkets: profile.targetMarkets?.join(', ') || '',
        sourcingFrequency: profile.sourcingFrequency || '',
        about: profile.about || ''
      });
    }
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsUpdating(true);
    try {
      const updateData: any = {
        displayName: formData.displayName,
        companyName: formData.companyName,
        phoneNumber: formData.phoneNumber,
        location: formData.location,
        about: formData.about
      };

      if (profile?.role === 'exporter') {
        updateData.companySize = formData.companySize;
        updateData.exportExperience = formData.exportExperience;
        updateData.annualExportVolume = formData.annualExportVolume;
        updateData.businessLicense = formData.businessLicense;
      } else {
        updateData.importExperience = formData.importExperience;
        updateData.sourcingFrequency = formData.sourcingFrequency;
        updateData.preferredPaymentMethods = formData.preferredPaymentMethods.split(',').map(s => s.trim()).filter(Boolean);
        updateData.targetMarkets = formData.targetMarkets.split(',').map(s => s.trim()).filter(Boolean);
      }

      await updateDoc(doc(db, 'users', user.uid), updateData);
      setIsEditingProfile(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'users');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddCert = async () => {
    if (!user || !newCert.trim()) return;
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        certifications: arrayUnion(newCert.trim())
      });
      setNewCert('');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'users');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveCert = async (cert: string) => {
    if (!user) return;
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        certifications: arrayRemove(cert)
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'users');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200">
        <User className="w-16 h-16 text-neutral-200 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-neutral-900">Please sign in</h2>
        <p className="text-neutral-500 text-sm mt-2">You need to be logged in to view your profile.</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 shadow-sm">
        <User className="w-16 h-16 text-neutral-200 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-neutral-900">Complete Your Profile</h2>
        <p className="text-neutral-500 mt-2">We couldn't find your profile details. Please complete your registration.</p>
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
            <button 
              onClick={() => setIsEditingProfile(true)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
            >
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
                <>
                  <div className="flex items-start gap-3">
                    <Users className="w-4 h-4 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-neutral-400 uppercase">Company Size</p>
                      <p className="text-sm text-neutral-900 capitalize">{profile.companySize}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-4 h-4 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-neutral-400 uppercase">Annual Volume</p>
                      <p className="text-sm text-neutral-900">{profile.annualExportVolume || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-neutral-400 uppercase">License</p>
                      <p className="text-sm text-neutral-900">{profile.businessLicense || 'Not provided'}</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-4 h-4 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-neutral-400 uppercase">Payment Methods</p>
                      <p className="text-sm text-neutral-900">{profile.preferredPaymentMethods?.join(', ') || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-4 h-4 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-neutral-400 uppercase">Target Markets</p>
                      <p className="text-sm text-neutral-900">{profile.targetMarkets?.join(', ') || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-4 h-4 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-neutral-400 uppercase">Sourcing Frequency</p>
                      <p className="text-sm text-neutral-900 capitalize">{profile.sourcingFrequency || 'Not specified'}</p>
                    </div>
                  </div>
                </>
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
              {profile.about || "No description provided yet. Click 'Edit Profile' to add one."}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-neutral-900">Certifications & Licenses</h3>
              {isExporter && (
                <button 
                  onClick={() => setIsEditingCerts(!isEditingCerts)}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  {isEditingCerts ? 'Done' : 'Manage Certifications'}
                </button>
              )}
            </div>

            {isEditingCerts && (
              <div className="mb-6 flex gap-2">
                <input
                  type="text"
                  value={newCert}
                  onChange={(e) => setNewCert(e.target.value)}
                  placeholder="Enter certification name..."
                  className="flex-grow px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCert()}
                />
                <button
                  onClick={handleAddCert}
                  disabled={isUpdating || !newCert.trim()}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {isUpdating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
                  Add
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.certifications && profile.certifications.length > 0 ? (
                profile.certifications.map((cert, i) => (
                  <div key={i} className="group flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-100 hover:border-emerald-200 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-900">{cert}</p>
                        <p className="text-[10px] text-neutral-500">Verified Certification</p>
                      </div>
                    </div>
                    {isEditingCerts && (
                      <button 
                        onClick={() => handleRemoveCert(cert)}
                        disabled={isUpdating}
                        className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-neutral-500 italic">No certifications listed.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200">
            <div className="sticky top-0 bg-white border-b border-neutral-100 px-8 py-6 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-neutral-900">Edit Profile</h2>
              <button 
                onClick={() => setIsEditingProfile(false)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
            
            <form onSubmit={handleSaveProfile} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Company Name</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {isExporter ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-neutral-100">
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Company Size</label>
                    <select
                      value={formData.companySize}
                      onChange={(e) => setFormData({...formData, companySize: e.target.value})}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="small">Small (1-10 employees)</option>
                      <option value="medium">Medium (11-50 employees)</option>
                      <option value="large">Large (50+ employees)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Export Experience</label>
                    <select
                      value={formData.exportExperience}
                      onChange={(e) => setFormData({...formData, exportExperience: e.target.value})}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="0-2">0-2 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5+">5+ years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Annual Export Volume</label>
                    <select
                      value={formData.annualExportVolume}
                      onChange={(e) => setFormData({...formData, annualExportVolume: e.target.value})}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="&lt; $100k">&lt; $100k</option>
                      <option value="$100k - $500k">$100k - $500k</option>
                      <option value="$500k - $1M">$500k - $1M</option>
                      <option value="$1M+">$1M+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Business License</label>
                    <input
                      type="text"
                      value={formData.businessLicense}
                      onChange={(e) => setFormData({...formData, businessLicense: e.target.value})}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-neutral-100">
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Import Experience</label>
                    <select
                      value={formData.importExperience}
                      onChange={(e) => setFormData({...formData, importExperience: e.target.value})}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="0-2">0-2 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5+">5+ years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Sourcing Frequency</label>
                    <select
                      value={formData.sourcingFrequency}
                      onChange={(e) => setFormData({...formData, sourcingFrequency: e.target.value})}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="as-needed">As Needed</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Preferred Payment Methods (comma separated)</label>
                    <input
                      type="text"
                      value={formData.preferredPaymentMethods}
                      onChange={(e) => setFormData({...formData, preferredPaymentMethods: e.target.value})}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Target Markets (comma separated)</label>
                    <input
                      type="text"
                      value={formData.targetMarkets}
                      onChange={(e) => setFormData({...formData, targetMarkets: e.target.value})}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-neutral-100">
                <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">About the Company</label>
                <textarea
                  rows={4}
                  value={formData.about}
                  onChange={(e) => setFormData({...formData, about: e.target.value})}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  placeholder="Tell us about your company..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-3 border border-neutral-200 text-neutral-600 font-bold rounded-xl hover:bg-neutral-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isUpdating && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
