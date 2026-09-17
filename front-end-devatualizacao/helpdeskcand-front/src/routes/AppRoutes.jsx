import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import AdminPage from '../pages/AdminPage';
import UserPage from '../pages/UserPage';
import TechPage from '../pages/TechPage';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRoutes() {
    return (
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<Login />} />

        {/* Rota do Setor Administrativo */}
        <Route element={<ProtectedRoute allowedRoles={['SETOR_ADMINISTRATIVO']} />}>
            <Route path="/admin" element={<AdminPage />} />
        </Route>

        {/* Rota do Usuário Comum */}
        <Route element={<ProtectedRoute allowedRoles={['USUARIO_COMUM']} />}>
            <Route path="/usuario" element={<UserPage />} />
        </Route>

        {/* Rota dos Atendentes Técnicos */}
        <Route element={<ProtectedRoute allowedRoles={['ATENDENTE_N1', 'ATENDENTE_N2', 'ATENDENTE_N3']} />}>
            <Route path="/atendimento" element={<TechPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>
    );
}