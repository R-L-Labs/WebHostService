import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from './store/authStore';
import { setupAuthListener } from './lib/supabase';
import { getCurrentUser } from './lib/auth';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages (eagerly loaded for fast initial render)
import HomePage from './pages/public/HomePage';
import ServicesPage from './pages/public/ServicesPage';
import ContactPage from './pages/public/ContactPage';

// Admin Pages (lazy loaded - behind auth wall)
const LoginPage = lazy(() => import('./pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const ClientsPage = lazy(() => import('./pages/admin/ClientsPage'));
const InquiriesPage = lazy(() => import('./pages/admin/InquiriesPage'));
const UsersPage = lazy(() => import('./pages/admin/UsersPage'));

// Components
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  useEffect(() => {
    const { initializeAuth, setUser } = useAuthStore.getState();
    initializeAuth();

    const unsubscribe = setupAuthListener(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { user } = await getCurrentUser();
        setUser(user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Admin Login Route (no layout) */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="inquiries" element={<InquiriesPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>

        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
