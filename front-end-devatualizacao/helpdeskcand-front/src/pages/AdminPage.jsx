import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminPage() {
    const navigate = useNavigate();

    const [users, setUsers] = useState(() => {
    return JSON.parse(localStorage.getItem('app_users') || '[]');
    });

    const [formData, setFormData] = useState({ nome: '', email: '', senha: '', perfil: 'USUARIO_COMUM' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email.toLowerCase().endsWith('@helpdeskcand.com')) {
        setError('Erro: O e-mail DEVE terminar estritamente com @helpdeskcand.com');
        return;
    }

    const updatedUsers = [...users, { ...formData, id: Date.now() }];
    setUsers(updatedUsers);
    localStorage.setItem('app_users', JSON.stringify(updatedUsers));
    setSuccess('Usuário cadastrado com sucesso!');
    setFormData({ nome: '', email: '', senha: '', perfil: 'USUARIO_COMUM' });
    };

    const handleLogout = () => {
    localStorage.clear();
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
                <td style={{ padding: '0.5rem' }}>{u.nome}</td>
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