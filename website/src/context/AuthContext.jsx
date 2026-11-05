import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const USERS_STORAGE_KEY = 'gramaseva_registered_users';
const SESSION_STORAGE_KEY = 'gramaseva_active_session';

export const AuthProvider = ({ children }) => {
  // Store of all registered accounts (persistent in localStorage)
  const [users, setUsers] = useState(() => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Currently logged-in user session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const session = localStorage.getItem(SESSION_STORAGE_KEY);
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  });

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
  const registerCitizen = ({ fullName, phone, password, district, mandal, village }) => {
    const existing = users.find((u) => u.phone === phone);
    if (existing) {
      throw new Error('A user with this mobile number is already registered.');
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      role: 'CITIZEN',
      fullName,
      phone,
      password,
      district,
      mandal,
      village,
      createdAt: new Date().toISOString()
    };

    const updated = [...users, newUser];
    setUsers(updated);
    setCurrentUser(newUser);
    return newUser;
  };

  // Provider Registration
  const registerProvider = ({
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

    const newProvider = {
      id: `prov-${Date.now()}`,
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

    const updated = [...users, newProvider];
    setUsers(updated);
    setCurrentUser(newProvider);
    return newProvider;
  };

  // Login for Citizen or Provider
  const login = ({ phone, password, role }) => {
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
    // Official AP Government Admin Portal Verification
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
