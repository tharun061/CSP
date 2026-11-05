import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Phone, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  AlertCircle,
  Plus,
  KeyRound,
  ArrowRight,
  Receipt
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';
import { DigitalReceiptModal } from '../components/DigitalReceiptModal';

export const CustomerDashboard = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { bookings, fileGuaranteeClaim } = useDatabase();
  const navigate = useNavigate();

  const [activeReceiptBooking, setActiveReceiptBooking] = useState(null);
  const [claimModalBooking, setClaimModalBooking] = useState(null);
  const [issueDesc, setIssueDesc] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Filter bookings for this citizen (or show recent bookings if guest demo)
  const myBookings = currentUser
    ? bookings.filter(
        (b) => b.customerPhone === currentUser.phone || b.customerName === currentUser.fullName
      )
    : bookings;

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!claimModalBooking || !issueDesc.trim()) return;

    try {
      await fileGuaranteeClaim({
        bookingId: claimModalBooking.id,
        issueDescription: issueDesc.trim()
      });
      setClaimSuccess(true);
      setTimeout(() => {
        setClaimSuccess(false);
        setClaimModalBooking(null);
        setIssueDesc('');
      }, 2000);
    } catch (err) {
      alert(err.message || 'Failed to submit claim.');
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen text-left">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* User Greeting & Stats Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-black text-2xl shadow-md">
                {currentUser?.fullName?.charAt(0) || 'C'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                    {currentUser?.fullName || 'Citizen Customer'}
                  </h1>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Verified Citizen
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentUser?.phone || '9440123456'}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {currentUser?.village || 'Panchayat Village'}, {currentUser?.mandal || 'Mandal'}, {currentUser?.district || 'Andhra Pradesh'}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <Link
              to="/nearby"
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-700/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Book New Doorstep Service</span>
            </Link>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 font-serif">
              My Doorstep Service Bookings
            </h2>
            <span className="text-xs text-slate-500 font-bold font-mono">
              Total: {myBookings.length}
            </span>
          </div>

          {myBookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Receipt className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-slate-800">
                You have no active service bookings yet.
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Book a certified technician in your mandal with standard ₹50 basic visit fee and a 30-day service guarantee.
              </p>
              <Link
                to="/nearby"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                <span>Find Technicians</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 text-left"
                >
                  {/* Top Booking Code & Status Pill */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Booking Code
                      </span>
                      <span className="font-mono font-black text-slate-900 text-xs">
                        #{b.code}
                      </span>
                    </div>

                    <span
                      className={`text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                        b.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'GUARANTEE_CLAIMED'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {b.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Service & Technician */}
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {b.serviceName}
                    </h3>
                    <div className="text-xs text-slate-600 mt-1 flex flex-col gap-0.5">
                      <span>Technician: <strong>{b.providerName}</strong></span>
                      <span className="font-mono text-slate-500">Phone: {b.providerPhone}</span>
                      <span className="text-slate-400 mt-1">
                        Scheduled: {b.scheduledDate} ({b.scheduledTime})
                      </span>
                    </div>
                  </div>

                  {/* Dual Verification OTP Card for Active Jobs */}
                  {b.status !== 'COMPLETED' && b.status !== 'GUARANTEE_CLAIMED' && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                        <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Doorstep Verification Passcodes:</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center font-mono">
                        <div className="p-2 bg-white rounded-xl border border-emerald-200/80">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Start OTP</span>
                          <span className="text-base font-black text-slate-900">{b.startOtp}</span>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-emerald-200/80">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Complete OTP</span>
                          <span className="text-base font-black text-slate-900">{b.completeOtp}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-emerald-800 leading-tight">
                        Provide Start OTP when the technician arrives, and Complete OTP once the work is finished to your satisfaction.
                      </p>
                    </div>
                  )}

                  {/* Pricing Summary */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Basic Visit Fee: ₹50
                      </span>
                      <span className="text-slate-600">
                        Work charges: ₹{b.workCharges || 0}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Amount</span>
                      <span className="text-base font-black text-emerald-700 font-mono">
                        ₹{b.totalAmount || 50}
                      </span>
                    </div>
                  </div>

                  {/* Actions: View Receipt or Claim Guarantee */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    {b.status === 'COMPLETED' ? (
                      <>
                        <button
                          onClick={() => setActiveReceiptBooking(b)}
                          className="grow px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Official Receipt</span>
                        </button>

                        <button
                          onClick={() => setClaimModalBooking(b)}
                          className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors cursor-pointer"
                          title="Claim 30-Day Guarantee"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <div className="text-xs text-slate-400 italic">
                        Technician on schedule. Verification passcodes ready.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Digital Receipt Modal */}
      {activeReceiptBooking && (
        <DigitalReceiptModal
          booking={activeReceiptBooking}
          onClose={() => setActiveReceiptBooking(null)}
          onClaimGuarantee={(bkg) => {
            setActiveReceiptBooking(null);
            setClaimModalBooking(bkg);
          }}
        />
      )}

      {/* Guarantee Claim Modal */}
      {claimModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-black text-slate-900">
                  File 30-Day Guarantee Claim
                </h3>
              </div>
              <button
                onClick={() => setClaimModalBooking(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                &times;
              </button>
            </div>

            {claimSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-extrabold text-slate-900">
                  Guarantee Claim Registered!
                </h4>
                <p className="text-xs text-slate-600">
                  Worker B will be assigned by the state administration. The re-service is 100% free of charge.
                </p>
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit} className="py-4 space-y-4">
                <div className="p-3 rounded-2xl bg-amber-50 text-xs text-amber-900 border border-amber-200">
                  <strong>Worker A vs Worker B Rule:</strong> The database will assign an independent certified technician (Worker B) who is not the original worker to inspect and resolve this fault free of charge.
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Describe the recurring problem:
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={issueDesc}
                    onChange={(e) => setIssueDesc(e.target.value)}
                    placeholder="e.g. The motor starter was repaired 6 days ago, but the capacitor failed again today."
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setClaimModalBooking(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md shadow-amber-600/20"
                  >
                    Submit Guarantee Claim (100% Free)
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
