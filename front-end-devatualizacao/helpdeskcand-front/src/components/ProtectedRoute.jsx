import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!token || !user) {
    return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
    if (user.role === 'SETOR_ADMINISTRATIVO') return <Navigate to="/admin" replace />;
    if (user.role === 'USUARIO_COMUM') return <Navigate to="/usuario" replace />;
    return <Navigate to="/atendimento" replace />;
    }

    return <Outlet />;
}