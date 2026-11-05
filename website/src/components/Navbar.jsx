import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  MapPin, 
  ShieldCheck, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Languages, 
  Wrench, 
  CheckCircle2, 
  Crosshair,
  Building2,
  PhoneCall
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';
import { apDistricts } from '../data/apDistricts';

export const Navbar = () => {
  const { lang, toggleLanguage, t } = useLanguage();
  const { currentUser, isAuthenticated, role, logout } = useAuth();
  const { selectedDistrict, changeDistrict, detectGpsLocation, gpsLoading } = useDatabase();
  const [districtModalOpen, setDistrictModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Topmost AP Government Official Flag & Notice Strip */}
      <div className="bg-emerald-950 text-emerald-100 text-[11px] sm:text-xs py-1.5 px-4 border-b border-emerald-900/60">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold tracking-wide">
              {lang === 'te' ? 'ఆంధ్రప్రదేశ్ ప్రభుత్వం • గ్రామసేవ అధికారిక పౌర పోర్టల్' : 'Government of Andhra Pradesh • Official Citizen Services Portal'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-emerald-200">
            <span className="hidden md:inline-flex items-center gap-1.5 font-medium">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('contactHelpline')}</span>
            </span>
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1 font-bold text-white bg-emerald-800/80 hover:bg-emerald-700 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer"
              title="Switch Language"
            >
              <Languages className="w-3 h-3 text-emerald-300" />
              <span>{lang === 'te' ? 'English' : 'తెలుగు'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
          {/* Logo & Emblem Branding */}
          <Link to="/" className="flex items-center gap-3.5 shrink-0 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-emerald-100" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-serif">
                  {lang === 'te' ? 'గ్రామసేవ' : 'GramaSeva'}
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  AP GOV
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight">
                {lang === 'te' ? 'ఆంధ్రప్రదేశ్ గ్రామీణ స్థానిక సేవలు' : 'Andhra Pradesh Citizen Services'}
              </p>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('navHome')}
            </Link>
            <Link
              to="/services"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/services') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('navServices')}
            </Link>
            <Link
              to="/nearby"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/nearby') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('navNearby')}
            </Link>
            <Link
              to="/guarantee"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/guarantee') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('navGuarantee')}
            </Link>
            <Link
              to="/how-it-works"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/how-it-works') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('navHowItWorks')}
            </Link>
          </nav>

          {/* Right Action Controls: District Selector & User State */}
          <div className="flex items-center gap-2.5">
            {/* AP District Selector Button with GPS quick-detect */}
            <button
              onClick={() => setDistrictModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
              title="Change AP District"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span className="max-w-[110px] truncate">
                {lang === 'te' ? selectedDistrict.nameTe : selectedDistrict.nameEn}
              </span>
            </button>

            {/* Authentication Action Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {role === 'CITIZEN' && (
                  <Link
                    to="/customer"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Bookings</span>
                  </Link>
                )}
                {role === 'PROVIDER' && (
                  <Link
                    to="/provider"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Technician Portal</span>
                  </Link>
                )}
                {role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Admin Console</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-200 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-colors"
                >
                  {t('navLogin')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                >
                  {t('navRegister')}
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 shadow-lg">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              {t('navHome')}
            </Link>
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              {t('navServices')}
            </Link>
            <Link
              to="/nearby"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              {t('navNearby')}
            </Link>
            <Link
              to="/guarantee"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              {t('navGuarantee')}
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              {t('navHowItWorks')}
            </Link>

            {isAuthenticated && (
              <div className="pt-2 border-t border-slate-100 space-y-1">
                {role === 'CITIZEN' && (
                  <Link
                    to="/customer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-bold text-emerald-800 bg-emerald-50"
                  >
                    My Bookings Dashboard
                  </Link>
                )}
                {role === 'PROVIDER' && (
                  <Link
                    to="/provider"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-bold text-emerald-800 bg-emerald-50"
                  >
                    Technician Work Dashboard
                  </Link>
                )}
                {role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-bold text-slate-900 bg-slate-100"
                  >
                    Admin Console
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </header>

      {/* AP District Selection Modal with GPS Detection */}
      {districtModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    {lang === 'te' ? 'ఆంధ్రప్రదేశ్ జిల్లాను ఎంచుకోండి' : 'Select Andhra Pradesh District'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {lang === 'te' ? 'అన్ని 26 జిల్లాల్లో సేవలు అందుబాటులో ఉన్నాయి' : 'Official coverage across all 26 state districts'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDistrictModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* GPS Auto Detect Banner */}
            <div className="pt-4 pb-2">
              <button
                onClick={() => {
                  detectGpsLocation();
                  setDistrictModalOpen(false);
                }}
                disabled={gpsLoading}
                className="w-full flex items-center justify-center gap-2.5 p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
              >
                <Crosshair className={`w-4 h-4 ${gpsLoading ? 'animate-spin' : ''}`} />
                <span>
                  {gpsLoading
                    ? (lang === 'te' ? 'GPS లొకేషన్ గుర్తిస్తున్నాం...' : 'Detecting GPS Coordinates...')
                    : (lang === 'te' ? 'నా ప్రస్తుత GPS స్థానాన్ని గుర్తించండి' : 'Auto-Detect My Current GPS Location')}
                </span>
              </button>
            </div>

            {/* 26 AP Districts Grid */}
            <div className="overflow-y-auto grow my-2 pr-1 space-y-1.5">
              <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider px-2 py-1">
                All 26 Districts (అన్ని 26 జిల్లాలు):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {apDistricts.map((d) => {
                  const isSelected = selectedDistrict.id === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => {
                        changeDistrict(d.id);
                        setDistrictModalOpen(false);
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-sm'
                          : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold">{d.nameEn}</div>
                        <div className="text-xs text-slate-500 font-medium">{d.nameTe}</div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setDistrictModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
