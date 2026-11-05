import React, { useState } from 'react';
import { 
  Wrench, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  KeyRound, 
  DollarSign, 
  ShieldCheck, 
  Star,
  FileCheck2,
  AlertCircle,
  Truck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';

export const ProviderDashboard = () => {
  const { currentUser } = useAuth();
  const { bookings, updateBookingStatus, completeJobWithUpload } = useDatabase();

  const [activeJobForCompletion, setActiveJobForCompletion] = useState(null);
  const [workCharges, setWorkCharges] = useState('200');
  const [workDetails, setWorkDetails] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [error, setError] = useState(null);

  // Filter jobs assigned to this provider or matching their district
  const providerPhone = currentUser?.phone || '9848011223';
  const myJobs = bookings.filter(
    (b) => b.providerPhone === providerPhone || b.providerId === currentUser?.id || b.providerName === currentUser?.fullName
  );

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!activeJobForCompletion) return;

    if (enteredOtp.trim() !== activeJobForCompletion.completeOtp) {
      setError(`Invalid Complete OTP. Please ask the customer for their 4-digit Complete OTP (Expected: ${activeJobForCompletion.completeOtp}).`);
      return;
    }

    try {
      await completeJobWithUpload({
        bookingId: activeJobForCompletion.id,
        additionalWorkCharges: parseFloat(workCharges) || 0,
        workDetails: workDetails.trim() || 'Repairs completed and inspected on site.'
      });

      setActiveJobForCompletion(null);
      setWorkCharges('200');
      setWorkDetails('');
      setEnteredOtp('');
    } catch (err) {
      setError(err.message || 'Failed to complete job.');
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen text-left">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Technician Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-black text-2xl shadow-md">
                {currentUser?.fullName?.charAt(0) || 'T'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                    {currentUser?.fullName || 'Ramesh Kumar (Certified Technician)'}
                  </h1>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Verified AP Registry</span>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentUser?.phone || '9848011223'}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {currentUser?.village || 'Chandragiri'}, {currentUser?.mandal || 'Chandragiri'}, {currentUser?.district || 'Tirupati'}
                    </span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-bold text-amber-700">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{currentUser?.rating || 4.95} Rating</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Approved Trade Badges */}
            <div className="space-y-1.5 text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Approved Trade Skills:
              </span>
              <div className="flex flex-wrap sm:justify-end gap-1.5">
                {(currentUser?.services || ['Electrician Services', 'TV / DTH & Digital Tech']).map((svc, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200"
                  >
                    {svc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Bookings List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 font-serif">
              Assigned Doorstep Service Jobs
            </h2>
            <span className="text-xs text-slate-500 font-bold font-mono">
              Total Assigned: {myJobs.length}
            </span>
          </div>

          {myJobs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <Wrench className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-extrabold text-slate-800">
                No active bookings currently assigned to your queue.
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Incoming citizen requests from your mandal will appear here in real time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myJobs.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 text-left"
                >
                  {/* Code & Status */}
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
                          : b.status === 'ARRIVED'
                          ? 'bg-purple-100 text-purple-800'
                          : b.status === 'ON_THE_WAY'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {b.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Customer Information */}
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {b.serviceName}
                    </h3>
                    <div className="text-xs text-slate-600 mt-2 space-y-1">
                      <div>
                        Customer: <strong>{b.customerName}</strong> (
                        <a href={`tel:${b.customerPhone}`} className="text-emerald-700 font-mono font-bold">
                          {b.customerPhone}
                        </a>
                        )
                      </div>
                      <div className="flex items-start gap-1 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {b.village}, {b.mandal}, {b.district}
                        </span>
                      </div>
                      <div className="text-slate-400">
                        Schedule: {b.scheduledDate} ({b.scheduledTime})
                      </div>
                    </div>
                  </div>

                  {/* Pricing Overview */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Basic Home Visit Fee: ₹50
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

                  {/* State Action Buttons */}
                  <div className="pt-2">
                    {b.status === 'CONFIRMED' && (
                      <button
                        onClick={() => updateBookingStatus(b.id, 'ON_THE_WAY')}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Mark "On The Way to Village"</span>
                      </button>
                    )}

                    {b.status === 'ON_THE_WAY' && (
                      <button
                        onClick={() => updateBookingStatus(b.id, 'ARRIVED')}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>Mark "Arrived at Customer Doorstep"</span>
                      </button>
                    )}

                    {b.status === 'ARRIVED' && (
                      <button
                        onClick={() => setActiveJobForCompletion(b)}
                        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Complete Job & Upload Work Details</span>
                      </button>
                    )}

                    {b.status === 'COMPLETED' && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center border border-emerald-200 flex items-center justify-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Service Complete & 30-Day Guarantee Active</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Complete Job & Upload Payment Modal */}
      {activeJobForCompletion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-black text-slate-900">
                  Complete Job & Upload Bill
                </h3>
              </div>
              <button
                onClick={() => setActiveJobForCompletion(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                &times;
              </button>
            </div>

            {error && (
              <div className="my-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCompleteSubmit} className="py-4 space-y-4">
              {/* Fixed Visit Fee Disclosure */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">Basic Home Visit Fee</span>
                  <span className="text-[11px] text-slate-500">Government mandated doorstep inspection rate</span>
                </div>
                <span className="text-base font-black text-emerald-700 font-mono">₹50</span>
              </div>

              {/* Additional Work Charges */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Additional Diagnosed Work Charges (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="10"
                    value={workCharges}
                    onChange={(e) => setWorkCharges(e.target.value)}
                    placeholder="e.g. 200"
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Total Bill = ₹50 + ₹{parseFloat(workCharges) || 0} = <strong>₹{50 + (parseFloat(workCharges) || 0)}</strong>
                </span>
              </div>

              {/* Work Summary */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Brief Work & Repair Summary *
                </label>
                <textarea
                  required
                  rows={3}
                  value={workDetails}
                  onChange={(e) => setWorkDetails(e.target.value)}
                  placeholder="e.g. Inspected 3-phase starter box, replaced burnt capacitor, cleaned contactor points."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Customer Complete OTP Verification */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                <label className="text-xs font-bold text-emerald-950 block">
                  Customer Complete Verification OTP *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ask customer for 4-digit Complete OTP"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-emerald-300 bg-white text-xs font-mono font-bold tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[10px] text-emerald-800">
                  Customer receives this OTP on their booking screen to verify work completion.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveJobForCompletion(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-700/20"
                >
                  Verify OTP & Issue Guarantee Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
