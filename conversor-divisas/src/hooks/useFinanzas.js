import { useState, useEffect } from 'react';

export const useFinanzas = () => {
    const [balance, setBalance] = useState(() => JSON.parse(localStorage.getItem('balance')) || { USD: 0, MXN: 0 });
    const [notas, setNotas] = useState(() => JSON.parse(localStorage.getItem('notas')) || []);

    useEffect(() => { localStorage.setItem('balance', JSON.stringify(balance)); }, [balance]);
    useEffect(() => { localStorage.setItem('notas', JSON.stringify(notas)); }, [notas]);

    const ajustarBalance = (moneda, cantidad) => {
        setBalance(prev => ({ ...prev, [moneda]: (prev[moneda] || 0) + cantidad }));
    };

    return { balance, notas, setNotas, ajustarBalance };
};