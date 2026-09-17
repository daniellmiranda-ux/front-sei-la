import './TicketFilter.css';

export default function TicketFilter({ onFilterChange }) {
    return (
    <div style={{ margin: '10px 0' }}>
        <label>Filtrar por Status: </label>
        <select onChange={(e) => onFilterChange(e.target.value)}>
        <option value="Todos">Todos</option>
        <option value="Aberto">Aberto</option>
        <option value="Em Andamento">Em Andamento</option>
        <option value="Concluído">Concluído</option>
        </select>
    </div>
    );
}