import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/authService';

export default function PrivateRoute({ allowedRoles }) {
    const isAuth = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    if (!isAuth || !currentUser) {
    return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}