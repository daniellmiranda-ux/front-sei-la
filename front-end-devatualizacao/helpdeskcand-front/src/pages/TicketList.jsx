import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import TicketFilter from '../components/TicketFilter';
import './TicketList.css';

export default function TicketList() {
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [tickets, setTickets] = useState(() => {
    try {
        const storedTickets = localStorage.getItem('tickets');
        const parsedTickets = storedTickets ? JSON.parse(storedTickets) : [];
        return Array.isArray(parsedTickets) ? parsedTickets : [];
    } catch {
        return [];
    }
    });

    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();

    const handleLogout = () => {
    authService.logout();
    navigate('/');
    };

    const handleEscalate = (id) => {
    const updatedTickets = tickets.map((ticket) => {
        if (ticket.id === id) {
        let newLevel = ticket.nivel;
        if (ticket.nivel === 'N1') newLevel = 'N2';
        else if (ticket.nivel === 'N2') newLevel = 'N3';

        return { ...ticket, nivel: newLevel };
        }
        return ticket;
    });

    setTickets(updatedTickets);
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));
    };

    const handleResolve = (id) => {
    const updatedTickets = tickets.map((ticket) => {
        if (ticket.id === id) {
        return { ...ticket, status: 'Resolvido' };
        }
        return ticket;
    });

    setTickets(updatedTickets);
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));
    };

    const filteredTickets = tickets.filter((ticket) => {
    if (currentUser?.role === 'USUARIO_COMUM') {
        if (ticket.solicitante !== currentUser.name) return false;
    } else if (currentUser?.role === 'ATENDENTE_N1') {
        if (ticket.nivel !== 'N1') return false;
    } else if (currentUser?.role === 'ATENDENTE_N2') {
        if (ticket.nivel !== 'N2') return false;
    } else if (currentUser?.role === 'ATENDENTE_N3') {
        if (ticket.nivel !== 'N3') return false;
    }

    if (statusFilter === 'Todos') return true;
    return ticket.status === statusFilter;
    });

    return (
    <div style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '2rem' }}>
        <div className="ticket-list-container" style={{ maxWidth: '900px', margin: '0 auto', background: '#fff', padding: '2rem', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Fila de Chamados ({currentUser?.role})</h2>
            <span>Atendendo como: <strong>{currentUser?.name}</strong></span>
        </div>

        <TicketFilter onFilterChange={(status) => setStatusFilter(status)} />

        <div className="tickets-grid" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredTickets.length === 0 ? (
            <p>Nenhum chamado pendente nesta fila.</p>
            ) : (
            filteredTickets.map((ticket) => {
                const currentLevel = ticket.nivel || 'N1';

                return (
                <div key={ticket.id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '6px', background: '#fafafa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Protocolo: {ticket.id}</strong>
                    <span>Nível: <strong>{currentLevel}</strong> | Status: <strong>{ticket.status}</strong></span>
                    </div>

                    <h4 style={{ margin: '0.5rem 0' }}>{ticket.titulo}</h4>
                    <p style={{ margin: '0.2rem 0', fontSize: '0.9rem' }}>💻 Equipamento: {ticket.equipamento}</p>
                    <p style={{ margin: '0.2rem 0', fontSize: '0.9rem' }}>👤 Solicitante: {ticket.solicitante}</p>
                    <p style={{ margin: '0.2rem 0', fontSize: '0.9rem' }}>📝 Descrição: {ticket.descricao}</p>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    {ticket.status !== 'Resolvido' && currentUser?.role !== 'USUARIO_COMUM' && (
                        <>
                        <button
                            onClick={() => handleResolve(ticket.id)}
                            style={{ padding: '0.4rem 0.8rem', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            ✔ Resolver Chamado
                        </button>

                        {currentLevel !== 'N3' && (
                            <button
                            onClick={() => handleEscalate(ticket.id)}
                            style={{ padding: '0.4rem 0.8rem', backgroundColor: '#fd7e14', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                            Passar para {currentLevel === 'N1' ? 'N2' : 'N3'}
                            </button>
                        )}
                        </>
                    )}
                    </div>
                </div>
                );
            })
            )}
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sair</button>
            {currentUser?.role === 'USUARIO_COMUM' && (
            <button onClick={() => navigate('/novo-chamado')} style={{ padding: '0.5rem 1rem', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Novo Chamado</button>
            )}
        </div>
        </div>
    </div>
    );
}