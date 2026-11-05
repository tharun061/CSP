import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  KeyRound, 
  Receipt, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HowItWorks = () => {
  const { lang, t } = useLanguage();

  const steps = [
    {
      num: '01',
      title: 'Select Trade & Detect AP District',
      desc: 'Choose from 8 official rural trade skills. The portal auto-detects your nearest Andhra Pradesh district using GPS or allows instant manual selection.',
      icon: <MapPin className="w-6 h-6 text-emerald-600" />
    },
    {
      num: '02',
      title: 'Fixed ₹50 Doorstep Inspection Booking',
      desc: 'Confirm your doorstep booking with the fixed standard Basic Home Visit Fee of ₹50. A police-verified certified local technician is dispatched to your mandal.',
      icon: <Clock className="w-6 h-6 text-emerald-600" />
    },
    {
      num: '03',
      title: 'Dual-OTP Verification at Your Village',
      desc: 'Technician arrives and requests your 4-digit Start OTP to begin inspection. Upon completing repairs, you provide the Complete OTP to verify service satisfaction.',
      icon: <KeyRound className="w-6 h-6 text-emerald-600" />
    },
    {
      num: '04',
      title: 'Work Charges Upload & Digital Receipt',
      desc: 'Technician uploads itemized diagnosed work charges and a brief summary of the repair. You receive a verified government digital receipt instantly on your screen.',
      icon: <Receipt className="w-6 h-6 text-emerald-600" />
    },
    {
      num: '05',
      title: '30-Day Guarantee Activated',
      desc: 'Your 30-day guarantee is automatically active. If any repair recurs within 30 calendar days, an independent alternate technician (Worker B) fixes it 100% free.',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />
    }
  ];

  return (
    <div className="py-12 bg-slate-50 min-h-screen text-left">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Transparent 5-Step Process</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-serif">
            {lang === 'te' ? 'గ్రామసేవ పనిచేసే విధానం' : 'How GramaSeva Works'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Simple, transparent, and legally protected doorstep services for every rural family in Andhra Pradesh.
          </p>
        </div>

        {/* 5-Step Flow */}
        <div className="space-y-6 mb-16">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start gap-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-2xl font-black text-emerald-600 font-mono">
                  {step.num}
                </span>
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  {step.icon}
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Rules Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm mb-16 space-y-6">
          <h2 className="text-2xl font-black text-slate-900 font-serif">
            Government Mandated Fee Structure
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <span className="text-[10px] uppercase font-extrabold text-emerald-700 block tracking-wider">
                Component 1 (Fixed)
              </span>
              <h4 className="text-base font-black text-emerald-950">
                Basic Home Visit Fee: ₹50
              </h4>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Applies to every doorstep booking across all 26 AP districts. Covers technician travel up to your village doorstep and technical diagnostic inspection of the equipment.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] uppercase font-extrabold text-slate-500 block tracking-wider">
                Component 2 (Variable)
              </span>
              <h4 className="text-base font-black text-slate-900">
                Diagnosed Work & Spare Parts
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Determined by the actual repair required (e.g. rewiring, motor capacitor, valve replacement). The technician provides the quote on-site, and upon completion uploads the exact work charges to your digital receipt.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/nearby"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-xl shadow-emerald-700/20 transition-all hover:scale-105"
          >
            <span>Book a Service Now (₹50 Base Fee)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
