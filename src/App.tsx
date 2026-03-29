import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
// Landing page components
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PromoCards } from './components/PromoCards';
import { MortgageBanner } from './components/MortgageBanner';
import { FinancialGuidance } from './components/FinancialGuidance';
import { AskFargo } from './components/AskFargo';
import { ServingCommunities } from './components/ServingCommunities';
import { HowCanWeHelp } from './components/HowCanWeHelp';
import { Footer } from './components/Footer';
// Pages
import { EnrollPage } from './pages/EnrollPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { FeaturePage } from './pages/FeaturePage';
import { TransferPage } from './pages/TransferPage';
import { TransferBankPage } from './pages/TransferBankPage';
import { TransferCryptoPage } from './pages/TransferCryptoPage';
import { DepositPage } from './pages/DepositPage';
import { DepositCryptoPage } from './pages/DepositCryptoPage';
import { DepositGiftCardPage } from './pages/DepositGiftCardPage';
import { DepositCashAppPage } from './pages/DepositCashAppPage';
import { CardsPage } from './pages/CardsPage';
import { LoansPage } from './pages/LoansPage';
import { InvestPage } from './pages/InvestPage';
import { BillsPage } from './pages/BillsPage';
import { StatementsPage } from './pages/StatementsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { VerificationPage } from './pages/VerificationPage';
import { NextOfKinPage } from './pages/NextOfKinPage';
import { ChangePasswordPage } from './pages/ChangePasswordPage';
import { CreatePinPage } from './pages/CreatePinPage';
import { TransactionHistoryPage } from './pages/TransactionHistoryPage';
import { InfoPage } from './pages/InfoPage';
function ProtectedRoute({
  children


}: {children: React.ReactNode;}) {
  const {
    user,
    loading
  } = useAuth();
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="w-10 h-10 border-4 border-[#D71E28] border-t-transparent rounded-full animate-spin" />
      </div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
function LandingPage() {
  return <div className="min-h-screen bg-white" style={{
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
  }}>
      <Header />
      <main>
        <HeroSection />
        <PromoCards />
        <MortgageBanner />
        <FinancialGuidance />
        <AskFargo />
        <ServingCommunities />
        <HowCanWeHelp />
      </main>
      <Footer />
    </div>;
}
function AppRoutes() {
  return <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/enroll" element={<EnrollPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/feature/:id" element={<FeaturePage />} />
      <Route path="/info/:slug" element={<InfoPage />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>} />
      <Route path="/transfer" element={<ProtectedRoute>
            <TransferPage />
          </ProtectedRoute>} />
      <Route path="/transfer/bank" element={<ProtectedRoute>
            <TransferBankPage />
          </ProtectedRoute>} />
      <Route path="/transfer/crypto" element={<ProtectedRoute>
            <TransferCryptoPage />
          </ProtectedRoute>} />
      <Route path="/deposit" element={<ProtectedRoute>
            <DepositPage />
          </ProtectedRoute>} />
      <Route path="/deposit/crypto" element={<ProtectedRoute>
            <DepositCryptoPage />
          </ProtectedRoute>} />
      <Route path="/deposit/gift-card" element={<ProtectedRoute>
            <DepositGiftCardPage />
          </ProtectedRoute>} />
      <Route path="/deposit/cashapp" element={<ProtectedRoute>
            <DepositCashAppPage />
          </ProtectedRoute>} />
      <Route path="/cards" element={<ProtectedRoute>
            <CardsPage />
          </ProtectedRoute>} />
      <Route path="/loans" element={<ProtectedRoute>
            <LoansPage />
          </ProtectedRoute>} />
      <Route path="/invest" element={<ProtectedRoute>
            <InvestPage />
          </ProtectedRoute>} />
      <Route path="/bills" element={<ProtectedRoute>
            <BillsPage />
          </ProtectedRoute>} />
      <Route path="/statements" element={<ProtectedRoute>
            <StatementsPage />
          </ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>} />
      <Route path="/settings/profile" element={<ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>} />
      <Route path="/settings/verification" element={<ProtectedRoute>
            <VerificationPage />
          </ProtectedRoute>} />
      <Route path="/settings/next-of-kin" element={<ProtectedRoute>
            <NextOfKinPage />
          </ProtectedRoute>} />
      <Route path="/settings/change-password" element={<ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>} />
      <Route path="/settings/create-pin" element={<ProtectedRoute>
            <CreatePinPage />
          </ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute>
            <TransactionHistoryPage />
          </ProtectedRoute>} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>;
}
export function App() {
  return <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>;
}