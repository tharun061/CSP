import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLogin = () => {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    setLoading(true);

    try {
      loginAdmin({
        email: email.trim(),
        password: password.trim()
      });
      setLoading(false);
      navigate('/admin');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Authentication failed.');
    }
  };

  return (
    <div className="py-16 bg-slate-900 min-h-screen text-left flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Emblem */}
        <div className="text-center mb-8 space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 mx-auto flex items-center justify-center text-white shadow-xl shadow-emerald-700/30 mb-3 border border-emerald-500/30">
            <Building2 className="w-8 h-8 text-emerald-200" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-serif">
            Government of Andhra Pradesh
          </h1>
          <p className="text-xs text-emerald-400 font-semibold tracking-wider uppercase">
            Official GramaSeva Administration Gateway
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Authorized State Administrative Officers & District Collectors Only</span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Official Government Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gramaseva.ap.gov.in"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Administrative Passkey
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs shadow-md shadow-emerald-700/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Validating Security Credentials...' : 'Authenticate & Enter Admin Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-900 text-center text-xs text-slate-500">
            <Link to="/" className="text-slate-400 hover:text-white transition-colors">
              &larr; Return to Public Citizen Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
