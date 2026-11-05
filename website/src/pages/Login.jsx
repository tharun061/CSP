import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Phone, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  User, 
  Wrench, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { lang, t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('citizen'); // 'citizen' or 'provider'
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!phone.trim() || !password.trim()) {
      setError('Please enter both your registered mobile number and password.');
      return;
    }

    setLoading(true);

    try {
      const targetRole = activeTab === 'citizen' ? 'CITIZEN' : 'PROVIDER';
      const user = login({
        phone: phone.trim(),
        password: password.trim(),
        role: targetRole
      });

      setLoading(false);
      if (user.role === 'CITIZEN') {
        navigate('/customer');
      } else if (user.role === 'PROVIDER') {
        navigate('/provider');
      } else {
        navigate('/');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    }
  };

  return (
    <div className="py-16 bg-slate-50 min-h-screen text-left flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* State Emblem & Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-700/20 mb-3">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
            {lang === 'te' ? 'గ్రామసేవ లాగిన్' : 'GramaSeva Portal Login'}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Government of Andhra Pradesh • Official Citizen & Technician Gateway
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
              <span>Citizen Login</span>
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
              <span>Technician Login</span>
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
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Registered Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>
                {loading
                  ? 'Authenticating...'
                  : activeTab === 'citizen'
                  ? 'Login to Citizen Dashboard'
                  : 'Login to Technician Dashboard'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Register Prompt */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500 space-y-2">
            <div>
              Don't have an account?{' '}
              <Link to="/register" className="font-extrabold text-emerald-700 hover:underline">
                Register New Account
              </Link>
            </div>
            <div>
              <Link to="/admin/login" className="text-[11px] text-slate-400 hover:text-slate-600">
                Official State Government Administration Login &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
