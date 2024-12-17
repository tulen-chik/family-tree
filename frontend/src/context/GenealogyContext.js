import React, { createContext, useContext, useState, ReactNode } from 'react';

const GenealogyContext = createContext(undefined);

export function GenealogyProvider({ children }) {
    const [genealogy, setGenealogy] = useState(null);

    return (
        <GenealogyContext.Provider value={{ genealogy, setGenealogy }}>
            {children}
        </GenealogyContext.Provider>
    );
}

export function useGenealogy() {
    const context = useContext(GenealogyContext);
    if (context === undefined) {
        throw new Error('useGenealogy must be used within a GenealogyProvider');
    }
    return context;
}

