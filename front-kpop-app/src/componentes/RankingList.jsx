import { useEffect, useState } from 'react';
import axios from 'axios';

function RankingList() {
    const [canciones, setCanciones] = useState([]);

    useEffect(() => {
        axios.get('/api/kpop/top-canciones')
            .then(res => setCanciones(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h2>Top Canciones</h2>
            <ul>
                {canciones.map((c, index) => (
                    <li key={index}>
                        {c.nombre} - <strong>Promedio: {parseFloat(c.promedio).toFixed(1)}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RankingList;