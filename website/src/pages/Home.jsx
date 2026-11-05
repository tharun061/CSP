import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Crosshair, 
  ArrowRight, 
  Wrench, 
  Zap, 
  Tractor, 
  Bike, 
  Droplets, 
  Refrigerator, 
  Sun, 
  Tv,
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  Award,
  Users,
  Building2,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useDatabase } from '../context/DatabaseContext';
import { servicesData } from '../data/servicesData';
import { BookingModal } from '../components/BookingModal';

export const Home = () => {
  const { lang, t } = useLanguage();
  const { selectedDistrict, detectGpsLocation, gpsLoading, gpsStatus } = useDatabase();
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);
  const navigate = useNavigate();

  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-6 h-6 text-emerald-600" />;
      case 'Wrench': return <Wrench className="w-6 h-6 text-emerald-600" />;
      case 'Tractor': return <Tractor className="w-6 h-6 text-emerald-600" />;
      case 'Bike': return <Bike className="w-6 h-6 text-emerald-600" />;
      case 'Droplets': return <Droplets className="w-6 h-6 text-emerald-600" />;
      case 'Refrigerator': return <Refrigerator className="w-6 h-6 text-emerald-600" />;
      case 'Sun': return <Sun className="w-6 h-6 text-emerald-600" />;
      case 'Tv': return <Tv className="w-6 h-6 text-emerald-600" />;
      default: return <Wrench className="w-6 h-6 text-emerald-600" />;
    }
  };

  return (
    <div className="text-left bg-slate-50 min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-950 to-slate-950 text-white pt-16 pb-24 px-4">
        {/* Subtle patterned background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Official State Ribbon */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/60 border border-emerald-600/40 text-emerald-200 text-xs font-bold shadow-inner">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Government of Andhra Pradesh • Official Rural Citizen Portal</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-serif leading-tight">
              {lang === 'te'
                ? 'గ్రామీణ ప్రాంతాలకు నమ్మకమైన స్థానిక సేవా నిపుణులు'
                : 'Reliable Local Services for Every Rural Household'}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-emerald-100/90 leading-relaxed font-normal max-w-2xl mx-auto">
              {lang === 'te'
                ? 'ఆంధ్రప్రదేశ్ లోని 26 జిల్లాల్లో ధృవీకరించబడిన ఎలక్ట్రీషియన్లు, ప్లంబర్లు, ట్రాక్టర్ & వాహన మెకానిక్ ల డోర్‌స్టెప్ సేవలు. ప్రతి పనికి 30-రోజుల ఉచిత రీ-సర్వీస్ గ్యారెంటీ.'
                : 'Doorstep certified electricians, borewell plumbers, agricultural equipment mechanics, and appliance technicians across all 26 districts of Andhra Pradesh, backed by a 30-day independent guarantee.'}
            </p>

            {/* Key Value Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-white">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Basic Home Visit Fee: <strong>₹50 Only</strong></span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>30-Day Free Guarantee</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-white">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>All 26 AP Districts Covered</span>
              </div>
            </div>

            {/* GPS Detection & Search Bar */}
            <div className="pt-4 max-w-xl mx-auto">
              <div className="p-2 sm:p-2.5 rounded-2xl bg-white/95 backdrop-blur-lg shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-slate-200">
                <div className="flex items-center gap-2 px-3 py-2 w-full sm:w-auto grow text-slate-800 text-xs font-bold">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">
                    District: <strong>{lang === 'te' ? selectedDistrict.nameTe : selectedDistrict.nameEn}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={detectGpsLocation}
                    disabled={gpsLoading}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="Auto-detect closest district"
                  >
                    <Crosshair className={`w-3.5 h-3.5 text-emerald-700 ${gpsLoading ? 'animate-spin' : ''}`} />
                    <span>{gpsLoading ? 'Detecting...' : 'Auto GPS'}</span>
                  </button>

                  <Link
                    to="/nearby"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/30 transition-all hover:scale-[1.02]"
                  >
                    <span>Find Technicians</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {gpsStatus && (
                <div className="mt-2 text-xs font-semibold text-emerald-300">
                  {gpsStatus.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* TRANSPARENT PRICING BANNER */}
      <div className="bg-amber-500 text-slate-950 py-3.5 px-4 shadow-md font-bold text-xs sm:text-sm">
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <span className="p-1 rounded-lg bg-black text-amber-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <span>
              Official Government Price Standard: Basic Home Visit Fee is strictly ₹50 across all 26 districts.
            </span>
          </div>
          <Link
            to="/how-it-works"
            className="text-xs uppercase font-extrabold tracking-wider underline hover:text-black shrink-0"
          >
            How Pricing Works &rarr;
          </Link>
        </div>
      </div>

      {/* CORE SERVICE CATEGORIES GRID */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-emerald-700 mb-1">
                <span>Verified Rural Services</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-serif">
                {lang === 'te' ? 'అధికారిక సేవా విభాగాలు' : 'Official Trade Service Categories'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Standard ₹50 doorstep diagnosis. Select any trade service below to book an active certified technician.
              </p>
            </div>

            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              <span>View All 8 Services with Task Rates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesData.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      {getServiceIcon(s.icon)}
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Visit Fee</span>
                      <span className="text-sm font-black text-emerald-700 font-mono">₹50</span>
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 mb-1">
                    {lang === 'te' ? s.name_te : s.name_en}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {lang === 'te' ? s.description_te : s.description_en}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400">
                    Est. work: ₹{s.estimated_work_min}-{s.estimated_work_max}
                  </span>
                  <button
                    onClick={() => setSelectedServiceForBooking(s)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 30-DAY GUARANTEE HIGHLIGHT (WORKER A vs WORKER B) */}
      <section className="py-20 px-4 bg-white border-y border-slate-200">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero Moral Hazard • 100% Conflict Free</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-serif">
              {lang === 'te' ? '30-రోజుల స్వతంత్ర సర్వీస్ హామీ' : 'The 30-Day Service Guarantee Engine'}
            </h2>
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
              In traditional unorganized services, calling the same technician to fix a recurring fault leads to excuses and repeated charges. GramaSeva enforces an automated <strong>Worker A vs. Worker B</strong> protocol:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
            {/* Worker A Card */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold font-mono">
                STAGE 1: ORIGINAL REPAIR
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Worker A Performs Initial Repair
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A police-verified local technician visits your doorstep for ₹50, diagnoses the issue, completes the repair with itemized billing, and marks the service complete.
              </p>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>30-Day Clock Activated</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Digital Receipt issued with unique receipt code and timestamp.
                </div>
              </div>
            </div>

            {/* Worker B Card */}
            <div className="p-8 rounded-3xl bg-emerald-50 border-2 border-emerald-500/50 text-left space-y-4 relative shadow-lg shadow-emerald-700/5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-200 text-emerald-900 text-xs font-bold font-mono">
                STAGE 2: IF FAULT RECURS &le; 30 DAYS
              </div>
              <h3 className="text-xl font-black text-emerald-950">
                Independent Worker B Re-Services 100% Free
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                If the repaired issue recurs within 30 days, the database automatically filters out Worker A and dispatches an independent certified technician (Worker B) to resolve it with <strong>zero charges to the citizen</strong>.
              </p>
              <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-700">
                  <ShieldCheck className="w-4 h-4" />
                  <span>No Argument • Zero Conflict of Interest</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Worker B is compensated by the state guarantee escrow pool.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/guarantee"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all hover:scale-[1.02]"
            >
              <span>Learn Complete Guarantee Policy</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 26 AP DISTRICTS COVERAGE STRIP */}
      <section className="py-16 px-4 bg-slate-900 text-white">
        <div className="container mx-auto max-w-6xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-900/60 text-emerald-300 text-xs font-bold border border-emerald-700/50">
            <MapPin className="w-3.5 h-3.5" />
            <span>Statewide Administrative Coverage</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight font-serif">
            Available Across All 26 Districts of Andhra Pradesh
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            From Srikakulam in the north to Chittoor in the south, GramaSeva operates across all revenue mandals and rural gram panchayats.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            {[
              'Alluri Sitharama Raju', 'Anakapalli', 'Ananthapuramu', 'Annamayya', 'Bapatla',
              'Chittoor', 'Dr. B.R. Ambedkar Konaseema', 'East Godavari', 'Eluru', 'Guntur',
              'Kakinada', 'Krishna', 'Kurnool', 'Nandyal', 'NTR (Vijayawada)', 'Palnadu',
              'Parvathipuram Manyam', 'Prakasam (Ongole)', 'Srikakulam', 'SPS Nellore',
              'Sri Sathya Sai', 'Tirupati', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'
            ].map((distName) => (
              <span
                key={distName}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700/60"
              >
                {distName}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-800 to-teal-900 text-white text-center">
        <div className="container mx-auto max-w-4xl space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black font-serif">
            Need Doorstep Service Today?
          </h2>
          <p className="text-xs sm:text-base text-emerald-100 max-w-xl mx-auto leading-relaxed">
            Standard ₹50 home visit fee. Verified local technicians dispatched to your village with guaranteed work.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/nearby"
              className="px-8 py-4 rounded-2xl bg-white text-emerald-950 font-black text-sm shadow-xl hover:bg-emerald-50 transition-all hover:scale-105"
            >
              Find Technicians in {selectedDistrict.nameEn}
            </Link>
            <Link
              to="/register"
              className="px-6 py-4 rounded-2xl bg-emerald-900/60 hover:bg-emerald-900 text-white font-extrabold text-sm border border-emerald-500/40 transition-colors"
            >
              Are you a technician? Register Here
            </Link>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedServiceForBooking && (
        <BookingModal
          service={selectedServiceForBooking}
          provider={null}
          onClose={() => setSelectedServiceForBooking(null)}
          onSuccess={(bkg) => {
            navigate('/customer');
          }}
        />
      )}
    </div>
  );
};
