import './CompleteRegister.css';

export default function CompleteRegister() {
    return (
    <div>
        <h2>RF02 - Complementação de Cadastro</h2>
        <p>Digite o código enviado ao seu e-mail corporativo.</p>
        <input type="text" placeholder="Código de validação" />
        <button>Validar Conta</button>
    </div>
    );
}