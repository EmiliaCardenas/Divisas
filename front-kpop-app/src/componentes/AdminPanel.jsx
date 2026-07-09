import { useState } from 'react';
import axios from 'axios';

function AdminPanel() {
    const [nombre, setNombre] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/kpop/artista', { 
                nombre, 
                num_integrantes: 1, 
                es_grupo: false 
            });
            alert("Artista creado con éxito");
            setNombre('');
        } catch (error) {
            alert("Error al guardar artista");
        }
    };

    return (
        <div>
            <h2>Registrar Nuevo Artista</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    value={nombre} 
                    onChange={(e) => setNombre(e.target.value)} 
                    placeholder="Nombre del artista" 
                    required 
                />
                <button type="submit">Guardar</button>
            </form>
        </div>
    );
}

export default AdminPanel;