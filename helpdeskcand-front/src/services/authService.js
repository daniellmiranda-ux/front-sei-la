const ROLES = {
    USUARIO_COMUM: 'USUARIO_COMUM',
    SETOR_ADMINISTRATIVO: 'SETOR_ADMINISTRATIVO',
    ATENDENTE_N1: 'ATENDENTE_N1',
    ATENDENTE_N2: 'ATENDENTE_N2',
    ATENDENTE_N3: 'ATENDENTE_N3'
};

const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

const parseResponse = async (response) => {
    const body = await response.json().catch(() => null);
    if (!response.ok) {
        throw new Error(body?.message || body?.error || `Erro HTTP ${response.status}`);
    }
    return body;
};

export const authService = {
    login: async (email, password, selectedRole) => {
    if (!email.endsWith('@helpdeskcand.com')) {
        throw new Error('RN01: Acesso permitido apenas para e-mails corporativos (@helpdeskcand.com).');
    }

    if (!password) {
        throw new Error('Informe sua senha.');
    }

    if (!selectedRole || !Object.values(ROLES).includes(selectedRole)) {
        throw new Error('Selecione um perfil de acesso válido.');
    }

    const response = await fetch(`${API_URL}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: password })
    });
    const result = await parseResponse(response);
    const token = result?.token || result?.accessToken || result?.jwt;

    if (!token) {
        throw new Error('O backend não retornou um token de autenticação.');
    }

    const backendUser = result?.usuario || result?.user || result?.utilizador || {};
    const user = {
        ...backendUser,
        id: backendUser.id || result?.usuarioId,
        name: backendUser.nome || backendUser.name || email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: backendUser.email || email,
        role: backendUser.role || backendUser.perfil || selectedRole,
        emailConfirmed: backendUser.emailConfirmed ?? backendUser.emailConfirmado ?? true
    };

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);

    return { user, token };
    },

    logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    },

    getCurrentUser: () => {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
    },

    isAuthenticated: () => {
    return !!localStorage.getItem('token');
    }
};