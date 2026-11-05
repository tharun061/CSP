import React, { createContext, useContext, useState, useEffect } from 'react';
import { apDistricts, findClosestAPDistrict, calculateHaversineDistance } from '../data/apDistricts';
import { servicesData } from '../data/servicesData';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const DatabaseContext = createContext();

const BOOKINGS_KEY = 'gramaseva_db_bookings';
const CLAIMS_KEY = 'gramaseva_db_guarantee_claims';

export const DatabaseProvider = ({ children }) => {
  const { users } = useAuth();

  // Active Selected District (default: Tirupati)
  const [selectedDistrict, setSelectedDistrict] = useState(apDistricts[21]);
  const [selectedMandal, setSelectedMandal] = useState(apDistricts[21].mandals[0]);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState(null);

  // Bookings Store (starts empty if clean, or loaded from Supabase/localStorage)
  const [bookings, setBookings] = useState(() => {
    try {
      const stored = localStorage.getItem(BOOKINGS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Guarantee Claims Store
  const [claims, setClaims] = useState(() => {
    try {
      const stored = localStorage.getItem(CLAIMS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Fetch live bookings and claims directly from Supabase if connected
  useEffect(() => {
    const fetchSupabaseData = async () => {
      if (!isSupabaseConfigured || !supabase) return;
      try {
        const { data: bData, error: bErr } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });

        if (!bErr && bData) {
          const mappedBookings = bData.map((b) => ({
            id: b.id,
            code: b.booking_code,
            serviceName: b.service_name,
            providerId: b.provider_id,
            providerName: b.provider_name,
            providerPhone: b.provider_phone,
            customerName: b.customer_name,
            customerPhone: b.customer_phone,
            district: b.district,
            mandal: b.mandal,
            village: b.village,
            scheduledDate: b.scheduled_date,
            scheduledTime: b.scheduled_time,
            status: b.status,
            startOtp: b.start_otp,
            completeOtp: b.complete_otp,
            baseVisitFee: parseFloat(b.base_visit_fee) || 50,
            workCharges: parseFloat(b.work_charges) || 0,
            totalAmount: parseFloat(b.total_amount) || 50,
            workDetails: b.work_details,
            guaranteeActive: b.guarantee_active,
            guaranteeExpiresAt: b.guarantee_expires_at,
            completedAt: b.completed_at,
            createdAt: b.created_at
          }));
          setBookings(mappedBookings);
        }

        const { data: cData, error: cErr } = await supabase
          .from('guarantee_claims')
          .select('*')
          .order('filed_at', { ascending: false });

        if (!cErr && cData) {
          const mappedClaims = cData.map((c) => ({
            id: c.id,
            bookingId: c.booking_id,
            bookingCode: c.booking_code,
            customerName: c.customer_name,
            customerPhone: c.customer_phone,
            district: c.district,
            mandal: c.mandal,
            originalWorkerAId: c.worker_a_id,
            originalWorkerAName: c.worker_a_name,
            assignedWorkerBId: c.worker_b_id,
            assignedWorkerBName: c.worker_b_name,
            issueDescription: c.issue_description,
            status: c.status,
            filedAt: c.filed_at
          }));
          setClaims(mappedClaims);
        }
      } catch (err) {
        console.warn('Could not sync with Supabase tables:', err);
      }
    };

    fetchSupabaseData();
  }, []);

  useEffect(() => {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(CLAIMS_KEY, JSON.stringify(claims));
  }, [claims]);

  // Combine newly registered providers from users
  const registeredProviders = users.filter((u) => u.role === 'PROVIDER');
  const allProviders = registeredProviders.map((p) => {
    const distData = apDistricts.find((d) => d.nameEn === p.district) || selectedDistrict;
    return {
      ...p,
      lat: distData.lat,
      lng: distData.lng,
      completedJobs: p.completedJobs || 0,
      rating: p.rating || 5.0
    };
  });

  // Geolocation trigger
  const detectGpsLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus({ success: false, message: 'Geolocation is not supported by your browser.' });
      return;
    }

    setGpsLoading(true);
    setGpsStatus(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const closest = findClosestAPDistrict(latitude, longitude);
        setSelectedDistrict(closest);
        setSelectedMandal(closest.mandals[0]);
        setGpsLoading(false);
        setGpsStatus({
          success: true,
          message: `GPS Auto-Detected: ${closest.nameEn} District (${closest.distanceKm || 0} km from your coordinates)`
        });
      },
      (err) => {
        setGpsLoading(false);
        setGpsStatus({
          success: false,
          message: 'Location access was not granted. Showing Tirupati district by default.'
        });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const changeDistrict = (districtId) => {
    const found = apDistricts.find((d) => d.id === districtId);
    if (found) {
      setSelectedDistrict(found);
      setSelectedMandal(found.mandals[0]);
      setGpsStatus(null);
    }
  };

  // Get nearby technicians for active district & optional service
  const getNearbyProviders = (serviceSlug = null) => {
    return allProviders
      .filter((p) => {
        const matchesDistrict =
          p.district?.toLowerCase() === selectedDistrict.nameEn.toLowerCase() ||
          p.district?.toLowerCase() === selectedDistrict.id.toLowerCase();

        if (!serviceSlug) return matchesDistrict;

        const targetService = servicesData.find((s) => s.slug === serviceSlug);
        if (!targetService) return matchesDistrict;

        const matchesService = (p.services || []).some(
          (s) => s.toLowerCase() === targetService.name_en.toLowerCase()
        );
        return matchesDistrict && matchesService;
      })
      .map((p) => {
        const distance = calculateHaversineDistance(
          selectedDistrict.lat,
          selectedDistrict.lng,
          p.lat,
          p.lng
        );
        return {
          ...p,
          distanceKm: distance === 0 ? 1.5 : distance
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  };

  // Create new citizen booking (Inserts row into Supabase bookings table!)
  const createBooking = async ({
    serviceId,
    serviceName,
    providerId,
    providerName,
    providerPhone,
    customerName,
    customerPhone,
    district,
    mandal,
    village,
    scheduledDate,
    scheduledTime
  }) => {
    const startOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const completeOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const bookingCode = `GRM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    let assignedId = `bkg-${Date.now()}`;

    // Direct write to Supabase if connected
    if (isSupabaseConfigured && supabase) {
      try {
        const bkgPayload = {
          booking_code: bookingCode,
          customer_name: customerName,
          customer_phone: customerPhone,
          provider_name: providerName,
          provider_phone: providerPhone,
          service_name: serviceName,
          district: district || selectedDistrict.nameEn,
          mandal: mandal || selectedMandal,
          village,
          scheduled_date: scheduledDate || new Date().toISOString().split('T')[0],
          scheduled_time: scheduledTime || '10:00 AM - 12:00 PM',
          base_visit_fee: 50.00,
          work_charges: 0.00,
          total_amount: 50.00,
          status: 'CONFIRMED',
          start_otp: startOtp,
          complete_otp: completeOtp
        };

        if (providerId && typeof providerId === 'string' && providerId.length === 36 && providerId.includes('-')) {
          bkgPayload.provider_id = providerId;
        }

        const { data, error } = await supabase
          .from('bookings')
          .insert(bkgPayload)
          .select()
          .single();

        if (error) {
          console.warn('Supabase booking insert warning:', error);
        } else if (data) {
          assignedId = data.id;
        }
      } catch (err) {
        console.warn('Supabase createBooking error:', err);
      }
    }

    const newBooking = {
      id: assignedId,
      code: bookingCode,
      serviceId,
      serviceName,
      providerId,
      providerName,
      providerPhone,
      customerName,
      customerPhone,
      district: district || selectedDistrict.nameEn,
      mandal: mandal || selectedMandal,
      village,
      scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
      scheduledTime: scheduledTime || '10:00 AM - 12:00 PM',
      baseVisitFee: 50,
      workCharges: 0,
      totalAmount: 50,
      workDetails: '',
      status: 'CONFIRMED',
      startOtp,
      completeOtp,
      createdAt: new Date().toISOString(),
      completedAt: null,
      guaranteeExpiresAt: null,
      guaranteeActive: false
    };

    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  // Provider advances status (Updates row in Supabase bookings table!)
  const updateBookingStatus = async (bookingId, newStatus) => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('bookings')
          .update({ status: newStatus })
          .eq('id', bookingId);
      } catch (err) {
        console.warn('Supabase status update error:', err);
      }
    }

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  // Provider completes job and uploads work details + payment breakdown
  const completeJobWithUpload = async ({ bookingId, additionalWorkCharges, workDetails }) => {
    const charges = parseFloat(additionalWorkCharges) || 0;
    const completedAt = new Date();
    const guaranteeExpiry = new Date(completedAt.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Update in Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('bookings')
          .update({
            status: 'COMPLETED',
            work_charges: charges,
            total_amount: 50 + charges,
            work_details: workDetails || 'Routine service diagnostics and repairs completed.',
            completed_at: completedAt.toISOString(),
            guarantee_expires_at: guaranteeExpiry.toISOString(),
            guarantee_active: true
          })
          .eq('id', bookingId);
      } catch (err) {
        console.warn('Supabase completeJob error:', err);
      }
    }

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: 'COMPLETED',
            workCharges: charges,
            totalAmount: b.baseVisitFee + charges,
            workDetails: workDetails || 'Routine service diagnostics and repairs completed.',
            completedAt: completedAt.toISOString(),
            guaranteeExpiresAt: guaranteeExpiry.toISOString(),
            guaranteeActive: true
          };
        }
        return b;
      })
    );
  };

  // Citizen files a 30-Day Guarantee Claim (Inserts row into Supabase guarantee_claims table!)
  const fileGuaranteeClaim = async ({ bookingId, issueDescription }) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (!targetBooking) throw new Error('Booking record not found.');

    const claimId = `claim-${Date.now()}`;

    // Direct write to Supabase if connected
    if (isSupabaseConfigured && supabase) {
      try {
        const insertPayload = {
          booking_code: targetBooking.code,
          customer_name: targetBooking.customerName,
          customer_phone: targetBooking.customerPhone,
          district: targetBooking.district,
          mandal: targetBooking.mandal,
          worker_a_name: targetBooking.providerName,
          issue_description: issueDescription,
          status: 'UNDER_REVIEW'
        };

        if (bookingId && bookingId.length === 36 && bookingId.includes('-')) {
          insertPayload.booking_id = bookingId;
        }

        if (targetBooking.providerId && targetBooking.providerId.length === 36 && targetBooking.providerId.includes('-')) {
          insertPayload.worker_a_id = targetBooking.providerId;
        }

        await supabase.from('guarantee_claims').insert(insertPayload);

        await supabase
          .from('bookings')
          .update({ status: 'GUARANTEE_CLAIMED' })
          .eq('id', bookingId);
      } catch (err) {
        console.warn('Supabase guarantee claim error:', err);
      }
    }

    const newClaim = {
      id: claimId,
      bookingId: targetBooking.id,
      bookingCode: targetBooking.code,
      serviceName: targetBooking.serviceName,
      customerName: targetBooking.customerName,
      customerPhone: targetBooking.customerPhone,
      district: targetBooking.district,
      mandal: targetBooking.mandal,
      originalWorkerAId: targetBooking.providerId,
      originalWorkerAName: targetBooking.providerName,
      assignedWorkerBId: null,
      assignedWorkerBName: null,
      issueDescription,
      status: 'UNDER_REVIEW',
      filedAt: new Date().toISOString()
    };

    setClaims((prev) => [newClaim, ...prev]);
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'GUARANTEE_CLAIMED' } : b))
    );

    return newClaim;
  };

  // Admin resolves claim and assigns independent Worker B
  const assignWorkerB = async ({ claimId, workerBId }) => {
    const targetClaim = claims.find((c) => c.id === claimId);
    if (!targetClaim) throw new Error('Claim record not found.');

    const workerB = allProviders.find((p) => p.id === workerBId);
    if (!workerB) throw new Error('Selected technician does not exist.');

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('guarantee_claims')
          .update({
            worker_b_name: workerB.fullName,
            status: 'WORKER_B_ASSIGNED',
            resolved_at: new Date().toISOString()
          })
          .eq('id', claimId);

        if (targetClaim.bookingId) {
          await supabase
            .from('bookings')
            .update({ status: 'GUARANTEE_RESOLVED' })
            .eq('id', targetClaim.bookingId);
        }
      } catch (err) {
        console.warn('Supabase assignWorkerB error:', err);
      }
    }

    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId) {
          return {
            ...c,
            assignedWorkerBId: workerB.id,
            assignedWorkerBName: workerB.fullName,
            status: 'WORKER_B_ASSIGNED'
          };
        }
        return c;
      })
    );

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === targetClaim.bookingId) {
          return {
            ...b,
            status: 'GUARANTEE_RESOLVED',
            assignedWorkerB: workerB.fullName
          };
        }
        return b;
      })
    );
  };

  return (
    <DatabaseContext.Provider
      value={{
        selectedDistrict,
        selectedMandal,
        setSelectedMandal,
        changeDistrict,
        detectGpsLocation,
        gpsLoading,
        gpsStatus,
        services: servicesData,
        allProviders,
        getNearbyProviders,
        bookings,
        claims,
        createBooking,
        updateBookingStatus,
        completeJobWithUpload,
        fileGuaranteeClaim,
        assignWorkerB
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
