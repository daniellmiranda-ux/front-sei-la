import { useState } from 'react';

export default function FileUpload({ onFileSelect }) {
    const [error, setError] = useState('');
    const [fileName, setFileName] = useState('');

    const ALLOWED_EXTENSIONS = ['pdf', 'svg', 'png', 'jpg', 'jpeg'];

    const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError('');

    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
        setError('Formato inválido! Envie apenas arquivos .pdf, .svg, .png ou .jpg.');
        setFileName('');
        if (onFileSelect) onFileSelect(null);
        return;
    }

    setFileName(file.name);
    if (onFileSelect) onFileSelect(file);
    };

    return (
    <div className="file-upload-container">
        <label htmlFor="file-input" className="file-upload-label">
        📁 Anexar Arquivo (.pdf, .svg, .png, .jpg)
        </label>
        <input
        id="file-input"
        type="file"
        accept=".pdf,.svg,.png,.jpg,.jpeg"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        />
        {fileName && <p className="file-name">Arquivo selecionado: <strong>{fileName}</strong></p>}
        {error && <p className="file-error" style={{ color: 'red', fontSize: '0.85rem' }}>{error}</p>}
    </div>
    );
}