import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  PhoneCall, 
  ShieldCheck, 
  MapPin, 
  Lock, 
  ExternalLink,
  Heart
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-10 border-t border-slate-900 mt-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1: Government Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md">
                <Building2 className="w-6 h-6 text-emerald-100" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  {lang === 'te' ? 'గ్రామసేవ' : 'GramaSeva'}
                </h3>
                <p className="text-xs text-emerald-400 font-semibold">
                  {lang === 'te' ? 'ఆంధ్రప్రదేశ్ ప్రభుత్వం' : 'Government of Andhra Pradesh'}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              {lang === 'te'
                ? 'ఆంధ్రప్రదేశ్‌లోని గ్రామీణ కుటుంబాలను ధృవీకరించబడిన స్థానిక నిపుణులతో అనుసంధానించే అధికారిక పోర్టల్. ప్రతి సర్వీస్ 30-రోజుల ఉచిత రీ-సర్వీస్ గ్యారెంటీతో రక్షించబడుతుంది.'
                : 'Official digital citizen portal connecting rural households with police-verified local trade technicians across all 26 districts of Andhra Pradesh, backed by an independent 30-day service guarantee.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>Helpline: <strong>1902</strong> (Toll-Free)</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>30-Day Guarantee</span>
              </div>
            </div>
          </div>

          {/* Col 2: Citizen Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Citizen Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/services" className="hover:text-emerald-400 transition-colors">
                  All 8 Trade Services
                </Link>
              </li>
              <li>
                <Link to="/nearby" className="hover:text-emerald-400 transition-colors">
                  Find Nearby Technicians
                </Link>
              </li>
              <li>
                <Link to="/guarantee" className="hover:text-emerald-400 transition-colors">
                  30-Day Guarantee Policy
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">
                  Transparent ₹50 Visit Fee
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Citizen Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Service Providers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Technician Portal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/register" className="hover:text-emerald-400 transition-colors">
                  Join as Verified Technician
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Technician Job Dashboard
                </Link>
              </li>
              <li>
                <span className="text-slate-500">
                  Fixed ₹50 Basic Home Visit Fee
                </span>
              </li>
              <li>
                <span className="text-slate-500">
                  Direct Work Charges Upload
                </span>
              </li>
              <li>
                <span className="text-slate-500">
                  Zero Platform Commission
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: State Administration */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              State Governance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link 
                  to="/admin/login" 
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  <Lock className="w-3 h-3" />
                  <span>State Admin Console</span>
                </Link>
              </li>
              <li>
                <span className="text-slate-400">
                  All 26 AP Districts Monitored
                </span>
              </li>
              <li>
                <span className="text-slate-400">
                  PostgreSQL 15 + PostGIS
                </span>
              </li>
              <li>
                <span className="text-slate-400">
                  Worker A vs Worker B Engine
                </span>
              </li>
              <li>
                <span className="text-slate-400">
                  Police Verification Registry
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Rights Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Government of Andhra Pradesh. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span>Andhra Pradesh Rural Governance Initiative</span>
            <span>•</span>
            <Link to="/admin/login" className="hover:text-slate-400">
              Administrative Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
