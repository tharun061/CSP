import React, { createContext, useContext, useState, useEffect } from 'react';
import { apDistricts, findClosestAPDistrict, calculateHaversineDistance } from '../data/apDistricts';
import { servicesData } from '../data/servicesData';
import { useAuth } from './AuthContext';

const DatabaseContext = createContext();

const BOOKINGS_KEY = 'gramaseva_db_bookings';
const CLAIMS_KEY = 'gramaseva_db_guarantee_claims';

// Initial verified district field technicians across AP (benchmarks for real dispatch)
const initialTechnicians = [
  {
    id: 'prov-tech-01',
    fullName: 'Ramesh Kumar Naidu',
    phone: '9848011223',
    role: 'PROVIDER',
    district: 'Tirupati',
    mandal: 'Chandragiri',
    village: 'A. Rangampet',
    lat: 13.6288,
    lng: 79.4192,
    services: ['Electrician Services', 'TV / DTH & Digital Tech'],
    experienceYears: 8,
    rating: 4.95,
    completedJobs: 142,
    verified: true
  },
  {
    id: 'prov-tech-02',
    fullName: 'Siva Prasad Reddy',
    phone: '9848044556',
    role: 'PROVIDER',
    district: 'Tirupati',
    mandal: 'Tirupati Rural',
    village: 'Peruru',
    lat: 13.6350,
    lng: 79.3900,
    services: ['Electrician Services', 'Solar Rooftop & Inverter'],
    experienceYears: 6,
    rating: 4.88,
    completedJobs: 98,
    verified: true
  },
  {
    id: 'prov-tech-03',
    fullName: 'K. Venkat Rao',
    phone: '9440123789',
    role: 'PROVIDER',
    district: 'Tirupati',
    mandal: 'Chandragiri',
    village: 'Chandragiri Fort Road',
    lat: 13.5850,
    lng: 79.3170,
    services: ['Plumbing & Borewell', 'Agri Machinery & Sprayers'],
    experienceYears: 10,
    rating: 4.92,
    completedJobs: 184,
    verified: true
  },
  {
    id: 'prov-tech-04',
    fullName: 'B. Satyanarayana',
    phone: '9988776655',
    role: 'PROVIDER',
    district: 'Krishna',
    mandal: 'Machilipatnam',
    village: 'Chilakalapudi',
    lat: 16.1875,
    lng: 81.1389,
    services: ['Plumbing & Borewell', 'RO Water Purifier Service'],
    experienceYears: 7,
    rating: 4.90,
    completedJobs: 110,
    verified: true
  },
  {
    id: 'prov-tech-05',
    fullName: 'M. Appala Raju',
    phone: '9876543210',
    role: 'PROVIDER',
    district: 'Visakhapatnam',
    mandal: 'Gajuwaka',
    village: 'Old Gajuwaka',
    lat: 17.6868,
    lng: 83.2185,
    services: ['2 & 4 Wheeler Mechanic', 'Home Appliances & Refrigerator'],
    experienceYears: 9,
    rating: 4.86,
    completedJobs: 165,
    verified: true
  },
  {
    id: 'prov-tech-06',
    fullName: 'G. Chenna Kesava',
    phone: '9701122334',
    role: 'PROVIDER',
    district: 'Guntur',
    mandal: 'Tenali',
    village: 'Morrispet',
    lat: 16.3067,
    lng: 80.4365,
    services: ['Agri Machinery & Sprayers', 'Electrician Services'],
    experienceYears: 12,
    rating: 4.96,
    completedJobs: 215,
    verified: true
  }
];

export const DatabaseProvider = ({ children }) => {
  const { users } = useAuth();

  // Active Selected District (default: Tirupati)
  const [selectedDistrict, setSelectedDistrict] = useState(apDistricts[21]);
  const [selectedMandal, setSelectedMandal] = useState(apDistricts[21].mandals[0]);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState(null);

  // Bookings Store
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

  useEffect(() => {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(CLAIMS_KEY, JSON.stringify(claims));
  }, [claims]);

  // Combine initial technicians with newly registered providers from AuthContext
  const registeredProviders = users.filter((u) => u.role === 'PROVIDER');
  const allProviders = [
    ...initialTechnicians,
    ...registeredProviders.map((p) => {
      // Find district coordinates
      const distData = apDistricts.find((d) => d.nameEn === p.district) || selectedDistrict;
      return {
        ...p,
        lat: distData.lat,
        lng: distData.lng,
        completedJobs: p.completedJobs || 0,
        rating: p.rating || 5.0
      };
    })
  ];

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
        // Fallback to Tirupati if denied or failed
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

  // Get nearby technicians for the active district & optional service
  const getNearbyProviders = (serviceSlug = null) => {
    return allProviders
      .filter((p) => {
        const matchesDistrict =
          p.district.toLowerCase() === selectedDistrict.nameEn.toLowerCase() ||
          p.district.toLowerCase() === selectedDistrict.id.toLowerCase();

        if (!serviceSlug) return matchesDistrict;

        const targetService = servicesData.find((s) => s.slug === serviceSlug);
        if (!targetService) return matchesDistrict;

        const matchesService = p.services.some(
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

  // Create new citizen booking
  const createBooking = ({
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

    const newBooking = {
      id: `bkg-${Date.now()}`,
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
      baseVisitFee: 50, // Standard ₹50 Basic Home Visit Fee
      workCharges: 0,
      totalAmount: 50,
      workDetails: '',
      status: 'CONFIRMED', // CONFIRMED -> ON_THE_WAY -> ARRIVED -> COMPLETED
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

  // Provider advances status
  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  // Provider completes job and uploads work details + payment breakdown
  const completeJobWithUpload = ({ bookingId, additionalWorkCharges, workDetails }) => {
    const charges = parseFloat(additionalWorkCharges) || 0;
    const completedAt = new Date();
    const guaranteeExpiry = new Date(completedAt.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 Calendar Days

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

  // Citizen files a 30-Day Guarantee Claim for recurring problem
  const fileGuaranteeClaim = ({ bookingId, issueDescription }) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (!targetBooking) throw new Error('Booking record not found.');

    const claimId = `claim-${Date.now()}`;
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
      status: 'UNDER_REVIEW', // UNDER_REVIEW -> WORKER_B_ASSIGNED -> RESOLVED
      filedAt: new Date().toISOString()
    };

    setClaims((prev) => [newClaim, ...prev]);

    // Update booking status
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'GUARANTEE_CLAIMED' } : b))
    );

    return newClaim;
  };

  // Admin resolves claim and assigns independent Worker B (!= Worker A)
  const assignWorkerB = ({ claimId, workerBId }) => {
    const targetClaim = claims.find((c) => c.id === claimId);
    if (!targetClaim) throw new Error('Claim record not found.');

    if (targetClaim.originalWorkerAId === workerBId) {
      throw new Error('Conflict of Interest Violation: Worker B must be an independent technician and cannot be the original Worker A.');
    }

    const workerB = allProviders.find((p) => p.id === workerBId);
    if (!workerB) throw new Error('Selected technician does not exist.');

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
