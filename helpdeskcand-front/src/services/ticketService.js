const STORAGE_KEY = 'tickets';
const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
const TICKETS_ENDPOINT = `${API_URL}/chamados`;

const readLocalTickets = () => {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    const legacy = localStorage.getItem('app_tickets');
    const tickets = current || legacy || '[]';
    const parsed = JSON.parse(tickets);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalTickets = (tickets) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
};

const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
});

const parseResponse = async (response) => {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(
      body?.message || body?.error || body?.erro || body?.detail || body?.exception || `Erro HTTP ${response.status}`
    );
    error.status = response.status;
    throw error;
  }
  return body;
};

const isApiUnavailable = (error) => error instanceof TypeError || [404, 502, 503].includes(error.status);

const unwrapTickets = (body) => {
  if (Array.isArray(body)) return body.map(normalizeTicket);
  if (Array.isArray(body?.tickets)) return body.tickets.map(normalizeTicket);
  if (Array.isArray(body?.data)) return body.data.map(normalizeTicket);
  return [];
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
  id: ticket.id || ticket.protocolo,
  nivel: normalizeLevel(ticket.nivel || ticket.nivelAtendimento),
  protocolo: ticket.protocolo || ticket.id,
  solicitante: ticket.solicitante || ticket.usuarioEmail,
  createdAt: ticket.createdAt || ticket.dataCriacao,
  slaLimit: ticket.slaLimit || ticket.dataLimiteSla,
  anexo: ticket.anexo || ticket.caminhoAnexo || null
});

export const ticketService = {
  generateProtocol: () => `HD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,

  calculateSLA: (urgency) => {
    const hours = ['CRITICO', 'Crítico', 'CRITICAL'].includes(urgency) ? 1 : ['MEDIO', 'Média', 'MEDIUM'].includes(urgency) ? 2 : 3;
    return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
  },

  getTickets: async () => {
    try {
      const response = await fetch(TICKETS_ENDPOINT, { headers: getHeaders() });
      const tickets = unwrapTickets(await parseResponse(response));
      writeLocalTickets(tickets);
      return tickets;
    } catch (error) {
      if (isApiUnavailable(error)) return readLocalTickets();
      throw error;
    }
  },

  createTicket: async (ticketData) => {
    const fallbackTicket = {
      ...ticketData,
      id: ticketData.id || ticketService.generateProtocol(),
      nivel: 'N1',
      status: 'ABERTO',
      createdAt: new Date().toISOString(),
      slaLimit: ticketService.calculateSLA(ticketData.urgencia)
    };
    const payload = {
      categoria: ticketData.categoria,
      urgencia: ticketData.urgencia,
      descricao: ticketData.descricao
    };

    try {
      const response = await fetch(TICKETS_ENDPOINT, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      const created = await parseResponse(response);
      const ticket = normalizeTicket(created?.ticket || created?.data || created);
      const tickets = readLocalTickets().filter((item) => item.id !== ticket.id);
      writeLocalTickets([ticket, ...tickets]);
      return ticket;
    } catch (error) {
      if (!isApiUnavailable(error)) throw error;
      const updated = [fallbackTicket, ...readLocalTickets()];
      writeLocalTickets(updated);
      return fallbackTicket;
    }
  },

  uploadAttachment: async (id, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${TICKETS_ENDPOINT}/${encodeURIComponent(id)}/anexo`, {
        method: 'POST',
        headers: localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {},
        body: formData
      });
      return normalizeTicket(await parseResponse(response));
    } catch (error) {
      if (!isApiUnavailable(error)) throw error;
      return null;
    }
  },

  openAttachment: async (id) => {
    const response = await fetch(`${TICKETS_ENDPOINT}/${encodeURIComponent(id)}/anexo`, {
      headers: localStorage.getItem('token')
        ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
        : {}
    });

    if (!response.ok) {
      const error = new Error(`Erro HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'noopener,noreferrer');
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  },

  updateTicket: async (id, changes) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isTransfer = Boolean(changes.nivel);
    const endpoint = isTransfer
      ? `${TICKETS_ENDPOINT}/${encodeURIComponent(id)}/escalonar?novoNivel=${encodeURIComponent(toBackendLevel(changes.nivel))}`
      : `${TICKETS_ENDPOINT}/${encodeURIComponent(id)}/atender?atendenteId=${encodeURIComponent(user.id || user.atendenteId || '')}&status=${encodeURIComponent(changes.status)}`;

    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: isTransfer
          ? getHeaders()
          : {
              'Content-Type': 'text/plain',
              ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
            },
        body: isTransfer ? undefined : (changes.solucao || '')
      });
      const responseBody = await parseResponse(response);
      const updatedTicket = responseBody?.ticket || responseBody?.data || responseBody;
      const tickets = readLocalTickets().map((ticket) => ticket.id === id ? { ...ticket, ...changes, ...(updatedTicket?.id ? updatedTicket : {}) } : ticket);
      writeLocalTickets(tickets);
      return tickets.find((ticket) => ticket.id === id);
    } catch (error) {
      if (!isApiUnavailable(error)) throw error;
      const updated = readLocalTickets().map((ticket) => ticket.id === id ? { ...ticket, ...changes } : ticket);
      writeLocalTickets(updated);
      return updated.find((ticket) => ticket.id === id);
    }
  }
};