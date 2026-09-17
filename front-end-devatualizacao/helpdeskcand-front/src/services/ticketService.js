export const ticketService = {
  generateProtocol: () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `HD-2026-${randomNum}`;
  },

  calculateSLA: (urgency) => {
    const hours = urgency === 'Crítico' ? 1 : urgency === 'Média' ? 2 : 3;
    return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
  },

  createTicket: (ticketData) => {
    const existingTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    
    const newTicket = {
      id: ticketService.generateProtocol(),
      ...ticketData,
      nivel: 'N1',
      status: 'Aberto',
      createdAt: new Date().toISOString(),
      slaLimit: ticketService.calculateSLA(ticketData.urgencia)
    };

    const updatedTickets = [newTicket, ...existingTickets];
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));
    return newTicket;
  }
};