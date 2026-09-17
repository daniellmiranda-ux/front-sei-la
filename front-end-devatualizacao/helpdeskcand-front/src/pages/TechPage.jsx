import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TechPage() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || {};

    const [tickets, setTickets] = useState(() => {
        return JSON.parse(localStorage.getItem('app_tickets') || '[]');
    });

    const [activeFilter, setActiveFilter] = useState('ABERTO');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [solutionText, setSolutionText] = useState('');

    const currentLevel = user.role ? user.role.replace('ATENDENTE_', '') : 'N1';

    const updateTickets = (updated) => {
        setTickets(updated);
        localStorage.setItem('app_tickets', JSON.stringify(updated));
    };

    const getNextLevel = (level) => {
        if (level === 'N1') return 'N2';
        if (level === 'N2') return 'N3';
        return null;
    };

    const targetLevel = getNextLevel(currentLevel);

    const openResolveModal = (ticket) => {
        setSelectedTicket(ticket);
        setSolutionText('');
        setModalType('RESOLVER');
    };

    const openTransferModal = (ticket) => {
        setSelectedTicket(ticket);
        setModalType('TRANSFERIR');
    };

    const closeModal = () => {
        setSelectedTicket(null);
        setModalType(null);
        setSolutionText('');
    };

    const handleConfirmResolve = () => {
        if (!solutionText.trim()) return alert('Escreva o relatório da solução técnica.');

        const updated = tickets.map(t => 
            t.id === selectedTicket.id ? { ...t, status: 'FECHADO', solucao: solutionText } : t
        );
        updateTickets(updated);
        closeModal();
    };

    const handleConfirmTransfer = () => {
        if (!targetLevel) return;

        const updated = tickets.map(t => 
            t.id === selectedTicket.id ? { ...t, nivel: targetLevel } : t
        );
        updateTickets(updated);
        closeModal();
        alert(`Chamado ${selectedTicket.id} transferido com sucesso para o Nível ${targetLevel}!`);
    };

    const abertosCount = tickets.filter(t => t.nivel === currentLevel && t.status === 'ABERTO').length;
    const resolvidosCount = tickets.filter(t => t.nivel === currentLevel && t.status === 'FECHADO').length;
    const atrasadosCount = tickets.filter(t => t.nivel === currentLevel && t.status === 'ATRASADO').length;

    const filteredTickets = tickets.filter(t => t.nivel === currentLevel && t.status === activeFilter);

    return (
        <div style={{ padding: '2rem', background: '#f4f6f9', minHeight: '100vh', color: '#333' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                <h2 style={{ 
                    margin: 0, 
                    letterSpacing: '1.5px', 
                    textTransform: 'uppercase', 
                    fontWeight: '800',
                    color: '#00e5ff',
                    textShadow: '0 0 10px rgba(0, 229, 255, 0.35)'
                }}>
                    PAINEL DE ATENDIMENTO TÉCNICO
                </h2>
                <small style={{ color: '#666' }}>Rota: <code>/atendimento</code></small>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span>Perfil: <strong>{user.role ? user.role.replace('_', ' ') : 'ATENDENTE ' + currentLevel}</strong></span>
                <button onClick={() => { localStorage.clear(); navigate('/'); }} style={{ padding: '0.4rem 0.8rem', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sair</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div 
                onClick={() => setActiveFilter('ABERTO')} 
                style={{ 
                    background: activeFilter === 'ABERTO' ? '#bbdefb' : '#e3f2fd', 
                    border: activeFilter === 'ABERTO' ? '2px solid #1e88e5' : '1px solid #90caf9',
                    padding: '1rem', borderRadius: '8px', textAlign: 'center', cursor: 'pointer' 
                }}
                >
                <small style={{ fontWeight: 'bold' }}>Abertos</small>
                <h2 style={{ margin: '0.5rem 0 0 0' }}>{abertosCount}</h2>
                </div>

                <div 
                onClick={() => setActiveFilter('FECHADO')} 
                style={{ 
                    background: activeFilter === 'FECHADO' ? '#c8e6c9' : '#e8f5e9', 
                    border: activeFilter === 'FECHADO' ? '2px solid #43a047' : '1px solid #a5d6a7',
                    padding: '1rem', borderRadius: '8px', textAlign: 'center', cursor: 'pointer' 
                }}
                >
                <small style={{ fontWeight: 'bold' }}>Resolvidos</small>
                <h2 style={{ margin: '0.5rem 0 0 0' }}>{resolvidosCount}</h2>
                </div>

                <div 
                onClick={() => setActiveFilter('ATRASADO')} 
                style={{ 
                    background: activeFilter === 'ATRASADO' ? '#ffcdd2' : '#ffebee', 
                    border: activeFilter === 'ATRASADO' ? '2px solid #e53935' : '1px solid #ef9a9a',
                    padding: '1rem', borderRadius: '8px', textAlign: 'center', cursor: 'pointer' 
                }}
                >
                <small style={{ fontWeight: 'bold' }}>Atrasados</small>
                <h2 style={{ margin: '0.5rem 0 0 0' }}>{atrasadosCount}</h2>
                </div>
            </div>

            <h3 style={{ marginBottom: '1rem' }}>Fila de Chamados - Nível {currentLevel} ({activeFilter})</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredTickets.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', background: '#f8f9fa', borderRadius: '6px', border: '1px dashed #ccc' }}>
                    <p style={{ color: '#666', margin: 0 }}>Nenhum chamado <strong>{activeFilter.toLowerCase()}</strong> encontrado no Nível {currentLevel}.</p>
                </div>
                ) : (
                filteredTickets.map(t => (
                    <div key={t.id} style={{ border: '1px solid #ddd', padding: '1.2rem', borderRadius: '6px', background: '#fafafa', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>{t.id} - [{t.categoria}]</strong>
                        <span style={{ padding: '0.25rem 0.6rem', borderRadius: '4px', background: t.status === 'FECHADO' ? '#d4edda' : '#fff3cd', fontSize: '0.85rem' }}>
                        Status: <strong>{t.status}</strong>
                        </span>
                    </div>
                    
                    <p style={{ margin: '0.75rem 0' }}>{t.descricao}</p>
                    
                    {t.solucao && (
                        <p style={{ background: '#e9ecef', padding: '0.5rem', borderRadius: '4px', fontSize: '0.9rem' }}>
                        <strong>Solução Registrada:</strong> {t.solucao}
                        </p>
                    )}

                    <small style={{ color: '#666', display: 'block', marginBottom: '1rem' }}>Solicitante: {t.solicitante} | Anexo: {t.anexo}</small>

                    {t.status !== 'FECHADO' && (
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '0.75rem' }}>
                        <button 
                            onClick={() => openResolveModal(t)} 
                            style={{ padding: '0.5rem 1rem', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Resolver Chamado
                        </button>

                        {targetLevel ? (
                            <button 
                            onClick={() => openTransferModal(t)} 
                            style={{ padding: '0.5rem 1rem', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                            ↗️ Transferir para {targetLevel}
                            </button>
                        ) : (
                            <span style={{ fontSize: '0.85rem', color: '#6c757d', background: '#e9ecef', padding: '0.4rem 0.8rem', borderRadius: '4px', fontStyle: 'italic' }}>
                            🔒 Nível Máximo (Sem permissão para Downgrade)
                            </span>
                        )}
                        </div>
                    )}
                    </div>
                ))
                )}
            </div>

            {modalType && selectedTicket && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', maxWidth: '420px', width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                    
                    {modalType === 'RESOLVER' ? (
                    <>
                        <h3 style={{ marginTop: 0, color: '#111827' }}>Resolver Chamado</h3>
                        <p style={{ margin: '0.5rem 0 1rem 0', color: '#4b5563' }}>
                        Protocolo: <strong style={{ color: '#d97706' }}>{selectedTicket.id}</strong>
                        </p>

                        <textarea 
                        placeholder="Escreva o relatório da solução técnica aqui..." 
                        value={solutionText} 
                        onChange={e => setSolutionText(e.target.value)} 
                        style={{ 
                            width: '100%', 
                            height: '110px', 
                            marginBottom: '1.25rem', 
                            padding: '0.75rem', 
                            boxSizing: 'border-box', 
                            background: '#3a3a3a', 
                            color: '#fff', 
                            borderRadius: '4px', 
                            border: 'none',
                            resize: 'vertical',
                            fontSize: '0.9rem'
                        }} 
                        />
                        
                        <button 
                        onClick={handleConfirmResolve} 
                        style={{ padding: '0.75rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: 'bold', fontSize: '0.95rem' }}
                        >
                        Confirmar e Fechar
                        </button>
                    </>
                    ) : (
                    <>
                        <h3 style={{ marginTop: 0 }}>Transferir Chamado</h3>
                        <p style={{ margin: '0.5rem 0 1rem 0' }}>
                        Protocolo: <strong style={{ color: '#d97706' }}>{selectedTicket.id}</strong>
                        </p>
                        <p style={{ fontSize: '0.95rem', color: '#555' }}>
                        Deseja encaminhar este chamado do <strong>Nível {currentLevel}</strong> para o <strong>Nível {targetLevel}</strong>?
                        </p>

                        <button 
                        onClick={handleConfirmTransfer} 
                        style={{ padding: '0.75rem', background: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: 'bold', fontSize: '0.95rem', marginTop: '1rem' }}
                        >
                        Confirmar Transferência para {targetLevel}
                        </button>
                    </>
                    )}

                    <button onClick={closeModal} style={{ display: 'block', margin: '1rem auto 0', background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.9rem' }}>
                    Cancelar
                    </button>

                </div>
                </div>
            )}

            </div>
        </div>
    );
}