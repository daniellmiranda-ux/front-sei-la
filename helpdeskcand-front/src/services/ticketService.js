const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
const TICKETS_ENDPOINT = `${API_URL}/chamados`;

const getToken = () => localStorage.getItem('token');

const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken()
    ? { Authorization: `Bearer ${getToken()}` }
    : {})
});

const getMultipartHeaders = () => ({
  ...(getToken()
    ? { Authorization: `Bearer ${getToken()}` }
    : {})
});

const parseResponse = async (response) => {
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      body?.message ||
      body?.error ||
      body?.erro ||
      body?.detail ||
      body?.exception ||
      `Erro HTTP ${response.status}`
    );

    error.status = response.status;
    throw error;
  }

  return body;
};

const normalizeLevel = (level) => {
  if (!level) return 'N1';

  if (level === 'ATENDENTE_N1') return 'N1';
  if (level === 'ATENDENTE_N2') return 'N2';
  if (level === 'ATENDENTE_N3') return 'N3';

  return level;
};

const toBackendLevel = (level) => {
  if (level === 'N1') return 'ATENDENTE_N1';
  if (level === 'N2') return 'ATENDENTE_N2';
  if (level === 'N3') return 'ATENDENTE_N3';

  return level;
};

const normalizeTicket = (ticket) => ({
  ...ticket,
  id: ticket.id,
  nivel: normalizeLevel(ticket.nivelAtendimento),
  protocolo: ticket.protocolo,
  solicitante: ticket.usuarioEmail,
  createdAt: ticket.dataCriacao,
  slaLimit: ticket.dataLimiteSla,
  anexo: ticket.caminhoAnexo || null
});

const unwrapTickets = (body) => {
  if (Array.isArray(body)) {
    return body.map(normalizeTicket);
  }

  if (Array.isArray(body?.tickets)) {
    return body.tickets.map(normalizeTicket);
  }

  if (Array.isArray(body?.data)) {
    return body.data.map(normalizeTicket);
  }

  return [];
};

export const ticketService = {
  getTickets: async () => {
    const response = await fetch(TICKETS_ENDPOINT, {
      method: 'GET',
      headers: getHeaders()
    });

    const body = await parseResponse(response);

    return unwrapTickets(body);
  },

  createTicket: async (ticketData) => {
    const payload = {
      categoria: ticketData.categoria,
      urgencia: ticketData.urgencia,
      descricao: ticketData.descricao
    };

    const response = await fetch(TICKETS_ENDPOINT, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });

    const body = await parseResponse(response);

    return normalizeTicket(body);
  },

  uploadAttachment: async (id, file) => {
    const formData = new FormData();

    formData.append('file', file);

    const response = await fetch(
      `${TICKETS_ENDPOINT}/${encodeURIComponent(id)}/anexo`,
      {
        method: 'POST',
        headers: getMultipartHeaders(),
        body: formData
      }
    );

    const body = await parseResponse(response);

    return normalizeTicket(body);
  },

  openAttachment: async (id) => {
    const response = await fetch(
      `${TICKETS_ENDPOINT}/${encodeURIComponent(id)}/anexo`,
      {
        method: 'GET',
        headers: getMultipartHeaders()
      }
    );

    if (!response.ok) {
      const error = new Error(`Erro HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    window.open(url, '_blank', 'noopener,noreferrer');

    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 60000);
  },

  escalateTicket: async (id, newLevel) => {
    const backendLevel = toBackendLevel(newLevel);

    const response = await fetch(
      `${TICKETS_ENDPOINT}/${encodeURIComponent(id)}/escalonar?novoNivel=${encodeURIComponent(backendLevel)}`,
      {
        method: 'PUT',
        headers: getHeaders()
      }
    );

    const body = await parseResponse(response);

    return normalizeTicket(body);
  },

  resolveTicket: async (id, solution) => {
    const user = JSON.parse(
      localStorage.getItem('user') || '{}'
    );

    const attendantId = user.id;

    if (!attendantId) {
      throw new Error(
        'Usuário atendente não possui ID. Faça login novamente.'
      );
    }

    const response = await fetch(
      `${TICKETS_ENDPOINT}/${encodeURIComponent(id)}/atender?atendenteId=${encodeURIComponent(attendantId)}&status=FECHADO`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/plain',
          ...(getToken()
            ? { Authorization: `Bearer ${getToken()}` }
            : {})
        },
        body: solution || ''
      }
    );

    const body = await parseResponse(response);

    return normalizeTicket(body);
  },

  updateTicket: async (id, changes) => {
    if (changes.nivel) {
      return ticketService.escalateTicket(
        id,
        changes.nivel
      );
    }

    if (changes.status === 'FECHADO') {
      return ticketService.resolveTicket(
        id,
        changes.solucao
      );
    }

    throw new Error(
      'Alteração de chamado não suportada.'
    );
  },

  getDashboard: async () => {
    const response = await fetch(
      `${TICKETS_ENDPOINT}/dashboard`,
      {
        method: 'GET',
        headers: getHeaders()
      }
    );

    return await parseResponse(response);
  }
};