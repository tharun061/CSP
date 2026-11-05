import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  ArrowRight,
  User,
  Phone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';
import { apDistricts } from '../data/apDistricts';

export const BookingModal = ({ service, provider, onClose, onSuccess }) => {
  const { lang, t } = useLanguage();
  const { currentUser, isAuthenticated } = useAuth();
  const { selectedDistrict, selectedMandal, createBooking } = useDatabase();

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [district, setDistrict] = useState(selectedDistrict.nameEn);
  const [mandal, setMandal] = useState(selectedMandal || selectedDistrict.mandals[0]);
  const [village, setVillage] = useState(currentUser?.village || '');
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [scheduledTime, setScheduledTime] = useState('10:00 AM - 12:00 PM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentDistrictData = apDistricts.find((d) => d.nameEn === district) || selectedDistrict;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !phone.trim() || !village.trim()) {
      setError('Please fill in your name, phone number, and village address.');
      return;
    }

    if (phone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);

    try {
      const newBooking = await createBooking({
        serviceId: service?.id || 'srv-gen',
        serviceName: service?.name_en || (lang === 'te' ? 'సాధారణ సేవ' : 'General Service'),
        providerId: provider?.id || 'prov-auto',
        providerName: provider?.fullName || (lang === 'te' ? 'మండల నిపుణుడు (ఆటో కేటాయింపు)' : 'Mandal Certified Technician (Auto-Assigned)'),
        providerPhone: provider?.phone || '9848011223',
        customerName: fullName.trim(),
        customerPhone: phone.trim(),
        district,
        mandal,
        village: village.trim(),
        scheduledDate,
        scheduledTime
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}

      setLoading(false);
      if (onSuccess) {
        onSuccess(newBooking);
      }
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to create booking.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>30-Day Guarantee Backed</span>
            </div>
            <h3 className="text-xl font-black text-slate-900">
              {service?.name_en || 'Book Certified Technician'}
            </h3>
            {provider && (
              <p className="text-xs text-slate-500 font-medium">
                Technician: <strong>{provider.fullName}</strong> ({provider.rating} ★ • {provider.experienceYears} yrs exp)
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing Disclosure Card */}
        <div className="my-4 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 block tracking-wider">
                Government Standard Fee
              </span>
              <span className="text-sm font-extrabold text-emerald-950">
                Basic Home Visit Fee:
              </span>
            </div>
            <span className="text-2xl font-black text-emerald-700">
              ₹50
            </span>
          </div>
          <p className="text-[11px] text-emerald-800 mt-2 leading-relaxed">
            Covers technician doorstep visit and fault diagnosis. Any required spare parts or additional work charges are diagnosed on-site and confirmed with you before commencing repair.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Your Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Venkat Rao"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit mobile"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* District & Mandal Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                AP District *
              </label>
              <select
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  const d = apDistricts.find((x) => x.nameEn === e.target.value);
                  if (d) setMandal(d.mandals[0]);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {apDistricts.map((d) => (
                  <option key={d.id} value={d.nameEn}>
                    {d.nameEn} ({d.nameTe})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Mandal *
              </label>
              <select
                value={mandal}
                onChange={(e) => setMandal(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {currentDistrictData.mandals.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Village / Door No / Street Address *
            </label>
            <input
              type="text"
              required
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder="e.g. Near Panchayat Office, Main Road"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Preferred Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Preferred Time Slot
              </label>
              <select
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="09:00 AM - 11:00 AM">Morning (09:00 AM - 11:00 AM)</option>
                <option value="11:00 AM - 01:00 PM">Mid-Day (11:00 AM - 01:00 PM)</option>
                <option value="02:00 PM - 04:00 PM">Afternoon (02:00 PM - 04:00 PM)</option>
                <option value="04:00 PM - 06:00 PM">Evening (04:00 PM - 06:00 PM)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Confirming Booking...' : 'Confirm Doorstep Visit (₹50 Base Fee)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
