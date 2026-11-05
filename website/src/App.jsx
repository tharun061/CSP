import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { DatabaseProvider } from './context/DatabaseContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { NearbyDiscovery } from './pages/NearbyDiscovery';
import { GuaranteeInfo } from './pages/GuaranteeInfo';
import { HowItWorks } from './pages/HowItWorks';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminLogin } from './pages/AdminLogin';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { ProviderDashboard } from './pages/ProviderDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DatabaseProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
              <Navbar />
              <main className="grow">
                <Routes>
                  {/* Public Portal Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/nearby" element={<NearbyDiscovery />} />
                  <Route path="/guarantee" element={<GuaranteeInfo />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />

                  {/* Clean Authentication Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* Persona Dashboards */}
                  <Route path="/customer" element={<CustomerDashboard />} />
                  <Route path="/provider" element={<ProviderDashboard />} />
                  <Route path="/admin" element={<AdminDashboard />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </DatabaseProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
