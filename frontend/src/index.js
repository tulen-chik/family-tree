import React from 'react';
import ReactDOM from 'react-dom';
import { GenealogyProvider } from './context/GenealogyContext';
import App from './App';
import './index.css';

ReactDOM.render(
    <React.StrictMode>
        <GenealogyProvider>
            <App />
        </GenealogyProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

