import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketService } from '../services/ticketService';
import { authService } from '../services/authService';
import FileUpload from '../components/FileUpload';

export default function CreateTicket() {
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();

    const [formData, setFormData] = useState({
    titulo: '',
    categoria: 'Hardware',
    urgencia: 'Normal',
    equipamento: '',
    descricao: ''
    });
    const [file, setFile] = useState(null);

    const handleSubmit = (e) => {
    e.preventDefault();

    ticketService.createTicket({
        ...formData,
        solicitante: currentUser?.name || 'Usuário',
        anexo: file ? file.name : null
    });

    navigate('/chamados');
    };

    return (
    <div style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '2rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Painel do Usuário - Abrir Chamado</h2>
            <button onClick={() => authService.logout() || navigate('/')} style={{ padding: '0.4rem 0.8rem', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sair</button>
        </div>

        <p style={{ marginBottom: '1rem', color: '#666' }}>
            Solicitante: <strong>{currentUser?.name}</strong> ({currentUser?.role})
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.3rem' }}>Título do Problema</label>
            <input
                type="text"
                placeholder="Ex: Computador sem internet"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            </div>

            <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.3rem' }}>Categoria</label>
            <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
            </select>
            </div>

            <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.3rem' }}>Urgência</label>
            <select
                value={formData.urgencia}
                onChange={(e) => setFormData({ ...formData, urgencia: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
                <option value="Normal">Normal (SLA: 3h)</option>
                <option value="Média">Média (SLA: 2h)</option>
                <option value="Crítico">Crítico (SLA: 1h)</option>
            </select>
            </div>

            <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.3rem' }}>Equipamento</label>
            <input
                type="text"
                placeholder="Ex: PC-SUPORTE-01"
                value={formData.equipamento}
                onChange={(e) => setFormData({ ...formData, equipamento: e.target.value })}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            </div>

            <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.3rem' }}>Descrição Detalhada</label>
            <textarea
                rows="4"
                placeholder="Descreva o problema em detalhes..."
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            </div>

            <FileUpload onFileSelect={(selectedFile) => setFile(selectedFile)} />

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => navigate('/chamados')} style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}>Ver Meus Chamados</button>
            <button type="submit" style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Abrir Chamado</button>
            </div>
        </form>
        </div>
    </div>
    );
}