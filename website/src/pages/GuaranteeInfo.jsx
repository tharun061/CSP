import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle, 
  Clock, 
  FileCheck2, 
  HelpCircle,
  Building2,
  Users
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const GuaranteeInfo = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="py-12 bg-slate-50 min-h-screen text-left">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Government Consumer Protection Policy</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-serif">
            {lang === 'te' ? '30-రోజుల సర్వీస్ హామీ విధానం' : 'The 30-Day Service Guarantee Policy'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Every completed doorstep service through GramaSeva is backed by an automated 30-calendar-day re-service guarantee. If a repaired fault recurs, an independent certified technician (Worker B) resolves it 100% free of charge.
          </p>
        </div>

        {/* 3-Pillar Guarantee Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg">
              30D
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              30 Calendar Days
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Protection activates immediately upon job completion and digital receipt issuance. Valid for 30 full calendar days from the completion timestamp.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg">
              W-B
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              Independent Worker B
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The system programmatically filters out the original technician (Worker A) and assigns an independent alternate expert (Worker B) to inspect and fix the fault.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg">
              ₹0
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              100% Free of Charge
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Zero visit fee and zero labor charges. The citizen pays nothing for the re-service. The state guarantee pool compensates Worker B directly.
            </p>
          </div>
        </div>

        {/* Worker A vs Worker B Comparison Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm mb-16 space-y-6">
          <h2 className="text-2xl font-black text-slate-900 font-serif">
            Why Worker A vs. Worker B Matters in Rural Services
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Scenario Feature</th>
                  <th className="py-3 px-4 text-red-600 bg-red-50/50">Unorganized Informal Repair</th>
                  <th className="py-3 px-4 text-emerald-700 bg-emerald-50/50 font-bold">GramaSeva 30-Day Guarantee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900">Technician for Re-Service</td>
                  <td className="py-3.5 px-4 bg-red-50/30 text-red-900">Same worker (argues fault was new)</td>
                  <td className="py-3.5 px-4 bg-emerald-50/30 text-emerald-950 font-bold">Independent Worker B (strictly Worker B &ne; Worker A)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900">Re-Service Cost</td>
                  <td className="py-3.5 px-4 bg-red-50/30 text-red-900">Charges visit fee + labor again</td>
                  <td className="py-3.5 px-4 bg-emerald-50/30 text-emerald-950 font-bold">₹0 Free of Charge</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900">Accountability</td>
                  <td className="py-3.5 px-4 bg-red-50/30 text-red-900">No written proof or receipt</td>
                  <td className="py-3.5 px-4 bg-emerald-50/30 text-emerald-950 font-bold">Government Verified Digital Receipt</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900">Arbitration</td>
                  <td className="py-3.5 px-4 bg-red-50/30 text-red-900">Citizen has no recourse</td>
                  <td className="py-3.5 px-4 bg-emerald-50/30 text-emerald-950 font-bold">Admin Portal & 1902 Helpline Escrow</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-serif">
            Common Guarantee Questions
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            <div className="p-4 rounded-2xl bg-slate-50 space-y-1">
              <h4 className="font-extrabold text-slate-900">
                1. How do I file a guarantee claim?
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Log into your Citizen Portal (`/login`), open "My Bookings", select the completed service, and click "Claim 30-Day Guarantee". You can also call the official state citizen helpline at 1902.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 space-y-1">
              <h4 className="font-extrabold text-slate-900">
                2. What happens if a spare part needs replacement during re-service?
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Labor and diagnosis by Worker B are 100% free of charge. If a physical component replaced by Worker A was defective, Worker A covers the warranty. If a completely new external part is required, it is billed at transparent MRP.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 space-y-1">
              <h4 className="font-extrabold text-slate-900">
                3. How does Worker B get paid?
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Worker B is compensated directly by the state platform escrow pool upon completing the re-service. The citizen pays nothing.
              </p>
            </div>
          </div>

          <div className="pt-4 text-center">
            <Link
              to="/nearby"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all hover:scale-[1.02]"
            >
              <span>Book a Guaranteed Doorstep Service</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
