import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout, ProtectedRoute } from '@/components/layout';
import { useAuthStore } from '@/stores';

// Pages
import HomePage from '@/pages/HomePage';
import DashboardPage from '@/pages/DashboardPage';
import ProfilePage from '@/pages/ProfilePage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import EventNewPage from '@/pages/events/EventNewPage';
import EventShowPage from '@/pages/events/EventShowPage';
import EventDashboardPage from '@/pages/events/EventDashboardPage';
import EventAnalyticsPage from '@/pages/events/EventAnalyticsPage';
import EventReviewPage from '@/pages/events/EventReviewPage';
import SongNewPage from '@/pages/songs/SongNewPage';
import SongShowPage from '@/pages/songs/SongShowPage';
import SongReviewPage from '@/pages/songs/SongReviewPage';
import PerformersPage from '@/pages/PerformersPage';
import AttendedEventsPage from '@/pages/AttendedEventsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function AppContent() {
  const { fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/performers"
          element={
            <ProtectedRoute>
              <PerformersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attended-events"
          element={
            <ProtectedRoute>
              <AttendedEventsPage />
            </ProtectedRoute>
          }
        />

        {/* Event routes */}
        <Route
          path="/events/new"
          element={
            <ProtectedRoute>
              <EventNewPage />
            </ProtectedRoute>
          }
        />
        <Route path="/events/:id" element={<EventShowPage />} />
        <Route path="/events/:id/review" element={<EventReviewPage />} />
        <Route
          path="/events/:id/dashboard"
          element={
            <ProtectedRoute>
              <EventDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id/analytics"
          element={
            <ProtectedRoute>
              <EventAnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id/edit"
          element={
            <ProtectedRoute>
              <EventNewPage />
            </ProtectedRoute>
          }
        />

        {/* Song routes */}
        <Route path="/events/:id/songs/:songId" element={<SongShowPage />} />
        <Route path="/events/:id/songs/:songId/review" element={<SongReviewPage />} />
        <Route
          path="/events/:id/songs/new"
          element={
            <ProtectedRoute>
              <SongNewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id/songs/:songId/edit"
          element={
            <ProtectedRoute>
              <SongNewPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
