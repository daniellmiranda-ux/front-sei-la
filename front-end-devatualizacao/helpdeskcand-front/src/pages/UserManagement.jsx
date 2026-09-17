import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './UserManagement.css';

export default function UserManagement() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    setor: '',
    cargo: '',
    perfil: 'USUARIO_COMUM'
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!formData.email.endsWith('@helpdeskcand.com')) {
        setError('O e-mail deve ter o domínio @helpdeskcand.com');
        return;
    }

    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    users.push({ ...formData, id: Date.now() });
    localStorage.setItem('registered_users', JSON.stringify(users));

    setMessage('Colaborador cadastrado com sucesso!');
    setFormData({ nome: '', email: '', senha: '', setor: '', cargo: '', perfil: 'USUARIO_COMUM' });
    };

    return (
    <div className="user-mgmt-container" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '2rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Painel Administrativo - Cadastro de Usuários</h2>
        <button onClick={() => authService.logout() || navigate('/')} style={{ padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sair</button>
        </header>

        <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3>Cadastrar Novo Colaborador no Sistema</h3>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
            type="text"
            placeholder="Nome Completo"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            required
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
            type="email"
            placeholder="e-mail@helpdeskcand.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
            type="password"
            placeholder="Senha Inicial"
            value={formData.senha}
            onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
            required
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
            type="text"
            placeholder="Setor"
            value={formData.setor}
            onChange={(e) => setFormData({ ...formData, setor: e.target.value })}
            required
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
            type="text"
            placeholder="Cargo"
            value={formData.cargo}
            onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
            required
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <select
            value={formData.perfil}
            onChange={(e) => setFormData({ ...formData, perfil: e.target.value })}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
            <option value="USUARIO_COMUM">Usuário Comum</option>
            <option value="ATENDENTE_N1">Atendente N1</option>
            <option value="ATENDENTE_N2">Atendente N2</option>
            <option value="ATENDENTE_N3">Atendente N3</option>
            <option value="SETOR_ADMINISTRATIVO">Setor Administrativo</option>
            </select>

            <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Cadastrar Usuário</button>
        </form>
        </div>
    </div>
    );
}