import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import './index.css';
import './i18n';
import { queryClient } from '@/lib/queryClient';

import { LanguageProvider } from './contexts/LanguageContext';
import AuthBootGate from './components/common/AuthBootGate';
import Layout from './layout/Layout';
import EntryPage from './pages/EntryPage';
import HomePage from './pages/HomePage';
import NoticePage from './pages/NoticePage';
import TimetablePage from './pages/TimetablePage';
import PerformancePage from './pages/PerformancePage';
import FoodTruckPage from './pages/FoodTruckPage';
import FoodTruckDetailPage from './pages/FoodTruckDetailPage';
import YardPage from './pages/YardPage';
import BoothDetailPage from './pages/BoothDetailPage';
import PubPage from './pages/PubPage';
import PubDetailPage from './pages/PubDetailPage';
import MakersPage from './pages/MakersPage';
import OnboardingPage from './pages/OnboardingPage';
import GamePage from './pages/GamePage';
import GamePlayPage from './pages/GamePlayPage';
import InfoInputPage from './pages/InfoInputPage';
import OAuthRedirectPage from './pages/OAuthRedirectPage';
import InfoGuidePage from './pages/InfoGuidePage';
import AdminPage from './pages/AdminPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BrowserRouter>
          <AuthBootGate>
            <Layout>
              <Routes>
              <Route path="/" element={<EntryPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/notice" element={<NoticePage />} />
              <Route path="/timetable" element={<TimetablePage />} />
              <Route path="/performance" element={<PerformancePage />} />
              <Route path="/foodtruck" element={<FoodTruckPage />} />
              <Route path="/foodtruck/:id" element={<FoodTruckDetailPage />} />
              <Route path="/yard" element={<YardPage />} />
              <Route path="/yard/:id" element={<BoothDetailPage />} />
              <Route path="/pub" element={<PubPage />} />
              <Route path="/pub/:id" element={<PubDetailPage />} />
              <Route path="/makers" element={<MakersPage />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/game/:gameId" element={<GamePlayPage />} />
              <Route path="/info" element={<InfoInputPage />} />
              <Route path="/oauth/callback/:dest" element={<OAuthRedirectPage />} />
              <Route path="/info-guide" element={<InfoGuidePage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
            </Layout>
          </AuthBootGate>
        </BrowserRouter>
      </LanguageProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
