import React from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  User, 
  Phone, 
  MapPin, 
  Receipt,
  FileCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const DigitalReceiptModal = ({ booking, onClose, onClaimGuarantee }) => {
  const { lang, t } = useLanguage();

  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const receiptNo = `RCP-${booking.code?.replace('GRM-', '') || Date.now().toString().slice(-6)}`;
  const completedDate = booking.completedAt
    ? new Date(booking.completedAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('en-IN');

  const guaranteeExpiryDate = booking.guaranteeExpiresAt
    ? new Date(booking.guaranteeExpiresAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : new Date(Date.now() + 30 * 86400000).toLocaleDateString('en-IN');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        {/* Top Actions */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Receipt className="w-4 h-4 text-emerald-600" />
            <span>Digital Service Receipt & Guarantee Card</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Header */}
        <div className="text-center py-5 border-b border-dashed border-slate-200">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 mx-auto flex items-center justify-center text-white shadow-md mb-2">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight font-serif">
            Government of Andhra Pradesh
          </h2>
          <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider">
            GramaSeva • Rural Citizen Services Portal
          </p>
          <div className="inline-block mt-2 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-mono text-slate-700 font-bold">
            Receipt No: {receiptNo}
          </div>
        </div>

        {/* Customer & Technician Details */}
        <div className="py-4 grid grid-cols-2 gap-4 text-xs border-b border-slate-100">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Customer Details
            </span>
            <div className="font-extrabold text-slate-900">{booking.customerName}</div>
            <div className="text-slate-600 font-mono">{booking.customerPhone}</div>
            <div className="text-slate-500 mt-1">
              {booking.village}, {booking.mandal}, {booking.district}
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Assigned Certified Technician
            </span>
            <div className="font-extrabold text-slate-900">{booking.providerName}</div>
            <div className="text-slate-600 font-mono">{booking.providerPhone}</div>
            <div className="text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified AP Registry License</span>
            </div>
          </div>
        </div>

        {/* Service Itemization */}
        <div className="py-4 space-y-2 border-b border-slate-100 text-xs">
          <div className="flex items-center justify-between font-bold text-slate-800 pb-1">
            <span>Service Description</span>
            <span>Amount</span>
          </div>

          <div className="flex items-center justify-between text-slate-700">
            <div>
              <span className="font-semibold block">{booking.serviceName}</span>
              <span className="text-[11px] text-slate-400">Basic Home Visit & Diagnostic Inspection</span>
            </div>
            <span className="font-mono font-bold">₹{booking.baseVisitFee || 50}.00</span>
          </div>

          {booking.workCharges > 0 && (
            <div className="flex items-center justify-between text-slate-700 pt-1">
              <div>
                <span className="font-semibold block">Diagnosed Work Charges</span>
                <span className="text-[11px] text-slate-400">
                  {booking.workDetails || 'On-site technical repairs and fittings'}
                </span>
              </div>
              <span className="font-mono font-bold">₹{booking.workCharges}.00</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm font-black text-slate-900">
            <span>Total Paid (Government Verified Rate):</span>
            <span className="text-lg text-emerald-700 font-mono">
              ₹{booking.totalAmount || (booking.baseVisitFee || 50) + (booking.workCharges || 0)}.00
            </span>
          </div>
        </div>

        {/* 30-Day Guarantee Certificate Box */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="grow text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-emerald-950 text-sm">
                  30-Day Service Guarantee Active
                </h4>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                  Protected
                </span>
              </div>
              <p className="text-emerald-800 mt-1 leading-relaxed">
                If the repaired fault recurs before <strong>{guaranteeExpiryDate}</strong>, an independent alternate certified technician (Worker B) will be dispatched to resolve it <strong>100% free of charge</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Claim Guarantee Button if applicable */}
        {onClaimGuarantee && (
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onClaimGuarantee(booking);
              }}
              className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Problem Recurred? Claim Free 30-Day Guarantee Re-Service</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
