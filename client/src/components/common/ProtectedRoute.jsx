import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, token, user } = useAuthStore();

  // Check authentication first
  if (!isAuthenticated || !token) {
    return <Navigate to="/admin/login" replace />;
  }

  // If roles specified, check user has one of the allowed roles
  if (allowedRoles && allowedRoles.length > 0) {
    if (!user?.role || !allowedRoles.includes(user.role)) {
      // Redirect to dashboard (unauthorized for this specific route)
      return <Navigate to="/admin" replace />;
    }
  }

  return children;
}
