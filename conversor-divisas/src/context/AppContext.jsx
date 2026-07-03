import { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [finanzas, setFinanzas] = useState(() => JSON.parse(localStorage.getItem('finanzas')) || { USD: 0, MXN: 0 });
    const [notas, setNotas] = useState(() => JSON.parse(localStorage.getItem('notas')) || []);

    useEffect(() => { localStorage.setItem('finanzas', JSON.stringify(finanzas)); }, [finanzas]);
    useEffect(() => { localStorage.setItem('notas', JSON.stringify(notas)); }, [notas]);

    return (
        <AppContext.Provider value={{ finanzas, setFinanzas, notas, setNotas }}>
            {children}
        </AppContext.Provider>
    );
};