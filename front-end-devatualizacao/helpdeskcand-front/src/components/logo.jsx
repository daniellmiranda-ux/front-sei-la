import logoImg from '../assets/vite.svg';

export default function Logo() {
    return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
        <img 
        src={logoImg} 
        alt="Logo HelpDesk" 
        style={{ width: '35px', filter: 'drop-shadow(0px 0px 8px #00d2ff)' }} 
        />
        <h1 style={{ color: '#00d2ff', fontSize: '1.6rem', margin: 0, fontWeight: 'bold' }}>HelpDesk CAND</h1>
    </div>
    );
}