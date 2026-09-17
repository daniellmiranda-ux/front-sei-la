const ROLES = {
    USUARIO_COMUM: 'USUARIO_COMUM',
    SETOR_ADMINISTRATIVO: 'SETOR_ADMINISTRATIVO',
    ATENDENTE_N1: 'ATENDENTE_N1',
    ATENDENTE_N2: 'ATENDENTE_N2',
    ATENDENTE_N3: 'ATENDENTE_N3'
};

export const authService = {
    login: async (email, password, selectedRole) => {
    if (!email.endsWith('@helpdeskcand.com')) {
        throw new Error('RN01: Acesso permitido apenas para e-mails corporativos (@helpdeskcand.com).');
    }

    if (!password || password.length < 6) {
        throw new Error('A senha deve conter no mínimo 6 caracteres.');
    }

    if (!selectedRole || !Object.values(ROLES).includes(selectedRole)) {
        throw new Error('Selecione um perfil de acesso válido.');
    }

    const user = {
      id: Math.floor(Math.random() * 1000) + 1,
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email,
        role: selectedRole
    };

    const token = `hd-jwt-token-${Date.now()}`;

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