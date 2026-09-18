import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            if (!response.ok) {
                throw new Error('E-mail ou senha inválidos.');
            }

            const data = await response.json();

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user || data));

            const userRole = data.user?.role || data.role || '';

            if (userRole.startsWith('ATENDENTE_') || userRole === 'SETOR_ADMINISTRATIVO') {
                navigate('/atendimento');
            } else {
                navigate('/usuario');
            }
        } catch (err) {
            setError(err.message || 'Erro ao realizar login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#090d16', fontFamily: 'sans-serif', color: '#fff' }}>
            <div style={{ width: '100%', maxWidth: '400px', background: '#121824', padding: '2.5rem', borderRadius: '12px', border: '1px solid #1a2332', boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
                <h2 style={{ margin: '0 0 1.5rem 0', color: '#00e5ff', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '800', textShadow: '0 0 12px rgba(0, 229, 255, 0.4)' }}>
                    SISTEMA DE CHAMADOS
                </h2>

                {error && (
                    <div style={{ background: '#3b1219', border: '1px solid #7f1d1d', color: '#fca5a5', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.2rem', fontSize: '0.85rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>
                            E-mail
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="seu.email@exemplo.com"
                            style={{ width: '100%', padding: '0.8rem', background: '#0b101b', color: '#fff', border: '1px solid #222f43', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>
                            Senha
                        </label>
                        <input
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                            placeholder="••••••••"
                            style={{ width: '100%', padding: '0.8rem', background: '#0b101b', color: '#fff', border: '1px solid #222f43', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ width: '100%', padding: '0.85rem', background: '#00e5ff', color: '#090d16', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '0.5rem', boxShadow: '0 0 12px rgba(0, 229, 255, 0.3)' }}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
}