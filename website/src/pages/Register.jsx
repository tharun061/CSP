import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  User, 
  Wrench, 
  Phone, 
  Lock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { apDistricts } from '../data/apDistricts';
import { servicesData } from '../data/servicesData';

export const Register = () => {
  const { lang, t } = useLanguage();
  const { registerCitizen, registerProvider } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('citizen'); // 'citizen' or 'provider'
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState(apDistricts[21].nameEn); // Default Tirupati
  const [mandal, setMandal] = useState(apDistricts[21].mandals[0]);
  const [village, setVillage] = useState('');
  const [experienceYears, setExperienceYears] = useState('5');
  const [selectedServices, setSelectedServices] = useState([servicesData[0].name_en]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentDistrictData = apDistricts.find((d) => d.nameEn === district) || apDistricts[21];

  const toggleService = (svcName) => {
    setSelectedServices((prev) => {
      if (prev.includes(svcName)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((s) => s !== svcName);
      }
      return [...prev, svcName];
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !phone.trim() || !password.trim() || !village.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (phone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      if (activeTab === 'citizen') {
        registerCitizen({
          fullName: fullName.trim(),
          phone: phone.trim(),
          password,
          district,
          mandal,
          village: village.trim()
        });
        setLoading(false);
        navigate('/customer');
      } else {
        registerProvider({
          fullName: fullName.trim(),
          phone: phone.trim(),
          password,
          district,
          mandal,
          village: village.trim(),
          services: selectedServices,
          experienceYears
        });
        setLoading(false);
        navigate('/provider');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="py-16 bg-slate-50 min-h-screen text-left flex items-center justify-center px-4">
      <div className="max-w-xl w-full">
        {/* Emblem & Title */}
        <div className="text-center mb-8 space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-700/20 mb-3">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
            {lang === 'te' ? 'గ్రామసేవ నూతన నమోదు' : 'Official GramaSeva Registration'}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Government of Andhra Pradesh • Official Rural Citizen & Technician Registration
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          {/* Persona Tabs */}
          <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setActiveTab('citizen');
                setError(null);
              }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'citizen'
                  ? 'bg-white text-emerald-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>Register as Citizen</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('provider');
                setError(null);
              }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'provider'
                  ? 'bg-white text-emerald-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wrench className="w-4 h-4 text-emerald-600" />
              <span>Register as Technician</span>
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mobile Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit number"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Create Secure Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
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
                placeholder="e.g. Near Ramalayam Temple, Old Village Road"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Provider-Specific Fields */}
            {activeTab === 'provider' && (
              <div className="pt-2 space-y-4 border-t border-slate-100">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Years of Field Experience *
                  </label>
                  <select
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="1">1 Year</option>
                    <option value="2">2 Years</option>
                    <option value="3">3 Years</option>
                    <option value="5">5 Years</option>
                    <option value="8">8 Years</option>
                    <option value="10">10+ Years</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Select Your Trade Skills (Select one or more) *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {servicesData.map((s) => {
                      const isChecked = selectedServices.includes(s.name_en);
                      return (
                        <label
                          key={s.id}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleService(s.name_en)}
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="truncate">{s.name_en}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {loading
                    ? 'Creating Account...'
                    : activeTab === 'citizen'
                    ? 'Register as Citizen (Start Booking)'
                    : 'Register as Verified Technician'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="font-extrabold text-emerald-700 hover:underline">
              Login to Your Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
