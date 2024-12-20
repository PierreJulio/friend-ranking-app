import React from 'react';
import classNames from 'classnames';

interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
    onClick, 
    children, 
    disabled = false, 
    variant = 'primary', 
    size = 'md', 
    className = '' 
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variantStyles = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-700 text-white hover:bg-gray-800 focus:ring-gray-600',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
        ghost: 'text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
    };
    const sizeStyles = {
        sm: 'px-2.5 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };

    const classes = classNames(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
    );

    return (
        <button onClick={onClick} disabled={disabled} className={classes}>
            {children}
        </button>
    );
};

export default Button;