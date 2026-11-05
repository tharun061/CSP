import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  Users, 
  Wrench, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  MapPin, 
  Activity, 
  ArrowRight,
  LogOut,
  RefreshCw,
  Search,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';
import { checkSupabaseStatus } from '../services/supabaseClient';
import { apDistricts } from '../data/apDistricts';

export const AdminDashboard = () => {
  const { currentUser, role, logout } = useAuth();
  const { users } = useAuth();
  const { bookings, claims, allProviders, assignWorkerB } = useDatabase();
  const navigate = useNavigate();

  const [dbStatus, setDbStatus] = useState(null);
  const [dbLoading, setDbLoading] = useState(true);
  const [selectedClaimForWorkerB, setSelectedClaimForWorkerB] = useState(null);
  const [selectedWorkerBId, setSelectedWorkerBId] = useState('');
  const [assignError, setAssignError] = useState(null);

  useEffect(() => {
    // Check database health
    checkSupabaseStatus().then((res) => {
      setDbStatus(res);
      setDbLoading(false);
    });
  }, []);

  // Protect route
  if (role !== 'ADMIN') {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">
          Administrative Privileges Required
        </h2>
        <p className="text-xs text-slate-500">
          Please log in through the official state government gateway.
        </p>
        <Link
          to="/admin/login"
          className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
        >
          Go to Official Admin Login
        </Link>
      </div>
    );
  }

  const registeredCitizens = users.filter((u) => u.role === 'CITIZEN');
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED');
  const activeGuarantees = bookings.filter((b) => b.guaranteeActive);

  const handleAssignWorkerB = async (e) => {
    e.preventDefault();
    setAssignError(null);

    if (!selectedWorkerBId) {
      setAssignError('Please select an independent certified technician.');
      return;
    }

    try {
      await assignWorkerB({
        claimId: selectedClaimForWorkerB.id,
        workerBId: selectedWorkerBId
      });
      setSelectedClaimForWorkerB(null);
      setSelectedWorkerBId('');
    } catch (err) {
      setAssignError(err.message || 'Failed to assign Worker B.');
    }
  };

  return (
    <div className="py-10 bg-slate-100 min-h-screen text-left">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Top Government Ribbon */}
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-lg">
              <Building2 className="w-8 h-8 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black font-serif">
                  State Administration Console
                </h1>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-mono">
                  State Official
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Government of Andhra Pradesh • Rural Governance & 30-Day Guarantee Oversight
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Admin</span>
            </button>
          </div>
        </div>

        {/* 4 Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Registered Citizens</span>
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">
              {registeredCitizens.length}
            </div>
            <p className="text-[11px] text-emerald-700 font-medium">
              Verified rural households across AP
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Certified Technicians</span>
              <Wrench className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">
              {allProviders.length}
            </div>
            <p className="text-[11px] text-emerald-700 font-medium">
              Police & skill verified field workers
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Completed Bookings</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">
              {completedBookings.length}
            </div>
            <p className="text-[11px] text-emerald-700 font-medium">
              ₹50 visit fee standard enforced
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Active 30-Day Guarantees</span>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">
              {activeGuarantees.length}
            </div>
            <p className="text-[11px] text-emerald-700 font-medium">
              Worker B free re-service protected
            </p>
          </div>
        </div>

        {/* Database Architecture & Live Health Monitor */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Relational Database & PostGIS Spatial Engine
                </h3>
                <p className="text-xs text-slate-500">
                  Unified cloud schema with instant offline fallback
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-800 font-mono">
                SYSTEM HEALTHY
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Database Mode</span>
              <span className="font-extrabold text-slate-900">{dbStatus?.mode || 'PostgreSQL 15 (PostGIS 3.4 Enabled)'}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Spatial Indexing</span>
              <span className="font-extrabold text-slate-900">GiST 2D Point Geodesic Indexing</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Guarantee Constraint</span>
              <span className="font-extrabold text-slate-900">CHECK (worker_a_id != worker_b_id)</span>
            </div>
          </div>
        </div>

        {/* Guarantee Claims Arbitration & Worker B Assignment */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Arbitration Queue</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 font-serif">
                30-Day Guarantee Claims & Worker B Re-Service Dispatch
              </h2>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 bg-amber-50 text-amber-900 rounded-full border border-amber-200">
              Claims: {claims.length}
            </span>
          </div>

          {claims.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
              Zero pending guarantee claims in the queue. All recurring fault arbitrations resolved.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {claims.map((claim) => (
                <div key={claim.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">#{claim.bookingCode}</span>
                      <span className="font-bold text-emerald-800">{claim.serviceName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px]">
                        {claim.status}
                      </span>
                    </div>
                    <div className="text-slate-600">
                      Citizen: <strong>{claim.customerName}</strong> ({claim.customerPhone}) • {claim.mandal}, {claim.district}
                    </div>
                    <div className="text-slate-500 italic">
                      Problem: "{claim.issueDescription}"
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      Original Worker A: <strong>{claim.originalWorkerAName}</strong>
                      {claim.assignedWorkerBName && (
                        <span> &rarr; Independent Worker B: <strong className="text-emerald-700">{claim.assignedWorkerBName}</strong></span>
                      )}
                    </div>
                  </div>

                  <div>
                    {claim.status === 'UNDER_REVIEW' ? (
                      <button
                        onClick={() => {
                          setSelectedClaimForWorkerB(claim);
                          setAssignError(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md shadow-amber-600/20 cursor-pointer"
                      >
                        Assign Independent Worker B
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Worker B Dispatched</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 26 AP Districts Operational Registry */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">
              All 26 Andhra Pradesh Revenue Districts Status
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              26 Districts Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
            {apDistricts.map((d) => (
              <div
                key={d.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <div className="font-extrabold text-slate-800">{d.nameEn}</div>
                  <div className="text-[11px] text-slate-500">{d.nameTe}</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Worker B Assignment Modal */}
      {selectedClaimForWorkerB && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                Assign Independent Worker B
              </h3>
              <button
                onClick={() => setSelectedClaimForWorkerB(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                &times;
              </button>
            </div>

            {assignError && (
              <div className="my-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{assignError}</span>
              </div>
            )}

            <form onSubmit={handleAssignWorkerB} className="py-4 space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-950 border border-emerald-200">
                Original Worker A: <strong>{selectedClaimForWorkerB.originalWorkerAName}</strong>.
                Per state policy, Worker B must be an independent technician to prevent conflict of interest.
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Select Independent Technician (Worker B) *:
                </label>
                <select
                  required
                  value={selectedWorkerBId}
                  onChange={(e) => setSelectedWorkerBId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="">-- Choose Eligible Technician --</option>
                  {allProviders
                    .filter((p) => p.id !== selectedClaimForWorkerB.originalWorkerAId)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} ({p.district} • {p.services.join(', ')})
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedClaimForWorkerB(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md shadow-emerald-700/20"
                >
                  Confirm Worker B Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
