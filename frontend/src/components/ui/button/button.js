import React from 'react';
import './Button.css';

export const Button = ({ children, variant = 'default', ...props }) => {
    return (
        <button className={`button ${variant}`} {...props}>
            {children}
        </button>
    );
};

