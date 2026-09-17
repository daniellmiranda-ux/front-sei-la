import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './Dashboard.css';

export default function Dashboard() {
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();

    const [metrics] = useState(() => {
    try {
        const stored = localStorage.getItem('tickets');
        const tickets = stored ? JSON.parse(stored) : [];
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];

        let total = tickets.length;
        let abertos = 0;
        let resolvidos = 0;
        let atrasados = 0;
        let hoje = 0;

        tickets.forEach((ticket) => {
        if (ticket.status === 'Resolvido' || ticket.status === 'Fechado') {
            resolvidos++;
        } else {
            abertos++;
        }

        if (ticket.slaLimit && new Date(ticket.slaLimit) < now && ticket.status !== 'Resolvido') {
            atrasados++;
        }

        if (ticket.createdAt && ticket.createdAt.startsWith(todayStr)) {
            hoje++;
        }
        });

        return { total, abertos, resolvidos, atrasados, hoje };
    } catch {
        return { total: 0, abertos: 0, resolvidos: 0, atrasados: 0, hoje: 0 };
    }
    });

    return (
    <div className="dashboard-container">
        <header className="dashboard-header">
        <div>
            <h2>Dashboard de Métricas - HelpDesk CAnd</h2>
            <p>Visão geral do sistema de suporte em tempo real</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {currentUser?.role !== 'SETOR_ADMINISTRATIVO' && (
            <button className="nav-btn" onClick={() => navigate('/chamados')}>Fila de Chamados</button>
            )}
            <button className="logout-btn" onClick={() => authService.logout() || navigate('/')}>Sair</button>
        </div>
        </header>

        <div className="metrics-grid">
        <div className="metric-card">
            <h3>Chamados Totais</h3>
            <p className="metric-value">{metrics.total}</p>
        </div>

        <div className="metric-card warning">
            <h3>Em Aberto</h3>
            <p className="metric-value">{metrics.abertos}</p>
        </div>

        <div className="metric-card danger">
            <h3>Atrasados (SLA Estourado)</h3>
            <p className="metric-value">{metrics.atrasados}</p>
        </div>

        <div className="metric-card success">
            <h3>Resolvidos</h3>
            <p className="metric-value">{metrics.resolvidos}</p>
        </div>

        <div className="metric-card info">
            <h3>Abertos Hoje</h3>
            <p className="metric-value">{metrics.hoje}</p>
        </div>
        </div>
    </div>
    );
}