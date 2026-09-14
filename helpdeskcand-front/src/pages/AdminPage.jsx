import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function AdminPage() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);

    const [formData, setFormData] = useState({ nome: '', email: '', senha: '', setor: '', cargo: '', perfil: 'USUARIO_COMUM' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const apiUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
    const authHeaders = () => ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    useEffect(() => {
        fetch(`${apiUrl}/usuarios`, { headers: authHeaders() })
            .then(async (response) => {
                const body = await response.json().catch(() => null);
                if (!response.ok) throw new Error(body?.message || body?.error || `Erro HTTP ${response.status}`);
                return body;
            })
            .then(setUsers)
            .catch((requestError) => setError(requestError.message));
    }, [apiUrl]);

    const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email.toLowerCase().endsWith('@helpdeskcand.com')) {
        setError('Erro: O e-mail DEVE terminar estritamente com @helpdeskcand.com');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/usuarios/cadastrar`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({
                email: formData.email,
                senha: formData.senha,
                setor: formData.setor,
                cargo: formData.cargo,
                perfil: formData.perfil
            })
        });
        const body = await response.json().catch(() => null);
        if (!response.ok) throw new Error(body?.message || body?.error || `Erro HTTP ${response.status}`);
        setUsers((currentUsers) => [...currentUsers, body]);
        setSuccess('Usuário cadastrado com sucesso! Um e-mail de confirmação foi enviado.');
        setFormData({ nome: '', email: '', senha: '', setor: '', cargo: '', perfil: 'USUARIO_COMUM' });
    } catch (requestError) {
        setError(requestError.message);
    }
    };

    const handleLogout = () => {
    authService.logout();
    navigate('/');
    };

    return (
    <div style={{ padding: '2rem', background: '#f4f6f9', minHeight: '100vh', color: '#333' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ letterSpacing: '0.5px', margin: 0 }}>PAINEL ADMINISTRATIVO</h2>
            <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sair</button>
        </div>

        <h3>Cadastrar Novo Usuário</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <form onSubmit={handleRegister} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr', marginBottom: '2rem' }}>
            <input type="text" placeholder="Nome Completo" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} required style={{ padding: '0.5rem' }} />
            <input type="email" placeholder="email@helpdeskcand.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required style={{ padding: '0.5rem' }} />
            <input type="password" placeholder="Senha" value={formData.senha} onChange={e => setFormData({ ...formData, senha: e.target.value })} required style={{ padding: '0.5rem' }} />
            <input type="text" placeholder="Setor" value={formData.setor} onChange={e => setFormData({ ...formData, setor: e.target.value })} required style={{ padding: '0.5rem' }} />
            <input type="text" placeholder="Cargo" value={formData.cargo} onChange={e => setFormData({ ...formData, cargo: e.target.value })} required style={{ padding: '0.5rem' }} />
            <select value={formData.perfil} onChange={e => setFormData({ ...formData, perfil: e.target.value })} style={{ padding: '0.5rem' }}>
            <option value="USUARIO_COMUM">Usuário Comum</option>
            <option value="ATENDENTE_N1">Atendente N1</option>
            <option value="ATENDENTE_N2">Atendente N2</option>
            <option value="ATENDENTE_N3">Atendente N3</option>
            <option value="SETOR_ADMINISTRATIVO">Setor Administrativo</option>
            </select>
            <button type="submit" style={{ gridColumn: 'span 2', padding: '0.75rem', background: '#6f42c1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cadastrar Usuário</button>
        </form>

        <h3>Usuários Cadastrados</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
            <tr style={{ background: '#eee', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Nome</th>
                <th style={{ padding: '0.5rem' }}>E-mail</th>
                <th style={{ padding: '0.5rem' }}>Perfil</th>
            </tr>
            </thead>
            <tbody>
            {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '0.5rem' }}>{u.nome || u.email}</td>
                <td style={{ padding: '0.5rem' }}>{u.email}</td>
                <td style={{ padding: '0.5rem' }}>{u.perfil}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </div>
    );
}