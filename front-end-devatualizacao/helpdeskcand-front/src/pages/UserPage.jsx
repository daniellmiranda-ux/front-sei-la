import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserPage() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || {};

    const [tickets, setTickets] = useState(() => {
        const savedTickets = JSON.parse(localStorage.getItem('app_tickets') || '[]');
        return savedTickets.filter(t => t.solicitante === user.email);
    });

    const [formData, setFormData] = useState({ categoria: 'HARDWARE', urgencia: 'NORMAL', descricao: '' });
    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const allowedTypes = ['application/pdf', 'image/svg+xml', 'image/png', 'image/jpeg'];
            if (!allowedTypes.includes(selectedFile.type)) {
                setFileError('Anexo inválido! Somente extensões .pdf, .svg, .png e .jpg são permitidas.');
                setFile(null);
                e.target.value = null;
            } else {
                setFileError('');
                setFile(selectedFile);
            }
        }
    };

    const handleCreateTicket = (e) => {
        e.preventDefault();
        if (!user.emailConfirmed) {
            alert('Bloqueado: Seu e-mail precisa estar confirmado para abrir chamados.');
            return;
        }

        const allTickets = JSON.parse(localStorage.getItem('app_tickets') || '[]');
        const protocolNumber = String(allTickets.length + 1).padStart(4, '0');
        const newTicket = {
            id: `HD-2026-${protocolNumber}`,
            solicitante: user.email,
            categoria: formData.categoria,
            urgencia: formData.urgencia,
            descricao: formData.descricao,
            anexo: file ? file.name : 'Nenhum',
            status: 'ABERTO',
            nivel: 'N1',
            slaLimit: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
            createdAt: new Date().toLocaleDateString('pt-BR')
        };

        const updated = [...allTickets, newTicket];
        localStorage.setItem('app_tickets', JSON.stringify(updated));
        setTickets(updated.filter(t => t.solicitante === user.email));
        setFormData({ categoria: 'HARDWARE', urgencia: 'NORMAL', descricao: '' });
        setFile(null);
    };

    return (
        <div style={{ padding: '2rem', background: '#090d16', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', background: '#121824', padding: '2rem', borderRadius: '12px', border: '1px solid #1a2332', boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ 
                        margin: 0, 
                        color: '#00e5ff', 
                        textTransform: 'uppercase', 
                        letterSpacing: '1.5px', 
                        fontWeight: '800',
                        textShadow: '0 0 12px rgba(0, 229, 255, 0.4)'
                    }}>
                        PAINEL DO USUÁRIO
                    </h2>
                    <button onClick={() => { localStorage.clear(); navigate('/'); }} style={{ padding: '0.5rem 1.2rem', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Sair
                    </button>
                </div>

                {!user.emailConfirmed && (
                    <div style={{ background: '#3b1219', border: '1px solid #7f1d1d', color: '#fca5a5', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
                        <strong>Aviso:</strong> Por favor, confirme seu e-mail para habilitar o envio de novos chamados.
                    </div>
                )}

                <h3 style={{ 
                    margin: '0 0 1.2rem 0', 
                    color: '#00e5ff', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1.5px', 
                    fontWeight: '800',
                    textShadow: '0 0 10px rgba(0, 229, 255, 0.35)',
                    fontSize: '1.15rem'
                }}>
                    ABRIR NOVO CHAMADO
                </h3>

                <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                    <select value={formData.categoria} onChange={e => setFormData({ ...formData, categoria: e.target.value })} style={{ padding: '0.8rem', background: '#0b101b', color: '#fff', border: '1px solid #222f43', borderRadius: '6px', outline: 'none' }}>
                        <option value="HARDWARE">HARDWARE</option>
                        <option value="SOFTWARE">SOFTWARE</option>
                        <option value="REDES">REDES</option>
                    </select>

                    <select value={formData.urgencia} onChange={e => setFormData({ ...formData, urgencia: e.target.value })} style={{ padding: '0.8rem', background: '#0b101b', color: '#fff', border: '1px solid #222f43', borderRadius: '6px', outline: 'none' }}>
                        <option value="NORMAL">NORMAL</option>
                        <option value="MEDIO">MÉDIO</option>
                        <option value="CRITICO">CRÍTICO</option>
                    </select>

                    <textarea placeholder="Descrição do problema..." value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} required style={{ padding: '0.8rem', height: '100px', background: '#0b101b', color: '#fff', border: '1px solid #222f43', borderRadius: '6px', outline: 'none', resize: 'vertical' }} />

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>
                            Anexo (.pdf, .svg, .png, .jpg):
                        </label>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '1rem', 
                            background: '#0b101b', 
                            border: '1px dashed #00e5ff55', 
                            padding: '0.75rem 1rem', 
                            borderRadius: '6px'
                        }}>
                            <label 
                                htmlFor="file-upload" 
                                style={{ 
                                    padding: '0.45rem 1.1rem', 
                                    background: 'rgba(0, 229, 255, 0.1)', 
                                    color: '#00e5ff', 
                                    border: '1px solid #00e5ff', 
                                    borderRadius: '5px', 
                                    cursor: 'pointer', 
                                    fontSize: '0.85rem', 
                                    fontWeight: 'bold'
                                }}
                            >
                                📁 Escolher Arquivo
                            </label>
                            <input 
                                id="file-upload" 
                                type="file" 
                                onChange={handleFileChange} 
                                style={{ display: 'none' }} 
                            />
                            <span style={{ fontSize: '0.85rem', color: file ? '#00e5ff' : '#64748b', fontStyle: file ? 'normal' : 'italic' }}>
                                {file ? `Arquivo selecionado: ${file.name}` : 'Nenhum arquivo escolhido'}
                            </span>
                        </div>
                        {fileError && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.4rem', margin: 0 }}>{fileError}</p>}
                    </div>

                    <button type="submit" disabled={!user.emailConfirmed} style={{ padding: '0.85rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: user.emailConfirmed ? 'pointer' : 'not-allowed', fontWeight: 'bold', fontSize: '1rem', marginTop: '0.5rem' }}>
                        Enviar Chamado
                    </button>
                </form>

                <h3 style={{ 
                    margin: '0 0 1.2rem 0', 
                    color: '#00e5ff', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1.5px', 
                    fontWeight: '800',
                    textShadow: '0 0 10px rgba(0, 229, 255, 0.35)',
                    fontSize: '1.15rem'
                }}>
                    MEUS CHAMADOS
                </h3>

                <table style={{ width: '100%', borderCollapse: 'collapse', background: '#0b101b', borderRadius: '8px', overflow: 'hidden', border: '1px solid #222f43' }}>
                    <thead>
                        <tr style={{ background: '#162032', textAlign: 'left', color: '#00e5ff', fontSize: '0.85rem' }}>
                            <th style={{ padding: '0.85rem 1rem' }}>PROTOCOLO</th>
                            <th style={{ padding: '0.85rem 1rem' }}>CATEGORIA</th>
                            <th style={{ padding: '0.85rem 1rem' }}>STATUS</th>
                            <th style={{ padding: '0.85rem 1rem' }}>LIMITE SLA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                                    Nenhum chamado aberto até o momento.
                                </td>
                            </tr>
                        ) : (
                            tickets.map(t => (
                                <tr key={t.id} style={{ borderBottom: '1px solid #1e293b', fontSize: '0.9rem' }}>
                                    <td style={{ padding: '0.85rem 1rem', color: '#fff', fontWeight: 'bold' }}>{t.id}</td>
                                    <td style={{ padding: '0.85rem 1rem', color: '#cbd5e1' }}>{t.categoria}</td>
                                    <td style={{ padding: '0.85rem 1rem', color: t.status === 'FECHADO' ? '#10b981' : '#f59e0b', fontWeight: 'bold' }}>{t.status}</td>
                                    <td style={{ padding: '0.85rem 1rem', color: '#94a3b8' }}>{t.slaLimit}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}