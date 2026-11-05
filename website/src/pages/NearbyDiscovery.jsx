import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Crosshair, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Wrench, 
  Phone, 
  ArrowRight,
  Filter,
  UserCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useDatabase } from '../context/DatabaseContext';
import { apDistricts } from '../data/apDistricts';
import { servicesData } from '../data/servicesData';
import { BookingModal } from '../components/BookingModal';

export const NearbyDiscovery = () => {
  const { lang, t } = useLanguage();
  const { 
    selectedDistrict, 
    changeDistrict, 
    detectGpsLocation, 
    gpsLoading, 
    gpsStatus,
    getNearbyProviders 
  } = useDatabase();

  const [selectedServiceSlug, setSelectedServiceSlug] = useState('ALL');
  const [selectedProviderForBooking, setSelectedProviderForBooking] = useState(null);
  const navigate = useNavigate();

  const providers = getNearbyProviders(selectedServiceSlug === 'ALL' ? null : selectedServiceSlug);

  return (
    <div className="py-12 bg-slate-50 min-h-screen text-left">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Police-Verified Local Technicians</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-serif">
            {lang === 'te'
              ? `${selectedDistrict.nameTe} లో అందుబాటులో ఉన్న నిపుణులు`
              : `Technicians in ${selectedDistrict.nameEn} District`}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Dispatched directly to your rural mandal and village. All technicians charge the standard <strong>₹50 Basic Home Visit Fee</strong> and are backed by the 30-Day Guarantee.
          </p>
        </div>

        {/* Location & Filter Toolbar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm mb-10 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* District Dropdown */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Select District:</span>
              </div>
              <select
                value={selectedDistrict.id}
                onChange={(e) => changeDistrict(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {apDistricts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nameEn} ({d.nameTe})
                  </option>
                ))}
              </select>

              <button
                onClick={detectGpsLocation}
                disabled={gpsLoading}
                className="px-3.5 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Crosshair className={`w-3.5 h-3.5 text-emerald-700 ${gpsLoading ? 'animate-spin' : ''}`} />
                <span>{gpsLoading ? 'Detecting...' : 'Auto-Detect GPS'}</span>
              </button>
            </div>

            {/* Service Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter Trade:</span>
              </span>
              <select
                value={selectedServiceSlug}
                onChange={(e) => setSelectedServiceSlug(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="ALL">All Trade Skills</option>
                {servicesData.map((s) => (
                  <option key={s.id} value={s.slug}>
                    {s.name_en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {gpsStatus && (
            <div className="text-xs font-semibold text-emerald-800 pt-1">
              {gpsStatus.message}
            </div>
          )}
        </div>

        {/* Technicians Cards Grid */}
        {providers.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <Wrench className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">
              No registered technicians found for this specific filter in {selectedDistrict.nameEn}.
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Technicians from neighboring mandals can be dispatched. You can also register as a certified local service provider for this area.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Profile Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-extrabold text-lg">
                        {p.fullName?.charAt(0) || 'T'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-slate-900 text-base">
                            {p.fullName}
                          </h3>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" title="Police Verified" />
                        </div>
                        <p className="text-xs text-slate-500">
                          {p.mandal || selectedDistrict.mandals[0]}, {p.district}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{p.rating || 4.9}</span>
                    </div>
                  </div>

                  {/* Registered Trade Services Badges */}
                  <div className="mb-4 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Approved Trade Skills:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {p.services.map((svc, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200/60"
                        >
                          {svc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Experience & Stats */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 text-xs text-slate-600 mb-6">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Experience</span>
                      <span className="font-extrabold text-slate-800">{p.experienceYears} Years</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Distance</span>
                      <span className="font-extrabold text-emerald-700">~{p.distanceKm || 2.4} km away</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer with Price and Book Button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Home Visit Fee</span>
                    <span className="text-sm font-black text-emerald-700 font-mono">₹50</span>
                  </div>

                  <button
                    onClick={() => setSelectedProviderForBooking(p)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-700/20 transition-all hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Book Technician</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedProviderForBooking && (
        <BookingModal
          service={{
            id: 'srv-spec',
            name_en: selectedProviderForBooking.services[0] || 'General Trade Service'
          }}
          provider={selectedProviderForBooking}
          onClose={() => setSelectedProviderForBooking(null)}
          onSuccess={() => navigate('/customer')}
        />
      )}
    </div>
  );
};
