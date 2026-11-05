import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Wrench, 
  Tractor, 
  Bike, 
  Droplets, 
  Refrigerator, 
  Sun, 
  Tv,
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Clock,
  MapPin,
  Tag
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useDatabase } from '../context/DatabaseContext';
import { servicesData } from '../data/servicesData';
import { BookingModal } from '../components/BookingModal';

export const Services = () => {
  const { lang, t } = useLanguage();
  const { selectedDistrict } = useDatabase();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);
  const navigate = useNavigate();

  const categories = [
    'ALL',
    'Electrical & Power',
    'Water & Sanitation',
    'Agriculture & Farm',
    'Automotive Breakdown',
    'Appliances & Health',
    'Home Appliances',
    'Renewable Energy',
    'Electronics & Media'
  ];

  const filteredServices = activeCategory === 'ALL'
    ? servicesData
    : servicesData.filter((s) => s.category === activeCategory);

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
    <div className="py-12 bg-slate-50 min-h-screen text-left">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Page Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
            <Tag className="w-3.5 h-3.5 text-emerald-600" />
            <span>Government Verified Service Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-serif">
            {lang === 'te' ? 'అధికారిక గ్రామీణ సేవలు & ధరల జాబితా' : 'Rural Local Services & Rate Card'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Standard <strong>₹50 Basic Home Visit Fee</strong> applies to all services. Additional work charges depend on diagnosed work and are uploaded transparently by the technician.
          </p>
        </div>

        {/* Categories Horizontal Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Services' : cat}
            </button>
          ))}
        </div>

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredServices.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                      {getServiceIcon(s.icon)}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        {s.category}
                      </span>
                      <h3 className="text-xl font-black text-slate-900">
                        {lang === 'te' ? s.name_te : s.name_en}
                      </h3>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Visit Fee</span>
                    <span className="text-lg font-black text-emerald-700 font-mono">₹50</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {lang === 'te' ? s.description_te : s.description_en}
                </p>

                {/* Common Tasks */}
                <div className="space-y-2 mb-6">
                  <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
                    Common Tasks & Diagnostics:
                  </span>
                  <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-700">
                    {s.common_tasks.map((task, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  Estimated work charges: <strong className="text-slate-900">₹{s.estimated_work_min} - ₹{s.estimated_work_max}</strong>
                </div>

                <button
                  onClick={() => setSelectedServiceForBooking(s)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-700/20 transition-all hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Book Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedServiceForBooking && (
        <BookingModal
          service={selectedServiceForBooking}
          provider={null}
          onClose={() => setSelectedServiceForBooking(null)}
          onSuccess={() => navigate('/customer')}
        />
      )}
    </div>
  );
};
