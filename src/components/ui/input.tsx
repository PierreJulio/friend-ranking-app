import React from 'react';

interface InputProps {
    label?: string;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
    className?: string;
    accept?: string; // Pour les fichiers
    capture?: boolean | 'user' | 'environment'; // Pour les appareils mobiles
}

const Input: React.FC<InputProps> = ({ 
    label, 
    value, 
    onChange, 
    onKeyDown, 
    type = 'text', 
    placeholder, 
    className = '',
    accept,
    capture,
}) => {
    // Détermine si le type est 'file'
    const isFileInput = type === 'file';

    return (
        <div className={`input-container ${className}`}>
            {label && <label className="input-label text-gray-700">{label}</label>}
            <input
                className="input-field border rounded-md p-2 w-full text-black bg-white"
                type={type}
                // Ne passe la valeur que si ce n'est pas un input de type 'file'
                {...(!isFileInput && { value })}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                accept={accept}
                capture={capture}
            />
        </div>
    );
};

export default Input;