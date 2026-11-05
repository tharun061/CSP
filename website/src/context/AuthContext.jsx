import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const AuthContext = createContext();

const USERS_STORAGE_KEY = 'gramaseva_registered_users';
const SESSION_STORAGE_KEY = 'gramaseva_active_session';

export const AuthProvider = ({ children }) => {
  // Store of registered accounts
  const [users, setUsers] = useState(() => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Current session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const session = localStorage.getItem(SESSION_STORAGE_KEY);
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  });

  // Load registered users from live Supabase if connected
  useEffect(() => {
    const fetchSupabaseUsers = async () => {
      if (!isSupabaseConfigured || !supabase) return;
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*, provider_profiles(*)');

        if (!error && data) {
          const mapped = data.map((u) => {
            const profile = Array.isArray(u.provider_profiles)
              ? u.provider_profiles[0]
              : u.provider_profiles;

            return {
              id: u.id,
              role: u.role,
              fullName: u.full_name,
              phone: u.phone,
              password: u.password_hash,
              district: u.district,
              mandal: u.mandal,
              village: u.village,
              services: profile?.services_list || [],
              experienceYears: profile?.experience_years || 1,
              rating: profile?.rating || 5.0,
              completedJobs: profile?.completed_jobs || 0,
              verified: profile?.status === 'VERIFIED',
              createdAt: u.created_at
            };
          });
          setUsers(mapped);
        }
      } catch (err) {
        console.warn('Could not load users from Supabase:', err);
      }
    };

    fetchSupabaseUsers();
  }, []);

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [currentUser]);

  // Citizen Registration
  const registerCitizen = async ({ fullName, phone, password, district, mandal, village }) => {
    // Check locally first
    const existing = users.find((u) => u.phone === phone);
    if (existing) {
      throw new Error('A user with this mobile number is already registered.');
    }

    let assignedId = `usr-${Date.now()}`;

    // Direct write to Supabase if connected
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .insert({
            phone,
            full_name: fullName,
            password_hash: password,
            role: 'CITIZEN',
            district,
            mandal,
            village,
            preferred_language: 'en'
          })
          .select()
          .single();

        if (error) {
          console.error('Supabase registration error:', error);
          throw new Error(error.message || 'Database insert failed.');
        }

        if (data) assignedId = data.id;
      } catch (err) {
        console.error('Failed to register in Supabase:', err);
        throw err;
      }
    }

    const newUser = {
      id: assignedId,
      role: 'CITIZEN',
      fullName,
      phone,
      password,
      district,
      mandal,
      village,
      createdAt: new Date().toISOString()
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  // Provider Registration
  const registerProvider = async ({
    fullName,
    phone,
    password,
    district,
    mandal,
    village,
    services,
    experienceYears
  }) => {
    const existing = users.find((u) => u.phone === phone);
    if (existing) {
      throw new Error('A technician with this mobile number is already registered.');
    }

    let assignedId = `prov-${Date.now()}`;

    // Direct write to Supabase if connected
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: userRow, error: uErr } = await supabase
          .from('users')
          .insert({
            phone,
            full_name: fullName,
            password_hash: password,
            role: 'PROVIDER',
            district,
            mandal,
            village,
            preferred_language: 'en'
          })
          .select()
          .single();

        if (uErr) {
          throw new Error(uErr.message || 'Failed to create user in database.');
        }

        if (userRow) {
          assignedId = userRow.id;
          // Insert provider profile
          const { error: pErr } = await supabase
            .from('provider_profiles')
            .insert({
              user_id: userRow.id,
              experience_years: parseInt(experienceYears, 10) || 1,
              rating: 5.0,
              completed_jobs: 0,
              status: 'VERIFIED',
              services_list: services || []
            });

          if (pErr) console.warn('Provider profile insert warning:', pErr);
        }
      } catch (err) {
        console.error('Failed to register provider in Supabase:', err);
        throw err;
      }
    }

    const newProvider = {
      id: assignedId,
      role: 'PROVIDER',
      fullName,
      phone,
      password,
      district,
      mandal,
      village,
      services: services || [],
      experienceYears: parseInt(experienceYears, 10) || 1,
      rating: 5.0,
      completedJobs: 0,
      verified: true,
      createdAt: new Date().toISOString()
    };

    setUsers((prev) => [...prev, newProvider]);
    setCurrentUser(newProvider);
    return newProvider;
  };

  // Login for Citizen or Provider
  const login = async ({ phone, password, role }) => {
    // If Supabase is connected, query live database directly!
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*, provider_profiles(*)')
          .eq('phone', phone)
          .eq('password_hash', password)
          .single();

        if (!error && data) {
          if (role && data.role !== role) {
            throw new Error(`This mobile number is registered as a ${data.role}, not ${role}. Please use the correct tab.`);
          }

          const profile = Array.isArray(data.provider_profiles)
            ? data.provider_profiles[0]
            : data.provider_profiles;

          const loggedInUser = {
            id: data.id,
            role: data.role,
            fullName: data.full_name,
            phone: data.phone,
            district: data.district,
            mandal: data.mandal,
            village: data.village,
            services: profile?.services_list || [],
            experienceYears: profile?.experience_years || 1,
            rating: profile?.rating || 5.0,
            completedJobs: profile?.completed_jobs || 0,
            verified: profile?.status === 'VERIFIED',
            createdAt: data.created_at
          };

          setCurrentUser(loggedInUser);
          return loggedInUser;
        }
      } catch (err) {
        console.warn('Supabase login check:', err.message);
      }
    }

    // Fallback to local users list
    const user = users.find(
      (u) => u.phone === phone && u.password === password && (role ? u.role === role : true)
    );

    if (!user) {
      throw new Error('Invalid mobile number or password. Please verify your credentials or register a new account.');
    }

    setCurrentUser(user);
    return user;
  };

  // Official Admin Login
  const loginAdmin = ({ email, password }) => {
    if (
      email.trim().toLowerCase() === 'admin@gramaseva.ap.gov.in' &&
      password === 'admin@ap2026'
    ) {
      const adminUser = {
        id: 'admin-001',
        role: 'ADMIN',
        fullName: 'Chief Administrative Officer (AP GramaSeva)',
        email: 'admin@gramaseva.ap.gov.in',
        department: 'Department of Rural Governance',
        state: 'Andhra Pradesh'
      };
      setCurrentUser(adminUser);
      return adminUser;
    }
    throw new Error('Invalid Administrative Credentials. Authorized State Personnel Only.');
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        isAuthenticated: Boolean(currentUser),
        role: currentUser?.role || null,
        registerCitizen,
        registerProvider,
        login,
        loginAdmin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
